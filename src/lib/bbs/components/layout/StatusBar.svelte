<script lang="ts">
	import { terminalStore } from '../../stores/terminal.store.js';
	import { navigationStore } from '../../stores/navigation.store.js';
	import type { StatusBarConfig, SystemConfig } from '../../types/config.js';

	export let statusBarConfig: StatusBarConfig;
	export let system: SystemConfig;

	$: clock = $terminalStore.clock;
	$: statusMessage = $terminalStore.statusMessage;
	$: statusType = $terminalStore.statusType;
	$: breadcrumb = $navigationStore.breadcrumb;

	$: connectionStr = system.baudRate > 0
		? `${system.baudRate} BAUD  8N1`
		: '';

	$: statusColor = statusType === 'error'   ? 'var(--bbs-error)'
	               : statusType === 'success' ? 'var(--bbs-success)'
	               : statusType === 'warn'    ? 'var(--bbs-warning)'
	               : 'var(--bbs-secondary)';
</script>

<div
	class="status-bar"
	style="
		position: relative;
		z-index: 2;
		background: var(--bbs-bg);
		color: var(--bbs-secondary);
		font-family: var(--bbs-font);
		font-size: var(--bbs-font-size-sm);
		border-top: 1px solid var(--bbs-muted);
		padding: 2px 8px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		white-space: nowrap;
		overflow: hidden;
		flex-shrink: 0;
	"
>
	<!-- Left section -->
	<div style="display: flex; gap: 16px; align-items: center; overflow: hidden;">
		{#if statusBarConfig.showNodeId}
			<span class="status-bar-sysname" style="color: var(--bbs-primary);">{system.name}</span>
			<span>|</span>
			<span>{system.nodeId}</span>
		{/if}

		{#if statusMessage}
			<span style="color: {statusColor};">[ {statusMessage} ]</span>
		{:else if statusBarConfig.showBreadcrumb && breadcrumb.length}
			<span>PATH: {breadcrumb.join(' > ')}</span>
		{/if}

		{#each statusBarConfig.customFields as field}
			<span>{field.label}: {typeof field.value === 'function' ? field.value() : field.value}</span>
		{/each}
	</div>

	<!-- Right section -->
	<div style="display: flex; gap: 16px; align-items: center; flex-shrink: 0;">
		{#if statusBarConfig.showConnectionSpeed && connectionStr}
			<span>{connectionStr}</span>
		{/if}
		{#if statusBarConfig.showClock && clock}
			<span style="color: var(--bbs-primary);">{clock}</span>
		{/if}
	</div>
</div>
