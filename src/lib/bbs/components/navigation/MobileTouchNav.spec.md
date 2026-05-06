# MobileTouchNav

## Purpose
Narrow-viewport-only touch strip for **Back**, **Home**, and **theme day/night toggle** when there is no hardware keyboard. Mirrors the same store actions and config keys as global keyboard nav (`goBack`, `goHome`, `toggleThemeMode`). Rendered from the app layout below the main screen area, above the status bar. Desktop (`min-width: 721px`) hides the strip entirely.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| — | — | — | No props; reads `configStore`, `themeModeStore`, `matrixLockedStore`. |

## Behaviour
- Shown only inside a `@media (max-width: 720px)` block (component-scoped); layout-level **`app.css`** hides **`.bbs-frame-footer`** on the same breakpoint (`src/MOBILE_LAYOUT.spec.md`) so `BackPrompt` controls are not shown twice.
- Back / Home buttons call `goBack()` and `goHome()`; labels and bracket keys come from `config.navigation.backKey` / `homeKey`.
- Theme control is rendered only when `config.themeDay` is set **and** `config.navigation.themeToggleKey` is non-null; otherwise omitted (same precondition as keyboard theme toggle).
- When `matrixLocked` is true: theme control is `disabled`, uses dim `KeyHint`, label `LOCK`.
- Uses `KeyHint` inside `<button type="button">` with minimum touch dimensions; colours are theme CSS variables only.
- `aria-label="Touch navigation"` on the strip root.
- Respects `safe-area-inset-bottom` for notched devices.

## Acceptance Criteria
- [ ] At ≤720px viewport width the strip is visible and tappable; at ≥721px it is not visible and takes no layout space.
- [ ] Back and Home invoke the same navigation as keyboard priority-1 handlers.
- [ ] Theme tap calls `toggleThemeMode()` when allowed; does nothing when matrix-locked or when `themeDay` / `themeToggleKey` absent.
- [ ] With matrix lock, theme control is visibly disabled and non-interactive.
- [ ] Pairs with suppressed `BBSFrame` top hints on ≤720px (`MOBILE_LAYOUT.spec.md`) — user does not see redundant `[H]` text above and `MobileTouchNav` below.
