<script lang="ts">
	export let loadOverlay = false;

	const ATOM =
		'ｱｲｳｴｵｶｸｹｺｻｼｽｾｿﾀﾁﾂｧｨｩｪｫｬｭｮｯｰ0123456789XYZﾊﾋﾌﾏﾗﾜ日';

	const COLUMN_COUNT = 28;

	type Strip = {
		seq: readonly string[];
		durSec: number;
		delaySec: number;
	};

	function rngPick(): string {
		const i = Math.floor(Math.random() * ATOM.length);
		return ATOM.slice(i, i + 1) || 'ｱ';
	}

	function strip(): Strip {
		const len = 20 + Math.floor(Math.random() * 16);
		const seq = Array.from({ length: len }, rngPick);
		return {
			seq,
			durSec: 3.6 + Math.random() * 4.8,
			delaySec: -Math.random() * 7
		};
	}

	const columns: Strip[] = Array.from({ length: COLUMN_COUNT }, strip);
</script>

<div
	class="matrix-rain"
	class:matrix-rain--overlay={loadOverlay}
	aria-hidden="true"
>
	{#each columns as col, ci (ci)}
		<div class="mr-col">
			<div
				class="mr-stream"
				style="animation-duration: {col.durSec}s; animation-delay: {col.delaySec}s;"
			>
				{#each [...col.seq, ...col.seq] as g, gi (gi)}
					<span class="mr-cell">{g}</span>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.matrix-rain {
		position: fixed;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 1px;
		padding: 0 4px;
		overflow: hidden;
		opacity: 0.3;
		font-family: var(--bbs-font);
	}

	.matrix-rain--overlay {
		z-index: 5;
		opacity: 0.5;
		pointer-events: auto;
	}

	.mr-col {
		flex: 1 1 0;
		min-width: 0;
		height: 100%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		mask-image: linear-gradient(
			to bottom,
			transparent 0%,
			black 12%,
			black 88%,
			transparent 100%
		);
	}

	.mr-stream {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1;
		color: var(--bbs-primary);
		font-size: var(--bbs-font-size-sm);
		text-shadow:
			0 0 4px color-mix(in srgb, var(--bbs-primary) 60%, transparent),
			0 0 14px color-mix(in srgb, var(--bbs-success) 25%, transparent);
		animation-name: mr-fall;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		will-change: transform;
	}

	.mr-cell {
		display: block;
		opacity: 0.55;
		padding: 1px 0;
	}

	@keyframes mr-fall {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-50%);
		}
	}
</style>
