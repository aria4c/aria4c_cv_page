# CRTOverlay

## Purpose
Non-interactive fixed overlay that simulates a CRT monitor effect: horizontal scanlines and a radial vignette. Sits at `z-index: 9999` above all content. Renders nothing when `config.enabled` is false.

## Props
| prop | type | required | description |
|------|------|----------|-------------|
| `config` | `CRTConfig` | yes | CRT effect configuration |

## Behavior
- `config.enabled: false` → renders nothing (no DOM nodes)
- Scanlines: `repeating-linear-gradient` using `scanlineOpacity` and `scanlineSpacing`
- Vignette: `radial-gradient` using `vignetteIntensity`, only rendered when `vignetteEnabled` is true
- `config.curvatureEnabled: true` → applies `border-radius: 12px` to the overlay div
- `pointer-events: none` — never blocks interaction
- `aria-hidden="true"` — invisible to screen readers

## Usage
```svelte
<!-- In +layout.svelte, inside BBSRoot, before the main content -->
<CRTOverlay config={bbsConfig.effects.crt} />
```

## Acceptance Criteria
- [ ] No DOM rendered when `config.enabled` is false
- [ ] Scanline gradient uses correct opacity and spacing values
- [ ] Vignette div not rendered when `vignetteEnabled` is false
- [ ] `border-radius` applied only when `curvatureEnabled` is true
- [ ] Overlay never intercepts pointer events
