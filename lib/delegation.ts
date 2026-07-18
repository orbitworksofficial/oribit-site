/**
 * Port of the theme's delegation registry. Blocks register a handler under the
 * name they carry in data-scrolltrigger / data-transition; the transition engine
 * fires it the first time the element intersects, then drops the registration.
 */

type Handler = (el: HTMLElement) => void;

const handlers = new Map<string, Set<Handler>>();
const fired = new WeakMap<HTMLElement, Set<string>>();

export function register(name: string, fn: Handler): () => void {
  let set = handlers.get(name);
  if (!set) {
    set = new Set();
    handlers.set(name, set);
  }
  set.add(fn);
  return () => {
    set!.delete(fn);
  };
}

export function trigger(name: string, el: HTMLElement): void {
  const set = handlers.get(name);
  if (!set) return;
  for (const fn of set) fn(el);
}

/** The original unbinds after the first fire so a block never re-runs. */
export function deregister(name: string, el: HTMLElement): void {
  let seen = fired.get(el);
  if (!seen) {
    seen = new Set();
    fired.set(el, seen);
  }
  seen.add(name);
}

export function hasFired(name: string, el: HTMLElement): boolean {
  return fired.get(el)?.has(name) ?? false;
}
