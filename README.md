# China Travel Guide — Site

Astro static site for [chinatrip/foreigner-visiting-china-wiki](https://github.com/chinatrip/foreigner-visiting-china-wiki) content. Deployed as a **Cloudflare Worker (static assets)** at <https://chinaguide.ai>.

## Architecture

```
wiki repo (content)                  site repo (this · code + build)
chinatrip/foreigner-visiting-        chinatrip/china-travel-site
china-wiki
  wiki/concepts/*.md  ──┐ audited
  wiki/entities/*.md  ──┘
        │  publish-content → repository_dispatch
        ▼
  sync-content.yml → 开内容 PR → ci.yml (gate + 预览)
        │
        └─ 合并 main → deploy.yml (wrangler deploy) → Cloudflare Worker
```

**完整流水线见 [PIPELINE.md](./PIPELINE.md)** —— 每个阶段谁负责、在哪观测、如何回滚。

## Quick Start

```bash
npm install
npm run sync-content   # 从 wiki 仓同步 audited 内容到 src/content/
npm run dev            # 本地开发
npm test               # node:test + astro build + 内链尾斜杠 guard
```

## Content workflow（简版）

1. 在 **wiki 仓** 编辑 `wiki/concepts/`（→ guides）或 `wiki/entities/`（→ apps）。
2. front matter 里把 `review.status` 设为 `audited` 表示可发布。
3. 合并到 wiki/main → 自动同步、开内容 PR → 审阅合并即上线。
4. 只有 `review.status: audited` 的页会进站。

## Deployment

GitHub Actions 用 `wrangler` 部署到 Cloudflare Worker（Cloudflare 原生 Git 集成已关闭，部署由 Actions 显式发起）：

- **PR** → `ci.yml` 部署预览版（`wrangler versions upload`），预览 URL 贴在 PR 评论。
- **合并到 main** → `deploy.yml` 部署生产（`wrangler deploy`）→ <https://chinaguide.ai>。

详见 [PIPELINE.md](./PIPELINE.md)。

## TODO

- [ ] Add GA4 analytics
- [ ] Design hotel booking CTA component
