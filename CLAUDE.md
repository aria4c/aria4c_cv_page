# BBS Framework — CLAUDE.md

## What this is

A retro BBS/teletype-style personal CV site built on SvelteKit. It has two layers:

1. **Framework** (`src/lib/bbs/`) — generic, reusable, content-agnostic BBS engine
2. **CV app** (`src/content/` + `src/routes/screens/`) — Illya's personal data + screen implementations

Entry point: `src/bbs.config.ts` — single source of truth for everything (theme, screens, effects, navigation).

## Architecture

```
src/
├── bbs.config.ts                  ← all config lives here
├── app.css                        ← CSS custom property declarations
├── content/                       ← CV data (TypeScript objects, no components)
│   ├── profile.ts
│   ├── experience.ts
│   ├── skills.ts
│   ├── projects.ts
│   ├── ascii-art.ts
├── lib/bbs/                       ← framework (no CV content here)
│   ├── index.ts                   ← public API barrel
│   ├── types/config.ts            ← all types, fully JSDoc'd
│   ├── stores/                    ← reactive state
│   │   ├── config.store.ts        ← singleton BBSConfig
│   │   ├── navigation.store.ts    ← screen routing + history + breadcrumb
│   │   ├── theme.store.ts         ← applies theme as CSS vars
│   │   ├── terminal.store.ts      ← clock, status messages
│   │   └── effects.store.ts       ← cursor blink, typewriter queue
│   ├── components/
│   │   ├── layout/                ← BBSRoot, BBSFrame, SplashScreen, StatusBar
│   │   ├── navigation/            ← MainMenu, MenuItem, BackPrompt, Breadcrumb
│   │   ├── effects/               ← CRTOverlay, MatrixRain, Typewriter, BlinkingCursor, BootSequence, GlitchText
│   │   └── primitives/            ← BoxFrame, Divider, Badge, AsciiArt, KeyHint, ProgressBar
│   └── utils/                     ← box-drawing.ts, keyboard.ts, typewriter.ts, theme-vars.ts
└── routes/
    ├── +layout.ts                 ← prerender=true, ssr=false
    ├── +layout.svelte             ← mounts BBSRoot + CRTOverlay + StatusBar
    ├── +page.svelte               ← screen switcher (if/else on currentScreenId)
    └── screens/                   ← CV screen components (use framework primitives)
```

## Navigation model

Single SPA route (`/`). No URL changes by default (urlSync disabled). Navigation is managed entirely by `navigation.store.ts`:

- `navigate(id)` — push current screen to history, show new screen
- `goBack()` — pop history; if empty, go home
- `goHome()` — clear history, go to `config.screens.home`

`+page.svelte` switches screens with a static `{#if}` chain keyed on `$navigationStore.currentScreenId`. New screens must be added here manually.

## How to add a new screen

1. Create `src/routes/screens/MyScreen.svelte` — use `BBSFrame` + `BackPrompt` as base
2. Add a `ScreenDefinition` entry to `bbs.config.ts` under `screens.screens[]`
3. Import and wire the component in `src/routes/+page.svelte`'s `{#if}` chain
4. Arcade or demo routes (`InvadersScreen`, etc.) follow the same wiring; gameplay keys stay at keyboard priority **2** so global nav remains priority **1**

## CSS custom properties

All theme values are available as CSS vars set by `theme.store.ts`:

| var | usage |
|-----|-------|
| `--bbs-bg` | background |
| `--bbs-fg` | default text |
| `--bbs-primary` | borders, key labels, accents |
| `--bbs-secondary` | metadata, labels, muted text |
| `--bbs-muted` | hints, separators |
| `--bbs-highlight` / `--bbs-highlight-text` | selected menu row |
| `--bbs-cursor` | blinking cursor |
| `--bbs-success` / `--bbs-error` / `--bbs-warning` | status colors |
| `--bbs-font` | monospace font stack |
| `--bbs-font-size` / `--bbs-font-size-lg` / `--bbs-font-size-sm` | sizes |
| `--bbs-line-height` | line height multiplier |

## Key conventions

- **No URL routing.** Never add `href` navigation or SvelteKit `goto()` — all navigation goes through `navigation.store`.
- **Content stays in `src/content/`.** Screens import typed data objects; they don't hardcode strings.
- **Box-drawing fills via overflow-clip.** Long fill strings (300 chars) are clipped by CSS — don't use JS string measurement for borders.
- **Keyboard handler priority.** `register(key, fn, priority)` — higher number = higher priority. Screens use priority 2, global nav (back/home/theme toggle) uses priority 1.
- **Mobile (no keyboard).** From **≤720px** width, `MobileTouchNav` in `+layout.svelte` shows Back / Home / theme (when configured) using the same stores as keyboard nav; `app.css` hides `BBSFrame` footers on that breakpoint to avoid duplicate controls. Wider layouts are unchanged.
- **Day/night.** Optional `bbsConfig.themeDay` (black-on-white) alongside `theme` (white-on-black). `navigation.themeToggleKey` (e.g. `T`) calls `toggleThemeMode()`; preference stored under `bbs-appearance` in `localStorage`. Rapid toggles can trigger **Matrix mode** (green-on-black, Matrix rain overlay **before** each screen commits on navigation, frozen clock, theme toggle disabled until full page refresh — see `theme.store` / `navigation.store` / `MatrixRain.svelte`).
- **Spec files live next to implementation.** `*.spec.md` alongside the file it describes.
- **Framework is content-agnostic.** Nothing inside `src/lib/bbs/` should import from `src/content/` or `src/routes/`.

## Build & dev

```bash
npm run dev      # dev server → http://localhost:5173
npm run build    # static build → build/
npm run preview  # preview build
```

SvelteKit adapter: `@sveltejs/adapter-static`. Output in `build/`.
