# Owner writing room setup

## Storage model

The portfolio repository is public. It contains the site, imported public essays, and only explicitly published project notes.

Private draft source lives in a separate repository:

```text
jaskhetani/jas-khetani-portfolio-notes
```

The server verifies that repository’s exact identity and `private: true` state before every note list, read, or save. A draft save writes only there. Publishing first verifies the private source commit, then verifies that `jaskhetani/jas-khetani-portfolio` is the expected public repository and copies the approved note to `content/notes/<slug>.json`. That public commit triggers Vercel.

Do not make the draft repository public. Build exclusion is not a privacy boundary, and Git history persists. The portfolio repository is likewise expected to remain public; authoring fails closed if either repository’s configured visibility no longer matches this two-repository model.

## One-time GitHub OAuth setup

1. Deploy the public portfolio repository to Vercel and choose the canonical HTTPS hostname.
2. Create a classic GitHub OAuth app at https://github.com/settings/developers.
3. Set its homepage to the canonical HTTPS origin.
4. Set the authorization callback to the exact value below, including the query string:

   ```text
   https://jaskhetani.vercel.app/api/author?action=callback
   ```

5. Add these server-only variables in Vercel for **Production**. Never prefix them with `VITE_`:
   - `APP_ORIGIN` — exact `https://jaskhetani.vercel.app`, with no trailing slash or path.
   - `DRAFT_REPO` — exact value `jaskhetani/jas-khetani-portfolio-notes`.
   - `GITHUB_CLIENT_ID` — OAuth app client ID.
   - `GITHUB_CLIENT_SECRET` — OAuth app secret, entered directly into Vercel’s masked settings.
   - `SESSION_SECRET` — cryptographically random value of at least 32 characters, stored only in the server environment.
6. Redeploy, visit `/study`, and sign in with GitHub. Only GitHub numeric user ID `82095478` can enter.
7. Save a draft. Confirm it exists only in the private notes repository and remains absent from the public portfolio and `/data/catalog.json`.
8. Publish it. Confirm a public note commit appears, Vercel deploys that commit, and the journal links to the local reading scroll.

**Never paste the OAuth secret, session secret, or access tokens into chat or source files.**

## Permission trade-off

The classic OAuth app requests `repo` because it must access the private draft repository. GitHub does not narrow that classic scope to a single repository. The server code itself is fixed to:

- private source: `jaskhetani/jas-khetani-portfolio-notes/content/notes`
- public target: `jaskhetani/jas-khetani-portfolio/content/notes`

Access tokens are encrypted into AES-256-GCM Secure/HttpOnly/SameSite cookies, never returned to browser JavaScript, and revoked on sign-out when GitHub is available. Sessions expire after two hours. State, PKCE, canonical-origin checks, owner-ID verification, and CSRF validation protect the flow.

A repository-installed GitHub App is the planned least-privilege successor. Until then, do not describe classic OAuth as repository-scoped.

## Authoring behavior

- The writing room uses a visual rich-text surface for headings, emphasis, links, quotes, lists, code, dividers, and HTTPS imagery. A sanitized live preview shows the public reading treatment. The browser converts the visual document to portable Markdown before sending it to the API; authors do not have to write Markdown directly.
- If only metadata changes, an existing note’s Markdown body is preserved byte-for-byte. Once the story itself is edited, the full visual document is normalized back to GitHub-flavored Markdown; unsupported formatting and non-HTTPS media may be removed, so review the live preview before saving.
- New note slugs must start with `note-`; imported Medium slugs cannot use that namespace.
- Saving a draft writes and reads back the exact private GitHub commit with a SHA concurrency check.
- Publishing writes the private source, then copies the server-generated note schema to the public repository and verifies the public commit.
- Moving a published note back to draft requires explicit confirmation. The private source is saved as a draft, the public file is deleted, and its absence is verified.
- If private persistence succeeds but public synchronization fails, the API says so explicitly and returns the verified private revision. It never falsely reports that nothing was saved. Every retry re-reads the actual public copy and reconciles it to the requested state, so a failed publication or unpublication does not become permanent drift.
- Unpublishing removes the current public file; it does **not** erase earlier public Git history or deployments.
- A successful publication means GitHub confirmed the public commit. Vercel may still be building it.

There is no client-side password, browser token field, database, or hidden-URL security claim. `/study` is unlisted and marked `noindex`, but real security comes from server-side authentication and authorization. Preview deployments use a different origin and are not production authoring surfaces.

## Content safety

Never put credentials, client data, private employer information, regulated records, or private account details in a note. The draft repository is private, but Git history and authorized-account access remain real exposure surfaces. Once content is published, assume it is permanently public.

## Primary references

- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
- https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
- https://vercel.com/docs/functions/runtimes/node-js
