import { writable, derived, type Readable } from 'svelte/store';

type StatusType = 'info' | 'success' | 'warn' | 'error';

interface TerminalState {
	statusMessage: string;
	statusType:    StatusType;
	clock:         string;
	online:        boolean;
}

const terminalWritable = writable<TerminalState>({
	statusMessage: '',
	statusType:    'info',
	clock:         '',
	online:        true
});

export const terminalStore: Readable<TerminalState> = { subscribe: terminalWritable.subscribe };

let clockInterval: ReturnType<typeof setInterval> | null = null;
let statusTimeout: ReturnType<typeof setTimeout> | null = null;
let clockFrozen = false;

function formatClock(format: '12h' | '24h'): string {
	const now = new Date();
	const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
	                    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

	const day   = dayNames[now.getDay()];
	const date  = String(now.getDate()).padStart(2, '0');
	const month = monthNames[now.getMonth()];
	const year  = now.getFullYear();

	if (format === '24h') {
		const hh = String(now.getHours()).padStart(2, '0');
		const mm = String(now.getMinutes()).padStart(2, '0');
		return `${day} ${date} ${month} ${year} ${hh}:${mm}`;
	} else {
		let hours = now.getHours();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;
		const hh = String(hours).padStart(2, '0');
		const mm = String(now.getMinutes()).padStart(2, '0');
		return `${day} ${date} ${month} ${year} ${hh}:${mm} ${ampm}`;
	}
}

/** Start the live clock. Call from BBSRoot.svelte onMount. */
export function startClock(format: '12h' | '24h' = '24h'): () => void {
	// Tick immediately
	terminalWritable.update((s) => ({ ...s, clock: formatClock(format) }));

	clockInterval = setInterval(() => {
		if (clockFrozen) return;
		terminalWritable.update((s) => ({ ...s, clock: formatClock(format) }));
	}, 1000);

	// Return cleanup fn
	return () => {
		if (clockInterval) clearInterval(clockInterval);
	};
}

/** Show a transient status message. Clears after `durationMs` if provided. */
export function setStatus(message: string, type: StatusType = 'info', durationMs?: number): void {
	if (statusTimeout) clearTimeout(statusTimeout);

	terminalWritable.update((s) => ({ ...s, statusMessage: message, statusType: type }));

	if (durationMs) {
		statusTimeout = setTimeout(() => {
			terminalWritable.update((s) => ({ ...s, statusMessage: '', statusType: 'info' }));
		}, durationMs);
	}
}

/** When true, clock interval stops advancing the displayed time (Matrix easter egg). */
export function setClockFrozen(frozen: boolean): void {
	clockFrozen = frozen;
}

/** Clear the status message immediately. */
export function clearStatus(): void {
	if (statusTimeout) clearTimeout(statusTimeout);
	terminalWritable.update((s) => ({ ...s, statusMessage: '', statusType: 'info' }));
}

/** Derived: formatted connection string for status bar. */
export const connectionString = derived(terminalStore, () => '');
// Populated by BBSRoot using system.baudRate from config
