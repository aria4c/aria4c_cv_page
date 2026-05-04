# navigation.store

## Purpose
Manage the current screen, navigation history stack, and breadcrumb trail. The single source of truth for all screen transitions.

## API
```typescript
function navigate(screenId: string): void
function goBack(): void
function goHome(): void
const navigationStore: Readable<NavigationState>
const currentScreen: Readable<ScreenDefinition | undefined>
const matrixNavigationRainStore: Readable<boolean>
```

## Behavior
- `navigate(id)` pushes current screen to history and sets `currentScreenId` to `id` (non-matrix timing: after a brief `transition`; see below).
- `goBack()` pops history stack; if empty, navigates to home
- `goHome()` navigates to `config.screens.home` and clears history
- `breadcrumb` is an array of screen titles built from the parent chain
- `transitioning` is set to `true` briefly during navigation for animation hooks
- Depends on `config.store` being initialised first
- **`matrixNavigationRainStore`**: `true` while a Matrix-lock navigation stall is showing the rain layer; **`navigate` / `goBack` / `goHome`** when **`theme.store` `matrixLocked`** delay updating `currentScreenId`/`history` until after **~1100ms** (`MATRIX_NAV_RAIN_MS`), turning rain on immediately so the prior screen stays visible under the overlay first, then swapping to the target screen when rain ends — rapid overlapping navigations cancel the pending timer and use the latest target.

## Acceptance Criteria
- [ ] `navigate('about')` sets `currentScreenId` to `'about'`
- [ ] `goBack()` from 'about' returns to previous screen
- [ ] `goHome()` clears history and returns to home screen
- [ ] `breadcrumb` correctly reflects parent chain (e.g. ["MAIN", "EXPERIENCE"])
- [ ] `transitioning` flips true then false on each navigation
- [ ] With Matrix lock on, `currentScreenId` does not change until after the rain interval; `matrixNavigationRainStore` is true for that interval
