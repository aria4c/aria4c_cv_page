import type { BBSConfig } from './lib/bbs/types/config.js';

export const bbsConfig: BBSConfig = {

	// ── SYSTEM ──────────────────────────────────────────────────────────────
	system: {
		name:           'ARIA4C bbs v1.0',
		version:        '1.0.0',
		hostname:       'bbs.illyaarefiev.dev',
		welcomeMessage: 'Welcome, USER. You are visitor #1,337.',
		nodeId:         'NODE 01',
		baudRate:       9600
	},

	// ── THEME ────────────────────────────────────────────────────────────────
	theme: {
		id: 'white-on-black',
		colors: {
			background:    '#000000',
			foreground:    '#ffffff',
			primary:       '#ffffff',
			secondary:     '#aaaaaa',
			muted:         '#555555',
			highlight:     '#ffffff',
			highlightText: '#000000',
			cursor:        '#ffffff',
			error:         '#ff4444',
			success:       '#44ff44',
			warning:       '#ffaa00',
			scanlineColor: 'rgba(255, 255, 255, 0.03)'
		},
		font: {
			family:     "'JetBrains Mono', 'Courier New', monospace",
			sizeBase:   '14px',
			sizeLg:     '16px',
			sizeSm:     '12px',
			lineHeight: 1.5
		},
		borders: 'double'
	},

	themeDay: {
		id: 'black-on-white',
		colors: {
			background:    '#ffffff',
			foreground:    '#000000',
			primary:       '#000000',
			secondary:     '#444444',
			muted:         '#999999',
			highlight:     '#000000',
			highlightText: '#ffffff',
			cursor:        '#000000',
			error:         '#cc2222',
			success:       '#1a7f37',
			warning:       '#b8860b',
			scanlineColor: 'rgba(0, 0, 0, 0.04)'
		},
		font: {
			family:     "'JetBrains Mono', 'Courier New', monospace",
			sizeBase:   '14px',
			sizeLg:     '16px',
			sizeSm:     '12px',
			lineHeight: 1.5
		},
		borders: 'double'
	},

	// ── SPLASH ───────────────────────────────────────────────────────────────
	splash: {
		enabled: true,
		asciiArt: `
 █████╗   ██████╗   ██╗   █████╗   ██╗  ██╗   ██████╗
██╔══██╗  ██╔══██╗  ██║  ██╔══██╗  ██║  ██║  ██╔════╝
███████║  ██████╔╝  ██║  ███████║  ███████║  ██║     
██╔══██║  ██╔══██╗  ██║  ██╔══██║  ╚════██║  ██║     
██║  ██║  ██║  ██║  ██║  ██║  ██║       ██║  ╚██████╗
╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝       ╚═╝   ╚═════╝`.trim(),
		tagline: 'FULL STACK ENGINEER · SAAS · PRODUCT CONSULTING',
		showBootSequence: true,
		bootSequenceDuration: 2400,
		bootMessages: [
			{ text: 'Initializing neural interface',      delay: 0,   type: 'ok'   },
			{ text: 'Loading personality matrix',         delay: 400, type: 'ok'   },
			{ text: 'Mounting caffeine subsystem',        delay: 400, type: 'ok'   },
			{ text: 'Calibrating imposter syndrome',      delay: 400, type: 'warn' },
			{ text: 'All systems nominal',                delay: 400, type: 'info' }
		],
		pressAnyKey:     true,
		pressAnyKeyText: 'PRESS ANY KEY TO CONTINUE...',
		autoAdvanceMs:   null
	},

	// ── NAVIGATION ───────────────────────────────────────────────────────────
	navigation: {
		enableKeyboard:     true,
		enableClick:        true,
		homeKey:            'H',
		backKey:            'B',
		themeToggleKey:     'T',
		quitKey:            'Q',
		menuStyle:          'numbered',
		animateTransitions: true,
		transitionEffect:   'fade',
		urlSync: {
			enabled:  false,
			strategy: 'hash'
		}
	},

	// ── SCREENS ──────────────────────────────────────────────────────────────
	screens: {
		home: 'main',
		screens: [
			{
				id:         'splash',
				title:      'WELCOME',
				menuLabel:  'Splash',
				menuKey:    '0',
				component:  'SplashScreen',
				showInMenu: false
			},
			{
				id:         'main',
				title:      'MAIN MENU',
				menuLabel:  'Main Menu',
				menuKey:    'M',
				component:  'MainMenuScreen',
				showInMenu: false,
				seo: {
					title:       'Illya Arefiev — Full Stack Engineer · SaaS & AI consultant',
					description:
						'Full stack engineer and SaaS / AI consultant (Dortmund, DE) — LLM APIs, RAG & embeddings, microservices, eCommerce, mobile backends, PHP/Laravel, cloud & data. Résumé BBS.'
				}
			},
			{
				id:         'about',
				title:      'ABOUT ME',
				menuLabel:  'About Me',
				menuKey:    '1',
				menuIcon:   '»',
				component:  'AboutScreen',
				parent:     'main',
				showInMenu: true,
				seo: {
					title:       'About | Illya Arefiev',
					description:
						'Full stack · SaaS & AI — LLM integrations, RAG, product APIs, eCommerce, microservices & mobile backends (Dortmund, Germany).'
				}
			},
			{
				id:         'experience',
				title:      'WORK EXPERIENCE',
				menuLabel:  'Work Experience',
				menuKey:    '2',
				menuIcon:   '»',
				component:  'ExperienceScreen',
				parent:     'main',
				showInMenu: true,
				seo: {
					title:       'Experience | Illya Arefiev',
					description:
						'Magento & eCommerce timeline — Surprise.com lead developer, SaM Solutions, QPARD, freelance consulting.'
				}
			},
			{
				id:         'skills',
				title:      'SKILLS & TOOLS',
				menuLabel:  'Skills & Tools',
				menuKey:    '3',
				menuIcon:   '»',
				component:  'SkillsScreen',
				parent:     'main',
				showInMenu: true,
				seo: {
					title:       'Skills | Illya Arefiev',
					description:
						'PHP · commerce stacks · AWS · queues · MySQL — plus OpenAI & Anthropic APIs, RAG, embeddings, agent / MCP patterns (~11y span).'
				}
			},
			{
				id:         'projects',
				title:      'PROJECTS',
				menuLabel:  'Projects',
				menuKey:    '4',
				menuIcon:   '»',
				component:  'ProjectsScreen',
				parent:     'main',
				showInMenu: true,
				menuInactive: true,
				seo: {
					title:       'Projects | Illya Arefiev',
					description:
						'GitHub: GPT + Filament/Trix, commerce PHP modules, SPA experiments, and this interactive résumé.'
				}
			},
			{
				id:         'contact',
				title:      'CONTACT',
				menuLabel:  'Contact',
				menuKey:    '5',
				menuIcon:   '»',
				component:  'ContactScreen',
				parent:     'main',
				showInMenu: true,
				seo: {
					title:       'Contact | Illya Arefiev',
					description:
						'LinkedIn & GitHub (aria4c). Open to SaaS, AI-enabled product engineering, and architecture-heavy consulting.'
				}
			},
			{
				id:         'invaders',
				title:      'GRID DEFENDER',
				menuLabel:  'Grid Defender (arcade)',
				menuKey:    '6',
				menuIcon:   '»',
				component:  'InvadersScreen',
				parent:     'main',
				showInMenu: true,
				seo: {
					title:       'Grid Defender | Illya Arefiev',
					description:
						'Retro micro-arcade in Illya Arefiev\'s résumé BBS — monospace Space Invaders analogue.'
				}
			}
		]
	},

	// ── EFFECTS ──────────────────────────────────────────────────────────────
	effects: {
		crt: {
			enabled:           true,
			scanlineOpacity:   0,
			scanlineSpacing:   3,
			vignetteEnabled:   true,
			vignetteIntensity: 0.25,
			phosphorGlow:      false,
			curvatureEnabled:  false
		},
		typewriter: {
			enabled:            true,
			baseSpeed:          0,           // 0 = derive from baudRate
			varianceMs:         20,
			pauseOnPunctuation: true,
			punctuationPauseMs: 120,
			skipOnClick:        true,
			skipOnKeypress:     false
		},
		cursor: {
			char:          '█',
			blinkRateMs:   530,
			showInMenus:   true,
			showInContent: true
		},
		glitch: {
			enabled:    false,
			frequency:  3,
			intensity:  0.05,
			durationMs: 150
		},
		screenFlicker: true
	},

	// ── STATUS BAR ───────────────────────────────────────────────────────────
	statusBar: {
		position:            'bottom',
		showClock:           true,
		clockFormat:         '24h',
		showNodeId:          true,
		showConnectionSpeed: true,
		showBreadcrumb:      true,
		customFields:        []
	}
};
