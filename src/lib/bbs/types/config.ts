// ─────────────────────────────────────────────────────────────────────────────
// BBS Framework — Master Config Type System
// All framework consumers import from here.
// ─────────────────────────────────────────────────────────────────────────────

export type { BBSConfig, SystemConfig, ThemeConfig, ColorPalette, FontConfig };
export type { SplashConfig, BootMessage };
export type { NavigationConfig };
export type { ScreenRegistry, ScreenDefinition };
export type { EffectsConfig, CRTConfig, TypewriterConfig, CursorConfig, GlitchConfig };
export type { StatusBarConfig, StatusField };
export type { BorderStyle };

// ── TOP LEVEL ────────────────────────────────────────────────────────────────

/** Root configuration object. Pass to `initConfig()` in +layout.ts. */
interface BBSConfig {
	system:     SystemConfig;
	/** Night baseline (typically light-on-dark UI). Published as canonical `theme` for box-style defaults. */
	theme:      ThemeConfig;
	/**
	 * Day palette — dark-on-light. When omitted, day/night toggle is disabled (`toggleThemeMode` no-op).
	 * Should match `theme` fonts, borders id, different `colors` only.
	 */
	themeDay?: ThemeConfig;
	splash:     SplashConfig;
	navigation: NavigationConfig;
	screens:    ScreenRegistry;
	effects:    EffectsConfig;
	statusBar:  StatusBarConfig;
}

// ── SYSTEM ───────────────────────────────────────────────────────────────────

/** Cosmetic system identity shown in the status bar and splash screen. */
interface SystemConfig {
	/** Display name, e.g. "ARIA4C bbs v1.0" */
	name:           string;
	/** Semantic version string, e.g. "1.0.0" */
	version:        string;
	/** Cosmetic hostname shown in status bar, e.g. "bbs.example.dev" */
	hostname:       string;
	/** Message shown below menu on the main menu screen */
	welcomeMessage: string;
	/** Cosmetic node identifier, e.g. "NODE 01" */
	nodeId:         string;
	/** Cosmetic baud rate — drives typewriter characters-per-second when effects.typewriter.baseSpeed is 0 */
	baudRate:       number;
}

// ── THEME ────────────────────────────────────────────────────────────────────

/** Visual theme for the BBS terminal. */
interface ThemeConfig {
	/** Unique theme identifier, e.g. "white-on-black", "amber", "green" */
	id:      string;
	/** Full color palette */
	colors:  ColorPalette;
	/** Font settings */
	font:    FontConfig;
	/** Box-drawing character set used for borders */
	borders: BorderStyle;
}

/** Box-drawing character style for all borders. */
type BorderStyle = 'double' | 'single' | 'heavy' | 'mixed';
// double → ╔╗╚╝║═╠╣╦╩╬
// single → ┌┐└┘│─├┤┬┴┼
// heavy  → ┏┓┗┛┃━┣┫┳┻╋
// mixed  → double outer + single inner dividers

/** All CSS color values used by the framework. Mapped to --bbs-* CSS custom properties. */
interface ColorPalette {
	/** Page background, e.g. "#000000" */
	background:    string;
	/** Default text color, e.g. "#ffffff" */
	foreground:    string;
	/** Primary accent: box borders, active menu highlights */
	primary:       string;
	/** Secondary accent: dates, metadata, subdued labels */
	secondary:     string;
	/** Muted: hints, separators, disabled text */
	muted:         string;
	/** Background color for the selected/highlighted menu row */
	highlight:     string;
	/** Text color on the highlighted menu row */
	highlightText: string;
	/** Blinking cursor color */
	cursor:        string;
	/** Error state color */
	error:         string;
	/** Success state color */
	success:       string;
	/** Warning state color */
	warning:       string;
	/** CRT scanline overlay tint, e.g. "rgba(0,0,0,0.12)" */
	scanlineColor: string;
}

/** Monospace font configuration. */
interface FontConfig {
	/** Full CSS font-family stack, e.g. "'JetBrains Mono', 'Courier New', monospace" */
	family:     string;
	/** Base font size, e.g. "14px" */
	sizeBase:   string;
	/** Large variant, e.g. "16px" */
	sizeLg:     string;
	/** Small variant, e.g. "12px" */
	sizeSm:     string;
	/** Line height multiplier, e.g. 1.5 */
	lineHeight: number;
}

