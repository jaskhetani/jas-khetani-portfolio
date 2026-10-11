# Jas Khetani — AI & Software Engineering Portfolio

A public, recruiter-facing portfolio for Jas Khetani’s applied-AI, software-engineering, and customer-workflow work. The experience pairs a blossom-tree homepage with a quiet mountain-temple journal, while keeping the information architecture conventional enough to scan quickly.

**Live site:** [jaskhetani.vercel.app](https://jaskhetani.vercel.app/)

**Journal:** [jaskhetani.vercel.app/journal](https://jaskhetani.vercel.app/journal)

**Source:** [github.com/jaskhetani/jas-khetani-portfolio](https://github.com/jaskhetani/jas-khetani-portfolio)

## What the site includes

- A recruiter-readable homepage organized around selected work, technical skills, engineering approach, experience, education, writing, and contact.
- A procedural blossom tree with a dense rasterized canopy, bounded petal animation, scroll-velocity leaf bursts, reduced-motion support, and responsive geometry.
- A separate mountain-temple journal with search, topic filters, and scroll-inspired article cards.
- Ten imported Medium essays rendered in a sanitized on-site reader, with the original publication retained as attribution.
- Owner-written project notes that appear publicly only after an explicit publish action.
- An unlisted `/study` writing room with a Medium-like visual composer, live preview, private drafts, explicit publishing, and GitHub-backed version safety. GitHub OAuth, owner-ID verification, encrypted server-only sessions, CSRF checks, and SHA concurrency controls protect it.
- A multi-page Vite build deployed automatically to Vercel from `main`.

The retired synthetic AI-safety demo was removed from the homepage. The portfolio now favors evidence from real work and writing over a small simulation that did not materially strengthen the story.

## Routes

- `/` — portfolio homepage
- `/journal` — searchable writing archive
- `/read?post=<slug>` — on-site reading scroll
- `/study` — owner-only project-note editor; deliberately absent from public navigation and search indexing
- `/api/author` — Vercel serverless OAuth and authoring endpoint

## Architecture

```text
Public browser
  ├─ Vite pages and shared design system
  ├─ generated catalog + sanitized article JSON
  └─ Vercel Function: /api/author
         ├─ GitHub OAuth + PKCE/state
         ├─ encrypted HttpOnly session + CSRF validation
         ├─ private draft repo: jas-khetani-portfolio-notes
         └─ public publish target: jas-khetani-portfolio/content/notes

GitHub main push → GitHub Actions → Vercel production deployment
```

The repository you are reading is intentionally **public**. It contains the site, imported public essays, and only those project notes that were explicitly published. Draft source lives in a separate private repository and is re-verified as private before every protected read or write. Publishing copies the approved note into this repository; that public commit triggers the next Vercel deployment.

Build-time content handling uses `marked` plus `sanitize-html`. The browser preview uses `marked` plus DOMPurify. Drafts are excluded, scripts and embeds are stripped, tracking pixels are removed, source links must use HTTPS, and owner-note slugs use the reserved `note-` namespace.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm ci
npm run dev
```

Useful commands:

```bash
npm test          # Node security, content, authoring, and structure tests
npm run build     # Generate content and build every route
npm run test:e2e  # Production-build browser tests in Microsoft Edge
```

## Deployment

Vercel builds the project with:

- Framework: Vite
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`
- Production branch: `main`

Every pushed commit is verified in GitHub Actions. Vercel then deploys a successful `main` build to the production URL. See [docs/VERIFICATION.md](docs/VERIFICATION.md) for the exercised checks.

## Owner authoring

The production writing room is configured at `/study`. Its server-side environment requires:

- `APP_ORIGIN`
- `DRAFT_REPO`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `SESSION_SECRET`

`DRAFT_REPO` must equal the fixed private repository `jaskhetani/jas-khetani-portfolio-notes`; the server fails closed if its exact identity or private visibility cannot be verified. Publication separately verifies that this portfolio repository has the expected public identity before writing.

The classic OAuth app currently requests `repo` because it must reach the private draft repository. GitHub does not narrow that classic scope to one repository. The endpoint itself is fixed to the two repositories above and never returns the OAuth token to client JavaScript. For setup, operating details, failure semantics, and security limitations, read [docs/AUTHORING.md](docs/AUTHORING.md).

Never commit secrets, private employer/client material, account data, or credentials here—or to the draft repository.

## Future plans

- Publish deeper, permission-safe case studies with architecture diagrams, measurable outcomes, and explicit trade-offs.
- Grow the field-note journal with original post-deployment lessons rather than generic AI commentary.
- Replace classic OAuth with a repository-installed GitHub App for tighter, repository-specific permissions.
- Add a first-party custom domain and durable ownership metadata while retaining `jaskhetani.vercel.app` as the deployment fallback.
- Self-host or deliberately archive article imagery that currently depends on original Medium-hosted assets.
- Keep reducing tree raster time and add visual-regression checks without thinning the blossom canopy or weakening reduced-motion behavior.
- Continue accessibility audits for keyboard navigation, contrast, semantic structure, and long-form reading comfort.

## Credits

Designed, written, and owned by **Jas Khetani**—with a strong helping hand from **Vera Hermes, his Hermes Agent**, across research synthesis, design engineering, implementation, testing, security review, and deployment.

The collaboration is credited plainly; responsibility for what is published remains Jas’s.
