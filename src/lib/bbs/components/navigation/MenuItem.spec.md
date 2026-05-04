# MenuItem

## Purpose
Renders a single menu row in the BBS style: `[KEY] » Label`. Highlights when active. Dispatches a `select` event on click (or Enter keypress).

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `screen` | `ScreenDefinition` | — | Includes optional `menuInactive` (gray, non-interactive row) |
| `active` | `boolean` | `false` | Whether this row is currently highlighted |
| `menuStyle` | `'numbered' \| 'lettered' \| 'both'` | `'numbered'` | How the key label is shown |
| `enableClick` | `boolean` | `true` | Click / Enter select; no effect when `screen.menuInactive` |

## Events
| event | payload | description |
|-------|---------|-------------|
| `select` | `string` (screenId) | Fired on click or Enter when enabled and not `menuInactive` |

## Visual states
- **Disabled (`screen.menuInactive`)**: all text `--bbs-muted`; `pointer-events: none` — no hover cursor or highlight
- **Normal**: foreground text; primary key bracket; secondary icon
- **Hovered / active** (when `enableClick` and not disabled): `--bbs-highlight` / `--bbs-highlight-text`

## Behavior
- Renders as `[key] icon label` — icon defaults to `' '` if `screen.menuIcon` is undefined
- Click / Enter only when `enableClick` is true and row is not `menuInactive`
- `user-select: none` — prevents text selection on rapid clicks

## Acceptance Criteria
- [ ] Rows with `menuInactive` stay muted `--bbs-muted`; no hover highlight (`pointer-events: none`)
- [ ] Interactive row uses foreground text with primary-colored key bracket when not highlighted
- [ ] No hover effect when `enableClick` is false
- [ ] Click fires `select` with `screen.id`
- [ ] Click does nothing when `enableClick` is false
- [ ] Enter key fires `select` only when interactive
