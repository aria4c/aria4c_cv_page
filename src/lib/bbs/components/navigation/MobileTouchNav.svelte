<script lang="ts">
	import KeyHint from '../primitives/KeyHint.svelte';
	import { configStore } from '../../stores/config.store.js';
	import { goBack, goHome } from '../../stores/navigation.store.js';
	import {
		matrixLockedStore,
		themeModeStore,
		toggleThemeMode
	} from '../../stores/theme.store.js';

	$: cfg = $configStore.config;
	$: matrixLocked = $matrixLockedStore;
	$: mode = $themeModeStore;

	$: backKey = cfg?.navigation.backKey ?? 'B';
	$: homeKey = cfg?.navigation.homeKey ?? 'H';
	$: themeKey = cfg?.navigation.themeToggleKey ?? 'T';
	$: showThemeBtn = !!(cfg?.themeDay && cfg.navigation.themeToggleKey);
	$: themeLabel = matrixLocked ? 'LOCK' : mode === 'day' ? 'NIGHT' : 'DAY';

	function onThemeTap(): void {
		if (matrixLocked) return;
		toggleThemeMode();
	}
</script>

<div class="mobile-touch-nav" aria-label="Touch navigation">
	<button type="button" class="touch-chip" on:click={goBack}>
		<KeyHint key={backKey} label="Back" />
	</button>
	<button type="button" class="touch-chip" on:click={goHome}>
		<KeyHint key={homeKey} label="Home" />
	</button>
	{#if showThemeBtn}
		<button
			type="button"
			class="touch-chip"
			class:touch-chip--disabled={matrixLocked}
			disabled={matrixLocked}
			on:click={onThemeTap}
		>
			<KeyHint key={themeKey} label={themeLabel} dim={matrixLocked} />
		</button>
	{/if}
</div>

<style>
	.mobile-touch-nav {
		display: none;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
		flex-wrap: wrap;
		padding: 0.35rem 0.65rem;
		padding-bottom: calc(0.35rem + env(safe-area-inset-bottom, 0px));
		border-top: 1px solid var(--bbs-muted);
		background: var(--bbs-bg);
		color: var(--bbs-secondary);
		font-family: var(--bbs-font);
		z-index: 3;
		line-height: var(--bbs-line-height);
	}

	@media (max-width: 720px) {
		.mobile-touch-nav {
			display: flex;
		}
	}

	.touch-chip {
		-webkit-tap-highlight-color: transparent;
		background: none;
		border: none;
		margin: 0;
		padding: 0.5rem 0.7rem;
		min-height: 44px;
		min-width: 48px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font: inherit;
	}

	.touch-chip--disabled {
		cursor: not-allowed;
	}
</style>
