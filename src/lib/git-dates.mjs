// Last-commit dates for content files, for the sitemap's <lastmod>.
//
// sitemaps.org defines <lastmod> as the file's last modification date. The site
// previously derived it from `last_verified || date` — but those are fact-checking
// dates, governed by a deliberate rule that forbids bumping them when a page was
// only rewritten. The two meanings were conflated, so a page could be rewritten
// and still advertise a lastmod from six weeks earlier. Git already records the
// answer, so ask git.
//
// The whole content tree is resolved with ONE `git log` pass rather than one
// subprocess per file; `git log` prints newest-first, so the first sighting of a
// path is its latest change.

import { execFileSync } from 'node:child_process';

// A NUL prefix marks the commit-date lines: no filesystem path can begin with one,
// so a path is never mistaken for a header (a `commit `-style prefix could be).
const HEADER = '\x00';
const FORMAT = `%x00%cI`;

/**
 * Parse `git log --format=%x00%cI --name-only` output.
 * @param {string|undefined} stdout
 * @returns {Map<string, string>} repo-relative path -> ISO commit date of its newest change
 */
export function parseGitLog(stdout) {
  const dates = new Map();
  let current = null;
  for (const line of String(stdout ?? '').split('\n')) {
    if (line.startsWith(HEADER)) {
      current = line.slice(HEADER.length).trim() || null;
      continue;
    }
    const path = line.trim();
    // A path with no commit header above it has no date; drop it rather than guess.
    if (!path || !current) continue;
    if (!dates.has(path)) dates.set(path, current);
  }
  return dates;
}

/**
 * Classify the checkout: a shallow clone answers `git log -- <file>` with the tip
 * commit for everything, which is a plausible-looking wrong date — so it has to be
 * distinguishable from both a full clone and no repository at all.
 * @param {{ cwd?: string }} [options]
 * @returns {'full' | 'shallow' | 'absent'}
 */
export function repoState({ cwd } = {}) {
  try {
    const out = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim() === 'true' ? 'shallow' : 'full';
  } catch {
    return 'absent';
  }
}

/**
 * Resolve last-commit dates for every file under the given directories.
 *
 * Throws on a shallow clone: that is a CI misconfiguration (a checkout that lost
 * `fetch-depth: 0`) and silently emitting the tip commit's date for all 41 content
 * pages would be worse than not building. Returns an empty map when there is no
 * repository at all, which is a legitimate environment (building from a tarball)
 * and lets the caller fall back to frontmatter dates.
 *
 * @param {string[]} dirs repo-relative directories to scan
 * @param {{ cwd?: string, stateOverride?: 'full'|'shallow'|'absent' }} [options]
 * @returns {Map<string, string>} repo-relative path -> ISO commit date
 */
export function contentCommitDates(dirs, { cwd, stateOverride } = {}) {
  const state = stateOverride ?? repoState({ cwd });
  if (state === 'shallow') {
    throw new Error(
      'sitemap <lastmod> needs full git history, but this is a shallow clone. ' +
        'Set `fetch-depth: 0` on actions/checkout in any workflow that builds the site.',
    );
  }
  if (state === 'absent') return new Map();

  const stdout = execFileSync(
    'git',
    ['log', `--format=${FORMAT}`, '--name-only', '--no-renames', '--', ...dirs],
    { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
  );
  return parseGitLog(stdout);
}
