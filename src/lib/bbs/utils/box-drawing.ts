import type { BorderStyle } from '../types/config.js';

// ─────────────────────────────────────────────────────────────────────────────
// Box-drawing character sets
// ─────────────────────────────────────────────────────────────────────────────

interface BoxChars {
	tl: string; tr: string; bl: string; br: string;  // corners
	h:  string; v:  string;                            // horizontal / vertical
	ml: string; mr: string; mt: string; mb: string;   // mid-left, mid-right, mid-top, mid-bottom
	cross: string;
}

const CHARS: Record<BorderStyle, BoxChars> = {
	double: { tl:'╔', tr:'╗', bl:'╚', br:'╝', h:'═', v:'║', ml:'╠', mr:'╣', mt:'╦', mb:'╩', cross:'╬' },
	single: { tl:'┌', tr:'┐', bl:'└', br:'┘', h:'─', v:'│', ml:'├', mr:'┤', mt:'┬', mb:'┴', cross:'┼' },
	heavy:  { tl:'┏', tr:'┓', bl:'┗', br:'┛', h:'━', v:'┃', ml:'┣', mr:'┫', mt:'┳', mb:'┻', cross:'╋' },
	mixed:  { tl:'╔', tr:'╗', bl:'╚', br:'╝', h:'═', v:'║', ml:'╠', mr:'╣', mt:'╦', mb:'╩', cross:'╬' }
};

// For 'mixed': inner dividers use single-style connectors with double outer
const INNER_CHARS: Record<BorderStyle, BoxChars> = {
	...CHARS,
	mixed: { tl:'┌', tr:'┐', bl:'└', br:'┘', h:'─', v:'│', ml:'├', mr:'┤', mt:'┬', mb:'┴', cross:'┼' }
};

export function getChars(style: BorderStyle): BoxChars {
	return CHARS[style];
}

export function getInnerChars(style: BorderStyle): BoxChars {
	return INNER_CHARS[style];
}

// ─────────────────────────────────────────────────────────────────────────────
// Builder functions (return plain strings for use in <pre> blocks)
// ─────────────────────────────────────────────────────────────────────────────

/** Build a top border line with an optional centered title.
 *  e.g. ╔══[ TITLE ]═══════╗
 */
export function topBorderWithTitle(
	innerWidth: number,
	title: string,
	style: BorderStyle = 'double',
	titleAlign: 'left' | 'center' | 'right' = 'left'
): string {
	const c = CHARS[style];
	if (!title) return c.tl + c.h.repeat(innerWidth) + c.tr;

	const label = ` ${title} `;
	const remaining = innerWidth - label.length;
	if (remaining < 0) return c.tl + label.slice(0, innerWidth) + c.tr;

	let left: number, right: number;
	if (titleAlign === 'center') {
		left  = Math.floor(remaining / 2);
		right = remaining - left;
	} else if (titleAlign === 'right') {
		left  = remaining;
		right = 0;
	} else {
		left  = 1;
		right = remaining - 1;
	}
	return c.tl + c.h.repeat(left) + label + c.h.repeat(right) + c.tr;
}

/** Build a horizontal divider line, optionally with a centered label.
 *  e.g. ╠══[ SECTION ]═══╣
 */
export function buildDivider(
	innerWidth: number,
	label = '',
	style: BorderStyle = 'double',
	inner = false
): string {
	const c = inner ? INNER_CHARS[style] : CHARS[style];
	if (!label) return c.ml + c.h.repeat(innerWidth) + c.mr;

	const txt = ` ${label} `;
	const remaining = innerWidth - txt.length;
	if (remaining < 0) return c.ml + txt.slice(0, innerWidth) + c.mr;
	const left  = Math.floor(remaining / 2);
	const right = remaining - left;
	return c.ml + c.h.repeat(left) + txt + c.h.repeat(right) + c.mr;
}

/** Build a plain horizontal rule (no connectors), e.g. ─────────────── */
export function buildRule(width: number, style: BorderStyle = 'single'): string {
	return CHARS[style].h.repeat(width);
}

/** Pad a string to exactly `width` chars with spaces (truncates if over). */
export function pad(str: string, width: number): string {
	if (str.length >= width) return str.slice(0, width);
	return str + ' '.repeat(width - str.length);
}

/** Build a single content row inside a box: ║ content ║ */
export function boxRow(content: string, innerWidth: number, style: BorderStyle = 'double'): string {
	const c = CHARS[style];
	return c.v + pad(content, innerWidth) + c.v;
}
