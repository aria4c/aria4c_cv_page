<script lang="ts">
	import type { Feature, FeatureCollection, GeoJsonProperties } from 'geojson';
	import { feature } from 'topojson-client';
	import { geoNaturalEarth1, geoPath } from 'd3-geo';
	import type { GeometryCollection, Topology } from 'topojson-specification';
	import countriesTopo from 'world-atlas/countries-110m.json';

	const VB_W = 240;
	const VB_H = 180;

	const topology = countriesTopo as unknown as Topology<{ countries: GeometryCollection<GeoJsonProperties> }>;
	const land = feature(topology, topology.objects.countries) as FeatureCollection;

	export let latitude: number;
	export let longitude: number;
	export let highlightCountryName: string;
	export let label = 'Location map';

	function countryName(f: Feature): string {
		const p = f.properties as Record<string, unknown> | null;
		const n = p?.name;
		return typeof n === 'string' ? n : '';
	}

	let paths: { d: string; highlight: boolean }[] = [];
	let dot: { cx: number; cy: number } | null = null;

	$: {
		const proj = geoNaturalEarth1();
		const path = geoPath(proj);
		const hi = land.features.find((f) => countryName(f) === highlightCountryName);
		proj.fitSize([VB_W, VB_H], hi ?? land);
		paths = land.features.map((f) => ({
			d: path(f) ?? '',
			highlight: countryName(f) === highlightCountryName
		}));
		const p = proj([longitude, latitude]);
		dot = p && p[0] != null && p[1] != null ? { cx: p[0], cy: p[1] } : null;
	}
</script>

<!-- Low intrinsic SVG size + pixelated upscale + shell = chunky mono CRT look -->
<div class="location-map-shell">
	<svg
		class="location-map"
		width="128"
		height="96"
		viewBox="0 0 {VB_W} {VB_H}"
		preserveAspectRatio="xMidYMid meet"
		shape-rendering="crispEdges"
		role="img"
		aria-label={label}
	>
		<defs>
			<pattern
				id="bbs-map-hatch"
				width="10"
				height="10"
				patternUnits="userSpaceOnUse"
				patternTransform="rotate(-45)"
			>
				<rect class="hatch-base" width="10" height="10" />
				<path
					class="hatch-lines"
					d="M0 10 L10 0 M-2 2 L2 -2 M8 12 L12 8"
					fill="none"
				/>
			</pattern>
			<pattern id="bbs-map-grid" width="14" height="14" patternUnits="userSpaceOnUse">
				<path class="grid-line" d="M14 0 L0 0 0 14" fill="none" />
			</pattern>
			<filter id="bbs-map-bloom" x="-30%" y="-30%" width="160%" height="160%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="0.35" result="b" />
				<feMerge>
					<feMergeNode in="b" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>

		<rect class="view-bg" width={VB_W} height={VB_H} />

		<rect class="coord-grid" width={VB_W} height={VB_H} />

		{#each paths as row (row.d + String(row.highlight))}
			<path
				class="land"
				class:highlight={row.highlight}
				d={row.d}
			/>
		{/each}

		{#if dot}
			<g
				class="marker"
				transform="translate({dot.cx}, {dot.cy})"
				filter="url(#bbs-map-bloom)"
			>
				<line class="marker-arm marker-arm-h" x1="-7" y1="0" x2="7" y2="0" />
				<line class="marker-arm marker-arm-v" x1="0" y1="-7" x2="0" y2="7" />
				<rect class="marker-core" x="-2.5" y="-2.5" width="5" height="5" />
			</g>
		{/if}
	</svg>
</div>

<style>
	.location-map-shell {
		position: relative;
		display: block;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
		background: var(--bbs-bg);
		border: 1px solid color-mix(in srgb, var(--bbs-primary) 55%, var(--bbs-bg));
		box-shadow:
			inset 0 0 0 1px color-mix(in srgb, var(--bbs-primary) 15%, transparent),
			0 0 10px color-mix(in srgb, var(--bbs-primary) 9%, transparent);
	}

	.location-map-shell::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0,
			transparent 2px,
			color-mix(in srgb, var(--bbs-fg) 7%, transparent) 2px,
			color-mix(in srgb, var(--bbs-fg) 7%, transparent) 3px
		);
		opacity: 0.55;
		mix-blend-mode: overlay;
	}

	.location-map-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 90% 80% at 50% 45%,
			transparent 30%,
			color-mix(in srgb, var(--bbs-bg) 85%, var(--bbs-fg)) 100%
		);
		opacity: 0.35;
		mix-blend-mode: multiply;
	}

	.location-map {
		display: block;
		width: 100%;
		height: auto;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}

	.hatch-base {
		fill: color-mix(in srgb, var(--bbs-primary) 10%, var(--bbs-bg));
	}
	.hatch-lines {
		stroke: var(--bbs-primary);
		stroke-width: 0.65;
		opacity: 0.42;
	}
	.grid-line {
		stroke: color-mix(in srgb, var(--bbs-primary) 18%, var(--bbs-bg));
		stroke-width: 0.35;
		opacity: 0.6;
	}

	.coord-grid {
		fill: url(#bbs-map-grid);
		pointer-events: none;
	}

	.view-bg {
		fill: var(--bbs-bg);
		stroke: color-mix(in srgb, var(--bbs-primary) 38%, var(--bbs-bg));
		stroke-width: 1.25;
		paint-order: stroke fill;
	}

	.land {
		fill: none;
		stroke: color-mix(in srgb, var(--bbs-primary) 28%, var(--bbs-bg));
		stroke-width: 1.05;
		stroke-linecap: square;
		stroke-linejoin: miter;
		stroke-miterlimit: 4;
		opacity: 0.92;
		paint-order: fill stroke;
	}

	.land.highlight {
		fill: url(#bbs-map-hatch);
		stroke: var(--bbs-primary);
		stroke-width: 1.15;
		opacity: 1;
		filter: drop-shadow(0 0 0.8px color-mix(in srgb, var(--bbs-primary) 60%, transparent));
	}

	.marker {
		pointer-events: none;
	}
	.marker-arm {
		stroke: var(--bbs-primary);
		stroke-width: 0.85;
		stroke-linecap: square;
		opacity: 0.85;
	}
	.marker-core {
		fill: var(--bbs-primary);
		stroke: var(--bbs-bg);
		stroke-width: 0.35;
		shape-rendering: crispEdges;
	}
</style>
