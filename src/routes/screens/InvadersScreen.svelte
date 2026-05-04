<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import BBSFrame from '$lib/bbs/components/layout/BBSFrame.svelte';
	import BackPrompt from '$lib/bbs/components/navigation/BackPrompt.svelte';
	import { register, unregister } from '$lib/bbs/utils/keyboard.js';

	const COLS = 72;
	const ROWS = 24;
	const PLAYER_ROW = ROWS - 2;
	const TICK_MS = 55;
	const SHOT_GAP_MS = 95;
	const MAG_MAX = 8;
	const INTRO_HOLD_MS = 2600;
	const RELOAD_MS_PER_SHELL = 760;
	const CHAR_ASPECT = 0.58;

	type Cell = { r: number; c: number };

	type Phase = 'levelSplash' | 'playing' | 'failed';

	let aliens: Cell[] = [];
	let bullets: Cell[] = [];
	let playerC = Math.floor(COLS / 2);
	let alienDir = 1;
	let alienSub = 0;
	let score = 0;
	let wave = 1;
	let phase: Phase = 'levelSplash';
	let lastShot = 0;
	let renderNonce = 0;
	let raf = 0;
	let accum = 0;
	let prev = 0;
	let ids: symbol[] = [];
	let introTimer: ReturnType<typeof setTimeout> | null = null;
	let shells = MAG_MAX;
	let reloadAccum = 0;
	let arenaW = 0;
	let arenaH = 0;

	function alienStridePeriod(): number {
		return Math.max(6, 22 - Math.min(wave, 12));
	}

	function spawnWave(): void {
		aliens = [];
		const rows = wave > 12 ? 4 : 3;
		const inset = wave > 8 ? 2 : 4;
		const step = wave > 9 ? 2 : wave > 4 ? 3 : 4;
		for (let r = 0; r < rows; r++) {
			for (let c = inset + (r % 2); c < COLS - inset; c += step) {
				aliens.push({ r: 2 + r * 2, c });
			}
		}
		alienDir = 1;
		alienSub = 0;
	}

	function clearIntroTimer(): void {
		if (introTimer !== null) {
			clearTimeout(introTimer);
			introTimer = null;
		}
	}

	function scheduleIntroAutoAdvance(): void {
		clearIntroTimer();
		introTimer = setTimeout(() => dismissLevelIntro(), INTRO_HOLD_MS);
	}

	function queueLevelSplash(): void {
		phase = 'levelSplash';
		bullets = [];
		aliens = [];
		shells = MAG_MAX;
		reloadAccum = 0;
		renderNonce++;
		scheduleIntroAutoAdvance();
	}

	function dismissLevelIntro(): void {
		if (phase !== 'levelSplash') return;
		clearIntroTimer();
		shells = MAG_MAX;
		reloadAccum = 0;
		spawnWave();
		phase = 'playing';
		renderNonce++;
	}

	function resetRun(): void {
		clearIntroTimer();
		score = 0;
		wave = 1;
		phase = 'levelSplash';
		playerC = Math.floor(COLS / 2);
		alienDir = 1;
		alienSub = 0;
		bullets = [];
		aliens = [];
		shells = MAG_MAX;
		reloadAccum = 0;
		renderNonce++;
		scheduleIntroAutoAdvance();
	}

	function tryRestart(): void {
		if (phase !== 'failed') return;
		resetRun();
	}

	function tryDismissIntroOrShoot(now: number): void {
		if (phase === 'levelSplash') {
			dismissLevelIntro();
			return;
		}
		if (phase !== 'playing') return;
		fire(now);
	}

	function move(dx: number): void {
		if (phase !== 'playing') return;
		playerC = Math.max(2, Math.min(COLS - 3, playerC + dx));
		renderNonce++;
	}

	function fire(now: number): void {
		if (phase !== 'playing') return;
		if (shells <= 0) return;
		if (now - lastShot < SHOT_GAP_MS) return;
		lastShot = now;
		shells--;
		bullets.push({ r: PLAYER_ROW - 1, c: playerC });
		renderNonce++;
	}

	function marchAliens(): void {
		const hitR = alienDir > 0 && aliens.some((a) => a.c >= COLS - 2);
		const hitL = alienDir < 0 && aliens.some((a) => a.c <= 1);
		if (hitR || hitL) {
			aliens = aliens.map((a) => ({ r: a.r + 1, c: a.c }));
			alienDir *= -1;
		} else {
			aliens = aliens.map((a) => ({ r: a.r, c: a.c + alienDir }));
		}
	}

	function resolveHits(): void {
		const nextA = [...aliens];
		const nextB: Cell[] = [];
		for (const b of bullets) {
			let hit = false;
			for (let i = 0; i < nextA.length; i++) {
				const a = nextA[i];
				if (a.r === b.r && a.c === b.c) {
					nextA.splice(i, 1);
					score += 10 * wave;
					hit = true;
					break;
				}
			}
			if (!hit) nextB.push(b);
		}
		aliens = nextA;
		bullets = nextB;
	}

	function physicsStep(_now: number): void {
		if (phase !== 'playing') return;
		bullets = bullets
			.map((b) => ({ ...b, r: b.r - 1 }))
			.filter((b) => b.r >= 0);

		if (shells < MAG_MAX) {
			reloadAccum += TICK_MS;
			while (reloadAccum >= RELOAD_MS_PER_SHELL && shells < MAG_MAX) {
				reloadAccum -= RELOAD_MS_PER_SHELL;
				shells++;
			}
		} else {
			reloadAccum = 0;
		}

		resolveHits();
		if (!aliens.length) {
			wave++;
			queueLevelSplash();
			return;
		}
		alienSub++;
		if (alienSub >= alienStridePeriod()) {
			alienSub = 0;
			marchAliens();
		}
		for (const a of aliens) {
			if (a.r >= PLAYER_ROW || (a.r === PLAYER_ROW - 1 && Math.abs(a.c - playerC) <= 2)) {
				clearIntroTimer();
				phase = 'failed';
				break;
			}
		}
		renderNonce++;
	}

	function loop(t: number): void {
		if (!prev) prev = t;
		accum += t - prev;
		prev = t;
		while (accum >= TICK_MS) {
			accum -= TICK_MS;
			physicsStep(t);
		}
		raf = requestAnimationFrame(loop);
	}

	function assembleField(_nonce: number): string {
		const g: string[][] = [];
		for (let r = 0; r < ROWS; r++) {
			g.push(Array(COLS).fill(' '));
		}
		for (const a of aliens) {
			if (a.r >= 0 && a.r < ROWS && a.c >= 0 && a.c < COLS) g[a.r][a.c] = '▓';
		}
		for (const b of bullets) {
			if (b.r >= 0 && b.r < ROWS && b.c >= 0 && b.c < COLS && g[b.r][b.c] === ' ') g[b.r][b.c] = '│';
		}
		const pr = PLAYER_ROW;
		if (phase === 'playing' && pr >= 0 && pr < ROWS) {
			for (const d of [-1, 0, 1]) {
				const cc = playerC + d;
				if (cc >= 0 && cc < COLS) g[pr][cc] = '▀';
			}
		}
		return g.map((row) => row.join('')).join('\n');
	}

	$: playfield = assembleField(renderNonce);

	/** Thin recharge strip: full width while playing & mag topped up; partial while refilling; empty when idle overlay. */
	$: reloadLinePct =
		phase !== 'playing'
			? 0
			: shells >= MAG_MAX
				? 100
				: Math.min(100, (reloadAccum / RELOAD_MS_PER_SHELL) * 100);

	$: fpFromW = arenaW > 8 ? arenaW / (COLS * CHAR_ASPECT) : 14;
	$: fpFromH = arenaH > 8 ? arenaH / ROWS : 14;
	$: fieldFontPx =
		arenaW > 8 && arenaH > 8
			? Math.max(
					9,
					Math.min(72, ROWS * fpFromW <= arenaH * 1.02 ? fpFromW : fpFromH),
				)
			: 14;

	onMount(() => {
		resetRun();
		prev = performance.now();
		renderNonce++;

		const bind = (key: string, fn: () => void) => {
			ids.push(register(key, fn, 2));
		};

		bind('ARROWLEFT', () => move(-1));
		bind('ARROWRIGHT', () => move(1));
		bind('A', () => move(-1));
		bind('D', () => move(1));

		bind(' ', () => tryDismissIntroOrShoot(performance.now()));
		bind('X', () => tryDismissIntroOrShoot(performance.now()));
		bind('ENTER', dismissLevelIntro);

		bind('R', tryRestart);

		raf = requestAnimationFrame(loop);
	});

	onDestroy(() => {
		clearIntroTimer();
		cancelAnimationFrame(raf);
		for (const id of ids) unregister(id);
	});
