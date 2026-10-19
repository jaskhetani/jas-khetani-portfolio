# Verification of the rebuild

## Source and destination

Source: user-designated `Downloads/jas-fde-portfolio-bundle/`. Destination: public `jaskhetani/jas-khetani-portfolio`, preserving existing history. Private authoring source: `jaskhetani/jas-khetani-portfolio-notes`. No force push or history rewrite.

## Executed locally

- `npm test`: **22 passing** unit/security/content/structure tests.
- `npm run build`: successful Vite production build; **10 imported published articles**; drafts excluded.
- `npm run test:e2e`: **29 passing** Microsoft Edge production-build browser tests.
- Layout widths: **320, 390, 768, 1024, 1440 CSS pixels**. No horizontal document overflow; measured tree connections and ground alignment hold.
- Journal filtering, search, empty state, two visibly forthcoming project-note topics, clean `/journal/<slug>` routes, legacy-link canonicalization, text-size controls, all ten full imported bodies, and a useful missing-article state.
- Homepage proof checks cover the forward-deployed positioning, canonical facts, seven direct credential artifacts, omission of stale/unsupported claims, six lazy `youtube-nocookie.com` commercial embeds, canonical/structured metadata, `robots.txt`, and `sitemap.xml`.
- Reduced motion: no falling-petal or scroll-leaf frame scheduling; arrival leaf hidden. Fast downward scrolling releases a bounded leaf burst, and the deliberate footer double-up owner gesture routes to the OAuth-protected study.
- Owner editor tests simulate authenticated API responses: visual formatting to Markdown, sanitized live preview, word/read-time count, note namespace, cancelled navigation, locked controls during loading, edits retained during saving, explicit unpublish, and verified-save/list-refresh distinction.
- Server tests simulate GitHub: OAuth state+PKCE, encrypted cookies, numeric owner allowlist, nonowner denial/token revocation, CSRF, origin denial, exact private/public repository verification, validation, SHA conflicts, read-back after private save and public publication, explicit unpublish deletion, and honest partial-sync failures.
- Stale worker/fallback regression tests prevent older renders from terminating/replacing the current generation.
- `npm audit --omit=dev`: zero reported vulnerabilities at verification time.
- Full-page screenshots were visually reviewed for the desktop/mobile homepage, temple journal, reader, and writing studio. The evidence-led layout retained the blossom-tree identity without horizontal clipping at any tested width.

Recent local browser runs measured **129–1,503 ms main-thread geometry** and **1,446–4,509 ms worker rasterization** across tested widths. The high values were outliers on a busy host; repeated runs varied substantially between Edge and Chromium. These are local observations, not universal performance guarantees. Content remains usable while worker artwork finishes, and the same dense canopy was retained.

## Deployment boundary

Browser tests run against the production static build locally. API tests use a simulated GitHub provider rather than mutating production notes. The production site and OAuth login have been configured on Vercel; Jas previously completed the live owner sign-in. After the public/private repository split, deployment health and owner authentication must be read back again from production before this document is treated as a live-publication guarantee. Production needs the five server variables documented in AUTHORING.md. Original article images remain external resources and can become unavailable; reader fallback text handles failures.

Employer/client descriptions and résumé-reported numbers still require the owner's publication approval. Public source visibility is not permission to disclose private client or employer material. The approved Precisio copy remains deliberately high-level, and no résumé is published until the owner supplies the final file.
