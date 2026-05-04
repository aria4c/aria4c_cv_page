<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { GlitchConfig } from '../../types/config.js';

	export let text:    string = '';
	export let config:  GlitchConfig | undefined = undefined;
	export let enabled: boolean = true;

	const GLITCH_CHARS = '!@#$%^&*<>?/\\|[]{}~`';

	let displayed = text;
	let glitchTimer: ReturnType<typeof setInterval> | null = null;
	let restoreTimer: ReturnType<typeof setTimeout> | null = null;

	function glitch() {
		if (!config || !enabled) return;
		const chars = text.split('');
		const count = Math.max(1, Math.round(chars.length * config.intensity));
		for (let i = 0; i < count; i++) {
			const idx = Math.floor(Math.random() * chars.length);
			chars[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
		}
		displayed = chars.join('');
		restoreTimer = setTimeout(() => { displayed = text; }, config.durationMs);
	}

	onMount(() => {
		if (!config?.enabled || !enabled) return;
		const intervalMs = (60 / config.frequency) * 1000;
		glitchTimer = setInterval(glitch, intervalMs);
	});

	onDestroy(() => {
		if (glitchTimer)  clearInterval(glitchTimer);
		if (restoreTimer) clearTimeout(restoreTimer);
	});

	$: if (text) displayed = text; // reset when text changes
</script>

<span style="font-family: var(--bbs-font);">{displayed}</span>
