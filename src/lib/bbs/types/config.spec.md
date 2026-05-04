# BBSConfig Type System

## Purpose
Single TypeScript interface hierarchy that is the source of truth for every configurable aspect of the BBS framework. All stores, components, and utilities import from here.

## API

```typescript
// See config.ts for full definitions.
// Top-level shape:
interface BBSConfig {
  system:     SystemConfig;
  theme:      ThemeConfig;
  themeDay?:  ThemeConfig;
  splash:     SplashConfig;
  navigation: NavigationConfig;
  screens:    ScreenRegistry;
  effects:    EffectsConfig;
  statusBar:  StatusBarConfig;
}
```

## Behavior
- Pure types only — no runtime logic
- All fields have JSDoc comments
- Re-exported from `src/lib/bbs/index.ts`

### `BBSConfig.theme` · `themeDay`
| field | type | description |
|-------|------|-------------|
| `theme` | `ThemeConfig` | Night baseline (typically light glyphs on dark background). Canonical source for CLI-style defaults wired through `theme.borders`. |
| `themeDay` | `ThemeConfig \| undefined` | Optional day palette (dark glyphs on light). Enables global day/night toggle via `navigation.themeToggleKey`. |

### `NavigationConfig.themeToggleKey`
| field | type | description |
|-------|------|-------------|
| `themeToggleKey` | `string \| null` | Key (e.g. `"T"`) invoking `toggleThemeMode()` at priority **1**. `null` disables. Without `themeDay`, toggling is ineffective. |

## ScreenDefinition.seo (optional)
When present, `+layout.svelte` uses these values to override the layout-level `<svelte:head>` defaults while that screen is active.

| field | type | description |
|-------|------|-------------|
| `title` | `string` | Browser tab title and `<title>` tag |
| `description` | `string` | `<meta name="description">` content |

## Acceptance Criteria
- [ ] `BBSConfig` and all sub-interfaces are importable from `$lib/bbs/types/config`
- [ ] TypeScript compiles with strict mode and no errors
- [ ] Every field has a JSDoc comment
- [ ] `ScreenDefinition.seo` is optional; omitting it falls back to layout-level defaults
- [ ] Browser tab title updates when navigating between screens that define `seo.title`
- [ ] `themeDay` optional — apps without `themeDay` keep a single palette
- [ ] `themeToggleKey` appears on `NavigationConfig` and binds `toggleThemeMode` at keyboard priority **1**
