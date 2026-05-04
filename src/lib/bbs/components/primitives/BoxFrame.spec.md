# BoxFrame

## Purpose
A self-contained box with box-drawing borders, an optional title in the top border, and an optional subtitle in the top-right. Used for subsections within a screen (as opposed to `BBSFrame` which wraps the whole screen). Supports `dimmed` opacity for de-emphasis.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `title` | `string` | `''` | Text in the top-left of the top border |
| `subtitle` | `string` | `''` | Text in the top-right of the top border |
| `style` | `BorderStyle \| undefined` | theme default | Border character set override |
| `titleAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Horizontal alignment of the title text |
| `dimmed` | `boolean` | `false` | Applies `opacity: 0.5` to the whole box |

## Slots
| slot | description |
|------|-------------|
| *(default)* | Content rendered inside the box, between the side borders |

## Behavior
- Border style falls back to `config.theme.borders` from `configStore`
- Horizontal fill uses a 300-char repeat string, clipped by CSS `overflow: hidden`
- `titleAlign: 'center'` or `'right'` inserts a fill span before the title to push it rightward
- `dimmed: true` → `opacity: 0.5` on the outer div
- Width is `100%` with `min-width: 0` to participate correctly in flex/grid parents

## Difference from BBSFrame
`BoxFrame` is a compact, content-sized box for sub-sections. `BBSFrame` is the full-screen wrapper with `height: 100%` and a named footer slot.

## Usage
```svelte
<BoxFrame title="EXPERIENCE" style="single">
  <p>Content here</p>
</BoxFrame>
```

## Acceptance Criteria
- [ ] Title appears in top border; subtitle in top-right
- [ ] `titleAlign='center'` centres the title in the top border
- [ ] `dimmed=true` reduces opacity to 0.5
- [ ] Border characters match the selected `style`
- [ ] Fill lines extend to full available width
