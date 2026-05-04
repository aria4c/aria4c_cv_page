<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import BBSFrame from '$lib/bbs/components/layout/BBSFrame.svelte';
	import BackPrompt from '$lib/bbs/components/navigation/BackPrompt.svelte';
	import Badge from '$lib/bbs/components/primitives/Badge.svelte';
	import Typewriter from '$lib/bbs/components/effects/Typewriter.svelte';
	import { register, unregister } from '$lib/bbs/utils/keyboard.js';
	import { experience } from '../../content/experience.js';

	let expanded: string | null = null;
	let keyIds: symbol[] = [];

	function toggle(id: string) {
		expanded = expanded === id ? null : id;
	}

	onMount(() => {
		experience.forEach((entry, i) => {
			const key = String(i + 1);
			keyIds.push(register(key, () => toggle(entry.id), 2));
		});
	});

	onDestroy(() => keyIds.forEach(unregister));
</script>

<BBSFrame title="WORK EXPERIENCE">
	<div style="display: flex; flex-direction: column; gap: 0.75rem; overflow: hidden; min-height: 0; padding: 0.25rem 0; height: 100%;">

		{#each experience as entry, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="entry"
				role="button"
				tabindex="0"
				on:click={() => toggle(entry.id)}
				style="
					border: 1px solid {expanded === entry.id ? 'var(--bbs-primary)' : 'var(--bbs-muted)'};
					cursor: pointer;
					transition: border-color 0.1s;
				"
			>
				<!-- Header row -->
				<div style="
					display: flex;
					justify-content: space-between;
					align-items: baseline;
					padding: 0.4rem 0.75rem;
					gap: 1rem;
					background: {expanded === entry.id ? 'var(--bbs-highlight)' : 'transparent'};
					color: {expanded === entry.id ? 'var(--bbs-highlight-text)' : 'var(--bbs-fg)'};
				">
					<div style="display: flex; align-items: baseline; gap: 0.5rem;">
						<span style="color: {expanded === entry.id ? 'var(--bbs-highlight-text)' : 'var(--bbs-primary)'};">[{i + 1}]</span>
						<span style="font-weight: bold;">{entry.company}</span>
					</div>
					<span style="color: {expanded === entry.id ? 'var(--bbs-highlight-text)' : 'var(--bbs-secondary)'}; flex-shrink: 0;">
						{entry.period}
					</span>
				</div>
				<div style="padding: 0 0.75rem 0.4rem; color: var(--bbs-secondary); display: flex; justify-content: space-between;">
					<span>{entry.role}</span>
					<span>{entry.location}</span>
				</div>

				<!-- Expanded details -->
				{#if expanded === entry.id}
					<div style="border-top: 1px solid var(--bbs-muted); padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
						<Typewriter text={entry.description} />
						<div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.25rem;">
							{#each entry.stack as tech}
								<Badge label={tech} variant="muted" />
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/each}

		<div style="color: var(--bbs-muted); font-size: var(--bbs-font-size-sm); margin-top: auto; padding-top: 0.5rem;">
			Press number key or click to expand an entry.
		</div>
	</div>

	<svelte:fragment slot="footer">
		<BackPrompt />
	</svelte:fragment>
</BBSFrame>
