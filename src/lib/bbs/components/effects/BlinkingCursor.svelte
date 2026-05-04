<script lang="ts">
	import { cursorBlink } from '../../stores/effects.store.js';
	import { configStore } from '../../stores/config.store.js';

	export let char:   string  | undefined = undefined;
	export let inline: boolean = true;

	$: cursorChar = char ?? ($configStore.config?.effects.cursor.char ?? '█');
	$: visible = $cursorBlink;
</script>

<svelte:element
	this={inline ? 'span' : 'div'}
	style="
		font-family: var(--bbs-font);
		color: var(--bbs-cursor);
		visibility: {visible ? 'visible' : 'hidden'};
		user-select: none;
	"
	aria-hidden="true"
>{cursorChar}</svelte:element>
