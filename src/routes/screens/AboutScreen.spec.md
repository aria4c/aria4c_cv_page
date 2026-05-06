# AboutScreen

## Purpose
CV “About Me” route: portrait, badges, locale map, typed bio (`profile`), languages/domains lists. Mounted from `+page.svelte` when navigation `currentScreenId === 'about'`.

## Components used
| component | usage |
|-----------|-------|
| `BBSFrame` | Screen chrome + footer `BackPrompt` |
| `RowRevealImage` | `/photo.jpg` |
| `LocationMap`, `Badge`, `Divider` | Inline layout |
| `Typewriter` | Desktop bio only (≤720px bio is static text) |

## Behaviour
- Imports `languages` / `practiceDomains` / `profile` from `src/content/` (never hardcoded prose).
- On wider viewports, layout remains side-by-side (photo rail + main column with hidden overflow consistent with desktop typewriter containment); bio uses `<Typewriter>`.
- On viewports **≤720px** (initial `matchMedia` + `change` listener): **pager UI** — **two screens**: (1) photo/status, name/title, **full bio text immediately** (no typewriter), opportunities; (2) metadata lines + centred narrow `LocationMap`. Bottom strip: touch `⟨` / `⟩`, disabled at ends, `SCREEN · n/m` plus `SYNOPSIS` / `DATA` tag. Scroll region sits above the strip.

## Acceptance Criteria
- [ ] Desktop (>720px): two-column About layout unchanged visually (photo left, detail + scroll-contained bio behaviour as before).
- [ ] Narrow (≤720px): pager defaults to screen 1 (bio); arrows flip screens; `SCREEN · n/m`; ends disable arrows.
- [ ] Narrow (≤720px): bio on screen 1 shows at once (no character-by-character typewriter).
- [ ] Narrow: map only on screen 2, capped width / centred (not full-bleed dominating the view).
