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
| Require status checks | `test` (from ci.yml) |
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
- `WIKI_REPO_TOKEN` must be set on the site repo — a PAT that **clones the private wiki AND opens the content PR**, so it needs `contents:write` + `pull-requests:write` on the site repo and `contents:read` on the wiki repo. (Must be a PAT, not the default `GITHUB_TOKEN`, or the content PR won't trigger `ci.yml`.)
