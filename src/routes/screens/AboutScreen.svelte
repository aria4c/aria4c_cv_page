<script lang="ts">
	import { onMount } from 'svelte';
	import BBSFrame from '$lib/bbs/components/layout/BBSFrame.svelte';
	import BackPrompt from '$lib/bbs/components/navigation/BackPrompt.svelte';
	import RowRevealImage from '$lib/bbs/components/effects/RowRevealImage.svelte';
	import Badge from '$lib/bbs/components/primitives/Badge.svelte';
	import Typewriter from '$lib/bbs/components/effects/Typewriter.svelte';
	import Divider from '$lib/bbs/components/primitives/Divider.svelte';
	import LocationMap from '$lib/bbs/components/primitives/LocationMap.svelte';
	import { languages } from '../../content/languages.js';
	import { practiceDomains, profile } from '../../content/profile.js';

	const MOBILE_MQ       = '(max-width: 720px)';
	const MOBILE_PAGES    = 2;
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

	$: screenTag =
		useMobilePager && mobilePageIndex === 0
			? 'SYNOPSIS'
			: useMobilePager
				? 'DATA'
				: '';

	$: mapLabel =
		'Map highlighting ' + profile.mapCountryName + ', location marked';
</script>

<BBSFrame title="ABOUT ME">
	{#if !useMobilePager}
		<div class="about-root">
			<div class="about-photo-col">
				<RowRevealImage src="/photo.jpg" alt={profile.name} />
				<div class="about-photo-rule">──────────────</div>
				<Badge label="STATUS: ONLINE" variant="success" blink={profile.available} />
			</div>

			<div class="about-main-col">
				<div class="about-name">{profile.name}</div>
				<div class="about-title">{profile.title}</div>

				<Divider />

				<div class="about-meta-row">
					<div class="about-details">
						<div>&gt; Location  : {profile.location}</div>
						<div>
							&gt; Available :&nbsp;<Badge
								label={profile.available ? 'YES' : 'NO'}
								variant={profile.available ? 'success' : 'error'}
								blink={profile.available}
							/>
						</div>
						<div>&gt; Experience: {profile.yearsExperience} years</div>
						<div class="domains-line">
							&gt; Domains : &nbsp;<span>{practiceDomains.join(' · ')}</span>
						</div>
						<div class="lang-row">
							<span class="lang-label">&gt; Languages :</span>
							<span class="lang-chips">
								{#each languages as lang (lang.code)}
									<span
										class="lang-code tier-{lang.tier}"
										title="{lang.name}{lang.preferred ? ' — preferred' : ''}"
									>
										{lang.code}{#if lang.preferred}<abbr class="lang-pref" title="Preferred language">*</abbr>{/if}
									</span>
								{/each}
							</span>
						</div>
					</div>
					<div class="about-map-wrap">
						<LocationMap
							latitude={profile.latitude}
							longitude={profile.longitude}
							highlightCountryName={profile.mapCountryName}
							label={mapLabel}
						/>
					</div>
				</div>

				<Divider />

				<div class="about-bio">
					<Typewriter text={profile.bio} startDelay={600} />
				</div>

				{#if profile.available}
					<div class="about-opportunities">
						Currently: <Badge label="OPEN TO OPPORTUNITIES" variant="success" blink />
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="about-mobile-root">
			<div class="about-mobile-scroll" aria-live="polite">
				{#if mobilePageIndex === 0}
					<div class="about-mobile-page">
						<div class="about-photo-col about-photo-col--centered">
							<RowRevealImage src="/photo.jpg" alt={profile.name} />
							<div class="about-photo-rule">──────────────</div>
							<Badge label="STATUS: ONLINE" variant="success" blink={profile.available} />
						</div>
						<div class="about-name">{profile.name}</div>
						<div class="about-title">{profile.title}</div>
						<Divider />
						<div class="about-bio-mobile">{profile.bio}</div>
						{#if profile.available}
							<div class="about-opportunities">
								Currently: <Badge label="OPEN TO OPPORTUNITIES" variant="success" blink />
							</div>
						{/if}
					</div>
				{:else}
					<div class="about-mobile-page">
						<div class="about-subhead mute">└─ METADATA ─ STATUS ─ LOCALE ─┘</div>
						<div class="about-details">
							<div>&gt; Location  : {profile.location}</div>
							<div>
								&gt; Available :&nbsp;<Badge
									label={profile.available ? 'YES' : 'NO'}
									variant={profile.available ? 'success' : 'error'}
									blink={profile.available}
								/>
							</div>
							<div>&gt; Experience: {profile.yearsExperience} years</div>
							<div class="domains-line">
								&gt; Domains : &nbsp;<span>{practiceDomains.join(' · ')}</span>
							</div>
							<div class="lang-row">
								<span class="lang-label">&gt; Languages :</span>
								<span class="lang-chips">
									{#each languages as lang (lang.code)}
										<span
											class="lang-code tier-{lang.tier}"
											title="{lang.name}{lang.preferred ? ' — preferred' : ''}"
										>
											{lang.code}{#if lang.preferred}<abbr class="lang-pref" title="Preferred language">*</abbr>{/if}
										</span>
									{/each}
								</span>
							</div>
						</div>
						<Divider />
						<div class="about-mobile-map-wrap">
							<LocationMap
								latitude={profile.latitude}
								longitude={profile.longitude}
								highlightCountryName={profile.mapCountryName}
								label={mapLabel}
							/>
						</div>
					</div>
				{/if}
			</div>

			<div class="about-mobile-pager" role="navigation" aria-label="About screen paging">
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
	.about-root {
		display: flex;
		gap: 1.5rem;
		height: 100%;
		min-height: 0;
		overflow: hidden;
	}

	.about-photo-col {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.5rem 0;
		width: 14rem;
	}

	.about-photo-rule {
		color: var(--bbs-muted);
	}

	.about-main-col {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem 0;
		overflow: hidden;
		min-height: 0;
	}

	.about-name {
		color: var(--bbs-primary);
		font-size: var(--bbs-font-size-lg);
	}

	.about-title {
		color: var(--bbs-secondary);
	}

	.about-meta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-start;
		justify-content: space-between;
	}

	.about-details {
		flex: 1;
		min-width: min(11rem, 100%);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		color: var(--bbs-fg);
	}

	.about-map-wrap {
		flex-shrink: 0;
		width: 12rem;
		max-width: 100%;
	}

	.about-bio {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		color: var(--bbs-fg);
	}

	.about-opportunities {
		margin-top: 0.5rem;
	}

	.domains-line {
		color: var(--bbs-fg);
		margin-top: 0.15rem;
		line-height: 1.35;
	}

	.domains-line span {
		color: var(--bbs-secondary);
	}

	.lang-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem 0.6rem;
		margin-top: 0.35rem;
	}

	.lang-label {
		color: var(--bbs-fg);
	}

	.lang-chips {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.45rem 0.85rem;
	}

	.lang-code {
		white-space: nowrap;
	}

	.tier-gray {
		color: var(--bbs-muted);
	}

	.tier-extra {
		color: color-mix(in srgb, var(--bbs-secondary) 92%, var(--bbs-fg));
	}

	.tier-bright {
		color: var(--bbs-primary);
		font-weight: 600;
	}

	.tier-extra-bright {
		color: var(--bbs-fg);
		font-weight: 600;
		text-shadow: 0 0 5px color-mix(in srgb, var(--bbs-primary) 45%, transparent);
	}

	.lang-pref {
		margin-left: 0.12em;
		color: var(--bbs-secondary);
		font-weight: 400;
		text-decoration: none;
		cursor: help;
	}

	.about-mobile-root {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		font-family: var(--bbs-font);
	}

	.about-mobile-scroll {
		flex: 1;
		min-height: 0;
		overflow-x: hidden;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		padding-right: 0.15rem;
	}

	.about-mobile-page {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-bottom: 0.5rem;
		color: var(--bbs-fg);
		line-height: var(--bbs-line-height);
	}

	.about-photo-col--centered {
		width: min(13rem, 100%);
		max-width: 100%;
		align-self: center;
		padding-top: 0.15rem;
	}

	.about-bio-mobile {
		flex: none;
		color: var(--bbs-fg);
		overflow: visible;
		min-height: 0;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.about-mobile-map-wrap {
		max-width: 10rem;
		width: 100%;
		margin-inline: auto;
	}

	.about-subhead {
		font-size: var(--bbs-font-size-sm);
		letter-spacing: 0.04em;
		text-align: center;
	}

	.mute {
		color: var(--bbs-muted);
	}

	.about-mobile-pager {
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
