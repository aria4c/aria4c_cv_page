# BackPrompt

## Purpose
Footer bar showing keyboard hints for Back, Home, and optional extra actions. Registers keyboard shortcuts on mount and cleans them up on destroy. Used in the `footer` slot of `BBSFrame` on every content screen.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `showBack` | `boolean` | `true` | Whether to show and register the Back hint |
| `showHome` | `boolean` | `true` | Whether to show and register the Home hint |
| `showQuit` | `boolean` | `false` | Reserved — not yet implemented in rendering |
| `extraHints` | `Array<{ key: string; label: string; action: () => void }>` | `[]` | Additional hints to render and register |

## Behavior
- Back action calls `goBack()` from navigation store; key read from `config.navigation.backKey`
- Home action calls `goHome()` from navigation store; key read from `config.navigation.homeKey`
- Extra hints register their key at priority 1 and render a `KeyHint` button
- All keyboard registrations use priority 1 (lower than screen hotkeys at priority 2)
- If config is not yet initialised when the component mounts, keyboard bindings are silently skipped
- On viewports **≤720px**, global `app.css` hides the `BBSFrame` footer block (divider + footer area) so `BackPrompt` is not duplicated; **MobileTouchNav** in `+layout.svelte` exposes the same Back / Home actions for touch; keyboard bindings still register if a keyboard is present

## Usage
```svelte
<svelte:fragment slot="footer">
  <BackPrompt />
</svelte:fragment>

<!-- With extra actions -->
<svelte:fragment slot="footer">
  <BackPrompt extraHints={[{ key: 'E', label: 'Email', action: openEmail }]} />
</svelte:fragment>
```

## Acceptance Criteria
- [ ] Back key (from config) calls `goBack()`
- [ ] Home key (from config) calls `goHome()`
- [ ] Extra hints render and their keys are registered
- [ ] All bindings unregistered on destroy
- [ ] Clicking a rendered button triggers the corresponding action
- [ ] On wide viewports the footer remains visible when a footer slot exists; on ≤720px the footer is hidden by global CSS (see MobileTouchNav) while actions stay available via the touch strip
