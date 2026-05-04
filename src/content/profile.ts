export interface ContactLink {
	key:    string;
	label:  string;
	value:  string;
	url:    string;
	action: 'open-tab' | 'mailto' | 'download';
}

/** Practice areas shown on About + positioning copy */
export const practiceDomains = [
	'eCommerce',
	'SaaS',
	'AI integrations',
	'Microservices',
	'Mobile',
	'Systems integration'
] as const;

export const profile = {
	name:            'Illya Arefiev',
	title:           'Full Stack Engineer · SaaS & AI consultant',
	location:        'Dortmund, North Rhine-Westphalia, Germany',
	latitude:        51.5136,
	longitude:       7.4653,
	mapCountryName:  'Germany',
	available:       true,
	yearsExperience: '11',
	bio:
		'Full stack engineer and independent consultant for SaaS and product teams — owning APIs, services, data layers, and pragmatic UIs when shipping end-to-end outcomes.' +
		' I help with architecture trade-offs, delivery pace, vendor and cloud integrations, asynchronous workflows, and operational hardening (CI, queues, observability).' +
		' On the AI side I wire LLM features into real products: provider APIs, embeddings and retrieval (RAG), tool-calling and agent-style flows, MCP where it fits, plus the usual guardrails — latency, cost, logging, and human-in-the-loop when stakes are high.' +
		' Domains I work most: eCommerce platforms, subscription & B2B SaaS, microservice-style boundaries, backends for mobile clients, and AI-assisted workflows alongside classic business logic.' +
		' MSc Computer Engineering NTU KPI (Kharkiv Polytechnic); PhD coursework track (Computer Engineering) since 2020.',

	contactLinks: [
		{
			key:    '1',
			label:  'GITHUB',
			value:  'github.com/aria4c',
			url:    'https://github.com/aria4c',
			action: 'open-tab' as const
		},
		{
			key:    '2',
			label:  'LINKEDIN',
			value:  'linkedin.com/in/aria4c',
			url:    'https://www.linkedin.com/in/aria4c/',
			action: 'open-tab' as const
		},
		{
			key:    '3',
			label:  'SITE',
			value:  'bbs.illyaarefiev.dev',
			url:    'https://bbs.illyaarefiev.dev/',
			action: 'open-tab' as const
		}
	] as ContactLink[]
};
