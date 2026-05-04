# terminal.store

## Purpose
Status line text, live clock string, and transient status toasts for the `StatusBar`.

## Behavior
- `startClock` runs a 1s interval that writes `clock` via `formatClock` until cleanup.
- **`setClockFrozen(true)`** skips further interval ticks so the clock string **stalls** until refresh (used by Matrix easter egg). `setClockFrozen(false)` is available for symmetry; normal app flow does not unfreeze.

## Acceptance Criteria
- [ ] `setStatus` / `clearStatus` behave as before.
- [ ] While frozen, `terminalStore.clock` is not overwritten by the ticking interval.
