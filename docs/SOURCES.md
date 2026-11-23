# Implementation sources and provenance

## Authoritative input

The user-designated source is `Downloads/jas-fde-portfolio-bundle/`, not the prior React application. Its homepage, connected tree algorithm, palette, and content were migrated to a Vite multi-page site. The old app remains available through Git history, not as duplicate active source. The original research is retained under docs/research, as historical design evidence; the new recognizable headings supersede its poetic-heading recommendation.

## Runtime / build

- Vite multi-page build: https://vite.dev/guide/build.html#multi-page-app
- Vercel Node functions: https://vercel.com/docs/functions/runtimes/node-js
- GitHub OAuth state and PKCE: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
- GitHub Contents API and update SHA: https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
- OffscreenCanvas + Blob conversion: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- Markdown must be sanitized: https://marked.js.org/
- HTML allowlist sanitizer: https://github.com/apostrophecms/sanitize-html

## Medium import

Source: https://medium.com/feed/@jaskhetani

Ten distinct articles are stored in content/medium as author-feed HTML and metadata. Every target from the supplied blog page matched a feed entry. Each includes a substantial body, closing paragraphs or lab copyright notices, not a short feed teaser. `full-feed` means the complete body supplied by Medium's public RSS, not a claim that interactive embeds, comments, or member-only extras were imported. Article wording is retained; HTML is sanitized at build. Source links and code copyright notices are retained. External image URLs remain lazy-loaded from their original hosts, with no referrer. Interactive iframes/scripts and tracking pixels are not embedded. This is not an authenticated Medium export; if a future feed contains only excerpts, request the author's export instead of inventing text.

## Blogger archive

Source: https://jaskhetani.blogspot.com/feeds/posts/default?alt=json

The feed contains exactly three posts, all published on December 29, 2022: `RED - A Color or an Understanding`, `Old is Aurum`, and `Time Travel Conjecture`. Their full text and publication metadata are stored in `content/blogger`; the original Blogspot URLs remain attribution links. The journal labels them as early writing and states that speculative claims reflect the author's thinking at the time. Legacy images are deliberately excluded from the portfolio because their third-party rights are not established; the original pages retain the historical visual context.

## Resource policy

Public pages have no React runtime, remote fonts, analytics, AI-service calls, or database. Article bodies are loaded only when opened. Medium imagery remains lazy-loaded from its original host; legacy Blogger imagery is excluded. Draft files never enter public/data or dist. Blossom raster work runs in a worker; unsupported platforms use an asynchronously chunked fallback. Old worker jobs are terminated and object URLs revoked on geometry rebuilds. Reduced motion disables falling petals and entry animation.
