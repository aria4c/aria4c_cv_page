<script lang="ts">
	import type { BorderStyle } from '../../types/config.js';
	import { getChars, getInnerChars } from '../../utils/box-drawing.js';
	import { configStore } from '../../stores/config.store.js';

	export let label:  string      = '';
	/** 'full' = ─────── (no connectors), 'connector' = ╠═══════╣ */
	export let style:  'full' | 'connector' = 'full';
	export let bStyle: BorderStyle | undefined = undefined;

	const FILL = '═'.repeat(300);
	const FILL_S = '─'.repeat(300);

	$: bs = bStyle ?? ($configStore.config?.theme.borders ?? 'double');
	$: c  = style === 'connector' ? getChars(bs) : getInnerChars(bs);
	$: hFill = bs === 'single' ? FILL_S : FILL;
</script>

<div
	class="divider"
	style="display: flex; align-items: center; white-space: nowrap; overflow: hidden; color: var(--bbs-primary); line-height: 1;"
>
	{#if style === 'connector'}
		<span style="flex-shrink:0;">{c.ml}</span>
	{/if}
	{#if label}
		<span style="flex:1; overflow:hidden;">{hFill}</span>
		<span style="flex-shrink:0;">&nbsp;{label}&nbsp;</span>
		<span style="flex:1; overflow:hidden;">{hFill}</span>
	{:else}
		<span style="flex:1; overflow:hidden;">{hFill}</span>
	{/if}
	{#if style === 'connector'}
		<span style="flex-shrink:0;">{c.mr}</span>
	{/if}
</div>
