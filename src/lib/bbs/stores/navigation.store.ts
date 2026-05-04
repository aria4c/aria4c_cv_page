import { readable, derived, writable, get, type Readable } from 'svelte/store';
import { configStore, getScreen, getConfig } from './config.store.js';
import { themeStore } from './theme.store.js';
import type { ScreenDefinition } from '../types/config.js';

export interface NavigationState {
	currentScreenId:     string;
	history:             string[];
	breadcrumb:          string[];
	transitioning:       boolean;
	transitionDirection: 'forward' | 'backward';
}

const TRANSITION_DURATION = 120; // ms — matches CSS transition
const MATRIX_NAV_RAIN_MS  = 1100;

let _set: (value: NavigationState) => void;
let _state: NavigationState = {
	currentScreenId:     'splash',
	history:             [],
	breadcrumb:          ['SPLASH'],
	transitioning:       false,
	transitionDirection: 'forward'
};

const matrixNavRainWritable = writable(false);
export const matrixNavigationRainStore: Readable<boolean> = {
	subscribe: matrixNavRainWritable.subscribe
};

let matrixNavTimer: ReturnType<typeof setTimeout> | null = null;

export const navigationStore: Readable<NavigationState> = readable(_state, (set) => {
	_set = set;
});

/** Derived: the full ScreenDefinition for the current screen (or undefined). */
export const currentScreen: Readable<ScreenDefinition | undefined> = derived(
	[navigationStore, configStore],
	([$nav]) => getScreen($nav.currentScreenId)
);

function buildBreadcrumb(screenId: string): string[] {
	const crumbs: string[] = [];
	let id: string | undefined = screenId;
	while (id) {
		const screen = getScreen(id);
		if (!screen) break;
		crumbs.unshift(screen.title);
		id = screen.parent;
	}
	return crumbs;
}

function matrixNavActive(): boolean {
	return typeof window !== 'undefined' && get(themeStore).matrixLocked;
}

function clearMatrixNavTimer(): void {
	if (matrixNavTimer !== null) {
		clearTimeout(matrixNavTimer);
		matrixNavTimer = null;
	}
}

function startMatrixRainNavigation(
	direction: 'forward' | 'backward',
	commit: () => void
): void {
	clearMatrixNavTimer();
	_state = { ..._state, transitioning: true, transitionDirection: direction };
	_set(_state);
	matrixNavRainWritable.set(true);
	matrixNavTimer = setTimeout(() => {
		matrixNavTimer = null;
		matrixNavRainWritable.set(false);
		commit();
	}, MATRIX_NAV_RAIN_MS);
}

function transition(screenId: string, direction: 'forward' | 'backward'): void {
	_state = { ..._state, transitioning: true, transitionDirection: direction };
	_set(_state);

	setTimeout(() => {
		_state = {
			..._state,
			currentScreenId: screenId,
			breadcrumb:      buildBreadcrumb(screenId),
			transitioning:   false
		};
		_set(_state);
	}, TRANSITION_DURATION);
}

/** Navigate forward to a screen by ID. */
export function navigate(screenId: string): void {
	if (screenId === _state.currentScreenId) return;
	if (matrixNavActive()) {
		startMatrixRainNavigation('forward', () => {
			_state = {
				..._state,
				history:         [..._state.history, _state.currentScreenId],
				currentScreenId: screenId,
				breadcrumb:      buildBreadcrumb(screenId),
				transitioning:   false
			};
			_set(_state);
		});
		return;
	}
	_state = { ..._state, history: [..._state.history, _state.currentScreenId] };
	transition(screenId, 'forward');
}

/** Go back one level. Falls back to home if history is empty. */
export function goBack(): void {
	const history = [..._state.history];
	const previousId = history.pop();
	if (!previousId) {
		goHome();
		return;
	}
	if (matrixNavActive()) {
		const nextHist = history;
		startMatrixRainNavigation('backward', () => {
			_state = {
				..._state,
				history:         nextHist,
				currentScreenId: previousId,
				breadcrumb:      buildBreadcrumb(previousId),
				transitioning:   false
			};
			_set(_state);
		});
		return;
	}
	_state = { ..._state, history };
	transition(previousId, 'backward');
}

/** Navigate to the home screen and clear history. */
export function goHome(): void {
	let homeId: string;
	try {
		homeId = getConfig().screens.home;
	} catch {
		homeId = 'main';
	}
	if (matrixNavActive()) {
		startMatrixRainNavigation('backward', () => {
			_state = {
				..._state,
				history:         [],
				currentScreenId: homeId,
				breadcrumb:      buildBreadcrumb(homeId),
				transitioning:   false
			};
			_set(_state);
		});
		return;
	}
	_state = { ..._state, history: [] };
	transition(homeId, 'backward');
}

/** Directly set the initial screen (used by layout before splash). */
export function setInitialScreen(screenId: string): void {
	_state = {
		..._state,
		currentScreenId: screenId,
		breadcrumb:      buildBreadcrumb(screenId),
		history:         []
	};
	_set(_state);
}
