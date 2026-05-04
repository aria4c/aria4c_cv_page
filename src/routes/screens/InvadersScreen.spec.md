# InvadersScreen (GRID DEFENDER)

## Purpose
Easter-egg arcade: a monochrome grid “Space Invaders” analogue playable inside the BBS shell. Ships as block glyphs; lasers vs descending formation. Wired from `bbs.config.ts` via `menuKey` like other routes.

## Behaviour
- Full-screen-ish playfield inside `BBSFrame`; uses only `--bbs-*` colours (no literals). Outer shell drops page padding (`+page` when `invaders`) and bleeds into `BBSFrame` inner gutters. `font-size` is derived from **`bind:clientWidth` / `clientHeight`** on the arena: prefer **filling the padded width** when `ROWS × fp` fits the height; otherwise shrink to **height-fit** so nothing is permanently “half-width” from `vmin` alone.
- **Priority 2** keyboard: `ARROWLEFT` / `ARROWRIGHT` move the cannon (`A` / `D` aliases); fire with `SPACE` or `X` only while `phase === 'playing'`.
- **Ammo magazine:** `MAG_MAX` charges; firing decrements **`shells`**. While `phase === 'playing'` and `shells < MAG_MAX`, the sim accumulates time each tick toward **`RELOAD_MS_PER_SHELL`**; when the threshold is met, **one** charge is restored (repeat until full if multiple intervals elapsed). Alien hits consume the round **without refund**. Waves / level splash top up to full and clear the reload accumulator.
- **Reload HUD:** a dedicated **thin line bar** below the HUD (not the résumé `ProgressBar` primitive) is **always mounted** so the layout height does not jump. While `playing` with `shells < MAG_MAX`, fill width reflects **percent progress** toward the next shell (`reloadAccum / RELOAD_MS_PER_SHELL`); with a full magazine it stays **100%**; during level splash / fail it shows an **idle** empty bar (muted track).
- **`levelSplash` phase:** between starts and between waves — shows **LEVEL n** card; `SPACE` / `X` / `ENTER` skip; timer auto-advances after a few seconds.
- **`failed` phase:** full fail card (`SIGNAL LOST`); **`R`** hard-resets to wave 1 + level splash; **`B`** still exits via footer (priority 1).
- **`R`** only arms on `failed` — no mid-wave reset.
- **Priority 1** still wins for back/home/theme (`BackPrompt` unaffected).
- `requestAnimationFrame` loop clears on destroy; intro `setTimeout` cleared; registrations `unregister()` on destroy.

## Acceptance Criteria
- [ ] Selecting the menu row (**menu key `7`**) opens `InvadersScreen` from `bbs.config.ts`.
- [ ] Invaders descend and flip direction at lateral edges; cannon fires upward; collisions add score.
- [ ] All rows cleared advances wave (harder pacing), shows **LEVEL** interstitial before the next formation; aliens breaching yields **fail** overlay (not just a one-line hint).
- [ ] Firing stalls at **`shells === 0`** until the timer restores charges one-by-one; HUD `AMMO · n/MAG_MAX` and the **thin recharge line** stay in sync — hits strip ammo without instant refill.
- [ ] `B` exits via standard footer; **fail** then `R` restarts cleanly without leaks (`cancelAnimationFrame` + intro timer + key cleanup).
- [ ] Raster measures the arena (`clientWidth`/`clientHeight`), scales `font-size` so the **`COLS×ROWS`** matrix spans the padded frame width (centered slab), cropping only when vertical space is tighter than glyph height.
