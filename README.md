# China Travel Guide — Site

Astro-based static site for [foreigner-visiting-china-wiki](https://github.com/yi-yang/foreigner-visiting-china-wiki) content.

## Architecture

```
wiki repo (content)          site repo (code)
yi-yang/foreigner-           yi-yang/china-travel-site
visiting-china-wiki
  │                              │
  │  wiki/concepts/*.md          │  src/content/guides/
  │  wiki/entities/*.md          │  src/content/apps/
  │                              │
  └──── sync-content ───────────►│
         (script or CI)          │
                                 ├── astro build
                                 │
                                 └── Cloudflare Pages (deploy)
```

## Quick Start

```bash
# Install
npm install

# Sync content from wiki repo
npm run sync-content

# Dev server
npm run dev

# Build
npm run build
```

## Content Workflow

1. Edit Markdown in the **wiki repo** (`wiki/concepts/` or `wiki/entities/`)
2. Set front matter `status: audited` when content is ready for publication
3. Run `npm run sync-content` locally, or push to trigger CI
4. Only `status: audited` files are published to the site

## Deployment

The site deploys to Cloudflare Pages. Deployment is triggered by:
- Push to `main` branch of this repo
- `repository_dispatch` event from the wiki repo (on content update)
- Manual workflow dispatch

## TODO

- [ ] Configure Cloudflare Pages project
- [ ] Set up custom domain
- [ ] Add sitemap generation
- [ ] Add GA4 analytics
- [ ] Design hotel booking CTA component
