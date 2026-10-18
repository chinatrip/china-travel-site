# Branch Protection Rules

## Setup Instructions

Apply these rules to the `main` branch of both repos via GitHub Settings > Branches > Add rule, or run the script below.

### Wiki repo (foreigner-visiting-china-wiki)

| Setting | Value |
|---------|-------|
| Branch pattern | `main` |
| Require PR before merging | Yes |
| Required approvals | 1 |
| Require status checks | `lint` (from pr-lint.yml) |
| Require branches up to date | Yes |
| Include administrators | No (allow admin bypass for urgent fixes) |

### Site repo (china-travel-site)

| Setting | Value |
|---------|-------|
| Branch pattern | `main` |
| Require PR before merging | Yes |
| Required approvals | 1 |
| Require status checks | `test` **and** `seo-review` (both from ci.yml). `seo-review` blocks on `faq_grounding` for ordinary content PRs; the other blocking-class criteria stay advisory. |
| Require branches up to date | Yes |
| Include administrators | Yes (`enforce_admins=true`) |

## Script (gh CLI)

```bash
# Wiki repo
gh api repos/chinatrip/foreigner-visiting-china-wiki/branches/main/protection \
  --method PUT \
  --field 'required_status_checks[strict]=true' \
  --field 'required_status_checks[contexts][]=lint' \
  --field 'required_pull_request_reviews[required_approving_review_count]=1' \
  --field 'enforce_admins=false' \
  --field 'restrictions=null'

# Site repo
gh api repos/chinatrip/china-travel-site/branches/main/protection \
  --method PUT \
  --field 'required_status_checks[strict]=true' \
  --field 'required_status_checks[contexts][]=test' \
  --field 'required_status_checks[contexts][]=seo-review' \
  --field 'enforce_admins=true' \
  --field 'restrictions=null'
```

## Notes

- Branch protection needs **GitHub Pro** for a **private** repo, or a **public** repo. The site repo was made **public on 2026-10-17**, so the rules below now apply there (currently: `test` + `seo-review`, `strict`, `enforce_admins`). The wiki repo is still private/free, so its rules in this file remain aspirational and its checks are non-required.
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be set as repo secrets on the site repo (used by `ci.yml` / `deploy.yml` to deploy via `wrangler`).
- `SITE_REPO_TOKEN` is **no longer used** (the wiki→site dispatch uses the GitHub App since 2026-10-17); remove it if it still exists.
- `DEEPSEEK_API_KEY` must be set on the site repo — used by the **`seo-review`** CI job. The backend is `scripts/seo-review.mjs` `resolveBackend()`: DeepSeek `deepseek-chat` via `api.deepseek.com` (JSON mode); without the key the job soft-passes. The old OpenRouter backend was removed in 2026-10 after its key was revoked (issue #156). The job **blocks on one criterion, `faq_grounding`, for ordinary content PRs** (`SEO_REVIEW_MODE` is computed in `ci.yml`; `SEO_REVIEW_ENFORCED_IDS: faq_grounding`). Everything else stays advisory: the other four blocking-class criteria, every run on `auto/content-sync`, and the manual full-site scan are reported and flagged "would block" but exit 0. It **is a required check again since 2026-10-18**: the DeepSeek backend was verified with a full-site scan after the `faq_grounding` backlog (10 findings on 7 pages) was fixed, and main's protection now requires `test` + `seo-review`.

This shape is deliberate. An earlier rollout set the whole gate to `blocking` + required and was reverted, because a wiki sync PR bundles every pending page, the gate re-reviews each in full, and latent issues on pages the sync never touched hard-blocked unrelated deploys. The sync branch is therefore exempt, and enforcement is per-criterion (see `resolveEnforcedIds` in `scripts/seo-review.mjs`) so criteria can be hardened one at a time once their backlog is clear. `faq_grounding` went first because its backlog was cleared (7 pages) and it had already caught a real defect that reached production. Without `DEEPSEEK_API_KEY` the job **soft-passes** (the review step is gated on the key), so a missing secret can never turn the required check red.