</script>

<BBSFrame title="GRID DEFENDER" subtitle="">
	<div class="inv-bleed">
		<div class="inv-root">
			<div class="inv-hud-line">
				<span class="inv-led">●</span>
				SCORE {String(score).padStart(5, '0')} · WAVE {wave} · AMMO {phase === 'playing'
					? `${shells}/${MAG_MAX}`
					: phase === 'levelSplash'
						? `${MAG_MAX}/${MAG_MAX}`
						: '——'}
				{#if phase === 'levelSplash'}
					<span class="inv-chip"> READY</span>
				{/if}
			</div>

			<div
				class="inv-reload-line"
				class:inv-reload-line--idle={phase !== 'playing'}
				role="progressbar"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow={Math.round(reloadLinePct)}
				aria-label={phase === 'playing' ? 'Next pulse recharge' : 'Pulse recharge idle'}
			>
				<div class="inv-reload-line__track">
					<div class="inv-reload-line__fill" style:width="{reloadLinePct}%" />
				</div>
			</div>

			<div class="inv-stack" bind:clientWidth={arenaW} bind:clientHeight={arenaH}>
				<pre class="inv-field" style="font-size: {fieldFontPx}px">{playfield}</pre>

				{#if phase === 'levelSplash'}
					<div class="inv-overlay" role="presentation">
						<div class="inv-card inv-card-level">
							<div class="inv-level-num">LEVEL {wave}</div>
							<div class="inv-level-sub">
								UP-LINK SYNC · <span class="inv-strong">SPACE</span>
								· <span class="inv-strong">ENTER</span> · AUTO
							</div>
						</div>
					</div>
				{/if}

				{#if phase === 'failed'}
					<div class="inv-overlay" role="presentation">
						<div class="inv-card inv-card-fail">
							<div class="inv-fail-title">■■ SIGNAL LOST ■■</div>
							<div class="inv-fail-row">GRID OVERRUN — DEFENSIVE MATRIX BREACHED</div>
							<div class="inv-fail-stats">
								FINAL SCORE · {score} · DEEPEST WAVE · {wave}
							</div>
							<div class="inv-fail-hint"><span class="inv-strong">[R]</span> HARD RESET LINK</div>
							<div class="inv-fail-micro">EXIT WITH [B]</div>
						</div>
					</div>
				{/if}
			</div>

			<p class="inv-micro-hint">
				<code class="muted">←/→ A·D</code> VECTOR · <code class="muted">SPACE / X</code> PULSE · MAG
				{MAG_MAX} · AUTO-RECHARGE (BAR = NEXT CHARGE)
			</p>
		</div>
	</div>

	<svelte:fragment slot="footer">
		<BackPrompt />
	</svelte:fragment>
</BBSFrame>

<style>
	.inv-bleed {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		width: 100%;
		min-width: 0;
		height: 100%;
		box-sizing: border-box;
	}

	.inv-root {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		flex: 1;
		min-height: 0;
		min-width: 0;
		width: 100%;
		overflow: hidden;
		font-family: var(--bbs-font);
		line-height: 1;
	}

	.inv-hud-line {
		color: var(--bbs-secondary);
		font-size: var(--bbs-font-size-sm);
		flex-shrink: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
	}

	.inv-reload-line {
		flex-shrink: 0;
		width: 100%;
		max-width: 22rem;
		min-height: 5px;
		box-sizing: border-box;
		padding-block: 1px;
	}

	.inv-reload-line__track {
		height: 3px;
		border-radius: 1px;
		background: color-mix(in srgb, var(--bbs-muted) 55%, var(--bbs-bg));
		overflow: hidden;
	}

	.inv-reload-line__fill {
		height: 100%;
		border-radius: 1px;
		background: var(--bbs-primary);
		transition: width 70ms linear;
		will-change: width;
	}

	.inv-reload-line--idle .inv-reload-line__track {
		opacity: 0.45;
	}

	.inv-reload-line--idle .inv-reload-line__fill {
		transition-duration: 0ms;
	}

	.inv-led {
		color: var(--bbs-success);
	}

	.inv-chip {
		color: var(--bbs-warning);
		font-size: var(--bbs-font-size-sm);
	}

	.inv-stack {
		position: relative;
		flex: 1;
		min-height: min(420px, 55vh);
		min-width: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.inv-field {
		display: block;
		flex: 0 0 auto;
		margin-inline: auto;
		min-width: 0;
		max-height: 100%;
		overflow: hidden;
		text-align: left;
		white-space: pre;
		color: var(--bbs-fg);
		font-family: inherit;
		line-height: 1;
		tab-size: 1;
		user-select: none;
		width: max-content;
		max-width: 100%;
		box-sizing: border-box;
	}

	.inv-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--bbs-bg) 78%, transparent);
		border: 1px dashed var(--bbs-muted);
		box-sizing: border-box;
	}

	.inv-card {
		text-align: center;
		padding: clamp(1rem, 4vmin, 2.5rem) clamp(1.25rem, 5vmin, 3rem);
		border: 1px solid var(--bbs-primary);
		background: color-mix(in srgb, var(--bbs-bg) 92%, transparent);
		max-width: min(96vw, 44rem);
	}

	.inv-card-level .inv-level-num {
		font-size: clamp(1.4rem, 6vmin, 3rem);
		font-weight: 700;
		letter-spacing: 0.2em;
		color: var(--bbs-primary);
	}

	.inv-level-sub {
		margin-top: 0.85rem;
		color: var(--bbs-secondary);
		font-size: var(--bbs-font-size-sm);
	}

	.inv-card-fail {
		border-color: var(--bbs-error);
		box-shadow:
			0 0 0 1px color-mix(in srgb, var(--bbs-error) 35%, transparent),
			inset 0 0 2rem color-mix(in srgb, var(--bbs-error) 12%, transparent);
	}

	.inv-fail-title {
		color: var(--bbs-error);
		font-size: clamp(1rem, 4.8vmin, 2rem);
		font-weight: 700;
		letter-spacing: 0.12em;
	}

	.inv-fail-row,
	.inv-fail-stats {
		margin-top: 0.6rem;
		color: var(--bbs-secondary);
		font-size: var(--bbs-font-size-sm);
	}

	.inv-fail-hint {
		margin-top: 1rem;
		color: var(--bbs-primary);
		font-size: var(--bbs-font-size);
	}

	.inv-fail-micro {
		margin-top: 0.75rem;
		color: var(--bbs-muted);
		font-size: var(--bbs-font-size-sm);
	}

	.inv-strong {
		color: var(--bbs-primary);
		font-weight: 600;
	}

	.inv-micro-hint {
		margin: 0;
		color: var(--bbs-muted);
		font-size: calc(var(--bbs-font-size-sm) * 0.95);
		flex-shrink: 0;
		line-height: var(--bbs-line-height);
	}

	code.muted {
		color: var(--bbs-muted);
		font-family: inherit;
	}
</style>
