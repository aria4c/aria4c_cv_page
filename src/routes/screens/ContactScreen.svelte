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

		<div class="contact-channels-box">
			{#each profile.contactLinks as link}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					role="button"
					tabindex="0"
					class="contact-channel-row"
					on:click={() => activate(link)}
					on:mouseenter={hoverEnter}
					on:mouseleave={hoverLeave}
				>
					<span class="contact-channel-key">[{link.key}]</span>
					<span class="contact-channel-label">{link.label}</span>
					<span class="contact-channel-value">{link.value}</span>
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

<style>
	.contact-channels-box {
		border: 1px solid var(--bbs-muted);
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.contact-channel-row {
		display: flex;
		align-items: baseline;
		gap: 0.75rem 1rem;
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		border-bottom: 1px solid var(--bbs-muted);
		color: var(--bbs-fg);
		min-width: 0;
	}

	.contact-channel-row:last-child {
		border-bottom: none;
	}

	.contact-channel-key {
		color: var(--bbs-primary);
		flex-shrink: 0;
	}

	.contact-channel-label {
		color: var(--bbs-secondary);
		min-width: 8ch;
		flex-shrink: 0;
	}

	.contact-channel-value {
		min-width: 0;
		flex: 1 1 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 720px) {
		.contact-channel-row {
			flex-wrap: wrap;
		}

		.contact-channel-value {
			flex: 1 1 100%;
			white-space: normal;
			overflow-wrap: anywhere;
			word-break: break-word;
		}
	}
</style>
