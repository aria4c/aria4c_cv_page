# LocationMap

## Purpose
Small SVG map styled like a **1980s monochrome white raster / vector terminal** (white-on-black): chunky upscale, scanlines, diagonal hatch fill, grid, and crosshair — not a smooth “web map”. Uses BBS CSS custom properties only.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `latitude` | `number` | (required) | Latitude in WGS84 degrees |
| `longitude` | `number` | (required) | Longitude in WGS84 degrees |
| `highlightCountryName` | `string` | (required) | Country name matching `properties.name` in `world-atlas/countries-110m` (Natural Earth) |
| `label` | `string` | `'Location map'` | Accessible name for the SVG (`aria-label`) |

## Behavior
- Loads country outlines from `world-atlas` TopoJSON (110m), projects with `d3-geo` using `geoNaturalEarth1`, and fits the projection to the highlighted country geometry (falls back to the full land set if the name is not found)
- Renders every country as a stroked path in dim white; the highlighted country uses a **hatch pattern** plus bright `--bbs-primary` stroke
- **Retro display styling:** `shape-rendering="crispEdges"`, `crisp-edges` / `pixelated` scaling, miter/square caps, chunky blocky coastline sampling
- **Old-hardware shell:** Map is wrapped in a bordered “CRT window” with subtle inset glow; **horizontal scanlines** and a **vignette** overlay sit on top (pure CSS, non-interactive); palette is **monochrome white** (emphasis on `--bbs-primary` / `--bbs-fg`, not green)
- **Low-res upscale:** SVG is authored at **128×96** css pixels but `viewBox` stays 240×180 so the browser **nearest-neighbor**-scales geometry when stretched to the slot — visibly **blocky** like an early framebuffer
- **Coordinate grid:** Faint repeating grid pattern over the panel (pattern fill)
- **Highlighted country:** Diagonal **hatch pattern** fill plus brighter white stroke and light drop-shadow (via `--bbs-primary` mixes)
- **Marker:** Orthogonal **crosshair** arms + square core, with light bloom blur filter on the group; uses `--bbs-primary`
- The SVG uses a fixed `viewBox`, intrinsic bitmap-like width/height for upscale, and `width: 100%` inside the shell

## Usage
```svelte
<LocationMap
	latitude={51.51}
	longitude={7.47}
	highlightCountryName="Germany"
	label="Map of Germany and location"
/>
```

## Acceptance Criteria
- [ ] Country borders read as dim white wireframe on black; highlighted country has hatch fill and brighter white outline
- [ ] The country whose `name` matches `highlightCountryName` is visibly filled (highlight) compared to other countries
- [ ] A crosshair + square marker appears at the given lat/lng and uses `--bbs-primary`
- [ ] Projection zooms to frame the highlighted country when the name matches data; otherwise shows world-scale fit
- [ ] No hardcoded hex colors; only `var(--bbs-…)` (and transparent / `color-mix` with theme vars as needed)
- [ ] Map uses crisp/pixelated rendering (not soft antialiased coastline look); highlight fill and marker read as flat “CRT vector” graphics
- [ ] Panel reads as monochrome CRT hardware: visible scanline overlay, non-modern border/glow, hatch fill on highlighted country, crosshair marker, optional grid
