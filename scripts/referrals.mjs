#!/usr/bin/env node
/**
 * Read-only query helper for the edge referral attribution data (issue: edge
 * referral logging). The Worker writes one privacy-clean data point per HTML
 * page view into the Cloudflare Analytics Engine dataset `chinaguide_referrals`
 * (see worker/index.js → buildReferralDataPoint). That dataset is produced by
 * the wrangler AE binding `REFERRALS` → dataset `chinaguide_referrals`, added
 * to wrangler.json separately; until that binding lands the dataset is empty.
 *
 * This script POSTs SQL to the Analytics Engine SQL API and prints a readable
 * table of the top traffic sources over the last 7 days. It is strictly
 * read-only and dependency-free (Node 22+, global fetch).
 *
 * Credentials come from the environment ONLY — never hardcode or commit them:
 *   CF_ACCOUNT_ID  - your Cloudflare account id
 *   CF_API_TOKEN   - a token with the "Account Analytics: Read" permission
 *
 * Usage:
 *   CF_ACCOUNT_ID=... CF_API_TOKEN=... node scripts/referrals.mjs
 */

const DATASET = 'chinaguide_referrals';

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const API_TOKEN = process.env.CF_API_TOKEN;

// blob1=source, blob2=medium, blob3=campaign; double1 is the per-view counter.
// _sample_interval scales sampled rows back up to a true count.
const QUERY = `
SELECT
  blob1 AS source,
  blob2 AS medium,
  blob3 AS campaign,
  SUM(_sample_interval * double1) AS views
FROM ${DATASET}
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY source, medium, campaign
ORDER BY views DESC
LIMIT 50
`.trim();

function missingCredentials() {
  console.error('Missing CF_ACCOUNT_ID and/or CF_API_TOKEN in the environment.\n');
  console.error('This script reads the Cloudflare Analytics Engine dataset');
  console.error(`"${DATASET}" and needs read-only API credentials:\n`);
  console.error('  1. Find your account id: Cloudflare dashboard → any domain →');
  console.error('     the "Account ID" in the right sidebar (or `wrangler whoami`).');
  console.error('  2. Create an API token: dashboard → My Profile → API Tokens →');
  console.error('     Create Token → Custom token, with permission');
  console.error('       Account · Account Analytics · Read');
  console.error('     scoped to this account. Treat it like a password.\n');
  console.error('Then run:');
  console.error('  CF_ACCOUNT_ID=xxxx CF_API_TOKEN=yyyy node scripts/referrals.mjs');
  process.exit(1);
}

/** Render an array of flat row objects as a left-aligned text table. */
function printTable(rows) {
  if (!rows.length) {
    console.log('No referral data in the last 7 days.');
    console.log(
      `(If you expected data: confirm the wrangler AE binding REFERRALS → dataset "${DATASET}" is live.)`,
    );
    return;
  }
  const columns = Object.keys(rows[0]);
  const widths = columns.map((c) =>
    Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length)),
  );
  const line = (cells) =>
    cells.map((cell, i) => String(cell ?? '').padEnd(widths[i])).join('  ');
  console.log(line(columns));
  console.log(line(widths.map((w) => '-'.repeat(w))));
  for (const row of rows) console.log(line(columns.map((c) => row[c])));
}

async function main() {
  if (!ACCOUNT_ID || !API_TOKEN) missingCredentials();

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/analytics_engine/sql`;
  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'text/plain',
      },
      body: QUERY,
    });
  } catch (err) {
    console.error('Request to the Analytics Engine SQL API failed:', err.message);
    process.exit(1);
  }

  const text = await res.text();
  if (!res.ok) {
    console.error(`Analytics Engine SQL API returned ${res.status} ${res.statusText}:`);
    console.error(text);
    if (res.status === 401 || res.status === 403) {
      console.error('\nCheck that CF_API_TOKEN has "Account Analytics: Read" for this account.');
    }
    process.exit(1);
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    console.error('Unexpected (non-JSON) response from the SQL API:');
    console.error(text);
    process.exit(1);
  }

  const rows = (payload.data || []).map((r) => ({
    source: r.source,
    medium: r.medium,
    campaign: r.campaign,
    views: Math.round(Number(r.views)),
  }));

  console.log(`Top traffic sources — last 7 days (dataset: ${DATASET})\n`);
  printTable(rows);
}

main();
