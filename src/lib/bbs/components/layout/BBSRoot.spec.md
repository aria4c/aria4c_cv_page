# BBSRoot

## Purpose
Top-level framework wrapper. Bootstraps all stores (config, theme, clock, cursor, keyboard) on mount and tears them down on destroy. Sets the full-viewport CSS container that everything else renders inside.

## Props
| prop | type | required | description |
|------|------|----------|-------------|
| `config` | `BBSConfig` | yes | Full config object. Passed to `initConfig()`, theme init (`initThemeFromStored`), etc. |

## Behavior
- `onMount`: calls `initConfig(config)` → `initThemeFromStored()` (loads `bbs-appearance`, applies `theme` or `themeDay`, sets `bbs-theme-night`/`bbs-theme-day` on `<html>`) → if `navigation.themeToggleKey != null`: `register(themeToggleKey, toggleThemeMode, 1)` → starts clock, cursor blink, keyboard listener → sets initial screen (`splash` if `config.splash.enabled`, otherwise `config.screens.home`)
- `onDestroy`: unregisters theme-toggle handler when present; cleans up clock, cursor, keyboard listener
- Renders a full `100vw × 100vh` div with `overflow: hidden` and theme CSS vars applied
- Provides a `<slot />` for layout children (CRTOverlay, StatusBar, main content)
- Does NOT render any visible UI of its own — purely structural + init

## Usage
```svelte
<!-- +layout.svelte -->
<BBSRoot config={bbsConfig}>
  <CRTOverlay ... />
  <StatusBar ... />
  <main><slot /></main>
</BBSRoot>
```

## Acceptance Criteria
- [ ] All stores are initialised before the first child renders
- [ ] CSS custom properties (--bbs-bg, --bbs-fg, etc.) are set on the root div
- [ ] Cleanup functions are called on destroy (no memory leaks)
- [ ] Renders exactly one child slot
- [ ] With `themeDay` + non-null `themeToggleKey`, toggling survives reload (`localStorage`) and restores correct palette without flash of wrong mode when possible
