import { describe, expect, it } from 'vitest';
import { installPlatform } from './pwa';

describe('install instructions', () => {
  it('recognises iPhone, iPad (also in desktop mode) and Android', () => {
    expect(installPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1')).toBe('ios');
    // iPadOS reports a Mac user agent; touch points give it away.
    expect(installPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', 5)).toBe('ios');
    expect(installPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', 0)).toBe('other');
    expect(installPlatform('Mozilla/5.0 (Linux; Android 15; Pixel 7) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36')).toBe('android');
    expect(installPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36')).toBe('other');
  });
});
