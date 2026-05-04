<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import BBSFrame from '$lib/bbs/components/layout/BBSFrame.svelte';
	import BackPrompt from '$lib/bbs/components/navigation/BackPrompt.svelte';
	import Badge from '$lib/bbs/components/primitives/Badge.svelte';
	import KeyHint from '$lib/bbs/components/primitives/KeyHint.svelte';
	import { register, unregister } from '$lib/bbs/utils/keyboard.js';
	import { setStatus } from '$lib/bbs/stores/terminal.store.js';
	import { projects } from '../../content/projects.js';

	const PER_PAGE = 2;
	let page = 0;
	let focused: string | null = null;
	let keyIds: symbol[] = [];

	$: totalPages = Math.ceil(projects.length / PER_PAGE);
	$: pageItems  = projects.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

	function focusProject(id: string) {
		focused = focused === id ? null : id;
	}

	function openLink(url: string, label: string) {
		setStatus(`CONNECTING TO ${label}...`, 'info', 2000);
		window.open(url, '_blank', 'noopener noreferrer');
	}

	onMount(() => {
		// Number keys focus projects on current page
		pageItems.forEach((p, i) => {
			keyIds.push(register(String(i + 1), () => focusProject(p.id), 2));
		});

		// N/P pagination
		keyIds.push(register('N', () => { if (page < totalPages - 1) { page++; focused = null; } }, 2));
		keyIds.push(register('P', () => { if (page > 0) { page--; focused = null; } }, 2));

		// G/D for focused project links
		keyIds.push(register('G', () => {
			const proj = projects.find((p) => p.id === focused);
			const link = proj?.links.find((l) => l.key === 'G');
			if (link) openLink(link.url, link.label);
		}, 2));
		keyIds.push(register('D', () => {
			const proj = projects.find((p) => p.id === focused);
			const link = proj?.links.find((l) => l.key === 'D');
			if (link) openLink(link.url, link.label);
		}, 2));
	});

	onDestroy(() => keyIds.forEach(unregister));
</script>

<BBSFrame title="PROJECTS" subtitle="{projects.length} ENTRIES">
	<div style="display: flex; flex-direction: column; gap: 0.75rem; height: 100%; overflow: hidden; min-height: 0; padding: 0.25rem 0;">

		{#each pageItems as proj, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				role="button"
				tabindex="0"
				on:click={() => focusProject(proj.id)}
				style="
					border: 1px solid {focused === proj.id ? 'var(--bbs-primary)' : 'var(--bbs-muted)'};
					padding: 0.6rem 0.75rem;
					cursor: pointer;
					display: flex;
					flex-direction: column;
					gap: 0.4rem;
				"
			>
				<!-- Header -->
				<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 1rem;">
					<div style="display: flex; gap: 0.5rem; align-items: baseline;">
						<span style="color: var(--bbs-primary);">[{i + 1}]</span>
						<span style="color: {focused === proj.id ? 'var(--bbs-primary)' : 'var(--bbs-fg)'}; font-weight: bold;">
							{proj.name}
						</span>
					</div>
					<Badge label={proj.primaryTag} variant="muted" />
				</div>

				<!-- Description -->
				<div style="color: var(--bbs-secondary);">{proj.description}</div>

				<!-- Stack -->
				<div style="display: flex; flex-wrap: wrap; gap: 0.3rem; border-top: 1px solid var(--bbs-muted); padding-top: 0.4rem;">
					{#each proj.stack as tech}
						<Badge label={tech} variant="muted" />
					{/each}
				</div>

				<!-- Links -->
				{#if focused === proj.id}
					<div style="display: flex; gap: 1rem; margin-top: 0.25rem;">
						{#each proj.links as link}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<span
								role="button"
								tabindex="0"
								on:click|stopPropagation={() => openLink(link.url, link.label)}
								style="cursor: pointer;"
							>
								<KeyHint key={link.key} label={link.label} />
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{/each}

		<!-- Pagination -->
		{#if totalPages > 1}
			<div style="display: flex; align-items: center; gap: 1rem; color: var(--bbs-secondary); margin-top: auto; padding-top: 0.5rem;">
				<span>── [ PAGE {page + 1} OF {totalPages} ]</span>
				<KeyHint key="N" label="Next" dim={page >= totalPages - 1} />
				<KeyHint key="P" label="Prev" dim={page <= 0} />
			</div>
		{/if}
	</div>

	<svelte:fragment slot="footer">
		<BackPrompt />
	</svelte:fragment>
</BBSFrame>
