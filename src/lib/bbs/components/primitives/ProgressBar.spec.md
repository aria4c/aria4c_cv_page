# ProgressBar

## Purpose
Unicode block bar rendering with optional label on the **same line**. Three modes:

- **`percent`**: classic left-fill 0–100%.
- **`years`**: left-fill proportional to `value / scaleMax` with `y` suffix (legacy competency-style).
- **`timeline`**: the bar span represents **overall career duration** `[0 … timelineCareerYears]`; shaded cells depict only the **overlap window** `[timelineFrom … timelineTo]` anywhere along that axis — stacks that showed up lately render as a trailing segment.

Animate ease-out cubic (800ms) unless `animated=false`.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `value` | `number` | `0` | `percent`/`years` target |
| `width` | `number` | `20` | Bar width in monospace cells |
| `fillChar` / `emptyChar` | `string` | `█` / `░` | Active / idle glyphs |
| `showValue` | `boolean` | `true` | Trailing `%`, `y`, or timeline prose |
| `showPercent` | `boolean \| undefined` | `undefined` | Deprecated alias overriding `showValue` |
| `label` | `string` | `''` | Left prefix |
| `labelWidth` | `number` | `14` | Pad / truncate semantics (see Behavior) |
| `truncateLabel` | `boolean` | `false` | Truncate versus pad-only behaviour |
| `animated` | `boolean` | `true` | Animate fills |
| `animDelay` | `number` | `0` | Delay before RAF loop |
| `displayMode` | `'percent' \| 'years' \| 'timeline'` | `'percent'` | Mode discriminator |
| `scaleMax` | `number` | `100` | Denominator when `years` |
| `timelineCareerYears` | `number` | `1` | Full timeline length for `timeline` |
| `timelineFrom` | `number` | `0` | Active window lower bound |
| `timelineTo` | `number` | `0` | Active window upper bound (use career length for “until now”) |
| `labelAlignCols` | `number` | `0` | When `>0` and `label` is set, render a **fixed-width** label column in `ch` (CSS grid) so the bar column starts at the same horizontal offset for every row; short labels are padded, long labels are trimmed to `labelAlignCols`. When `0`, use the legacy single-line `labelWidth` pad/trim behaviour. |
| `splitLabelBar` | `boolean` | `false` | Two rows: wrapped **full label**, then monospace bar + suffix (no ellipsis). Pair with **`splitBarTrailing`** to anchor the bar line to the right (`SkillsScreen` mobile pager). |
| `splitBarTrailing` | `boolean` | `false` | With **`splitLabelBar`**, **`align-self: flex-end`** on the bar row. |

## Behavior
### `timeline`
Career axis maps left→right `[0,career]`; each monospace cell is one slice of time. Shading appears on any slice intersecting `(timelineFrom,timelineTo]` (half-open overlap vs cell interval). Animation eases a growth parameter so the shaded band widens from `timelineFrom` toward `timelineTo`.

### `truncateLabel=false`
Full label text preserved; short labels padded up to `labelWidth` before gaps (only when `labelAlignCols` is `0`).

### `labelAlignCols` (aligned layout)
Parent should set **`labelAlignCols ≥` longest expected label length** (in monospace character cells) plus any desired padding — otherwise trailing characters are clipped. Rows that share the same grid share a common bar origin.

## Acceptance Criteria
- [ ] `timeline` permits leading empty region (recent-only tools) and trailing gaps (skills dropped before “now”).
- [ ] `timeline` suffix shows overlap length only (no `yr …→now` prose). The number is **left-padded to fixed width** before `y` (monospace) so `8y` and `11y` keep the bar + tail from shifting.
- [ ] `%`/`years` behaviour unchanged aside from typings.
