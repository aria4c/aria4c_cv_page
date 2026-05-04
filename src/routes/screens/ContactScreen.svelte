<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import BBSFrame from '$lib/bbs/components/layout/BBSFrame.svelte';
	import BackPrompt from '$lib/bbs/components/navigation/BackPrompt.svelte';
	import Badge from '$lib/bbs/components/primitives/Badge.svelte';
	import KeyHint from '$lib/bbs/components/primitives/KeyHint.svelte';
	import { register, unregister } from '$lib/bbs/utils/keyboard.js';
	import { setStatus } from '$lib/bbs/stores/terminal.store.js';
	import { profile } from '../../content/profile.js';

	let keyIds: symbol[] = [];

	function hoverEnter(e: MouseEvent) {
		const el = e.currentTarget as HTMLElement;
		el.style.background = 'var(--bbs-highlight)';
		el.style.color = 'var(--bbs-highlight-text)';
	}
	function hoverLeave(e: MouseEvent) {
		const el = e.currentTarget as HTMLElement;
		el.style.background = 'transparent';
		el.style.color = 'var(--bbs-fg)';
	}

	function activate(link: typeof profile.contactLinks[0]) {
		setStatus(`CONNECTING TO ${link.label}...`, 'info', 2000);

		if (link.action === 'mailto') {
			window.location.href = link.url;
		} else if (link.action === 'download') {
			const a = document.createElement('a');
			a.href = link.url;
			a.download = '';
			a.click();
		} else {
			window.open(link.url, '_blank', 'noopener noreferrer');
		}
	}

	onMount(() => {
		profile.contactLinks.forEach((link) => {
			keyIds.push(register(link.key, () => activate(link), 2));
		});
	});

	onDestroy(() => keyIds.forEach(unregister));
</script>

<BBSFrame title="CONTACT">
	<div style="display: flex; flex-direction: column; gap: 1rem; padding: 0.5rem 0; height: 100%;">

		<div style="color: var(--bbs-secondary);">
			Establish connection using one of the following channels:
		</div>

		<div style="
			border: 1px solid var(--bbs-muted);
			display: flex;
			flex-direction: column;
		">
			{#each profile.contactLinks as link}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					role="button"
					tabindex="0"
					on:click={() => activate(link)}
					style="
						display: flex;
						align-items: baseline;
						gap: 1rem;
						padding: 0.5rem 0.75rem;
						cursor: pointer;
						border-bottom: 1px solid var(--bbs-muted);
						color: var(--bbs-fg);
					"
					on:mouseenter={hoverEnter}
					on:mouseleave={hoverLeave}
				>
					<span style="color: var(--bbs-primary); flex-shrink: 0;">[{link.key}]</span>
					<span style="color: var(--bbs-secondary); min-width: 10ch; flex-shrink: 0;">{link.label}</span>
					<span>{link.value}</span>
				</div>
			{/each}
		</div>

		<div style="color: var(--bbs-muted); font-size: var(--bbs-font-size-sm);">
			Press number key or click to open.
		</div>

		<div style="margin-top: auto;">
			<Badge label="TRANSMISSION READY" variant="success" blink />
		</div>
	</div>

	<svelte:fragment slot="footer">
		<BackPrompt />
	</svelte:fragment>
</BBSFrame>
