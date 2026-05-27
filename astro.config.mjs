// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://chinatravelguide.com', // TODO: 替换为实际域名
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
