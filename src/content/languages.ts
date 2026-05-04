export type LanguageTier = 'gray' | 'extra' | 'bright' | 'extra-bright';

export interface Language {
	code:     string;
	name:     string;
	tier:     LanguageTier;
	/** Primary language for professional use */
	preferred?: boolean;
}

export const languages: Language[] = [
	{ code: 'EN', name: 'English',     tier: 'bright',       preferred: true },
	{ code: 'DE', name: 'Deutsch',      tier: 'gray' },
	{ code: 'UA', name: 'Ukrainian',   tier: 'extra-bright' },
	{ code: 'RU', name: 'Russian',     tier: 'extra' },
];
