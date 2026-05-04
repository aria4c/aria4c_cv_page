<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import type { BootMessage } from '../../types/config.js';

	export let messages: BootMessage[];

	const dispatch = createEventDispatcher<{ complete: void }>();

	let shown: number = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function badgeColor(type: BootMessage['type']): string {
		return type === 'ok'    ? 'var(--bbs-success)'
		     : type === 'warn'  ? 'var(--bbs-warning)'
		     : type === 'error' ? 'var(--bbs-error)'
		     : 'var(--bbs-secondary)';
	}

	function badgeText(type: BootMessage['type']): string {
		return type === 'ok'    ? '  OK  '
		     : type === 'warn'  ? ' WARN '
		     : type === 'error' ? ' ERR  '
		     : ' INFO ';
	}

	onMount(() => {
		let cumDelay = 0;
		messages.forEach((msg, i) => {
			cumDelay += msg.delay;
			const t = setTimeout(() => {
				shown = i + 1;
				if (shown >= messages.length) {
					dispatch('complete');
				}
			}, cumDelay);
			timers.push(t);
		});
		return () => timers.forEach(clearTimeout);
	});

	export function skipAll() {
		timers.forEach(clearTimeout);
		shown = messages.length;
		dispatch('complete');
	}
</script>

<div style="font-family: var(--bbs-font); color: var(--bbs-fg);">
	{#each messages.slice(0, shown) as msg}
		<div style="display: flex; align-items: center; gap: 0.5rem; line-height: var(--bbs-line-height);">
			<span style="color: {badgeColor(msg.type)};">[{badgeText(msg.type)}]</span>
			<span>{msg.text}</span>
		</div>
	{/each}
</div>
