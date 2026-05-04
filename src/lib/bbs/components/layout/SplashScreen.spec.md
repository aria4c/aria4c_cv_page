# SplashScreen

## Purpose
Boot/welcome screen shown on first load. Runs a multi-phase sequence: ASCII art reveal → boot messages → "press any key" prompt. Each phase can be skipped by user input. Dispatches `complete` when the user advances past the last phase.

## Props
| prop | type | required | description |
|------|------|----------|-------------|
| `config` | `SplashConfig` | yes | Full splash config from `bbs.config.ts` |

## Events
| event | payload | description |
|-------|---------|-------------|
| `complete` | `void` | Fired when the user advances past the press-any-key phase |

## Phases
1. **`art`** — ASCII art reveals line-by-line. Auto-advances after `(lineCount * 40 + 200)ms`.
2. **`boot`** — Boot messages appear sequentially per their `delay` fields. Fires `complete` after last message.
3. **`press-key`** — Shows press-any-key prompt. Auto-advances after `config.autoAdvanceMs` if set.
4. **`done`** — Dispatches `complete` event.

## Skip behavior
- Any keydown or click skips the current phase:
  - During `art`: jumps to `boot` (or `press-key` if `showBootSequence` is false)
  - During `boot`: calls `bootRef.skipAll()` to immediately show all messages
  - During `press-key`: advances to `done`

## Behavior
- `config.showBootSequence: false` skips from art directly to press-key
- `config.autoAdvanceMs: null` waits indefinitely for user input
- Phosphor glow text-shadow applied if `config.effects.crt.phosphorGlow` is true

## Acceptance Criteria
- [ ] ASCII art reveals line-by-line on mount
- [ ] Boot messages appear sequentially with correct delays
- [ ] Any keydown/click during boot phase calls `skipAll()` and jumps to press-key
- [ ] `complete` event fires when user presses a key or clicks during press-key phase
- [ ] `autoAdvanceMs` triggers automatic advance without user input
