# GlitchText

## Purpose
Inline text span that periodically replaces random characters with glitch symbols (`!@#$%^&*<>?/\|[]{}~\``), then restores the original text after a short duration. Controlled by `GlitchConfig` from the framework config.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `text` | `string` | `''` | The text to display and occasionally corrupt |
| `config` | `GlitchConfig \| undefined` | `undefined` | Glitch settings. If undefined, effect is disabled. |
| `enabled` | `boolean` | `true` | Local on/off switch. Both `config.enabled` AND `enabled` must be true to activate. |

## Behavior
- Glitch interval fires every `(60 / config.frequency) * 1000` ms
- On each event: randomly replaces `Math.round(text.length * config.intensity)` characters with glitch chars
- After `config.durationMs`, restores `displayed` back to original `text`
- When `text` prop changes, `displayed` resets to new `text` immediately
- No animation runs if `config` is undefined, `config.enabled` is false, or `enabled` is false
- All timers cleared on destroy

## Usage
```svelte
<!-- Glitch a header title occasionally -->
<GlitchText text="ARIA4C bbs" config={bbsConfig.effects.glitch} />
```

## Acceptance Criteria
- [ ] Characters are corrupted periodically at the configured frequency
- [ ] Original text is restored after `durationMs`
- [ ] `enabled=false` prevents any glitch activity
- [ ] `config.enabled=false` prevents any glitch activity
- [ ] Changing the `text` prop resets `displayed` to the new value
- [ ] Timers cleaned up on destroy
