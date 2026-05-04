<script lang="ts">
	export let src: string;
	export let alt: string = '';
	export let rows: number = 60;
	export let duration: number = 700;

	let loadFailed = false;

	/** New `src` → retry load (e.g. hot reload, deploy path fix). */
	$: {
		src;
		loadFailed = false;
	}

	function onImgError(): void {
		loadFailed = true;
	}
</script>

<div class="wrap" class:wrap--failed={loadFailed}>
	<!--
	 Do not put `animation: <name> …` on the element: scoped @keyframes names are rewritten,
	 but inline styles are not, so the clip-path reveal would never run (image stays invisible).
	 Animation name stays in scoped CSS; duration + steps() stay inline (computable from props).
-->
	<img
		class="rr-img"
		class:rr-img--hidden={loadFailed}
		{src}
		{alt}
		style="animation-duration: {duration}ms; animation-timing-function: steps({rows}, end);"
		on:error={onImgError}
	/>

	{#if loadFailed}
		<div class="load-fallback" role="status" aria-live="polite">
			<span class="load-fallback__chev">&gt;</span>
			<span class="load-fallback__text">PHOTO LOADING</span>
			<span class="load-fallback__dots" aria-hidden="true">...</span>
		</div>
	{/if}
</div>

<style>
	.wrap {
		overflow: hidden;
		border: 1px solid var(--bbs-primary);
		line-height: 0;
		position: relative;
	}

	.wrap--failed {
		min-height: 12rem;
		background: color-mix(in srgb, var(--bbs-bg) 92%, var(--bbs-muted));
	}

	.rr-img {
		display: block;
		width: 100%;
		clip-path: inset(0 0 100% 0);
		animation-name: rr-scan;
		animation-fill-mode: forwards;
	}

	.rr-img--hidden {
		display: none;
	}

	.load-fallback {
		box-sizing: border-box;
		min-height: inherit;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 1rem 0.5rem;
		font-family: var(--bbs-font);
		font-size: var(--bbs-font-size-sm);
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--bbs-secondary);
		line-height: var(--bbs-line-height);
		animation: load-blink 720ms step-end infinite;
	}

	.load-fallback__chev {
		letter-spacing: 0;
		color: var(--bbs-muted);
		font-weight: 600;
	}

	.load-fallback__text {
		letter-spacing: 0.24em;
		color: var(--bbs-fg);
		font-weight: 600;
	}

	.load-fallback__dots {
		letter-spacing: 0.12em;
		margin-inline-start: 0.1em;
		color: var(--bbs-muted);
	}

	@keyframes load-blink {
		0%, 49% {
			opacity: 1;
		}
		50%, 100% {
			opacity: 0.2;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.load-fallback {
			animation: none;
			opacity: 0.88;
		}
	}

	@keyframes rr-scan {
		from {
			clip-path: inset(0 0 100% 0);
		}
		to {
			clip-path: inset(0 0 0% 0);
		}
	}
</style>
