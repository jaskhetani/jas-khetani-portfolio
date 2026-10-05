# Jas Khetani — Portfolio & Mountain Reading Room

A Vercel-ready, multi-page portfolio rebuilt from the user-designated `Downloads/jas-fde-portfolio-bundle/`. The original blossom geometry and paper/rose/wood palette are retained; the obsolete React site is not the design source.

## Routes

- `/` — AI & Software Engineering, projects, skills, approach, demo, experience, writing, contact.
- `/journal` — mountain-temple reading shelf with search and theme filters.
- `/read?post=majorana-1` — full on-site article in a reading scroll; text-size controls, contents, print, reading progress.
- `/study` — unlisted, authenticated owner-only mini-blog editor. No drafts or access tokens are bundled into public pages. Hidden is **not** the security boundary.

## Development

Node 22.12+ and npm are required. Dependencies are pinned in package-lock.json.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`npm run test:e2e` runs the production build against installed Microsoft Edge. Set up that browser on CI first. Build before running the browser suite. Vite dev serves the same author API in its fail-closed/unconfigured state; real OAuth requires the canonical HTTPS Vercel origin (not localhost).

## Vercel

Import **jaskhetani/jas-khetani-portfolio**, production branch **main**, framework **Vite**.
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`
- Repository root: `.`
- Vercel automatically recognizes `api/author.js` as a Node function. Do not deploy only the dist folder if you want authoring.

The public portfolio and journal need **no secrets**. To activate the private writing room, follow [docs/AUTHORING.md](docs/AUTHORING.md). Configuration and live OAuth sign-in remain deployment steps; tests use a simulated GitHub provider and are not a claim of a live account session.

## Content & editing

- `index.html`: editable homepage copy. `src/home.css` and `src/shared.css`: styling.
- `src/tree.js`: source-bundle connected geometry and bounded petals. `src/blossoms.worker.js`: off-main-thread blossom rasterization. Unsupported browsers use a chunked fallback; content never waits for artwork.
- `journal.html`, `read.html`, `study.html`: separate documents, not homepage scroll sections.
- `content/medium/*.json`: ten actual full public-feed article bodies, attribution, code, and image references. No invented article text. [Import limits](docs/SOURCES.md).
- `content/notes/*.json`: private GitHub-backed drafts/published Markdown notes. Keep this repository private.
- `scripts/build-content.js`: sanitizes HTML, excludes drafts, creates a small catalog and per-article JSON in `public/data`. These are regenerated, not hand-edited.
- `docs/research/`: historical 55-site design research. Its poetic heading recommendations are superseded by this rebuild's explicit recruiter-facing headings.

No analytics, third-party fonts, live LLM calls, or Medium tracking pixels are shipped. Article images are lazy-loaded from their original sources. The interactive AI demo is labeled synthetic and is not an employer product.

## Before public launch

Verify permission to publish employer/client descriptions and resume-reported performance metrics. This repo remains private, but a Vercel deployment may be public. Check the current availability of original article image hosts and review the deployment hostname, OAuth callback, and owner-only access on the deployed site.
