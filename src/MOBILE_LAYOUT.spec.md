# Mobile layout conventions (viewport ≤720px)

## Breakpoint

- **`max-width: 720px`** is the canonical **narrow / touch-primary** breakpoint. Anything using it must stay aligned (`MobileTouchNav`, `BBSFrame` hint suppression + title bar compaction, global footer hiding in `app.css`, `AboutScreen` pager branch, etc.).

## Navigation affordances (avoid duplication)

- **`MobileTouchNav`** (`+layout.svelte`): the **only visible** Back / Home / theme controls on narrow widths. Uses the same store calls as keyboard priority **1**.
- **`BackPrompt`** still **mounts** in `BBSFrame` footers so physical keyboards fire `B`/`H`; its **buttons are hidden** via `app.css` (targeting **`.bbs-frame-footer`**) so they are **not** shown next to `MobileTouchNav`.
- **`BBSFrame`** **suppresses top-border global hints** (`[H] HOME`, `[T] DAY|NIGHT`, `[Q] QUIT`) on narrow widths — otherwise users see the same gestures twice (hint ribbon vs touch strip).

## Chrome density

- **StatusBar** (`status-bar-sysname`): `system.name` (e.g. product string including **ARIA4C**) scales down and **ellipsizes** inside a capped inline width so the bar stays one line beside PATH / clock.
- **BBSFrame** top border (`.bbs-frame-titlebar`): body text steps down one notch so long `title=` strings (menus use `bbsConfig.system.name`) do not dominate the header.

## Route-specific behaviour

- **About**: separate **pager** (`AboutScreen.spec.md`), not governed by `MobileTouchNav` duplication rules beyond shared breakpoint.

## Files

| Concern | Location |
|---------|----------|
| Touch strip | `routes/+layout.svelte`, `lib/bbs/.../MobileTouchNav.svelte` |
| Footer hide + title/status density | `app.css` |
| Hint suppression | `lib/bbs/.../BBSFrame.svelte` |
| Footer wrapper hook | `.bbs-frame-footer` in `BBSFrame.svelte` |

### Acceptance checklist

- [ ] ≤720px: one visible Back/Home/theme cluster (`MobileTouchNav`); frame footer buttons hidden; frame top-right **[H]/[T]/[Q] hints absent** when `showGlobalNavHints` would otherwise show them.
- [ ] ≤720px: status bar shows truncated long `system.name` without blowing out layout.
- [ ] ≥721px: desktop chrome unchanged (hints + footers visible; status/title sizing default).
