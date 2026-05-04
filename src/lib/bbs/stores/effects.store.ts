import { writable, derived, type Readable } from 'svelte/store';
import type { TypewriterConfig } from '../types/config.js';

export interface TypewriterJob {
	id:       string;
	text:     string;
	revealed: number;    // number of characters revealed so far
	complete: boolean;
	config:   TypewriterConfig;
}

interface EffectsState {
	typewriterJobs: TypewriterJob[];
	cursorVisible:  boolean;
	glitchActive:   boolean;
	scanlineEnabled: boolean;
}

const effectsWritable = writable<EffectsState>({
	typewriterJobs:  [],
	cursorVisible:   true,
	glitchActive:    false,
	scanlineEnabled: true
});

export const effectsStore: Readable<EffectsState> = { subscribe: effectsWritable.subscribe };

// ── Cursor blink ─────────────────────────────────────────────────────────────

let blinkInterval: ReturnType<typeof setInterval> | null = null;

export function startCursorBlink(rateMs: number): () => void {
	if (blinkInterval) clearInterval(blinkInterval);

	blinkInterval = setInterval(() => {
		effectsWritable.update((s) => ({ ...s, cursorVisible: !s.cursorVisible }));
	}, rateMs);

	return () => {
		if (blinkInterval) clearInterval(blinkInterval);
	};
}

/** Derived: just the cursor visibility boolean for easy subscription. */
export const cursorBlink: Readable<boolean> = derived(
	effectsStore,
	($s) => $s.cursorVisible
);

// ── Typewriter jobs ───────────────────────────────────────────────────────────

/** Add a typewriter job to the queue. Returns the job ID. */
export function enqueueTypewriter(text: string, config: TypewriterConfig): string {
	const id = crypto.randomUUID();
	const job: TypewriterJob = { id, text, revealed: 0, complete: false, config };
	effectsWritable.update((s) => ({ ...s, typewriterJobs: [...s.typewriterJobs, job] }));
	return id;
}

/** Update how many characters are revealed for a job. */
export function updateTypewriterProgress(id: string, revealed: number, complete: boolean): void {
	effectsWritable.update((s) => ({
		...s,
		typewriterJobs: s.typewriterJobs.map((j) =>
			j.id === id ? { ...j, revealed, complete } : j
		)
	}));
}

/** Remove a completed typewriter job. */
export function removeTypewriterJob(id: string): void {
	effectsWritable.update((s) => ({
		...s,
		typewriterJobs: s.typewriterJobs.filter((j) => j.id !== id)
	}));
}

/** Clear all typewriter jobs (e.g. on screen transition). */
export function clearTypewriters(): void {
	effectsWritable.update((s) => ({ ...s, typewriterJobs: [] }));
}

// ── Scanlines ─────────────────────────────────────────────────────────────────

export function setScanlines(enabled: boolean): void {
	effectsWritable.update((s) => ({ ...s, scanlineEnabled: enabled }));
}
