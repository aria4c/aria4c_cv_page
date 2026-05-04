# Badge

## Purpose
Inline status badge rendered as `[ LABEL ]`. Color is driven by variant. Optionally blinks using a CSS animation.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `label` | `string` | `''` | Text shown inside the brackets |
| `variant` | `'default' \| 'success' \| 'warn' \| 'error' \| 'muted'` | `'default'` | Color variant |
| `blink` | `boolean` | `false` | Whether to apply CSS blink animation |

## Color mapping
| variant | color |
|---------|-------|
| `default` | `--bbs-primary` |
| `success` | `--bbs-success` |
| `warn` | `--bbs-warning` |
| `error` | `--bbs-error` |
| `muted` | `--bbs-muted` |

## Behavior
- Blink animation is a CSS `step-start` at 1060ms (double the 530ms cursor rate to appear distinct)
- `white-space: nowrap` — badge never wraps across lines
- Renders as inline `<span>`

## Usage
```svelte
<Badge label="STATUS: ONLINE" variant="success" blink />
<Badge label="OPEN TO OPPORTUNITIES" variant="success" blink />
<Badge label="UNAVAILABLE" variant="error" />
```

## Acceptance Criteria
- [ ] Label appears as `[ LABEL ]` with spaces inside brackets
- [ ] Correct color for each variant
- [ ] `blink=true` applies CSS animation; `blink=false` renders static
- [ ] Does not wrap onto a second line
