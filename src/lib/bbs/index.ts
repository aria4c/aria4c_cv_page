// ─────────────────────────────────────────────────────────────────────────────
// BBS Framework — Public API
// Import from '$lib/bbs' in your SvelteKit app.
// ─────────────────────────────────────────────────────────────────────────────

// Types
export type {
	BBSConfig, SystemConfig, ThemeConfig, ColorPalette, FontConfig,
	SplashConfig, BootMessage,
	NavigationConfig,
	ScreenRegistry, ScreenDefinition,
	EffectsConfig, CRTConfig, TypewriterConfig, CursorConfig, GlitchConfig,
	StatusBarConfig, StatusField,
	BorderStyle
} from './types/config.js';

// Config store
export { configStore, initConfig, getScreen, getScreenChildren, getConfig } from './stores/config.store.js';

// Navigation store
export {
	navigationStore,
	currentScreen,
	matrixNavigationRainStore,
	navigate,
	goBack,
	goHome,
	setInitialScreen
} from './stores/navigation.store.js';
export type { NavigationState } from './stores/navigation.store.js';

// Theme store
export type { ThemeMode } from './stores/theme.store.js';
export {
	themeStore,
	themeModeStore,
	matrixLockedStore,
	applyTheme,
	initThemeFromStored,
	toggleThemeMode,
	cssVarsString
} from './stores/theme.store.js';

// Terminal store
export {
	terminalStore,
	startClock,
	setStatus,
	clearStatus,
	setClockFrozen
} from './stores/terminal.store.js';

// Effects store
export {
	effectsStore, cursorBlink,
	startCursorBlink,
	enqueueTypewriter, updateTypewriterProgress, removeTypewriterJob, clearTypewriters,
	setScanlines
} from './stores/effects.store.js';
export type { TypewriterJob } from './stores/effects.store.js';

// Keyboard utility
export {
	attachKeyboardListener, register, unregister,
	disableKeyboard, enableKeyboard, clearAllBindings
} from './utils/keyboard.js';
