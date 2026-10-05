# Private writing room setup

## What works without setup

The portfolio, journal, imported articles, search, filters, scroll reader, and animations are static. `/study` shows an honest configuration message until the server is configured; it never pretends that browser-only drafts have been published.

## One-time GitHub OAuth setup

1. Deploy the repository to Vercel and decide the canonical HTTPS hostname.
2. Create a GitHub OAuth app in your own account: https://github.com/settings/developers
3. Homepage URL: your canonical HTTPS origin.
4. Authorization callback URL: `https://YOUR-HOST/api/author` (the implementation adds `?action=callback` to the redirect URI).
5. Add these server-only Environment Variables in Vercel for **Production**, never with a `VITE_` prefix:
   - `APP_ORIGIN`: exact `https://YOUR-HOST`, no trailing slash/path.
   - `GITHUB_CLIENT_ID`: OAuth app's client ID.
   - `GITHUB_CLIENT_SECRET`: OAuth app secret, entered directly in Vercel's masked settings.
   - `SESSION_SECRET`: cryptographically random secret of at least 32 characters, generated in your password manager and stored only in the server environment.
6. Redeploy, visit `/study`, and authorize your GitHub account. Only GitHub numeric user ID `82095478` (Jas) can enter. Neither a guessed URL nor another GitHub login is sufficient.
7. Save a draft; check it exists in the private repo but is absent from `/data/catalog.json`. Publish explicitly, wait for Vercel's Git-triggered deployment, and check the public article.

**Never paste client secrets or session secrets into chat or source files.** OAuth setup is intentionally not fabricated. Live OAuth and publication must be verified on the deployed canonical hostname.

## Permission trade-off

This implementation uses a classic GitHub OAuth app with `repo` scope because the target repository is private. GitHub does not narrow that classic scope to a single repository: the consent grants wider repository access than this app's fixed endpoint uses. The server only targets `jaskhetani/jas-khetani-portfolio/content/notes` on `main`. Access tokens are AES-256-GCM encrypted inside Secure/HttpOnly/SameSite cookies and are never returned to JavaScript. Sessions expire in two hours. For stricter least privilege, migrate to a repository-installed GitHub App before broader deployment; do not mislabel classic OAuth as repository-scoped.

## Draft privacy

Keep the repository **private**. Build exclusion is not a substitute for GitHub privacy; note drafts remain in Git history. Anyone with repository access can see drafts/history, and making the repo public would expose historical drafts. Never put passwords, client data, or private account records in a note. A published note can be moved back to draft, but prior public deployments and Git history are not erased by unpublishing.

## Publishing behavior

Saving creates/updates a JSON file in GitHub using a SHA concurrency check, then reads back the exact committed target. Conflicting versions are rejected instead of overwriting silently. A successful save means GitHub confirmed it—not that Vercel has finished rebuilding. Draft-only commits may also trigger builds; those drafts are excluded from public output.

There is no database, insecure browser token field, client-side password, or hidden backdoor. `/study` is unlisted and marked noindex, with real server authentication for every protected operation. Preview deployments use a different origin and are not authorized production writing surfaces. Local Vite is suitable for UI testing, not live OAuth.

Sources:
- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
- https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
- https://vercel.com/docs/functions/runtimes/node-js
