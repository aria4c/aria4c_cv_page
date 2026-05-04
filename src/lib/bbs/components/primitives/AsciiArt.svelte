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

<pre style="
	font-family: var(--bbs-font);
	color: {color};
	margin: 0;
	line-height: var(--bbs-line-height);
	white-space: pre;
">{lines.slice(0, revealed).join('\n')}</pre>
