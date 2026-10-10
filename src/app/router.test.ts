import { beforeAll, describe, expect, it } from 'vitest';

/** Minimal browser history: entries with state, popstate on back(), like a WebView. */
function installFakeWindow() {
  const entries: { hash: string; state: unknown }[] = [{ hash: '', state: null }];
  let index = 0;
  const listeners: Record<string, (() => void)[]> = {};
  const fire = (type: string) => (listeners[type] ?? []).forEach((cb) => cb());
  const win = {
    location: {
      get hash() {
        return entries[index].hash;
      },
    },
    history: {
      get state() {
        return entries[index].state;
      },
      pushState(state: unknown, _title: string, url: string) {
        entries.splice(index + 1);
        entries.push({ hash: url, state });
        index += 1;
      },
      replaceState(state: unknown, _title: string, url: string) {
        entries[index] = { hash: url, state };
      },
      back() {
        if (index === 0) return;
        index -= 1;
        fire('popstate');
        fire('hashchange');
      },
    },
    addEventListener(type: string, cb: () => void) {
      (listeners[type] ??= []).push(cb);
    },
    scrollTo() {},
  };
  (globalThis as unknown as { window: unknown }).window = win;
}

let router: typeof import('./router');

beforeAll(async () => {
  installFakeWindow();
  router = await import('./router');
});

describe('router history', () => {
  it('goes back step by step through in-app navigation', () => {
    const { navigate, canGoBack, goBack, currentPath } = router;
    expect(canGoBack()).toBe(false);
    navigate('/settings');
    navigate('/about');
    expect(currentPath()).toBe('/about');
    expect(canGoBack()).toBe(true);
    goBack();
    expect(currentPath()).toBe('/settings');
    expect(canGoBack()).toBe(true);
    goBack();
    expect(currentPath()).toBe('/');
    expect(canGoBack()).toBe(false);
  });

  it('replacing an entry keeps the depth', () => {
    const { navigate, canGoBack, currentPath } = router;
    navigate('/learn');
    navigate('/lesson/es.l01');
    navigate('/lesson/es.l02', { replace: true });
    expect(currentPath()).toBe('/lesson/es.l02');
    expect(canGoBack()).toBe(true);
  });

  it('survives malformed escapes in the address', () => {
    expect(() => router.parse('#/write/hiragana/%E3')).not.toThrow();
    expect(router.parse('#/write/hiragana/%E3%81%82').segments).toEqual(['write', 'hiragana', 'あ']);
  });
});
