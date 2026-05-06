<script lang="ts">
	import { onMount } from 'svelte';

	export let art:       string  = '';
	export let color:     string  = 'var(--bbs-primary)';
	export let animate:   boolean = false;   // line-by-line reveal
	export let lineDelay: number  = 40;      // ms between lines

	const lines = art.split('\n');
	let revealed = animate ? 0 : lines.length;

	onMount(() => {
		if (!animate) return;
		let i = 0;
		const interval = setInterval(() => {
			i++;
			revealed = i;
			if (i >= lines.length) clearInterval(interval);
		}, lineDelay);
		return () => clearInterval(interval);
	});
</script>

<pre
	class="bbs-ascii-pre"
	style="
	font-family: var(--bbs-font);
	color: {color};
	margin: 0 auto;
	line-height: var(--bbs-line-height);
	white-space: pre;
">{lines.slice(0, revealed).join('\n')}</pre>

<style>
	.bbs-ascii-pre {
		max-width: 100%;
		box-sizing: border-box;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	@media (max-width: 720px) {
		/* ~55 monospace columns wide — scale down text so artwork fits viewport */
		.bbs-ascii-pre {
			font-size: clamp(6px, 2.85vw, var(--bbs-font-size, 14px));
		}
	}
</style>
