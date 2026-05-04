# BlinkingCursor

## Purpose
Renders the blinking cursor character. Visibility is driven by the global `cursorBlink` store (toggled by `startCursorBlink()` in BBSRoot). Used inline within text (e.g. Typewriter) or as a standalone block.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `char` | `string \| undefined` | config default (`█`) | Cursor character to display. Falls back to `config.effects.cursor.char`. |
| `inline` | `boolean` | `true` | `true` = renders as `<span>`, `false` = renders as `<div>` |

## Behavior
- Visibility toggles via CSS `visibility: visible/hidden` (preserves layout space when hidden)
- Blink rate is global — set once by `startCursorBlink(config.effects.cursor.blinkRateMs)` in BBSRoot
- `aria-hidden="true"` — excluded from screen readers
- Color is always `--bbs-cursor`

## Usage
```svelte
<!-- Inline at end of typed text -->
<span>{displayText}<BlinkingCursor inline /></span>

<!-- Flanking a prompt message -->
<BlinkingCursor char="▌" inline />&nbsp;PRESS ANY KEY&nbsp;<BlinkingCursor char="▌" inline />
```

## Acceptance Criteria
- [ ] Uses `char` prop when provided; falls back to `config.effects.cursor.char`
- [ ] Renders as `<span>` when `inline=true`, `<div>` when `inline=false`
- [ ] `visibility` toggles in sync with `cursorBlink` store
- [ ] Does not shift surrounding text layout when hidden (visibility, not display)
