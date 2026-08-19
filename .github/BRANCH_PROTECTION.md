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
| Require status checks | `test` (from ci.yml). `seo-review` runs in parallel and **blocks on `faq_grounding` for ordinary content PRs** (advisory for everything else) — still not a required check. |
| Require branches up to date | Yes |
| Include administrators | No |

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
  --field 'required_pull_request_reviews[required_approving_review_count]=1' \
  --field 'enforce_admins=false' \
  --field 'restrictions=null'
```

## Notes

- ⚠️ Branch protection (required status checks / required approvals) needs **GitHub Pro** for a **private** repo, or making the repo public. On the current free private plan the rules below can't be applied — the gates still run as **non-required** checks (a red check doesn't hard-block merge, it's just a visible signal).
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be set as repo secrets on the site repo (used by `ci.yml` / `deploy.yml` to deploy via `wrangler`).
- `SITE_REPO_TOKEN` must be set on the wiki repo (PAT — cross-repo `repository_dispatch` to the site repo).
- `APP_ID` + `APP_PRIVATE_KEY` must be set on the site repo — credentials for the **`chinaguide-content-sync` GitHub App**, which authors the content PR (`sync-content.yml`). The App must be installed on **both** repos with: site `Contents` + `Pull requests` write, wiki `Contents` read. Using a GitHub App (not the default `GITHUB_TOKEN`) means the content PR triggers `CI & Preview` AND the author ≠ reviewer so `reviewers:` notifies. The old `WIKI_REPO_TOKEN` is no longer used and can be removed.
- `OPENROUTER_API_KEY` must be set on the site repo — used by the **`seo-review`** CI job (OpenRouter `openai/gpt-5.5`) to review the SEO/GEO quality of changed content. The job **blocks on one criterion, `faq_grounding`, for ordinary content PRs** (`SEO_REVIEW_MODE` is computed in `ci.yml`; `SEO_REVIEW_ENFORCED_IDS: faq_grounding`). Everything else stays advisory: the other four blocking-class criteria, every run on `auto/content-sync`, and the manual full-site scan are reported and flagged "would block" but exit 0. It is still **not a required check** — a red run is a signal the reviewer weighs, not a hard merge stop.

This shape is deliberate. An earlier rollout set the whole gate to `blocking` + required and was reverted, because a wiki sync PR bundles every pending page, the gate re-reviews each in full, and latent issues on pages the sync never touched hard-blocked unrelated deploys. The sync branch is therefore exempt, and enforcement is per-criterion (see `resolveEnforcedIds` in `scripts/seo-review.mjs`) so criteria can be hardened one at a time once their backlog is clear. `faq_grounding` went first because its backlog was cleared (7 pages) and it had already caught a real defect that reached production. Until the secret is set, the job **soft-passes** (the review step is gated on `env.OPENROUTER_API_KEY != ''`, so the job stays green regardless).
