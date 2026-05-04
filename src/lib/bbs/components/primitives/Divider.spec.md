# Divider

## Purpose
A full-width horizontal rule using box-drawing fill characters. Two styles: `full` (plain fill line) and `connector` (with left/right connectors `╠═══╣` for use inside a `BBSFrame` or `BoxFrame`).

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `label` | `string` | `''` | Optional centred label embedded in the fill line |
| `style` | `'full' \| 'connector'` | `'full'` | Whether to add `╠`/`╣` connectors at the edges |
| `bStyle` | `BorderStyle \| undefined` | theme default | Border character set override |

## Behavior
- `style: 'full'` — plain fill: `══════════════`
- `style: 'connector'` — with connectors: `╠═══════════╣`
- With `label`: `══ LABEL ══` (fill on both sides)
- Without `label`: single fill span spanning full width
- Fill uses `overflow: hidden` CSS clip — no JS measurement
- Color is always `--bbs-primary`
- Inner characters (for single-border dividers inside double boxes) come from `getInnerChars()`

## Usage
```svelte
<Divider />                              <!-- plain line -->
<Divider label="SKILLS" />              <!-- labelled -->
<Divider style="connector" />           <!-- ╠═════╣ -->
```

## Acceptance Criteria
- [ ] `style='full'` renders a plain horizontal fill line
- [ ] `style='connector'` adds `╠` on left and `╣` on right
- [ ] `label` is centred between two fill segments
- [ ] Fill extends to available width
- [ ] Color is `--bbs-primary`
