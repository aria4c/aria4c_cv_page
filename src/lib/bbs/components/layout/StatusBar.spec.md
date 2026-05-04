# StatusBar

## Purpose
Persistent one-line bar at the top or bottom of the screen. Shows system name, node ID, current breadcrumb path (or a status message), connection speed, live clock, and any custom fields defined in config.

## Props
| prop | type | required | description |
|------|------|----------|-------------|
| `statusBarConfig` | `StatusBarConfig` | yes | Controls which fields are visible |
| `system` | `SystemConfig` | yes | Provides system name, nodeId, baudRate for display |

## Layout
- Left section: system name + nodeId + breadcrumb (or status message) + custom fields
- Right section: connection speed string + clock

## Behavior
- Clock value comes from `terminalStore.clock` (updated by `startClock()` in BBSRoot)
- While the clock is frozen (`setClockFrozen(true)` from Matrix mode), the displayed clock string does not advance until a full page reload
- Breadcrumb comes from `navigationStore.breadcrumb` — shown as `PATH: A > B > C`
- When `terminalStore.statusMessage` is set, it replaces the breadcrumb in the left section
- Status message color reflects `terminalStore.statusType`: error=red, success=green, warn=yellow, default=secondary
- Connection string format: `{baudRate} BAUD  8N1` — hidden if `baudRate` is 0
- `customFields` are rendered after the node info: `{field.label}: {field.value}`
- `field.value` can be a static string or a `() => string` function (called on each render)

## Acceptance Criteria
- [ ] System name and node ID appear in left section when `showNodeId` is true
- [ ] Breadcrumb shows current path when no status message is active
- [ ] Status message replaces breadcrumb and uses the correct color for its type
- [ ] Clock appears in right section when `showClock` is true (and stalls when `setClockFrozen(true)` is active)
- [ ] Connection speed string hidden when `showConnectionSpeed` is false
- [ ] Custom fields render in order with correct label/value
