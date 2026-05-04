# BootSequence

## Purpose
Renders boot messages one by one with configurable delays, each prefixed with a colored status badge (`[  OK  ]`, `[ WARN ]`, `[ ERR  ]`, `[ INFO ]`). Dispatches `complete` after the last message appears. Exposes `skipAll()` to instantly show all messages.

## Props
| prop | type | required | description |
|------|------|----------|-------------|
| `messages` | `BootMessage[]` | yes | Ordered list of boot messages with `text`, `delay`, and `type` |

## Events
| event | payload | description |
|-------|---------|-------------|
| `complete` | `void` | Fired when all messages have been revealed |

## Exported methods
| method | description |
|--------|-------------|
| `skipAll()` | Clears all pending timers, shows all messages immediately, dispatches `complete` |

## Behavior
- Messages are revealed sequentially; each message's `delay` is relative to the previous one (cumulative)
- `delay: 0` on the first message means it appears immediately on mount
- Badge colors: `ok`=success, `warn`=warning, `error`=error, `info`=secondary
- All timers are cleared on component destroy

## Acceptance Criteria
- [ ] Messages appear one by one with correct delays
- [ ] `complete` fires after the last message
- [ ] `skipAll()` immediately shows all messages and fires `complete`
- [ ] Badge text and color match the message type
- [ ] All timers cleaned up on destroy
