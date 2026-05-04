export interface TechItem {
	name: string;
	activeFromYear: number;
	activeToYear: number;
}

export interface TechColumn {
	title: string;
	items: TechItem[];
}

/** Career ruler length (Jul ~2016 → now ≈ May 2026 — 11y) */
export const overallItYears = 11;

export const techColumns: TechColumn[] = [
	{
		title: 'Commerce & PHP',
		items: [
			{ name: 'PHP', activeFromYear: 0, activeToYear: 11 },
			{ name: 'Magento / Adobe Commerce', activeFromYear: 0, activeToYear: 11 },
			{ name: 'Composer & PHPUnit', activeFromYear: 0, activeToYear: 11 },
			{ name: 'Import / Export & MI', activeFromYear: 2, activeToYear: 11 },
			{ name: 'Laravel', activeFromYear: 2, activeToYear: 11 },
			{ name: 'TYPO3', activeFromYear: 2, activeToYear: 8 },
			{ name: 'WHMCS', activeFromYear: 2, activeToYear: 8 },
			{ name: 'LESS / Twig / Blade', activeFromYear: 0, activeToYear: 8 },
			{ name: 'WordPress integrations', activeFromYear: 2, activeToYear: 7 }
		]
	},
	{
		title: 'Platform & Ops',
		items: [
			{ name: 'MySQL / MariaDB', activeFromYear: 0, activeToYear: 11 },
			{ name: 'RabbitMQ & async jobs', activeFromYear: 4, activeToYear: 11 },
			{ name: 'AWS', activeFromYear: 4, activeToYear: 11 },
			{ name: 'Amazon CloudWatch', activeFromYear: 5, activeToYear: 11 },
			{ name: 'Amazon CloudFront', activeFromYear: 5, activeToYear: 11 },
			{ name: 'Stripe', activeFromYear: 3, activeToYear: 11 },
			{ name: 'Adyen', activeFromYear: 4, activeToYear: 11 },
			{ name: 'New Relic', activeFromYear: 5, activeToYear: 11 },
			{ name: 'Datadog', activeFromYear: 6, activeToYear: 11 },
			{ name: 'Docker & CI-ish deploys', activeFromYear: 3, activeToYear: 11 },
			{ name: 'Redis caches', activeFromYear: 3, activeToYear: 8 },
			{ name: 'Git / branching discipline', activeFromYear: 0, activeToYear: 11 },
			{ name: 'Linux hosting stacks', activeFromYear: 1, activeToYear: 8 }
		]
	},
	{
		title: 'AI · LLMs · agents',
		items: [
			{ name: 'Cursor', activeFromYear: 9, activeToYear: 11 },
			{ name: 'Claude Code', activeFromYear: 10, activeToYear: 11 },
			{ name: 'SpecKit', activeFromYear: 10, activeToYear: 11 },
			{ name: 'BMAD', activeFromYear: 10, activeToYear: 11 },
			{ name: 'OpenAI API', activeFromYear: 8, activeToYear: 11 },
			{ name: 'Anthropic API', activeFromYear: 9, activeToYear: 11 },
			{ name: 'RAG & retrieval pipelines', activeFromYear: 9, activeToYear: 11 },
			{ name: 'Embeddings · vector search', activeFromYear: 9, activeToYear: 11 },
			{ name: 'Agentic tooling · MCP hooks', activeFromYear: 10, activeToYear: 11 },
			{ name: 'Prompt / guardrail patterns', activeFromYear: 9, activeToYear: 11 }
		]
	}
];
