<script lang="ts">
	import KeyHint from '../primitives/KeyHint.svelte';
	import { goBack, goHome } from '../../stores/navigation.store.js';
	import { getConfig } from '../../stores/config.store.js';
	import { register, unregister } from '../../utils/keyboard.js';
	import { onMount, onDestroy } from 'svelte';

	export let showBack:   boolean = true;
	export let showHome:   boolean = true;
	export let showQuit:   boolean = false;
	export let extraHints: Array<{ key: string; label: string; action: () => void }> = [];

	let ids: symbol[] = [];

	onMount(() => {
		let cfg: ReturnType<typeof getConfig> | null = null;
		try { cfg = getConfig(); } catch { /* not yet init */ }

		if (showBack && cfg) ids.push(register(cfg.navigation.backKey, goBack, 1));
		if (showHome && cfg) ids.push(register(cfg.navigation.homeKey, goHome, 1));
		for (const hint of extraHints) {
			ids.push(register(hint.key, hint.action, 1));
		}
	});

	onDestroy(() => {
		for (const id of ids) unregister(id);
	});
</script>

<div style="
	display: flex;
	gap: 1.5rem;
	align-items: center;
	font-family: var(--bbs-font);
	color: var(--bbs-secondary);
">
	{#if showBack}
		<button
			style="background:none; border:none; padding:0; cursor:pointer;"
			on:click={goBack}
		>
			<KeyHint key="B" label="Back" />
		</button>
	{/if}
	{#if showHome}
		<button
			style="background:none; border:none; padding:0; cursor:pointer;"
			on:click={goHome}
		>
			<KeyHint key="H" label="Home" />
		</button>
	{/if}
	{#each extraHints as hint}
		<button
			style="background:none; border:none; padding:0; cursor:pointer;"
			on:click={hint.action}
		>
			<KeyHint key={hint.key} label={hint.label} />
		</button>
	{/each}
</div>
