# theme.store

## Purpose
Maps `ThemeConfig` colour + font blobs onto `:root` CSS custom properties (`--bbs-*`). Tracks **appearance mode** (`night` | `day`) when `bbsConfig.themeDay` is configured, persists selection, and aligns `color-scheme` for native UI.

## Exported API

| symbol | description |
|--------|--------------|
| `themeStore` | `{ active, cssVars, mode, matrixLocked }` — subscribed by derived helpers |
| `themeModeStore` | Derived `'night' \| 'day'` shorthand |
| `matrixLockedStore` | Derived boolean — true after Matrix easter egg activates (session until full page refresh) |
| `applyTheme(theme, mode?)` | Writes vars + `--bbs-theme-*` wrapper class (`mode` default `night`) |
| `initThemeFromStored()` | After `initConfig()` — restores `localStorage`, applies matching palette |
| `toggleThemeMode()` | Requires `themeDay`; flips mode, persists, reapplies palette |

### `localStorage`
- Key: `bbs-appearance` — stores `"night"` \| `"day"` while `themeDay` exists.

## Behavior
- `applyTheme` sets `document.documentElement` class `bbs-theme-night` or `bbs-theme-day` (when in browser).
- **Matrix easter egg**: within a **3.2s** sliding window, **`8`** successful day/night presses on `toggleThemeMode()` (only when `themeDay` is configured) trigger **Matrix mode**: applies a green-on-black palette via `applyTheme`, sets `matrixLocked` true, adds `bbs-matrix-mode` on `document.documentElement`, and freezes the status-bar clock via `setClockFrozen(true)` (`terminal.store`). While `matrixLocked`, `toggleThemeMode` is a no-op (no `localStorage` update). Matrix state clears on full page reload only. **`MatrixRain`** is not continuous: `navigation.store` sets **`matrixNavigationRainStore`** for **~1100ms** starting **before** the next screen’s id/history commit so rain covers the **previous** screen first (see `navigation.store` / `+layout.svelte`).
- Without **`themeDay`**: `toggleThemeMode` returns immediately; `initThemeFromStored` always applies `config.theme`.
- Fonts and `--bbs-font-*`/`--bbs-line-height` follow whichever `ThemeConfig` is active (`theme` vs `themeDay`); callers should duplicate font blocks in config when only colours differ.

## Acceptance Criteria
- [ ] `:root` receives correct `--bbs-bg`/`--bbs-fg` swaps when toggling (`#000`-on-white vs `#fff`-on-black style pairs).
- [ ] Preference survives reload when `themeDay` is present.
- [ ] `toggleThemeMode` is a silent no-op if `themeDay` is omitted.
- [ ] `document.documentElement` carries exactly one `bbs-theme-*` class after init and after each toggle.
- [ ] Rapid toggles (≥ **8** within **3.2s**) switch to Matrix palette, set `matrixLocked`, add `bbs-matrix-mode`, and subsequent `toggleThemeMode` calls do nothing until refresh.
