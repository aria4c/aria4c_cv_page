import type { ThemeConfig } from '../types/config.js';

/**
 * Convert a ThemeConfig into a CSS custom-property string for inline styles.
 * Used for SSR where :root mutations aren't available.
 */
export function themeToInlineStyle(theme: ThemeConfig): string {
	const c = theme.colors;
	const f = theme.font;
	return [
		`--bbs-bg: ${c.background}`,
		`--bbs-fg: ${c.foreground}`,
		`--bbs-primary: ${c.primary}`,
		`--bbs-secondary: ${c.secondary}`,
		`--bbs-muted: ${c.muted}`,
		`--bbs-highlight: ${c.highlight}`,
		`--bbs-highlight-text: ${c.highlightText}`,
		`--bbs-cursor: ${c.cursor}`,
		`--bbs-error: ${c.error}`,
		`--bbs-success: ${c.success}`,
		`--bbs-warning: ${c.warning}`,
		`--bbs-scanline-color: ${c.scanlineColor}`,
		`--bbs-font: ${f.family}`,
		`--bbs-font-size: ${f.sizeBase}`,
		`--bbs-font-size-lg: ${f.sizeLg}`,
		`--bbs-font-size-sm: ${f.sizeSm}`,
		`--bbs-line-height: ${f.lineHeight}`
	].join('; ');
}
