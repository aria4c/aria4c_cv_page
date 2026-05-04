# config.store

## Purpose
Hold the validated BBSConfig as a readonly singleton. Set once at app init. Provides O(1) screen lookup by ID.

## API
```typescript
function initConfig(config: BBSConfig): void
function getScreen(id: string): ScreenDefinition | undefined
function getScreenChildren(id: string): ScreenDefinition[]
const configStore: Readable<ConfigState>
```

## Behavior
- `initConfig()` sets the store and builds a `Map<string, ScreenDefinition>` for O(1) lookup
- Calling `initConfig()` twice is a no-op (config is immutable once set)
- `getScreen(id)` returns the definition or `undefined` if not found
- `getScreenChildren(id)` returns all screens whose `parent` equals `id`

## Acceptance Criteria
- [ ] `initConfig()` populates the store
- [ ] `getScreen('about')` returns the correct definition
- [ ] `getScreenChildren('main')` returns all direct children
- [ ] Store is typed as `Readable` (cannot be written from outside)