// ── SPLASH ───────────────────────────────────────────────────────────────────

/** Splash / boot screen configuration. */
interface SplashConfig {
	/** Whether to show the splash screen at all */
	enabled:              boolean;
	/** Multi-line ASCII art string rendered at the top */
	asciiArt:             string;
	/** Tagline shown below the ASCII art */
	tagline:              string;
	/** Sequential boot messages shown one by one */
	bootMessages:         BootMessage[];
	/** Whether to run the boot message sequence */
	showBootSequence:     boolean;
	/** Total duration of the boot sequence in ms (messages are spread evenly if delay is 0) */
	bootSequenceDuration: number;
	/** Whether to show the "PRESS ANY KEY" prompt after boot completes */
	pressAnyKey:          boolean;
	/** Custom text for the press-any-key prompt */
	pressAnyKeyText:      string;
	/** Auto-advance to main menu after this many ms. null = wait for user input. */
	autoAdvanceMs:        number | null;
}

/** A single line in the boot sequence. Renders as: [  OK  ] text */
interface BootMessage {
	/** The message text */
	text:  string;
	/** Delay in ms after the previous message before this one appears */
	delay: number;
	/** Badge type shown as a prefix: [  OK  ] [ WARN ] [ ERR  ] [ INFO ] */
	type:  'info' | 'ok' | 'warn' | 'error';
}

// ── NAVIGATION ───────────────────────────────────────────────────────────────

/** Navigation behaviour and key bindings. */
interface NavigationConfig {
	/** Whether keyboard hotkeys are active */
	enableKeyboard:     boolean;
	/** Whether mouse click on menu items is active */
	enableClick:        boolean;
	/** Key to navigate to home screen from anywhere, e.g. "H" */
	homeKey:            string;
	/** Key to go back one level, e.g. "B" */
	backKey:            string;
	/**
	 * Key to cycle night ↔ day palettes (`theme` ↔ `themeDay`). Requires `themeDay`; null disables.
	 * Typical: `"T"`. Dispatched globally at keyboard priority **1**.
	 */
	themeToggleKey:     string | null;
	/** Key to trigger quit / disconnect. null = disabled. */
	quitKey:            string | null;
	/** How menu items are labelled with their shortcut key */
	menuStyle:          'numbered' | 'lettered' | 'both';
	/** Whether screen transitions are animated */
	animateTransitions: boolean;
	/** The transition animation style */
	transitionEffect:   'wipe' | 'fade' | 'instant' | 'scanline-wipe';
	/** Optional URL sync — lets users share direct links to screens */
	urlSync: {
		/** Whether to sync current screen to the URL */
		enabled:  boolean;
		/** Strategy: hash (#about) or query (?screen=about) */
		strategy: 'hash' | 'query';
	};
}

// ── SCREENS ──────────────────────────────────────────────────────────────────

/** Registry of all screens in the application. */
interface ScreenRegistry {
	/** ID of the screen to show after splash (typically the main menu) */
	home:    string;
	/** Flat list of all screen definitions */
	screens: ScreenDefinition[];
}

/** Definition of a single navigable screen. */
interface ScreenDefinition {
	/** Unique identifier used in navigate() calls, e.g. "about" */
	id:          string;
	/** Text shown in the BBSFrame border title, e.g. "ABOUT ME" */
	title:       string;
	/** Text shown in the parent menu list, e.g. "About Me" */
	menuLabel:   string;
	/** Single-character keyboard shortcut, e.g. "1" or "A" */
	menuKey:     string;
	/** Optional glyph prefix in the menu row, e.g. "»" */
	menuIcon?:   string;
	/** The Svelte component name to render (resolved dynamically in +page.svelte) */
	component:   string;
	/** Parent screen ID — used to build the breadcrumb trail */
	parent?:     string;
	/** Child screen IDs — if set, this screen renders a sub-menu */
	children?:   string[];
	/** Whether this screen appears in its parent's menu */
	showInMenu:  boolean;
	/**
	 * When true, the row stays visible but is non-interactive: muted styling, no hover highlight,
	 * no click, hotkey not registered, arrow / Enter navigation skips it.
	 */
	menuInactive?: boolean;
	/** Arbitrary screen-specific config passed as props to the component */
	metadata?:   Record<string, unknown>;
	/** SEO metadata — overrides the layout-level defaults when this screen is active */
	seo?: {
		/** Browser tab title + <title> tag, e.g. "About Me | Illya Arefiev" */
		title:       string;
		/** <meta name="description"> content */
		description: string;
	};
}

