/**
 * Global keyboard registry for the BBS framework.
 * Components register handlers by key character; the global listener
 * dispatches to the highest-priority handler for each key.
 */

type KeyHandler = () => void;

interface KeyBinding {
	key:      string;   // uppercase single char, e.g. "1", "A", "ENTER", "ARROWUP"
	handler:  KeyHandler;
	priority: number;   // higher = called first; use 0 for default
	id:       symbol;   // unique handle for deregistration
}

const bindings: KeyBinding[] = [];
let listenerAttached = false;
let enabled = true;

function normalizeKey(event: KeyboardEvent): string {
	const k = event.key;
	if (k.length === 1) return k.toUpperCase();
	return k.toUpperCase(); // e.g. "ARROWUP", "ENTER", "ESCAPE"
}

function onKeyDown(event: KeyboardEvent): void {
	if (!enabled) return;

	// Don't intercept while typing in an input/textarea
	const tag = (event.target as HTMLElement).tagName;
	if (tag === 'INPUT' || tag === 'TEXTAREA') return;

	const key = normalizeKey(event);
	const matching = bindings
		.filter((b) => b.key === key)
		.sort((a, b) => b.priority - a.priority);

	if (matching.length > 0) {
		event.preventDefault();
		matching[0].handler();
	}
}

/** Attach the global keydown listener. Call from BBSRoot.svelte onMount. */
export function attachKeyboardListener(): () => void {
	if (listenerAttached) return () => {};
	document.addEventListener('keydown', onKeyDown);
	listenerAttached = true;
	return () => {
		document.removeEventListener('keydown', onKeyDown);
		listenerAttached = false;
	};
}

/** Register a key handler. Returns a symbol that can be passed to `unregister()`. */
export function register(key: string, handler: KeyHandler, priority = 0): symbol {
	const id = Symbol(key);
	bindings.push({ key: key.toUpperCase(), handler, priority, id });
	return id;
}

/** Unregister a handler by the symbol returned from `register()`. */
export function unregister(id: symbol): void {
	const index = bindings.findIndex((b) => b.id === id);
	if (index !== -1) bindings.splice(index, 1);
}

/** Temporarily disable all keyboard handling (e.g. during a modal). */
export function disableKeyboard(): void  { enabled = false; }

/** Re-enable keyboard handling. */
export function enableKeyboard(): void { enabled = true; }

/** Remove all registered bindings (called on app teardown). */
export function clearAllBindings(): void { bindings.length = 0; }
