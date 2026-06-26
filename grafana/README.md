# Referral analytics — Grafana dashboard

Visualise the `chinaguide_referrals` Cloudflare Analytics Engine (AE) dataset
written by the edge Worker (`worker/index.js` → `buildReferralDataPoint`). One
data point is written per HTML page view with the traffic-source attribution
(referrer host + UTM + landing path + country). This folder gives you a Grafana
view of it.

> The CLI alternative is `node scripts/referrals.mjs` (prints a 7-day table to
> the terminal). Grafana adds time-series charts and an always-on dashboard.

There is **no native Grafana data source for AE** — you query AE over its SQL
API with the **Infinity** plugin (`yesoreyeram-infinity-datasource`), which can
POST SQL and parse the JSON rows. That's the connector this dashboard uses.

---

## What you need first

- The AE binding is live (PR #91 deployed) and the dataset is receiving writes.
- **Cloudflare account id.**
- **A Cloudflare API token** with permission **Account → Account Analytics → Read**
  (dashboard → My Profile → API Tokens → Create Token → Custom token). Treat it
  like a password — it is **not** committed anywhere.

The AE SQL endpoint these queries hit:
```
POST https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql
Authorization: Bearer <token>
Content-Type: text/plain
body: <the SQL>
```

---

## Setup

### 1. Get Grafana
- **Grafana Cloud** (free tier, easiest): create a stack at grafana.com.
- **or local**: `docker run -d -p 3000:3000 --name=grafana grafana/grafana-oss`
  then open http://localhost:3000 (admin/admin).

### 2. Install the Infinity data source plugin
Grafana → **Connections → Add new connection** → search **"Infinity"**
(`yesoreyeram-infinity-datasource`) → Install.
(Local Docker: `docker exec -it grafana grafana cli plugins install yesoreyeram-infinity-datasource` then restart the container.)

### 3. Add an Infinity data source pointed at the AE SQL API
Connections → **Add new connection → Infinity → Add**:
- **Authentication → Bearer token** → paste your CF API token.
- **Network → Allowed hosts** → add `https://api.cloudflare.com`.
- (Optional) **URL / Base URL** → `https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine`
  so panel queries can use the relative path `/sql`.
- Save & test. Name it e.g. `Cloudflare AE`.

### 4. Import the dashboard
Dashboards → **New → Import** → upload `chinaguide-referrals.json` (or paste it).
On import you'll be asked to:
- pick the **Infinity** data source you just made, and
- set the **`account_id`** dashboard variable to your Cloudflare account id.

That's it — the panels below render. If your Grafana / Infinity version rejects
the import, build the panels by hand using the **Panel recipe** + **Queries**
sections below (same result, 10 minutes).

---

## Panel recipe (manual build / fallback)

For each panel: **Add panel** → data source = your Infinity source → set the
query to:
- **Type** `JSON`, **Source** `URL`, **Method** `POST`
- **URL** `https://api.cloudflare.com/client/v4/accounts/${account_id}/analytics_engine/sql`
  (or `/sql` if you set a Base URL on the data source)
- **Body** → `Raw`, content type `text/plain`, paste the SQL from **Queries** below
- **Parsing** → **Rows/Root selector** = `data`
- **Columns** → add one row per SELECT alias (see each query); set the numeric
  `views` column type to **Number**, and for the daily-trend query set `day` to
  type **Time** (format `YYYY-MM-DD HH:mm:ss` if the axis doesn't auto-parse).
- **Visualization**: Table for the breakdowns, Time series for the daily trend,
  Pie/Stat for the channel split.

Blob mapping (so you can write your own queries):
`blob1=source · blob2=medium · blob3=campaign · blob4=referrerHost · blob5=path · blob6=country`,
`double1` = per-view counter, `_sample_interval` scales sampled rows back to a
true count (always `SUM(_sample_interval * double1)` for view totals).

---

## Queries

**Channel split (last 7d)** — word-of-mouth vs outreach vs organic vs direct:
```sql
SELECT
  CASE
    WHEN blob2 = 'share' THEN 'word-of-mouth (share)'
    WHEN blob2 IN ('forum','blog','partner','newsletter') THEN 'outreach'
    WHEN blob2 = 'referral' THEN 'organic referral'
    ELSE 'direct'
  END AS channel,
  SUM(_sample_interval * double1) AS views
FROM chinaguide_referrals
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY channel
ORDER BY views DESC
```

**Daily views trend (last 30d)** — time series:
```sql
SELECT
  toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day,
  SUM(_sample_interval * double1) AS views
FROM chinaguide_referrals
WHERE timestamp > NOW() - INTERVAL '30' DAY
GROUP BY day
ORDER BY day
```

**Source / medium / campaign (last 7d)** — table:
```sql
SELECT blob1 AS source, blob2 AS medium, blob3 AS campaign,
  SUM(_sample_interval * double1) AS views
FROM chinaguide_referrals
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY source, medium, campaign
ORDER BY views DESC
LIMIT 50
```

**Top landing pages (last 7d)** — table:
```sql
SELECT blob5 AS path, SUM(_sample_interval * double1) AS views
FROM chinaguide_referrals
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY path
ORDER BY views DESC
LIMIT 20
```

**Top referrer hosts (last 7d)** — table (external referrers only):
```sql
SELECT blob4 AS referrer, SUM(_sample_interval * double1) AS views
FROM chinaguide_referrals
WHERE blob4 != '' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY referrer
ORDER BY views DESC
LIMIT 20
```

**By country (last 7d)** — table:
```sql
SELECT blob6 AS country, SUM(_sample_interval * double1) AS views
FROM chinaguide_referrals
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY country
ORDER BY views DESC
LIMIT 30
```

---

## Notes

- **Latency**: AE has a few-seconds-to-~1-minute ingestion delay before new data
  points are queryable.
- **Test row**: a verification page view tagged `utm_campaign=pipeline-check`
  was seeded when the binding went live — filter it out
  (`WHERE blob3 != 'pipeline-check'`) once real traffic accumulates.
- **Auth**: the token lives only in the Grafana data-source config (server-side),
  never in this repo or the dashboard JSON.
- **Dialect**: AE SQL is a ClickHouse subset. If a function (e.g.
  `toStartOfInterval`) isn't accepted on your account, see the AE SQL reference
  for the supported equivalents.
