# KeyHint

## Purpose
Renders a single keyboard shortcut hint as `[KEY] Label`. Used inside `BackPrompt` and anywhere a key binding needs to be surfaced in the UI.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `key` | `string` | `''` | The key character shown in brackets, e.g. `'B'`, `'H'` |
| `label` | `string` | `''` | Descriptive text shown after the bracket, e.g. `'Back'` |
| `dim` | `boolean` | `false` | Renders in `--bbs-muted` instead of secondary/primary colors |

## Behavior
- Key bracket uses `--bbs-primary` color (or `--bbs-muted` when `dim`)
- Label text uses `--bbs-secondary` color (or `--bbs-muted` when `dim`)
- `white-space: nowrap` — never wraps
- Renders as an inline `<span>` — no interactivity, no click handler (parent wraps in `<button>`)
- Label is optional — omitting it renders just `[KEY]`

## Usage
```svelte
<KeyHint key="B" label="Back" />
<KeyHint key="H" label="Home" />
<KeyHint key="Q" dim />   <!-- just [Q], dimmed -->
```

## Acceptance Criteria
- [ ] Renders as `[KEY] Label`
- [ ] Key bracket uses primary color; label uses secondary color
- [ ] `dim=true` uses muted for both key and label
- [ ] Omitting `label` renders just `[KEY]`
