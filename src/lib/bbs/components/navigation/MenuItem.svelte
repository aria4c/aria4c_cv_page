<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ScreenDefinition } from '../../types/config.js';

	export let screen:   ScreenDefinition;
	export let active:   boolean = false;
	export let menuStyle: 'numbered' | 'lettered' | 'both' = 'numbered';
	export let enableClick: boolean = true;

	const dispatch = createEventDispatcher<{ select: string }>();

	$: inactive = screen.menuInactive === true;

	let hovered = false;

	function handleClick() {
		if (inactive || !enableClick) return;
		dispatch('select', screen.id);
	}

	$: keyLabel = menuStyle === 'both'
		? screen.menuKey
		: screen.menuKey;

	$: icon = screen.menuIcon ?? ' ';

	$: highlighted = !inactive && (active || (hovered && enableClick));

	$: muted = inactive && !highlighted;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="menu-item"
	class:active={active && !inactive}
	class:menu-item--inactive={inactive}
	role="button"
	tabindex={inactive ? -1 : 0}
	aria-disabled={inactive ? 'true' : 'false'}
	on:click={handleClick}
	on:mouseenter={() => { hovered = true; }}
	on:mouseleave={() => { hovered = false; }}
	on:keypress={(e) => {
		if (!inactive && e.key === 'Enter') handleClick();
	}}
	style="
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.2rem 0.5rem;
		pointer-events: {inactive ? 'none' : 'auto'};
		cursor: {inactive ? 'default' : enableClick ? 'pointer' : 'default'};
		background: {highlighted ? 'var(--bbs-highlight)' : 'transparent'};
		color: {highlighted ? 'var(--bbs-highlight-text)' : muted ? 'var(--bbs-muted)' : 'var(--bbs-fg)'};
		font-family: var(--bbs-font);
		line-height: var(--bbs-line-height);
		user-select: none;
		white-space: nowrap;
		overflow: hidden;
		outline: none;
	"
>
	<span
		style="color: {highlighted
			? 'var(--bbs-highlight-text)'
			: muted
				? 'var(--bbs-muted)'
				: 'var(--bbs-primary)'}; flex-shrink: 0;"
		>[{keyLabel}]</span
	>
	<span
		style="color: {highlighted
			? 'var(--bbs-highlight-text)'
			: muted
				? 'var(--bbs-muted)'
				: 'var(--bbs-secondary)'}; flex-shrink: 0;"
		>{icon}</span
	>
	<span style="flex: 1; overflow: hidden; text-overflow: ellipsis;">{screen.menuLabel}</span>
</div>
