<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { BBSConfig } from '../../types/config.js';
	import { initConfig } from '../../stores/config.store.js';
	import { initThemeFromStored, toggleThemeMode } from '../../stores/theme.store.js';
	import { startClock } from '../../stores/terminal.store.js';
	import { startCursorBlink } from '../../stores/effects.store.js';
	import { attachKeyboardListener, register, unregister } from '../../utils/keyboard.js';
	import { setInitialScreen } from '../../stores/navigation.store.js';

	export let config: BBSConfig;

	let cleanupClock: () => void;
	let cleanupCursor: () => void;
	let cleanupKeyboard: () => void;
	let themeToggleId: symbol | undefined;

	onMount(() => {
		initConfig(config);
		initThemeFromStored();

		cleanupClock    = startClock(config.statusBar.clockFormat);
		cleanupCursor   = startCursorBlink(config.effects.cursor.blinkRateMs);
		cleanupKeyboard = attachKeyboardListener();

		const tk = config.navigation.themeToggleKey;
		if (tk !== null && tk !== '') themeToggleId = register(tk, toggleThemeMode, 1);

		if (config.splash.enabled) {
			setInitialScreen('splash');
		} else {
			setInitialScreen(config.screens.home);
		}
	});

	onDestroy(() => {
		if (themeToggleId !== undefined) unregister(themeToggleId);
		cleanupClock?.();
		cleanupCursor?.();
		cleanupKeyboard?.();
	});
</script>

<div
	class="bbs-root"
	style="
		background: var(--bbs-bg);
		color: var(--bbs-fg);
		font-family: var(--bbs-font);
		font-size: var(--bbs-font-size);
		line-height: var(--bbs-line-height);
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		position: relative;
	"
>
	<slot />
</div>
