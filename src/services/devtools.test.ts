import { describe, expect, it } from 'vitest';
import { createDb } from './db';
import { SandboxOnlyError, enterSandbox, simulateAchievements, simulateCoins, simulateLessons, simulateOnboarding, simulateStreak, simulateXp } from './devtools';
import { PermissionError, type Principal } from '../auth/permissions';
import { getWallet, purchase } from './economy';
import { recordLessonCompletion, totalXp, type SessionOutcomes } from './progress';
import { getCourse } from '../content/registry';
import { defaultSettings } from '../state/settings';
import { setMeta } from './db';
import { CLOUD_META_KEY } from '../config/cloud';

const dev: Principal = { role: 'developer', roleId: 'd'.repeat(64), verified: true };
const admin: Principal = { role: 'admin', roleId: 'a'.repeat(64), verified: true };
const user: Principal = { role: 'user', roleId: 'u'.repeat(64), verified: true };
const newDb = () => createDb(`test-dev-${Math.random()}`);

describe('developer tools', () => {
  it('refuse without the sandbox permission, whatever the screen shows', async () => {
    const d = newDb();
    for (const p of [user, admin]) {
      await expect(simulateCoins(p, 1000, { database: d, inSandbox: true })).rejects.toThrow(PermissionError);
      await expect(simulateLessons(p, 'es', 'all', { database: d, inSandbox: true })).rejects.toThrow(PermissionError);
      await expect(enterSandbox(p, true, { real: d, sandbox: newDb(), reload: false })).rejects.toThrow(PermissionError);
    }
    expect(await d.ledger.count()).toBe(0);
  });

  it('never simulate on the real data, even for a developer', async () => {
    const d = newDb();
    await expect(simulateCoins(dev, 1000, { database: d, inSandbox: false })).rejects.toThrow(SandboxOnlyError);
    await expect(simulateXp(dev, 1000, { database: d, inSandbox: false })).rejects.toThrow(SandboxOnlyError);
    expect(await d.ledger.count()).toBe(0);
  });

  it('simulate coins, XP, streaks, lessons, achievements and onboarding in the sandbox, labelled as tests', async () => {
    const sandbox = newDb();
    await sandbox.settings.put({ ...defaultSettings(), onboarded: true });
    const ctx = { database: sandbox, inSandbox: true };
    const [coins] = await simulateCoins(dev, 1000, ctx);
    expect(coins).toMatchObject({ type: 'adjustment', amount: 1000, ref: 'developer-test' });
    expect(coins.id).toMatch(/^test:coins:/);
    await simulateXp(dev, 500, ctx);
    expect(await totalXp(sandbox)).toBeGreaterThanOrEqual(500);
    await simulateStreak(dev, 7, 'es', ctx);
    expect(await sandbox.dailyStats.count()).toBe(7);
    expect(await simulateLessons(dev, 'es', 3, ctx)).toBe(3);
    expect(await sandbox.lessonProgress.count()).toBe(3);
    expect((await simulateAchievements(dev, ctx)).map((a) => a.id)).toContain('first-lesson');
    await simulateOnboarding(dev, ctx);
    expect((await sandbox.settings.get('app'))?.onboarded).toBe(false);
    // The test coins buy things in the sandbox like real ones.
    expect((await purchase('theme-galaxy', sandbox)).ok).toBe(true);
  });

  it('start the sandbox from a copy of the real data, keep the sign-in, and leave the real data untouched', async () => {
    const real = newDb();
    const es = getCourse('es');
    const outcomes: SessionOutcomes = { byRef: new Map(), graded: 10, correct: 10, xp: 100, bestRun: 10, speaking: 0, writing: 0 };
    await real.settings.put({ ...defaultSettings(), onboarded: true });
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes }, real);
    await setMeta(CLOUD_META_KEY, { account: { sub: 'dev-sub' } }, real);
    const realBefore = await getWallet(real);

    const sandbox = newDb();
    await enterSandbox(dev, true, { real, sandbox, reload: false });
    expect(await sandbox.lessonProgress.count()).toBe(1);
    expect((await sandbox.meta.get(CLOUD_META_KEY))?.value).toEqual({ account: { sub: 'dev-sub' } });

    await simulateCoins(dev, 5000, { database: sandbox, inSandbox: true });
    await simulateLessons(dev, 'es', 'all', { database: sandbox, inSandbox: true });
    expect(await real.lessonProgress.count()).toBe(1);
    expect((await getWallet(real)).balance).toBe(realBefore.balance);
    expect(await real.ledger.where('type').equals('adjustment').count()).toBe(0);
    const audit = (await real.meta.get('devAudit'))?.value as { action: string }[];
    expect(audit[0].action).toBe('sandbox.enter');
  });
});
