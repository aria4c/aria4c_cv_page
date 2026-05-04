<!--
  BBSFrame — the main screen wrapper used by every CV screen.
  Renders a full-height box with a title in the top border and
  a footer row in the bottom border.
-->
<script lang="ts">
	import type { BorderStyle, BBSConfig } from '../../types/config.js';
	import { getChars } from '../../utils/box-drawing.js';
	import { configStore } from '../../stores/config.store.js';
	import {
		matrixLockedStore,
		themeModeStore,
		type ThemeMode
	} from '../../stores/theme.store.js';

	export let title:      string      = '';
	export let subtitle:   string      = '';
	export let borderStyle: BorderStyle | undefined = undefined;
	/** When true, append `[H] HOME`, optional `[T] DAY|NIGHT`, `[Q] QUIT` from config (top-right cluster). */
	export let showGlobalNavHints: boolean = true;

	const FILL = '═'.repeat(300);
	const FILL_S = '─'.repeat(300);
	const FILL_H = '━'.repeat(300);

	function globalNavHintsText(cfg: BBSConfig, mode: ThemeMode, matrixLocked: boolean): string {
		const n = cfg.navigation;
		const parts: string[] = [];
		parts.push(`[${n.homeKey}] HOME`);
		if (cfg.themeDay && n.themeToggleKey !== null && n.themeToggleKey !== '') {
			parts.push(
				matrixLocked
					? `[${n.themeToggleKey}] LOCK`
					: `[${n.themeToggleKey}] ${mode === 'day' ? 'NIGHT' : 'DAY'}`
			);
		}
		if (n.quitKey !== null && n.quitKey !== '') parts.push(`[${n.quitKey}] QUIT`);
		return parts.join('  ');
	}

	$: bStyle = borderStyle ?? ($configStore.config?.theme.borders ?? 'double');
	$: c = getChars(bStyle);
	$: hFill = bStyle === 'single' ? FILL_S : bStyle === 'heavy' ? FILL_H : FILL;

	$: cfg = $configStore.config;
	$: navHints =
		showGlobalNavHints && cfg ? globalNavHintsText(cfg, $themeModeStore, $matrixLockedStore) : '';

	$: rightRail =
		navHints && subtitle
			? `${subtitle}  │  ${navHints}`
			: navHints || subtitle;
</script>

<div
	class="bbs-frame"
	style="
		display: flex;
		flex-direction: column;
		height: 100%;
		font-family: var(--bbs-font);
		overflow: hidden;
	"
>
	<!-- Top title bar: ╔══[ TITLE ]══════════════════[ SUBTITLE ]══╗ -->
	<div class="border-row" style="color: var(--bbs-primary); flex-shrink: 0;">
		<span>{c.tl}</span>
		{#if title}<span class="no-shrink">&nbsp;{title}&nbsp;</span>{/if}
		<span class="h-fill">{hFill}</span>
		{#if rightRail}<span class="no-shrink">&nbsp;{rightRail}&nbsp;</span>{/if}
		<span>{c.tr}</span>
	</div>

	<!-- Content area with side borders -->
	<div class="content-area">
		<span class="side-border" style="color: var(--bbs-primary);">{c.v}</span>
		<div class="inner" style="flex: 1; min-width: 0; overflow: hidden; padding: 0.5rem 1rem;">
			<slot />
		</div>
		<span class="side-border" style="color: var(--bbs-primary);">{c.v}</span>
	</div>

	<!-- Footer row (optional slot, e.g. BackPrompt) -->
	{#if $$slots.footer}
		<div class="divider-row" style="color: var(--bbs-primary); flex-shrink: 0;">
			<span>{c.ml}</span>
			<span class="h-fill">{hFill}</span>
			<span>{c.mr}</span>
		</div>
		<div class="footer-area">
			<span class="side-border" style="color: var(--bbs-primary);">{c.v}</span>
			<div style="flex: 1; min-width: 0; padding: 0.25rem 1rem; overflow: hidden;">
				<slot name="footer" />
			</div>
			<span class="side-border" style="color: var(--bbs-primary);">{c.v}</span>
		</div>
	{/if}

	<!-- Bottom border: ╚════════════════════════════════════════╝ -->
	<div class="border-row" style="color: var(--bbs-primary); flex-shrink: 0;">
		<span>{c.bl}</span>
		<span class="h-fill">{hFill}</span>
		<span>{c.br}</span>
	</div>
</div>

<style>
	.bbs-frame {
		box-sizing: border-box;
	}
	.border-row, .divider-row {
		display: flex;
		align-items: center;
		white-space: nowrap;
		overflow: hidden;
		line-height: 1;
	}
	.content-area, .footer-area {
		display: flex;
		flex: 1;
		overflow: hidden;
		align-items: stretch;
	}
	.footer-area {
		flex: 0 0 auto;
	}
	.side-border {
		flex-shrink: 0;
		align-self: stretch;
	}
	.h-fill {
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
	}
	.no-shrink {
		flex-shrink: 0;
	}
</style>
