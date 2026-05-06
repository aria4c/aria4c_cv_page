<script lang="ts">
	import '../app.css';
	import BBSRoot from '$lib/bbs/components/layout/BBSRoot.svelte';
	import StatusBar from '$lib/bbs/components/layout/StatusBar.svelte';
	import CRTOverlay from '$lib/bbs/components/effects/CRTOverlay.svelte';
	import MatrixRain from '$lib/bbs/components/effects/MatrixRain.svelte';
	import MobileTouchNav from '$lib/bbs/components/navigation/MobileTouchNav.svelte';
	import { bbsConfig } from '../bbs.config.js';
	import { currentScreen, matrixNavigationRainStore } from '$lib/bbs';

	const defaultTitle = 'Illya Arefiev — Full Stack Engineer · SaaS & AI consultant';
	const defaultDesc  =
		'Full stack engineer & SaaS / AI consultant — LLM integrations, RAG, product APIs, microservices & eCommerce, mobile backends. PHP · Laravel · cloud · data · résumé BBS.';

	$: seoTitle = $currentScreen?.seo?.title       ?? defaultTitle;
	$: seoDesc  = $currentScreen?.seo?.description ?? defaultDesc;
</script>

<svelte:head>
	<title>{seoTitle}</title>
	<meta name="description" content={seoDesc} />
</svelte:head>

<BBSRoot config={bbsConfig}>
	<!-- CRT overlay sits on top of everything -->
	<CRTOverlay config={bbsConfig.effects.crt} />

	{#if $matrixNavigationRainStore}
		<MatrixRain loadOverlay />
	{/if}

	{#if bbsConfig.statusBar.position === 'top' || bbsConfig.statusBar.position === 'both'}
		<StatusBar statusBarConfig={bbsConfig.statusBar} system={bbsConfig.system} />
	{/if}

	<main
		style="
			flex: 1;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			min-height: 0;
			position: relative;
			z-index: 2;
		"
	>
		<slot />
	</main>

	<MobileTouchNav />

	{#if bbsConfig.statusBar.position === 'bottom' || bbsConfig.statusBar.position === 'both'}
		<StatusBar statusBarConfig={bbsConfig.statusBar} system={bbsConfig.system} />
	{/if}
</BBSRoot>
