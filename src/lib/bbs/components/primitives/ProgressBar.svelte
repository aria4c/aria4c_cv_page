<script lang="ts">
	import { onMount } from 'svelte';

	export let value:               number   = 0;
	export let width:               number   = 20;
	export let fillChar:            string   = '█';
	export let emptyChar:           string   = '░';
	export let showValue:           boolean  = true;
	export let showPercent:         boolean | undefined = undefined;
	export let label:               string   = '';
	export let labelWidth:          number   = 14;
	export let truncateLabel:       boolean  = false;
	export let animated:            boolean  = true;
	export let animDelay:           number   = 0;
	export let displayMode:         'percent' | 'years' | 'timeline' = 'percent';
	export let scaleMax:            number   = 100;
	export let timelineCareerYears: number   = 1;
	export let timelineFrom:        number   = 0;
	export let timelineTo:          number   = 0;
	/** Fixed label lane in `ch`; >0 uses grid so bar column lines up across rows (parent should set ≥ longest label) */
	export let labelAlignCols:      number   = 0;
	/** Label on line 1 (full wrap), bar + trailing value on line 2 — e.g. `SkillsScreen` mobile */
	export let splitLabelBar:       boolean  = false;
	/** With `splitLabelBar`, pin the bar row to the right (`align-self: flex-end`) */
	export let splitBarTrailing:    boolean  = false;

	const LABEL_GAP_SPACES = 2;

	$: showVal = showPercent !== undefined ? showPercent : showValue;

	let displayedPctOrYears = 0;
	let timelineT = 0;

	function labelCellTrim(s: string, w: number, truncate: boolean): string {
		if (!s) return '';
		const gapTail = LABEL_GAP_SPACES;
		if (truncate && w > 0) {
			const cell = s.length >= w ? s.slice(0, w) : s + ' '.repeat(w - s.length);
			return cell + ' '.repeat(gapTail);
		}
		if (w <= 0) return s + ' '.repeat(gapTail);
		if (s.length >= w) return s + ' '.repeat(gapTail);
		return s + ' '.repeat(w - s.length + gapTail);
	}

	/** Monospace lane: pad short, trim long to never break column width */
	function labelLane(s: string, cols: number): string {
		if (!s) return ' '.repeat(Math.max(1, cols));
		if (cols <= 0) return s;
		return s.length >= cols ? s.slice(0, cols) : s + ' '.repeat(cols - s.length);
	}

	function buildTimelineCells(from: number, to: number, careerSpan: number, w: number): string {
		const span = Math.max(careerSpan, 0.0001);
		let s = '';
		for (let i = 0; i < w; i++) {
			const cellA = (i / w) * span;
			const cellB = ((i + 1) / w) * span;
			const overlaps = Math.min(cellB, to) > Math.max(cellA, from);
			s += overlaps ? fillChar : emptyChar;
		}
		return s;
	}

	function overlapDuration(from: number, to: number, careerSpan: number): number {
		return Math.max(0, Math.min(to, careerSpan) - Math.max(0, from));
	}

	function fmtYR(x: number): string {
		const r = Math.round(x * 10) / 10;
		return Number.isInteger(r) || Math.abs(r - Math.round(r)) < 1e-6 ? String(Math.round(r)) : r.toFixed(1);
	}

	/** Monospace run before `y` so `8y` / `11y` / `8.5y` keep the bar + tail width stable */
	const TIMELINE_SUFFIX_NUM_CH = 5;

	function timelineSuffix(from: number, to: number, careerSpan: number): string {
		const ov = overlapDuration(from, to, careerSpan);
		const n = fmtYR(ov);
		return `${n.padStart(TIMELINE_SUFFIX_NUM_CH)}y`;
	}

	function formatYearLabel(v: number): string {
		const step = 0.1;
		const r = Math.round(v / step) * step;
		const s = Number.isInteger(r) || Math.abs(r - Math.round(r)) < step / 2
			? String(Math.round(r))
			: r.toFixed(1);
		return s.padStart(4) + 'y';
	}

	$: career = Math.max(timelineCareerYears, 0.0001);
	$: clipFrom =
		displayMode === 'timeline'
			? Math.max(0, Math.min(Math.min(timelineFrom, timelineTo), career))
			: 0;
	$: clipToTarget =
		displayMode === 'timeline'
			? Math.max(timelineFrom, Math.min(Math.max(timelineTo, timelineFrom), career))
			: career;

	$: timelineEaseFactor = displayMode === 'timeline' && !animated ? 1 : timelineT;
	$: timelineDrawEnd =
		displayMode === 'timeline'
			? clipFrom + (clipToTarget - clipFrom) * timelineEaseFactor
			: career;

	onMount(() => {
		displayedPctOrYears = !animated ? value : 0;
		timelineT = 0;

		if (displayMode === 'timeline') {
			if (!animated) {
				timelineT = 1;
				return;
			}
			timelineT = 0;
			const t0 = performance.now() + animDelay;
			const duration = 800;

			function tick(now: number) {
				if (now < t0) {
					requestAnimationFrame(tick);
					return;
				}
				const raw = Math.min((now - t0) / duration, 1);
				timelineT = 1 - Math.pow(1 - raw, 3);
				if (raw < 1) requestAnimationFrame(tick);
				else timelineT = 1;
			}
			requestAnimationFrame(tick);
			return;
		}

		if (!animated) {
			displayedPctOrYears = value;
			return;
		}
		const t0 = performance.now() + animDelay;
		const duration = 800;

		function tick(now: number) {
			if (now < t0) {
				requestAnimationFrame(tick);
				return;
			}
			const progress = Math.min((now - t0) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			const target = displayMode === 'percent' ? Math.round(value * eased) : value * eased;
			displayedPctOrYears = target;
			if (progress < 1) requestAnimationFrame(tick);
			else displayedPctOrYears = value;
		}
		requestAnimationFrame(tick);
	});

	$: cap = displayMode === 'percent' ? 100 : Math.max(scaleMax, 0.0001);

	$: timelineDrawEndClipped =
		displayMode === 'timeline' ? Math.min(timelineDrawEnd, clipToTarget) : career;

	$: bar =
		displayMode === 'timeline'
			? buildTimelineCells(clipFrom, timelineDrawEndClipped, career, width)
			: (() => {
					const filledCell = Math.min(
						width,
						Math.max(0, Math.round((displayedPctOrYears / cap) * width)),
					);
					return fillChar.repeat(filledCell) + emptyChar.repeat(width - filledCell);
			  })();

	$: pctTxt = String(Math.round(displayedPctOrYears)).padStart(3, ' ') + '%';
	$: yTxt = formatYearLabel(displayedPctOrYears);

	$: valueSuffix =
		displayMode === 'percent'
			? pctTxt
			: displayMode === 'years'
				? yTxt
				: timelineSuffix(clipFrom, timelineDrawEndClipped, career);

	$: gridCols = `${Math.max(labelAlignCols, 1)}ch minmax(0, max-content)`;
</script>

{#if splitLabelBar && label}
	<div class="pbs pbs-split-label-bar">
		<div class="pbs-split-label">{label}</div>
		<div
			class="pbs-split-tail"
			class:pbs-split-tail--trailing={splitBarTrailing}
		>
			<span class="pbs-bar-glyphs">{bar}</span>
			{#if showVal}
				<span class="pbs-bar-gap">&nbsp;&nbsp;</span>
				<span class="pbs-value-suffix">{valueSuffix}</span>
			{/if}
		</div>
	</div>
{:else if labelAlignCols > 0 && label}
	<div
		class="pbs pbs-aligned"
		style="
			display: grid;
			grid-template-columns: {gridCols};
			column-gap: 0.5rem;
			align-items: baseline;
			font-family: var(--bbs-font);
			color: var(--bbs-fg);
			line-height: var(--bbs-line-height);
		"
	>
		<span class="pbs-lane-label" style="white-space: pre; overflow: hidden;">{labelLane(label, labelAlignCols)}</span>
		<!-- white-space:pre on .pbs-bar-cell — keep this span on one line to avoid accidental blank cells -->
		<span class="pbs-bar-cell"><span class="pbs-bar-glyphs" style="color: var(--bbs-primary);">{bar}</span>{#if showVal}<span class="pbs-bar-gap">&nbsp;&nbsp;</span><span class="pbs-value-suffix">{valueSuffix}</span>{/if}</span>
	</div>
{:else}
	<div
		class="pbs"
		style="font-family: var(--bbs-font); white-space: pre; color: var(--bbs-fg); line-height: var(--bbs-line-height);"
	>
		{#if label}{labelCellTrim(label, labelWidth, truncateLabel)}{/if}<span style="color: var(--bbs-primary);">{bar}</span>{#if showVal}<span class="pbs-bar-gap">&nbsp;&nbsp;</span><span class="pbs-value-suffix">{valueSuffix}</span>{/if}
	</div>
{/if}

<style>
	/*
		Narrow grids (wide label lane + bar + suffix): use a compact scale for bar + trailing value so
		overlap text like "15y" is not clipped by ancestor overflow:hidden.
	*/
	.pbs-aligned .pbs-bar-cell {
		display: inline-block;
		white-space: pre;
		font-size: var(--bbs-font-size-sm);
		line-height: var(--bbs-line-height);
		vertical-align: baseline;
	}

	.pbs-value-suffix {
		font-size: var(--bbs-font-size-sm);
		color: var(--bbs-secondary);
	}

	/* Split label / bar rows (mobile skills): full-label wrap + optional right-aligned monospace tail */
	.pbs-split-label-bar {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		align-items: stretch;
		min-width: 0;
		max-width: 100%;
		box-sizing: border-box;
		font-family: var(--bbs-font);
		line-height: var(--bbs-line-height);
		color: var(--bbs-fg);
	}

	.pbs-split-label {
		align-self: stretch;
		color: var(--bbs-secondary);
		font-size: var(--bbs-font-size-sm);
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.pbs-split-tail {
		display: inline-flex;
		align-items: baseline;
		align-self: flex-start;
		white-space: pre;
		font-size: calc(var(--bbs-font-size-sm) * 0.94);
		min-width: 0;
	}

	.pbs-split-tail--trailing {
		align-self: flex-end;
	}

	.pbs-split-tail .pbs-bar-glyphs {
		color: var(--bbs-primary);
	}
</style>
