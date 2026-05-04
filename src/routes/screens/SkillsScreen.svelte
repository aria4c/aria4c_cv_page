<script lang="ts">
	import BBSFrame from '$lib/bbs/components/layout/BBSFrame.svelte';
	import BackPrompt from '$lib/bbs/components/navigation/BackPrompt.svelte';
	import Divider from '$lib/bbs/components/primitives/Divider.svelte';
	import ProgressBar from '$lib/bbs/components/primitives/ProgressBar.svelte';
	import { overallItYears, techColumns } from '../../content/skills.js';
</script>

<BBSFrame title="SKILLS & TOOLS">
	<div class="skills-root">
		<div class="overall-head">OVERALL EXPERIENCE (IT)</div>
		<p class="overall-note">
			Full stack delivery on commerce and SaaS: PHP, Magento and Laravel stacks, heavy integrations, queues and data layers, then shipping and operating that work on AWS-class infrastructure with solid CI and observability. Lately the same muscle goes into LLMs — APIs, retrieval and embeddings, and careful agent-style automation where it earns its keep.
		</p>

		<ProgressBar
			label="OVERALL"
			value={100}
			labelWidth={10}
			width={28}
			animated
			animDelay={0}
		/>

		<Divider />

		<div class="tech-grid" aria-label="Technologies by years">
			{#each techColumns as col, ci (col.title)}
				{@const skillLabelLaneCols =
					Math.max(1, col.items.reduce((m, r) => Math.max(m, r.name.length), 0)) + 1}
				<div class="tech-col">
					<div class="tech-col-head">{col.title}</div>
					<div class="tech-bars">
						{#each col.items as row, ri (col.title + row.name)}
							{@const stagger = 120 + ci * 80 + ri * 40}
							<ProgressBar
								displayMode="timeline"
								timelineCareerYears={overallItYears}
								timelineFrom={row.activeFromYear}
								timelineTo={row.activeToYear}
								label={row.name}
								labelAlignCols={skillLabelLaneCols}
								width={14}
								truncateLabel={false}
								animated
								animDelay={stagger}
							/>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<svelte:fragment slot="footer">
		<BackPrompt />
	</svelte:fragment>
</BBSFrame>

<style>
	.skills-root {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		overflow: hidden;
		min-height: 0;
		padding: 0.25rem 0;
		height: 100%;
		font-family: var(--bbs-font);
	}

	.overall-head {
		color: var(--bbs-primary);
		font-size: var(--bbs-font-size-lg);
		font-weight: 600;
		line-height: var(--bbs-line-height);
	}

	.overall-note {
		margin: 0;
		color: var(--bbs-secondary);
		font-size: var(--bbs-font-size-sm);
		line-height: var(--bbs-line-height);
	}

	.tech-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.35rem 0.65rem;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		align-content: start;
	}

	.tech-col {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		overflow: hidden;
	}

	.tech-col-head {
		color: var(--bbs-primary);
		margin-bottom: 0.05rem;
		line-height: var(--bbs-line-height);
		font-size: var(--bbs-font-size-sm);
		border-bottom: 1px solid color-mix(in srgb, var(--bbs-muted) 70%, transparent);
		padding-bottom: 0.1rem;
	}

	.tech-bars {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		overflow: hidden;
	}

	.tech-bars :global(.pbs) {
		line-height: var(--bbs-line-height);
		font-size: var(--bbs-font-size);
	}
</style>
