# BBSFrame

## Purpose
Full-height screen wrapper used by every CV screen. Renders a box-drawing border with a labelled title row, a scrollable content slot, and an optional footer slot (typically `BackPrompt`). This is the standard outer shell for all content screens.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `title` | `string` | `''` | Text embedded in the top-left of the top border row |
| `subtitle` | `string` | `''` | Screen-specific text in the top-right (e.g. entry counts) |
| `borderStyle` | `BorderStyle \| undefined` | theme default | Overrides the global border style for this frame only |
| `showGlobalNavHints` | `boolean` | `true` | When `true` and config is initialised, appends `│ [H] HOME`, optional `[T] DAY\|NIGHT` (if `themeDay` + `themeToggleKey`), `[Q] QUIT` using actual keys from `navigation` |

## Slots
| slot | description |
|------|-------------|
| *(default)* | Main content area — rendered between the side borders with `0.5rem 1rem` padding |
| `footer` | Optional footer section — when provided, a full-width divider row is inserted above it |

## Behavior
- Border style falls back to `config.theme.borders` from `configStore` when not provided
- Box-drawing characters come from `getChars(borderStyle)`
- Horizontal fill uses a 300-char repeat string clipped by CSS `overflow: hidden` (never JS-measured)
- Footer slot is conditionally rendered using `$$slots.footer` — no divider row if no footer
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
- [ ] Top-right shows `subtitle` (if set) plus global `[HOME] [THEME?] [QUIT]` hints when `showGlobalNavHints` is true
- [ ] Footer divider and section only render when the `footer` slot is filled
- [ ] `borderStyle` prop overrides the theme default for this instance
- [ ] Horizontal fill lines extend to full available width via CSS clip
- [ ] When Matrix mode is active (`matrixLocked`), the theme toggle hint shows `[T] LOCK` (or the configured `themeToggleKey`) instead of DAY/NIGHT
