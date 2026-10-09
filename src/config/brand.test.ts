import { describe, expect, it } from 'vitest';
import capacitorConfig from '../../capacitor.config';
import { brand } from './brand';

describe('brand configuration', () => {
  it('matches the Capacitor configuration', () => {
    expect(capacitorConfig.appId).toBe(brand.appId);
    expect(capacitorConfig.appName).toBe(brand.appName);
    expect(capacitorConfig.plugins?.SplashScreen?.backgroundColor).toBe(brand.backgroundColor);
    expect(capacitorConfig.plugins?.LocalNotifications?.iconColor).toBe(brand.themeColor);
  });
});