// ── EFFECTS ──────────────────────────────────────────────────────────────────

/** All visual effect configurations. */
interface EffectsConfig {
	/** CRT monitor simulation */
	crt:           CRTConfig;
	/** Typewriter text reveal */
	typewriter:    TypewriterConfig;
	/** Blinking cursor */
	cursor:        CursorConfig;
	/** Random character glitch effect */
	glitch:        GlitchConfig;
	/** Power-on screen flicker on initial load */
	screenFlicker: boolean;
}

/** CRT monitor visual effect (scanlines, vignette, phosphor glow). */
interface CRTConfig {
	/** Whether the CRT overlay is active */
	enabled:           boolean;
	/** Scanline opacity, 0–1 */
	scanlineOpacity:   number;
	/** Pixels between scanlines */
	scanlineSpacing:   number;
	/** Whether to render a radial vignette around the screen edges */
	vignetteEnabled:   boolean;
	/** Vignette intensity, 0–1 */
	vignetteIntensity: number;
	/** Whether to apply a text-shadow phosphor glow */
	phosphorGlow:      boolean;
	/** Whether to apply slight border-radius to simulate screen curvature */
	curvatureEnabled:  boolean;
}

/** Typewriter character-reveal effect configuration. */
interface TypewriterConfig {
	/** Whether typewriter effects are active globally */
	enabled:            boolean;
	/** Characters per second. 0 = derive from system.baudRate */
	baseSpeed:          number;
	/** ±random delay per character in ms for realism */
	varianceMs:         number;
	/** Whether to pause longer after punctuation characters */
	pauseOnPunctuation: boolean;
	/** Extra pause duration in ms after punctuation */
	punctuationPauseMs: number;
	/** Whether clicking anywhere skips/completes the current typewriter animation */
	skipOnClick:        boolean;
	/** Whether pressing any key skips/completes the current typewriter animation */
	skipOnKeypress:     boolean;
}

/** Blinking cursor appearance. */
interface CursorConfig {
	/** Cursor character: "█" | "▌" | "_" | "|" */
	char:          string;
	/** Blink interval in ms. Default 530. */
	blinkRateMs:   number;
	/** Whether cursor is shown in menu screens */
	showInMenus:   boolean;
	/** Whether cursor is shown in content screens */
	showInContent: boolean;
}

/** Random character glitch effect. */
interface GlitchConfig {
	/** Whether glitch is active */
	enabled:    boolean;
	/** How many times per minute a glitch event fires */
	frequency:  number;
	/** Proportion of characters affected per event, 0–1 */
	intensity:  number;
	/** Duration of each glitch event in ms */
	durationMs: number;
}

// ── STATUS BAR ───────────────────────────────────────────────────────────────

/** Persistent status bar configuration. */
interface StatusBarConfig {
	/** Where to place the status bar */
	position:            'top' | 'bottom' | 'both';
	/** Whether to show a live clock */
	showClock:           boolean;
	/** Clock format */
	clockFormat:         '12h' | '24h';
	/** Whether to show the node ID */
	showNodeId:          boolean;
	/** Whether to show the cosmetic baud rate / connection string */
	showConnectionSpeed: boolean;
	/** Whether to show the current breadcrumb path */
	showBreadcrumb:      boolean;
	/** Additional custom fields to render in the status bar */
	customFields:        StatusField[];
}

/** A custom field for the status bar. */
interface StatusField {
	/** Unique identifier */
	id:    string;
	/** Display label */
	label: string;
	/** Static string or a function that returns the current value */
	value: string | (() => string);
}
