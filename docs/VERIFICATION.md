# Verification of the rebuild

## Source and destination

Source: user-designated `Downloads/jas-fde-portfolio-bundle/`. Destination: private `jaskhetani/jas-khetani-portfolio`, preserving existing history. No force push or history rewrite.

## Executed locally

- `npm test`: **17 passing** unit/security tests.
- `npm run build`: successful Vite production build; **10 imported published articles**; drafts excluded.
- `npm run test:e2e`: **20 passing** Microsoft Edge production-build browser tests.
- Layout widths: **320, 390, 768, 1024, 1440 CSS pixels**. No horizontal document overflow; measured tree connections and ground alignment hold.
- Journal filtering, search, empty state, local reader, text-size controls, all ten full imported bodies, useful missing-article state.
- Reduced motion: no falling-petal frame scheduling; arrival leaf hidden.
- Owner editor tests simulate authenticated API responses: note namespace, cancelled navigation, locked controls during loading, edits retained during saving, explicit unpublish, verified-save/list-refresh distinction.
- Server tests simulate GitHub: OAuth state+PKCE, encrypted cookies, numeric owner allowlist, nonowner denial/token revocation, CSRF, origin denial, repository privacy, validation, SHA conflicts, read-back after save, publish/unpublish dates.
- Stale worker/fallback regression tests prevent older renders from terminating/replacing the current generation.
- `npm audit --omit=dev`: zero reported vulnerabilities at verification time.
- Screenshots visually reviewed for desktop/mobile homepage, temple journal, and mobile reader.

The final local browser run measured **133–208 ms main-thread geometry** and **1,033–1,194 ms worker rasterization** across tested widths. An earlier busy-host run took much longer (6–14 seconds background rasterization). These are local observations, not universal performance guarantees. Content remains usable while worker artwork finishes. The same dense canopy was retained.

## Honest deployment boundary

Browser tests ran against the production static build locally. API tests used a simulated GitHub provider; no live OAuth login or note publishing is claimed. Production OAuth needs a canonical Vercel HTTPS origin and four server environment variables (see AUTHORING.md). Vercel deployment itself must be checked after the repository is imported and configured. Original article images are external resources and can become unavailable; reader fallback text handles failures.

Employer/client descriptions and resume-reported numbers still require the owner's publication approval. Public launch should not be confused with this private GitHub delivery.
