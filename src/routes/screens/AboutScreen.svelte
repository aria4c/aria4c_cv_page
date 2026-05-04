<script lang="ts">
	import BBSFrame from '$lib/bbs/components/layout/BBSFrame.svelte';
	import BackPrompt from '$lib/bbs/components/navigation/BackPrompt.svelte';
	import RowRevealImage from '$lib/bbs/components/effects/RowRevealImage.svelte';
	import Badge from '$lib/bbs/components/primitives/Badge.svelte';
	import Typewriter from '$lib/bbs/components/effects/Typewriter.svelte';
	import Divider from '$lib/bbs/components/primitives/Divider.svelte';
	import LocationMap from '$lib/bbs/components/primitives/LocationMap.svelte';
	import { languages } from '../../content/languages.js';
	import { practiceDomains, profile } from '../../content/profile.js';
</script>

<BBSFrame title="ABOUT ME">
	<div style="display: flex; gap: 1.5rem; height: 100%; overflow: hidden;">

		<!-- Left column: photo -->
		<div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 0.75rem; padding: 0.5rem 0; width: 14rem;">
			<RowRevealImage src="/photo.jpg" alt={profile.name} />
			<div style="color: var(--bbs-muted);">──────────────</div>
			<Badge label="STATUS: ONLINE" variant="success" blink={profile.available} />
		</div>

		<!-- Right column: info -->
		<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.5rem; padding: 0.5rem 0; overflow: hidden;">

			<div style="color: var(--bbs-primary); font-size: var(--bbs-font-size-lg);">
				{profile.name}
			</div>
			<div style="color: var(--bbs-secondary);">{profile.title}</div>

			<Divider />

			<div
				style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; justify-content: space-between;"
			>
				<div style="flex: 1; min-width: 11rem; display: flex; flex-direction: column; gap: 0.25rem; color: var(--bbs-fg);">
					<div>&gt; Location  : {profile.location}</div>
					<div>&gt; Available :&nbsp;<Badge
						label={profile.available ? 'YES' : 'NO'}
						variant={profile.available ? 'success' : 'error'}
						blink={profile.available}
					/></div>
					<div>&gt; Experience: {profile.yearsExperience} years</div>
					<div class="domains-line">&gt; Domains : &nbsp;<span>{practiceDomains.join(' · ')}</span></div>
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
				<div style="flex-shrink: 0; width: 12rem; max-width: 100%;">
					<LocationMap
						latitude={profile.latitude}
						longitude={profile.longitude}
						highlightCountryName={profile.mapCountryName}
						label="Map highlighting {profile.mapCountryName}, location marked"
					/>
				</div>
			</div>

			<Divider />

			<div style="flex: 1; min-height: 0; overflow: hidden; color: var(--bbs-fg);">
				<Typewriter text={profile.bio} startDelay={600} />
			</div>

			{#if profile.available}
				<div style="margin-top: 0.5rem;">
					Currently: <Badge label="OPEN TO OPPORTUNITIES" variant="success" blink />
				</div>
			{/if}
		</div>
	</div>

	<svelte:fragment slot="footer">
		<BackPrompt />
	</svelte:fragment>
</BBSFrame>

<style>
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
</style>
