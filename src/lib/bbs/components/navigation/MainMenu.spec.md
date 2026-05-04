# MainMenu

## Purpose
Renders a list of `MenuItem` rows and manages keyboard navigation (arrow keys, per-item hotkeys, Enter). Dispatches a `select` event with the chosen screen ID. Does not perform navigation itself — the parent screen handles that.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `items` | `ScreenDefinition[]` | — | Ordered list of screens to display |
| `activeIndex` | `number` | `-1` | Index of the currently highlighted row. Bindable. |

## Events
| event | payload | description |
|-------|---------|-------------|
| `select` | `string` (screenId) | Fired when a menu item is chosen by key or click |

## Slots
| slot | description |
|------|-------------|
| `header` | Content rendered above the menu list |
| `footer` | Content rendered below the menu list |

## Keyboard bindings (registered on mount, cleaned up on destroy)
| key | action |
|-----|--------|
| Each item's `menuKey` | Immediately dispatch `select` for that item — **skipped** when `menuInactive: true` |
| `ArrowUp` | Move `activeIndex` to the previous **non-inactive** row (wraps) |
| `ArrowDown` | Move `activeIndex` to the next **non-inactive** row (wraps) |
| `Enter` | Dispatch `select` for current `activeIndex` if that row is not `menuInactive` |

- All keyboard bindings use priority 2 (screen-level)
- Bindings are only registered when `config.navigation.enableKeyboard` is true

## Acceptance Criteria
- [ ] New `ScreenDefinition` rows in `bbs.config.ts` gain a `[menuKey]` entry automatically whenever `showInMenu: true`; no manual list duplication in MainMenu beyond config
- [ ] Pressing an **active** item's `menuKey` fires `select` with the correct screen ID; inactive rows register no binding
- [ ] Arrow keys skip `menuInactive` rows and wrap at boundaries
- [ ] Enter dispatches `select` only when the current row is **not** `menuInactive`
- [ ] Keyboard bindings are cleaned up on component destroy
- [ ] Header and footer slots render in correct positions
