<script lang="ts">
	import BBSFrame from '$lib/bbs/components/layout/BBSFrame.svelte';
	import MainMenu from '$lib/bbs/components/navigation/MainMenu.svelte';
	import { getScreenChildren, configStore } from '$lib/bbs/stores/config.store.js';
	import { navigate } from '$lib/bbs/stores/navigation.store.js';
	import { bbsConfig } from '../../bbs.config.js';

	$: menuItems = getScreenChildren('main').filter((s) => s.showInMenu);

	let activeIndex = -1;

	function onSelect(screenId: string) {
		navigate(screenId);
	}
</script>

<BBSFrame title={bbsConfig.system.name}>
	<div style="padding: 1rem 0.5rem; display: flex; flex-direction: column; gap: 0.75rem; height: 100%;">

		<div style="color: var(--bbs-secondary); padding: 0 0.25rem;">
			{bbsConfig.system.welcomeMessage}
		</div>

		<div style="
			border: 1px solid var(--bbs-muted);
			padding: 0.5rem 0;
			flex: 1;
		">
			<MainMenu
				items={menuItems}
				bind:activeIndex
				on:select={(e) => onSelect(e.detail)}
			/>
		</div>

		<div style="color: var(--bbs-muted); font-size: var(--bbs-font-size-sm); padding: 0 0.25rem;">
			Press a number key or click an item.
		</div>
	</div>
</BBSFrame>
