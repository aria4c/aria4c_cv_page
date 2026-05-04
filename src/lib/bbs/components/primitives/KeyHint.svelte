<script lang="ts">
	export let key:   string  = '';
	export let label: string  = '';
	export let dim:   boolean = false;
</script>

<span style="
	font-family: var(--bbs-font);
	color: {dim ? 'var(--bbs-muted)' : 'var(--bbs-secondary)'};
	white-space: nowrap;
">
	<span style="color: {dim ? 'var(--bbs-muted)' : 'var(--bbs-primary)'};">[{key}]</span>{#if label}&nbsp;{label}{/if}
</span>
