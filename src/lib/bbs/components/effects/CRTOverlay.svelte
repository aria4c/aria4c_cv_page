<script lang="ts">
	import type { CRTConfig } from '../../types/config.js';

	export let config: CRTConfig;
</script>

{#if config.enabled}
<div
	class="crt-overlay"
	aria-hidden="true"
	style="
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 9999;
		{config.curvatureEnabled ? 'border-radius: 12px; overflow: hidden;' : ''}
	"
>
	<!-- Scanlines -->
	<div
		class="scanlines"
		style="
			position: absolute;
			inset: 0;
			background: repeating-linear-gradient(
				to bottom,
				transparent 0px,
				transparent {config.scanlineSpacing * 2}px,
				{`rgba(0,0,0,${config.scanlineOpacity})`} {config.scanlineSpacing * 2}px,
				{`rgba(0,0,0,${config.scanlineOpacity})`} {config.scanlineSpacing * 2 + config.scanlineSpacing}px
			);
		"
	></div>

	<!-- Vignette -->
	{#if config.vignetteEnabled}
	<div
		class="vignette"
		style="
			position: absolute;
			inset: 0;
			background: radial-gradient(
				ellipse at center,
				transparent 60%,
				{`rgba(0,0,0,${config.vignetteIntensity})`} 100%
			);
		"
	></div>
	{/if}
</div>
{/if}
