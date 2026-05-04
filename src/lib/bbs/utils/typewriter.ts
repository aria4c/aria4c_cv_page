/**
 * Core typewriter timing engine.
 * Drives character-by-character text reveal with baud-rate-derived speed,
 * random variance, and punctuation pauses.
 */

import type { TypewriterConfig } from '../types/config.js';

const PUNCTUATION = new Set(['.', '!', '?', ',', ';', ':']);

/** Convert baud rate to characters-per-second (BBS approximation: 8 bits + overhead). */
export function baudToCharsPerSec(baud: number): number {
	return Math.round(baud / 10);
}

/** Calculate the delay (ms) before revealing the next character. */
export function charDelay(
	char: string,
	config: TypewriterConfig,
	baudRate: number
): number {
	const cps = config.baseSpeed > 0 ? config.baseSpeed : baudToCharsPerSec(baudRate);
	const base = 1000 / cps;
	const variance = config.varianceMs > 0
		? (Math.random() * 2 - 1) * config.varianceMs
		: 0;
	const punct = config.pauseOnPunctuation && PUNCTUATION.has(char)
		? config.punctuationPauseMs
		: 0;
	return Math.max(1, base + variance + punct);
}

export interface TypewriterHandle {
	skip: () => void;
	destroy: () => void;
}

/**
 * Run a typewriter animation.
 * Calls `onProgress(revealed)` each tick, `onComplete()` when done.
 * Returns a handle with `skip()` (complete instantly) and `destroy()` (cancel).
 */
export function runTypewriter(
	text: string,
	config: TypewriterConfig,
	baudRate: number,
	onProgress: (revealed: number) => void,
	onComplete: () => void
): TypewriterHandle {
	let cancelled = false;
	let skipped   = false;
	let revealed  = 0;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	function tick() {
		if (cancelled) return;

		if (skipped || revealed >= text.length) {
			revealed = text.length;
			onProgress(revealed);
			onComplete();
			return;
		}

		revealed++;
		onProgress(revealed);

		if (revealed < text.length) {
			const delay = charDelay(text[revealed - 1], config, baudRate);
			timeoutId = setTimeout(tick, delay);
		} else {
			onComplete();
		}
	}

	// Start after one frame
	timeoutId = setTimeout(tick, 0);

	return {
		skip() {
			skipped = true;
			if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
			tick();
		},
		destroy() {
			cancelled = true;
			if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
		}
	};
}
