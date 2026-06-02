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
| Require status checks | `preview` (from pr-preview.yml) |
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
  --field 'required_status_checks[contexts][]=preview' \
  --field 'required_pull_request_reviews[required_approving_review_count]=1' \
  --field 'enforce_admins=false' \
  --field 'restrictions=null'
```

## Notes

- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be set as repo secrets on the site repo
- `SITE_REPO_TOKEN` must be set on the wiki repo (PAT with `repo` scope for cross-repo dispatch)
- `WIKI_REPO_TOKEN` must be set on the site repo (PAT with read access to wiki private repo)
