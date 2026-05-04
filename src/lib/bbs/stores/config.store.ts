import { readable, type Readable } from 'svelte/store';
import type { BBSConfig, ScreenDefinition } from '../types/config.js';

interface ConfigState {
	config:      BBSConfig | null;
	screens:     Map<string, ScreenDefinition>;
	initialized: boolean;
}

const initial: ConfigState = {
	config:      null,
	screens:     new Map(),
	initialized: false
};

let _set: (value: ConfigState) => void;
let _state: ConfigState = { ...initial };

export const configStore: Readable<ConfigState> = readable(initial, (set) => {
	_set = set;
});

/** Call once in +layout.ts to initialise the framework with your BBSConfig. */
export function initConfig(config: BBSConfig): void {
	if (_state.initialized) return;

	const screens = new Map<string, ScreenDefinition>();
	for (const screen of config.screens.screens) {
		screens.set(screen.id, screen);
	}

	_state = { config, screens, initialized: true };
	_set(_state);
}

/** Look up a single screen by ID. Returns undefined if not found. */
export function getScreen(id: string): ScreenDefinition | undefined {
	return _state.screens.get(id);
}

/** Returns all screens whose `parent` field equals `id`. */
export function getScreenChildren(id: string): ScreenDefinition[] {
	return _state.config?.screens.screens.filter((s) => s.parent === id) ?? [];
}

/** Typed helper to read config — throws if not yet initialised. */
export function getConfig(): BBSConfig {
	if (!_state.config) throw new Error('BBS: initConfig() has not been called yet.');
	return _state.config;
}
