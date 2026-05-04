<script lang="ts">
	import type { BorderStyle } from '../../types/config.js';
	import { getChars } from '../../utils/box-drawing.js';
	import { configStore } from '../../stores/config.store.js';

	export let title:      string      = '';
	export let subtitle:   string      = '';
	export let style:      BorderStyle | undefined = undefined;
	export let titleAlign: 'left' | 'center' | 'right' = 'left';
	export let dimmed:     boolean     = false;

	// Long fill strings — CSS clips to actual width
	const FILL = '═'.repeat(300);
	const FILL_S = '─'.repeat(300);
	const FILL_H = '━'.repeat(300);

	$: bStyle = style ?? ($configStore.config?.theme.borders ?? 'double');
	$: c = getChars(bStyle);
	$: hFill = bStyle === 'single' ? FILL_S : bStyle === 'heavy' ? FILL_H : FILL;
</script>

<div
	class="box-frame"
	style="
		display: flex;
		flex-direction: column;
		opacity: {dimmed ? 0.5 : 1};
		font-family: var(--bbs-font);
		width: 100%;
		min-width: 0;
	"
>
	<!-- Top border row -->
	<div class="border-row" style="color: var(--bbs-primary);">
		<span class="corner">{c.tl}</span>
		{#if title}
			{#if titleAlign === 'center' || titleAlign === 'right'}
				<span class="h-fill" style="overflow:hidden; white-space:nowrap;">{hFill}</span>
			{/if}
			<span class="no-shrink">&nbsp;{title}&nbsp;</span>
		{/if}
		<span class="h-fill" style="overflow:hidden; white-space:nowrap; flex:1;">{hFill}</span>
		{#if subtitle}
			<span class="no-shrink">&nbsp;{subtitle}&nbsp;</span>
		{/if}
		<span class="corner">{c.tr}</span>
	</div>

	<!-- Content row -->
	<div class="content-row">
		<span class="v-border" style="color: var(--bbs-primary);">{c.v}</span>
		<div class="inner-content">
			<slot />
		</div>
		<span class="v-border" style="color: var(--bbs-primary);">{c.v}</span>
	</div>

	<!-- Bottom border row -->
	<div class="border-row" style="color: var(--bbs-primary);">
		<span class="corner">{c.bl}</span>
		<span class="h-fill" style="overflow:hidden; white-space:nowrap; flex:1;">{hFill}</span>
		<span class="corner">{c.br}</span>
	</div>
</div>

<style>
	.box-frame {
		box-sizing: border-box;
	}
	.border-row {
		display: flex;
		align-items: center;
		white-space: nowrap;
		overflow: hidden;
		line-height: 1;
	}
	.content-row {
		display: flex;
		align-items: stretch;
		flex: 1;
		overflow: hidden;
	}
	.v-border {
		flex-shrink: 0;
		line-height: 1;
		align-self: stretch;
		display: flex;
		align-items: stretch;
	}
	.inner-content {
		flex: 1;
		min-width: 0;
		overflow: hidden;
	}
	.corner, .no-shrink {
		flex-shrink: 0;
	}
	.h-fill {
		flex-shrink: 1;
	}
</style>
