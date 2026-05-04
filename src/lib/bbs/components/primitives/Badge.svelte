<script lang="ts">
	export let label:   string = '';
	export let variant: 'default' | 'success' | 'warn' | 'error' | 'muted' = 'default';
	export let blink:   boolean = false;

	$: color = variant === 'success' ? 'var(--bbs-success)'
	         : variant === 'warn'    ? 'var(--bbs-warning)'
	         : variant === 'error'   ? 'var(--bbs-error)'
	         : variant === 'muted'   ? 'var(--bbs-muted)'
	         : 'var(--bbs-primary)';
</script>

<span
	class="badge"
	class:blink
	style="color: {color}; font-family: var(--bbs-font);"
>[ {label} ]</span>

<style>
	.badge {
		display: inline;
		white-space: nowrap;
	}
	.blink {
		animation: cursor-blink 1060ms step-start infinite;
	}
	@keyframes cursor-blink {
		0%, 49%  { opacity: 1; }
		50%, 100% { opacity: 0; }
	}
</style>
