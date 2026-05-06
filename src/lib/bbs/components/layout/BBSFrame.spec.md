# BBSFrame

## Purpose
Full-height screen wrapper used by every CV screen. Renders a box-drawing border with a labelled title row, a scrollable content slot, and an optional footer slot (typically `BackPrompt`). This is the standard outer shell for all content screens.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `title` | `string` | `''` | Text embedded in the top-left of the top border row |
| `subtitle` | `string` | `''` | Screen-specific text in the top-right (e.g. entry counts) |
| `borderStyle` | `BorderStyle \| undefined` | theme default | Overrides the global border style for this frame only |
| `showGlobalNavHints` | `boolean` | `true` | Desktop: when `true` and config loads, appends `│ [H] HOME`, optional `[T] DAY\|NIGHT`, `[Q] QUIT`. Narrow (≤720px): hints are suppressed regardless of prop — see `MOBILE_LAYOUT.spec.md`. |

## Slots
| slot | description |
|------|-------------|
| *(default)* | Main content area — rendered between the side borders with `0.5rem 1rem` padding |
| `footer` | Optional footer section — when provided, a full-width divider row is inserted above it |

## Behavior
- Border style falls back to `config.theme.borders` from `configStore` when not provided
- Box-drawing characters come from `getChars(borderStyle)`
- Horizontal fill uses a 300-char repeat string clipped by CSS `overflow: hidden` (never JS-measured)
- When **`window.matchMedia('(max-width: 720px)')` matches**, global keyboard-hint ribbon (`[H] HOME`, `[T] DAY|NIGHT`, `[Q] QUIT`) is suppressed even if `showGlobalNavHints` is true — avoids duplicating **`MobileTouchNav`** / touch affordances (`src/MOBILE_LAYOUT.spec.md`).
- Footer slot when present is wrapped in **`bbs-frame-footer`** — holds the divider row and `.footer-area` — so global CSS can hide narrow footers without `:has()` selectors.
- Takes full height of its parent container (`height: 100%`)
- Top-right cluster: `subtitle` (if any) then `│` then global hints; label after `themeToggleKey` is **DAY** when current mode is night (press to switch to day) and **NIGHT** when current mode is day — mirrors `toggleThemeMode`, except when **`matrixLocked`** is true the theme segment shows **`LOCK`** (toggle is disabled until page refresh)

## Usage
```svelte
<BBSFrame title="ABOUT ME">
  <p>Content here</p>

  <svelte:fragment slot="footer">
    <BackPrompt />
  </svelte:fragment>
</BBSFrame>
```

## Acceptance Criteria
- [ ] Title appears in top-left of the top border row
- [ ] Top-right shows `subtitle` (if set) plus global `[HOME]` / `[THEME?]` / `[QUIT]` hints when `showGlobalNavHints` is true **and** viewport is wider than mobile breakpoint; narrow viewports omit hints
- [ ] Footer divider and section only render when the `footer` slot is filled
- [ ] `borderStyle` prop overrides the theme default for this instance
- [ ] Horizontal fill lines extend to full available width via CSS clip
- [ ] When Matrix mode is active (`matrixLocked`), the theme toggle hint shows `[T] LOCK` (or the configured `themeToggleKey`) instead of DAY/NIGHT
- [ ] ≤720px: global nav hints hidden from the top-right cluster (subtitle alone may still appear)
- [ ] Narrow footers use `.bbs-frame-footer`; hidden visually by layout CSS without breaking slot mount
