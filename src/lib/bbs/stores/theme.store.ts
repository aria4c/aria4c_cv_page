import { writable, derived, get, type Readable } from 'svelte/store';
import type { ThemeConfig, ColorPalette } from '../types/config.js';
import { getConfig } from './config.store.js';
import { setClockFrozen } from './terminal.store.js';

export type ThemeMode = 'night' | 'day';

const STORAGE_KEY = 'bbs-appearance';

const THEME_TOGGLE_WINDOW_MS = 3200;
const THEME_TOGGLES_FOR_MATRIX = 8;

let recentThemeToggles: number[] = [];

const MATRIX_PALETTE: ColorPalette = {
	background:    '#000000',
	foreground:    '#33ff66',
	primary:       '#00ff41',
	secondary:     '#00aa33',
	muted:         '#003d14',
	highlight:     '#00ff41',
	highlightText: '#000602',
	cursor:        '#00ff41',
	error:         '#ff3344',
	success:       '#00ff66',
	warning:       '#66ff00',
	scanlineColor: 'rgba(0, 255, 80, 0.035)'
};

interface ThemeState {
	active:        ThemeConfig | null;
	cssVars:       Record<string, string>;
	mode:          ThemeMode;
	matrixLocked:  boolean;
}

const themeWritable = writable<ThemeState>({
	active:       null,
	cssVars:      {},
	mode:         'night',
	matrixLocked: false
});

export const themeStore: Readable<ThemeState> = { subscribe: themeWritable.subscribe };
export const themeModeStore = derived(themeStore, ($t) => $t.mode);
export const matrixLockedStore = derived(themeStore, ($t) => $t.matrixLocked);

function paletteToVars(colors: ColorPalette): Record<string, string> {
	return {
		'--bbs-bg':             colors.background,
		'--bbs-fg':             colors.foreground,
		'--bbs-primary':        colors.primary,
		'--bbs-secondary':      colors.secondary,
		'--bbs-muted':          colors.muted,
		'--bbs-highlight':      colors.highlight,
		'--bbs-highlight-text': colors.highlightText,
		'--bbs-cursor':         colors.cursor,
		'--bbs-error':          colors.error,
		'--bbs-success':        colors.success,
		'--bbs-warning':        colors.warning,
		'--bbs-scanline-color': colors.scanlineColor
	};
}

function fontToVars(font: ThemeConfig['font']): Record<string, string> {
	return {
		'--bbs-font':         font.family,
		'--bbs-font-size':    font.sizeBase,
		'--bbs-font-size-lg': font.sizeLg,
		'--bbs-font-size-sm': font.sizeSm,
		'--bbs-line-height':  String(font.lineHeight)
	};
}

function setHtmlThemeClass(mode: ThemeMode): void {
	if (typeof document === 'undefined') return;
	const el = document.documentElement;
	el.classList.remove('bbs-theme-day', 'bbs-theme-night');
	el.classList.add(mode === 'day' ? 'bbs-theme-day' : 'bbs-theme-night');
}

function triggerMatrixMode(cfg: ReturnType<typeof getConfig>): void {
	setClockFrozen(true);
	const matrixTheme: ThemeConfig = {
		id:      'matrix-feed',
		colors:  MATRIX_PALETTE,
		font:    cfg.theme.font,
		borders: cfg.theme.borders
	};
	applyTheme(matrixTheme, 'night');
	themeWritable.update((s) => ({ ...s, matrixLocked: true }));
	if (typeof document !== 'undefined') {
		document.documentElement.classList.add('bbs-matrix-mode');
	}
}

export function applyTheme(theme: ThemeConfig, mode: ThemeMode = 'night'): void {
	const prev = get(themeWritable);
	const matrixLocked = prev.matrixLocked;

	const cssVars = { ...paletteToVars(theme.colors), ...fontToVars(theme.font) };

	if (typeof document !== 'undefined') {
		const root = document.documentElement;
		for (const [key, value] of Object.entries(cssVars)) {
			root.style.setProperty(key, value);
		}
		setHtmlThemeClass(mode);
	}

	themeWritable.set({ active: theme, cssVars, mode, matrixLocked });
}

export function initThemeFromStored(): void {
	const cfg = getConfig();
	let mode: ThemeMode = 'night';
	if (cfg.themeDay && typeof localStorage !== 'undefined') {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === 'day' || raw === 'night') mode = raw;
	}
	const palette = cfg.themeDay && mode === 'day' ? cfg.themeDay : cfg.theme;
	applyTheme(palette, mode);
}

export function toggleThemeMode(): void {
	const cfg = getConfig();
	const st = get(themeWritable);
	if (!cfg.themeDay || st.matrixLocked) return;

	const now = Date.now();
	recentThemeToggles = recentThemeToggles.filter((t) => now - t <= THEME_TOGGLE_WINDOW_MS);
	recentThemeToggles.push(now);
	if (recentThemeToggles.length >= THEME_TOGGLES_FOR_MATRIX) {
		recentThemeToggles = [];
		triggerMatrixMode(cfg);
		return;
	}

	const prev = st.mode;
	const mode: ThemeMode = prev === 'night' ? 'day' : 'night';
	try {
		localStorage.setItem(STORAGE_KEY, mode);
	} catch {
		/* ignore */
	}
	applyTheme(mode === 'day' ? cfg.themeDay : cfg.theme, mode);
}

export const cssVarsString: Readable<string> = derived(themeStore, ($theme) =>
	Object.entries($theme.cssVars)
		.map(([k, v]) => `${k}: ${v}`)
		.join('; ')
);
