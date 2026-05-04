<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import type { SplashConfig } from '../../types/config.js';
	import AsciiArt from '../primitives/AsciiArt.svelte';
	import BootSequence from '../effects/BootSequence.svelte';
	import BlinkingCursor from '../effects/BlinkingCursor.svelte';
	import { configStore } from '../../stores/config.store.js';
	import { attachKeyboardListener } from '../../utils/keyboard.js';

	export let config: SplashConfig;

	const dispatch = createEventDispatcher<{ complete: void }>();

	let phase: 'art' | 'boot' | 'press-key' | 'done' = 'art';
	let bootRef: BootSequence;
	let autoTimer: ReturnType<typeof setTimeout> | null = null;

	// Phosphor glow if configured
	$: phosphorGlow = $configStore.config?.effects.crt.phosphorGlow ?? false;

	function advance() {
		if (phase === 'done') return;
		phase = 'done';
		dispatch('complete');
	}

	function onArtComplete() {
		if (config.showBootSequence) {
			phase = 'boot';
		} else {
			phase = 'press-key';
			scheduleAutoAdvance();
		}
	}

	function onBootComplete() {
		phase = 'press-key';
		scheduleAutoAdvance();
	}

	function scheduleAutoAdvance() {
		if (config.autoAdvanceMs !== null) {
			autoTimer = setTimeout(advance, config.autoAdvanceMs);
		}
	}

	function handleUserInput() {
		if (phase === 'done') return;

		if (phase === 'art') {
			// Skip art → jump to boot or press-key
			onArtComplete();
			return;
		}
		if (phase === 'boot') {
			bootRef?.skipAll();
			return;
		}
		if (phase === 'press-key') {
			advance();
		}
	}

	// Global click/keypress handler for splash
	let cleanupKey: (() => void) | null = null;

	onMount(() => {
		// Trigger art animation immediately
		// Art phase auto-completes via AsciiArt.svelte's animate prop

		// Listen for any keydown to skip
		function onKey() { handleUserInput(); }
		document.addEventListener('keydown', onKey);
		cleanupKey = () => document.removeEventListener('keydown', onKey);

		// After art lines finish (AsciiArt fires no event, we estimate timing)
		const artLines = config.asciiArt.split('\n').length;
		const artDuration = artLines * 40 + 200;
		setTimeout(() => {
			if (phase === 'art') onArtComplete();
		}, artDuration);
	});

	onDestroy(() => {
		cleanupKey?.();
		if (autoTimer) clearTimeout(autoTimer);
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="splash-screen"
	on:click={handleUserInput}
	role="button"
	tabindex="-1"
	style="
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 2rem;
		gap: 1rem;
		font-family: var(--bbs-font);
		color: var(--bbs-fg);
		text-shadow: {phosphorGlow ? '0 0 8px var(--bbs-primary)' : 'none'};
		cursor: default;
		user-select: none;
	"
>
	<!-- ASCII Art -->
	<AsciiArt
		art={config.asciiArt}
		color="var(--bbs-primary)"
		animate={true}
		lineDelay={40}
	/>

	{#if config.tagline}
		<div style="color: var(--bbs-secondary); letter-spacing: 0.15em; margin-top: 0.25rem;">
			{config.tagline}
		</div>
	{/if}

	<!-- Boot sequence -->
	{#if phase === 'boot' || phase === 'press-key' || phase === 'done'}
		<div style="width: 100%; max-width: 56rem; margin-top: 1rem; border-top: 1px solid var(--bbs-muted); padding-top: 0.75rem;">
			<BootSequence
				bind:this={bootRef}
				messages={config.bootMessages}
				on:complete={onBootComplete}
			/>
		</div>
	{/if}

	<!-- Press any key prompt -->
	{#if phase === 'press-key'}
		<div style="margin-top: 1.5rem; color: var(--bbs-secondary); letter-spacing: 0.1em;">
			<BlinkingCursor char="▌" inline />
			&nbsp;{config.pressAnyKeyText}&nbsp;
			<BlinkingCursor char="▌" inline />
		</div>
	{/if}
</div>
