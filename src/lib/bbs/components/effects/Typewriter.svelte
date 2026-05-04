<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { runTypewriter, type TypewriterHandle } from '../../utils/typewriter.js';
	import { configStore } from '../../stores/config.store.js';
	import BlinkingCursor from './BlinkingCursor.svelte';

	export let text:        string  = '';
	export let startDelay:  number  = 0;   // ms before starting
	export let showCursor:  boolean = true;

	const dispatch = createEventDispatcher<{ complete: void }>();

	let revealed   = 0;
	let complete   = false;
	let handle:    TypewriterHandle | null = null;
	let startTimer: ReturnType<typeof setTimeout> | null = null;

	$: displayText = text.slice(0, revealed);

	function start() {
		if (!$configStore.config) return;
		const cfg    = $configStore.config;
		const twConf = cfg.effects.typewriter;
		const baud   = cfg.system.baudRate;

		if (!twConf.enabled) {
			revealed = text.length;
			complete = true;
			dispatch('complete');
			return;
		}

		handle = runTypewriter(
			text,
			twConf,
			baud,
			(n) => { revealed = n; },
			() => { complete = true; dispatch('complete'); }
		);
	}

	onMount(() => {
		if (startDelay > 0) {
			startTimer = setTimeout(start, startDelay);
		} else {
			start();
		}
	});

	onDestroy(() => {
		handle?.destroy();
		if (startTimer) clearTimeout(startTimer);
	});

	/** Skip to completion. */
	export function skip() {
		handle?.skip();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span
	class="typewriter"
	style="font-family: var(--bbs-font);"
	on:click={() => {
		const cfg = $configStore.config;
		if (cfg?.effects.typewriter.skipOnClick && !complete) skip();
	}}
>
	{displayText}{#if showCursor && !complete}<BlinkingCursor inline />{/if}
</span>
