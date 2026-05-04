<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import type { ScreenDefinition } from '../../types/config.js';
	import MenuItem from './MenuItem.svelte';
	import { register, unregister } from '../../utils/keyboard.js';
	import { configStore } from '../../stores/config.store.js';

	export let items:       ScreenDefinition[];
	export let activeIndex: number = -1;

	const dispatch = createEventDispatcher<{ select: string }>();

	$: navConfig = $configStore.config?.navigation;
	$: menuStyle = navConfig?.menuStyle ?? 'numbered';
	$: enableClick = navConfig?.enableClick ?? true;
	$: enableKeyboard = navConfig?.enableKeyboard ?? true;

	let keyIds: symbol[] = [];

	function select(id: string) {
		dispatch('select', id);
	}

	function findFirstEnabledIndex(): number {
		for (let i = 0; i < items.length; i++) {
			if (!items[i]?.menuInactive) return i;
		}
		return -1;
	}

	function findLastEnabledIndex(): number {
		for (let i = items.length - 1; i >= 0; i--) {
			if (!items[i]?.menuInactive) return i;
		}
		return -1;
	}

	function moveUp() {
		const n = items.length;
		if (!n) return;

		if (activeIndex < 0) {
			activeIndex = findLastEnabledIndex();
			return;
		}

		let idx = activeIndex;
		for (let k = 0; k < n; k++) {
			idx = (idx - 1 + n) % n;
			if (!items[idx]?.menuInactive) {
				activeIndex = idx;
				return;
			}
		}
	}

	function moveDown() {
		const n = items.length;
		if (!n) return;

		if (activeIndex < 0) {
			activeIndex = findFirstEnabledIndex();
			return;
		}

		let idx = activeIndex;
		for (let k = 0; k < n; k++) {
			idx = (idx + 1) % n;
			if (!items[idx]?.menuInactive) {
				activeIndex = idx;
				return;
			}
		}
	}

	function confirmSelection() {
		if (activeIndex < 0 || activeIndex >= items.length) return;
		const item = items[activeIndex];
		if (item?.menuInactive) return;
		select(item.id);
	}

	onMount(() => {
		if (!enableKeyboard) return;

		// Register per-item hotkeys (inactive rows are not reachable by shortcut)
		for (const item of items) {
			if (item.menuInactive) continue;
			keyIds.push(register(item.menuKey, () => select(item.id), 2));
		}

		// Arrow navigation
		keyIds.push(register('ARROWUP',   moveUp,            2));
		keyIds.push(register('ARROWDOWN', moveDown,          2));
		keyIds.push(register('ENTER',     confirmSelection,  2));
	});

	onDestroy(() => {
		for (const id of keyIds) unregister(id);
	});
</script>

<div class="main-menu" style="font-family: var(--bbs-font);">
	<slot name="header" />

	{#each items as item, i}
		<MenuItem
			screen={item}
			active={i === activeIndex}
			{menuStyle}
			{enableClick}
			on:select={(e) => select(e.detail)}
		/>
	{/each}

	<slot name="footer" />
</div>
