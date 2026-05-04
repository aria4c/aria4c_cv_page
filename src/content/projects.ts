export interface ProjectLink {
	key:   string;
	label: string;
	url:   string;
}

export interface ProjectEntry {
	id:          string;
	name:        string;
	description: string;
	stack:       string[];
	primaryTag:  string;
	links:       ProjectLink[];
	featured?:   boolean;
}

export const projects: ProjectEntry[] = [
	{
		id:          'bbs-cv',
		name:        'BBS RESUME SPA',
		description:
			'This site — SvelteKit, config-driven faux-BBS UX, CRT chrome, Matrix easter egg, keyboard navigation. Ships as static preview + GitHub-hosted source.',
		stack:       ['SvelteKit', 'TypeScript', 'Markdown-ish content TS'],
		primaryTag:  'SvelteKit',
		featured:    true,
		links: [
			{ key: 'D', label: 'Live site', url: 'https://aria4c.me/' },
			{ key: 'G', label: 'GitHub aria4c', url: 'https://github.com/aria4c' }
		]
	},
	{
		id:          'gpt-trix-editor',
		name:        'GPT TRIX EDITOR',
		description:
			'Filament form field marrying Trix editor with OpenAI GPT for assisted drafting — Laravel / Livewire ergonomics tuned for admins.',
		stack: ['PHP', 'Laravel', 'Filament', 'OpenAI API', 'Trix'],
		primaryTag: 'Laravel',
		featured: true,
		links: [{ key: 'G', label: 'GitHub', url: 'https://github.com/aria4c/gpt-trix-editor' }]
	},
	{
		id:          'magento2-faqs-extensions',
		name:        'FAQ EXTENSION · COMMERCE PHP',
		description:
			'FAQ module scaffolding for storefront/admin content — PHP extension layout for merchant-facing help & SEO copy.',
		stack: ['PHP', 'Commerce extensions'],
		primaryTag:  'PHP',
		links: [{ key: 'G', label: 'GitHub', url: 'https://github.com/aria4c/magento2-faqs-extensions' }]
	},
	{
		id:          'mage-repo',
		name:        'MAGENTO TOOLING (MAGE)',
		description:
			'Commerce-facing experiments and utilities — module & integration scripting surfaced on GitHub.',
		stack: ['PHP', 'Commerce tooling'],
		primaryTag: 'PHP',
		links: [{ key: 'G', label: 'GitHub', url: 'https://github.com/aria4c/mage' }]
	},
	{
		id:          'sea-battle',
		name:        'SEA BATTLE MINI APP',
		description: 'Small gameplay mini-app project — exploratory UI / SPA patterns.',
		stack: ['JavaScript'],
		primaryTag: 'Web',
		links: [{ key: 'G', label: 'GitHub', url: 'https://github.com/aria4c/sea-battle-mini-app' }]
	},
	{
		id:          'next-app-v2',
		name:        'NEXT APP V2',
		description:
			'Experimental Next-style application skeleton — scaffolding for SSR / routed UI experiments unrelated to storefronts.',
		stack: ['TypeScript', 'Next-inspired'],
		primaryTag: 'Frontend',
		links: [{ key: 'G', label: 'GitHub', url: 'https://github.com/aria4c/next-app-v2' }]
	}
];
