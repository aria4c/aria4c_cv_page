# AsciiArt

## Purpose
Renders a multi-line ASCII art string inside a `<pre>` tag with the correct monospace font and color. Optionally reveals lines one at a time for a typewriter-line effect.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `art` | `string` | `''` | Multi-line ASCII art string (newline-separated) |
| `color` | `string` | `'var(--bbs-primary)'` | CSS color value for the text |
| `animate` | `boolean` | `false` | Whether to reveal lines one by one |
| `lineDelay` | `number` | `40` | Milliseconds between each revealed line when `animate` is true |

## Behavior
- `animate: false` → all lines visible immediately on mount
- `animate: true` → lines revealed sequentially via `setInterval` at `lineDelay` ms per line; interval cleared after last line
- Uses `white-space: pre` to preserve spacing and alignment
- Line count derived by splitting `art` on `\n`
- Interval is cleaned up automatically when the component is destroyed (via `onMount` return)

## Usage
```svelte
<!-- Static -->
<AsciiArt art={AVATAR} color="var(--bbs-secondary)" />

<!-- Animated reveal -->
<AsciiArt art={config.asciiArt} color="var(--bbs-primary)" animate lineDelay={40} />
```

## Acceptance Criteria
- [ ] All lines visible immediately when `animate` is false
- [ ] Lines appear one at a time at `lineDelay` intervals when `animate` is true
- [ ] Final line count matches `art.split('\n').length`
- [ ] Interval stops after last line (no memory leak)
- [ ] `color` prop controls text color
