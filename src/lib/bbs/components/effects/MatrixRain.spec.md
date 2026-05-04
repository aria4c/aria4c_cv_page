# MatrixRain

## Purpose
Full-viewport effect for **Matrix mode** (easter egg): falling glyph columns driven by `--bbs-*` variables. Default mount uses `pointer-events: none`; `loadOverlay` raises stacking and briefly blocks hits so transitions read as load screens.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `loadOverlay` | `boolean` | `false` | When `true`, raises `z-index` above main/status (still below CRT), stronger opacity, and `pointer-events: auto` for ~1100ms transition load screens |

## Behavior
- Fixed `inset: 0`, `z-index: 1` by default (content/status use `z-index: 2`); with `loadOverlay`, `z-index: 5`, stronger opacity, and `pointer-events: auto` so the layer blocks interaction until it unmounts; default mode keeps `pointer-events: none`.
- Renders `aria-hidden="true"` decorative columns; each column repeats a doubled glyph sequence and uses a linear `translateY` keyframe loop for continuous fall.
- App shell (`+layout.svelte`) mounts this when **`matrixNavigationRainStore`** is true (**navigation.store**, Matrix lock only): rain runs **before** `currentScreenId` updates (~1100ms), not after.

## Acceptance Criteria
- [ ] During Matrix lock, rain mounts as soon as navigation is requested and `currentScreenId` still reflects the outgoing screen until the interval ends — not shown continuously after the handoff.
- [ ] Uses `--bbs-*` variables only (no hardcoded theme colours in component styles).
- [ ] Decorative glyphs only (`aria-hidden`): default mode does not intercept pointer events; overlay mode briefly blocks clicks on covered chrome during transitions.
- [ ] Animation loops smoothly; `loadOverlay` variant sits above opaque chrome so the transition reads as a load layer.
