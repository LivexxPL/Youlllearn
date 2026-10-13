/** Human-readable names for items and reasons for coin entries. */
import { t } from '../../i18n';
import { getBundle, getItem, type Slot } from '../../config/cosmetics';
import { allCourses } from '../../content/registry';
import type { LedgerEntry } from '../../services/db';
import type { ClaimedReward } from '../../services/progress';
import type { AchievementDef } from '../../engine/gamification';
import { achievementCoins } from '../../config/economy';

export function itemName(id: string): string {
  if (getBundle(id)) return t(`bundle.${id}` as never);
  const item = getItem(id);
  if (item?.slot === 'theme' && item.palette) return t(`palette.${item.palette}` as never);
  return t(`cos.${id}` as never);
}

export function slotName(slot: Slot): string {
  return t(`shop.slot.${slot}` as never);
}

function lessonTitle(id: string | undefined): string | undefined {
  if (!id) return undefined;
  for (const c of allCourses()) {
    const i = c.lessonIndex.get(id);
    if (i !== undefined) return c.lessons[i].title;
  }
  return undefined;
}

/** Why an entry of the coin history happened. */
export function entryReason(e: LedgerEntry): string {
  switch (e.type) {
    case 'lesson': {
      const base = e.id.endsWith(':first') ? t('coins.why.lessonFirst') : t('coins.why.lessonRepeat');
      const title = lessonTitle(e.ref);
      return title ? `${base}: ${title}` : base;
    }
    case 'practice':
      return t('coins.why.practice', { count: e.cards?.length ?? 0 });
    case 'story':
      return t('coins.why.story');
    case 'marathon':
      return t('coins.why.marathon');
    case 'writing':
      return t('coins.why.writing', { char: e.ref ?? '' });
    case 'quest':
      return e.ref === 'all' ? t('coins.why.allQuests') : t('coins.why.quest');
    case 'challenge':
      return t('coins.why.challenge');
    case 'achievement':
      return t('coins.why.achievement', { name: t(`ach.${e.ref}` as never) });
    case 'milestone':
      return t('coins.why.milestone', { count: Number(e.ref?.replace('days-', '') ?? 0) });
    case 'migration':
      return t('coins.why.migration');
    case 'purchase':
      return t('coins.why.purchase', { name: itemName(e.ref ?? '') });
    case 'refund':
      return t('coins.why.refund', { name: itemName(e.ref ?? '') });
    default:
      return t('coins.why.adjustment');
  }
}

export interface CoinLine {
  key: string;
  label: string;
  amount: number;
}

/** Everything a finished session earned: its own coins, quests and achievements. */
export function sessionCoinLines(entries: LedgerEntry[], rewards: ClaimedReward[] = [], achievements: AchievementDef[] = []): CoinLine[] {
  return [
    ...entries.map((e) => ({ key: e.id, label: entryReason(e), amount: e.amount })),
    ...rewards.map((r, i) => ({
      key: `reward-${i}`,
      label: r.kind === 'all-quests' ? t('coins.why.allQuests') : r.kind === 'challenge' ? t('coins.why.challenge') : `${t('coins.why.quest')}: ${t(r.titleKey as never, { count: r.target ?? 0 })}`,
      amount: r.coins,
    })),
    ...achievements.map((a) => ({ key: `ach-${a.id}`, label: t('coins.why.achievement', { name: t(`ach.${a.id}` as never) }), amount: achievementCoins(a.id) })),
  ].filter((l) => l.amount > 0);
}
