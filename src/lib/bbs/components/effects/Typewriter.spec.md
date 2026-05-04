# Typewriter

## Purpose
Reveals text character-by-character at a speed derived from the global typewriter config and system baud rate. Shows a blinking cursor at the reveal point while animating. Dispatches `complete` when all characters are shown. Exposes `skip()` to jump to the end.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `text` | `string` | `''` | The full text to reveal |
| `startDelay` | `number` | `0` | Milliseconds to wait before starting the reveal |
| `showCursor` | `boolean` | `true` | Whether to show a `BlinkingCursor` at the current reveal point |

## Events
| event | payload | description |
|-------|---------|-------------|
| `complete` | `void` | Fired when all characters have been revealed |

## Exported methods
| method | description |
|--------|-------------|
| `skip()` | Completes the animation immediately; equivalent to user clicking when `skipOnClick` is enabled |

## Behavior
- Speed is derived from `config.effects.typewriter` + `config.system.baudRate` via `runTypewriter()` utility
- When `config.effects.typewriter.enabled` is false: reveals all text synchronously and fires `complete` immediately
- Click on the component calls `skip()` if `config.effects.typewriter.skipOnClick` is true and animation is incomplete
- Cursor (`BlinkingCursor inline`) renders after the revealed portion while `complete` is false and `showCursor` is true
- `startDelay` is implemented via `setTimeout` — timer cleared on destroy

## Usage
```svelte
<Typewriter text={profile.bio} startDelay={600} />

<!-- Without cursor -->
<Typewriter text={title} showCursor={false} on:complete={onTitleDone} />
```

## Acceptance Criteria
- [ ] Text reveals character by character at the configured speed
- [ ] `complete` fires when the last character is revealed
- [ ] `skip()` immediately shows all text and fires `complete`
- [ ] Cursor not visible after `complete` is true
- [ ] `startDelay` delays the start of animation
- [ ] When typewriter effect is globally disabled, text appears instantly
