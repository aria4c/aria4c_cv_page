<script lang="ts">
	import { onMount } from 'svelte';
	import BBSFrame from '$lib/bbs/components/layout/BBSFrame.svelte';
	import BackPrompt from '$lib/bbs/components/navigation/BackPrompt.svelte';
	import Divider from '$lib/bbs/components/primitives/Divider.svelte';
	import ProgressBar from '$lib/bbs/components/primitives/ProgressBar.svelte';
	import { overallItYears, techColumns } from '../../content/skills.js';

	const MOBILE_MQ = '(max-width: 720px)';
	/** Narrow: overview (0), then one page per tech column — matches About pager pattern (`AboutScreen`). */
	const MOBILE_PAGES = 1 + techColumns.length;
	const LAST_PAGE_INDEX = MOBILE_PAGES - 1;

	let useMobilePager =
		typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches;
	let mobilePageIndex = 0;

	onMount(() => {
		const mq = window.matchMedia(MOBILE_MQ);
		const apply = (): void => {
			useMobilePager = mq.matches;
			if (!mq.matches) mobilePageIndex = 0;
		};
		apply();
		mq.addEventListener('change', apply);
		return () => mq.removeEventListener('change', apply);
	});

	function pagerPrev(): void {
		mobilePageIndex = Math.max(0, mobilePageIndex - 1);
	}

	function pagerNext(): void {
		mobilePageIndex = Math.min(LAST_PAGE_INDEX, mobilePageIndex + 1);
	}

	$: mobileCol =
		useMobilePager && mobilePageIndex >= 1 ? techColumns[mobilePageIndex - 1] : null;
	$: mobileCi = mobilePageIndex >= 1 ? mobilePageIndex - 1 : 0;

	function skillsScreenTag(index: number): string {
		if (index === 0) return 'OVERVIEW';
		const col = techColumns[index - 1];
		if (!col) return '';
		const t = col.title;
		if (t.startsWith('Commerce')) return 'COMMERCE';
		if (t.startsWith('Platform')) return 'PLATFORM';
		if (t.includes('AI')) return 'AI · LLMS';
		return t.length > 14 ? `${t.slice(0, 12)}…` : t.toUpperCase();
	}

	$: screenTag = useMobilePager ? skillsScreenTag(mobilePageIndex) : '';
</script>

<BBSFrame title="SKILLS & TOOLS">
	{#if !useMobilePager}
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
	{:else}
		<div class="skills-mobile-root">
			<div class="skills-mobile-scroll" aria-live="polite">
				{#if mobilePageIndex === 0}
					<div class="skills-mobile-page">
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
					</div>
				{:else if mobileCol}
					{@const col = mobileCol}
					{@const ci = mobileCi}
					<div class="skills-mobile-page">
						<div class="tech-col-head">{col.title}</div>
						<div class="tech-bars tech-bars--mobile">
							{#each col.items as row, ri (col.title + row.name)}
								{@const stagger = 120 + ci * 80 + ri * 40}
								<ProgressBar
									displayMode="timeline"
									timelineCareerYears={overallItYears}
									timelineFrom={row.activeFromYear}
									timelineTo={row.activeToYear}
									label={row.name}
									splitLabelBar={true}
									splitBarTrailing={true}
									width={36}
									truncateLabel={false}
									animated
									animDelay={stagger}
								/>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<div class="skills-mobile-pager" role="navigation" aria-label="Skills screen paging">
				<button
					type="button"
					class="pager-hit"
					disabled={mobilePageIndex <= 0}
					aria-label="Previous screen"
					on:click={pagerPrev}
				>
					⟨
				</button>
				<div class="pager-mid">
					<div class="pager-screen-line">
						SCREEN&nbsp;·&nbsp;{mobilePageIndex + 1}&nbsp;/&nbsp;{MOBILE_PAGES}
					</div>
					<div class="pager-tag mute">{screenTag}</div>
				</div>
				<button
					type="button"
					class="pager-hit"
					disabled={mobilePageIndex >= LAST_PAGE_INDEX}
					aria-label="Next screen"
					on:click={pagerNext}
				>
					⟩
				</button>
			</div>
		</div>
	{/if}

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

	.skills-mobile-root {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		font-family: var(--bbs-font);
	}

	.skills-mobile-scroll {
		flex: 1;
		min-height: 0;
		overflow-x: hidden;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		padding-right: 0.15rem;
	}

	.skills-mobile-page {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding-bottom: 0.5rem;
		color: var(--bbs-fg);
		line-height: var(--bbs-line-height);
	}

	.tech-bars--mobile {
		flex: none;
		overflow: visible;
		min-height: 0;
		gap: 0.32rem;
	}

	.mute {
		color: var(--bbs-muted);
	}

	.skills-mobile-pager {
		flex-shrink: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.3rem 0.35rem;
		padding-bottom: calc(0.3rem + env(safe-area-inset-bottom, 0px));
		border-top: 1px solid var(--bbs-muted);
		background: var(--bbs-bg);
		font-size: var(--bbs-font-size-sm);
		line-height: var(--bbs-line-height);
	}

	.pager-hit {
		-webkit-tap-highlight-color: transparent;
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 48px;
		min-height: 44px;
		margin: 0;
		padding: 0;
		border: 1px solid color-mix(in srgb, var(--bbs-muted) 80%, var(--bbs-bg));
		background: color-mix(in srgb, var(--bbs-bg) 88%, var(--bbs-primary));
		color: var(--bbs-primary);
		font-family: inherit;
		font-size: var(--bbs-font-size-lg);
		cursor: pointer;
		line-height: 1;
	}

	.pager-hit:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		color: var(--bbs-muted);
		border-color: color-mix(in srgb, var(--bbs-muted) 50%, var(--bbs-bg));
		background: transparent;
	}

	.pager-mid {
		flex: 1;
		min-width: 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.06rem;
	}

	.pager-screen-line {
		color: var(--bbs-secondary);
		font-weight: 600;
		letter-spacing: 0.06em;
	}

	.pager-tag {
		font-size: calc(var(--bbs-font-size-sm) * 0.92);
		letter-spacing: 0.12em;
	}
</style>
