export interface WorkEntry {
	id:          string;
	company:     string;
	role:        string;
	period:      string;
	location:    string;
	description: string;
	stack:       string[];
}

export const experience: WorkEntry[] = [
	{
		id:          'consulting-self',
		company:     'SELF-EMPLOYED',
		role:        'E-commerce Solution Consultant',
		period:      'Jan 2022 — PRESENT',
		location:    'Dortmund, DE · Remote-friendly',
		description:
			'Independent Magento / Adobe Commerce and PHP consulting: backend features, integrations, migrations (M1→M2), and long-running imports/exports. TYPO3, Laravel, WHMCS customisation and interoperability (Nextcloud, ISPConfig, carrier & PSP APIs).' +
			' Partnering with merchants and agencies to stabilise storefronts under real catalog and ops load.',
		stack: [
			'Magento 2',
			'Adobe Commerce',
			'PHP',
			'Laravel',
			'TYPO3',
			'WHMCS',
			'MySQL',
			'RabbitMQ',
			'AWS',
			'REST / SOAP APIs'
		]
	},
	{
		id:          'surprise-app',
		company:     'Surprise.com',
		role:        'Lead Magento Developer',
		period:      'Sep 2022 — Apr 2024',
		location:    'Hybrid / Remote · Mobile Gaming & Commerce',
		description:
			'Hands-on Magento lead shipping core backend work for a commerce layer inside a rapidly growing gaming product organisation. Architecture for extensions and integrations across catalog, fulfilment and compliance-sensitive flows.',
		stack: ['Magento 2', 'Adobe Commerce ecosystem', 'PHP', 'AWS', 'MySQL', 'RabbitMQ', 'PHPUnit']
	},
	{
		id:          'sam-solutions',
		company:     'SaM Solutions',
		role:        'Magento Developer',
		period:      'Sep 2017 — Jan 2022',
		location:    'Hybrid · IT Services · DE / international clients',
		description:
			'Enterprise Magento CE & EE delivery: tailoring modules from vendors (Amasty, MagePlaza, Klevu, Smile, Xtento, …), PSP & carrier integrations (Stripe, UPS, FedEx, Nova Poshta, eBay, WordPress services, etc.).' +
			' Owned product & order data ingest/export tooling (Xtento, CED Commerce, CSV/MI pipelines) and hardened migration paths Magento 1 → 2. TYPO3, Laravel & WHMCS projects with billing and hosting integrations.',
		stack: [
			'Magento 1 & 2',
			'Laravel',
			'TYPO3',
			'WHMCS',
			'LESS',
			'MySQL',
			'RabbitMQ',
			'Import/Export tooling',
			'Third-party REST/SOAP'
		]
	},
	{
		id:          'qpard',
		company:     'QPARD',
		role:        'Magento Developer',
		period:      'Jul 2016 — Nov 2017',
		location:    'Kharkiv, UA',
		description:
			'Early Magento 2 rollout: bespoke modules & themes for retail clients, migrating stores from Magento 1, exposing third-party APIs for logistics and PSPs.',
		stack: ['Magento 1 → 2', 'PHP', 'MySQL', 'REST APIs', 'Themes']
	}
];
