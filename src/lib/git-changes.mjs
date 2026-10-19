// Git-backed change feed for /api/v1/changes.json.
//
// Agents need to know what changed since their last visit; page models already
// carry content_hash, but only git knows *when* and *which commit*. This reads
// the content tree's history in one `git log` pass at build time (CI checks out
// with fetch-depth: 0). Outside a repository — or in a shallow clone, where the
// answer would be the tip commit for everything — it degrades to a snapshot
// derived from the pages' own verified dates, clearly labelled as such.

import { execFileSync } from 'node:child_process';
import { pageJsonUrl, pageUrl } from './facts.mjs';

const HEADER = '\x00'; // cannot appear in a path, so headers are unambiguous
const FORMAT = '%x00%H%x00%cI%x00%s';
const CONTENT_PATHS = ['src/content/guides', 'src/content/apps'];
const MAX_ENTRIES = 200;

/** @param {string} path repo-relative content path */
export function collectionOf(path) {
  if (path.startsWith('src/content/guides/es/')) return 'guidesEs';
  if (path.startsWith('src/content/guides/')) return 'guides';
  return 'apps';
}

/**
 * Parse `git log --format=%x00%H%x00%cI%x00%s --name-only` output.
 * @param {string|undefined} stdout
 */
export function parseChangesLog(stdout) {
  const entries = [];
  let current = null;
  for (const line of String(stdout ?? '').split('\n')) {
    if (line.startsWith(HEADER)) {
      const [, commit, date, subject] = line.split(HEADER);
      current = {
        commit: commit || null,
        date: (date || '').slice(0, 10) || null,
        subject: subject || '',
        files: [],
      };
      entries.push(current);
      continue;
    }
    const path = line.trim();
    if (!path || !current || !path.endsWith('.md')) continue;
    const collection = collectionOf(path);
    const slug = path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '');
    current.files.push({
      path,
      collection,
      slug,
      url: pageUrl(collection, slug),
      json_url: pageJsonUrl(collection, slug),
    });
  }
  return entries.filter((entry) => entry.files.length > 0).slice(0, MAX_ENTRIES);
}

/**
 * Read the content tree's commit history. Returns { source, entries }.
 * @param {{cwd?: string, sinceDays?: number}} [options]
 */
export function contentChanges({ cwd, sinceDays = 180 } = {}) {
  try {
    const stdout = execFileSync(
      'git',
      [
        'log',
        `--since=${sinceDays} days ago`,
        `--format=${FORMAT}`,
        '--name-only',
        '--',
        ...CONTENT_PATHS,
      ],
      { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 20 * 1024 * 1024 },
    );
    return { source: 'git', entries: parseChangesLog(stdout) };
  } catch {
    return { source: 'content-dates', entries: [] };
  }
}

/** Fallback when git history is unavailable: pages ordered by verified date. */
export function snapshotChanges(models, { limit = MAX_ENTRIES } = {}) {
  return models
    .filter((model) => model.last_verified)
    .sort((a, b) => String(b.last_verified).localeCompare(String(a.last_verified)))
    .slice(0, limit)
    .map((model) => ({
      date: model.last_verified,
      commit: null,
      subject: `Verified: ${model.title}`,
      files: [
        {
          path: null,
          collection: model.collection,
          slug: model.slug,
          url: model.url,
          json_url: model.json_url,
        },
      ],
    }));
}
