<script lang="ts">
	import { navigationStore, navigate } from '$lib/bbs/stores/navigation.store.js';
	import { bbsConfig } from '../bbs.config.js';

	// Layout components
	import SplashScreen    from '$lib/bbs/components/layout/SplashScreen.svelte';

	// CV screens
	import MainMenuScreen   from './screens/MainMenuScreen.svelte';
	import AboutScreen      from './screens/AboutScreen.svelte';
	import ExperienceScreen from './screens/ExperienceScreen.svelte';
	import SkillsScreen     from './screens/SkillsScreen.svelte';
	import ProjectsScreen   from './screens/ProjectsScreen.svelte';
	import ContactScreen    from './screens/ContactScreen.svelte';
	import InvadersScreen   from './screens/InvadersScreen.svelte';

	$: currentScreenId = $navigationStore.currentScreenId;
	$: transitioning   = $navigationStore.transitioning;

	function onSplashComplete() {
		navigate(bbsConfig.screens.home);
	}
</script>

<div
	class="screen-container"
	style="
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		min-height: 0;
		opacity: {transitioning ? 0 : 1};
		transition: opacity 120ms ease;
		padding: {currentScreenId === 'splash' || currentScreenId === 'invaders' ? '0' : '0.75rem'};
	"
>
	{#if currentScreenId === 'splash'}
		<SplashScreen config={bbsConfig.splash} on:complete={onSplashComplete} />
	{:else if currentScreenId === 'main'}
		<MainMenuScreen />
	{:else if currentScreenId === 'about'}
		<AboutScreen />
	{:else if currentScreenId === 'experience'}
		<ExperienceScreen />
	{:else if currentScreenId === 'skills'}
		<SkillsScreen />
	{:else if currentScreenId === 'projects'}
		<ProjectsScreen />
	{:else if currentScreenId === 'contact'}
		<ContactScreen />
	{:else if currentScreenId === 'invaders'}
		<InvadersScreen />
	{/if}
</div>
