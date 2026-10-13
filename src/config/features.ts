/**
 * Feature flags. A stable feature is on for everyone; beta and experimental features only
 * for accounts with the `features.preview` permission (developers). Gate new, unreleased
 * work with a flag here so that developers get it automatically.
 */
import { can, type Principal } from '../auth/permissions';

export type FeatureStage = 'stable' | 'beta' | 'experimental';

export interface FeatureFlag {
  id: string;
  stage: FeatureStage;
}

export const FEATURES: readonly FeatureFlag[] = [
  { id: 'lessons', stage: 'stable' },
  { id: 'reviews', stage: 'stable' },
  { id: 'endlessPractice', stage: 'stable' },
  { id: 'dailyQuests', stage: 'stable' },
  { id: 'audioQuest', stage: 'stable' },
  { id: 'audioMarathon', stage: 'stable' },
  { id: 'writing', stage: 'stable' },
  { id: 'coins', stage: 'stable' },
  { id: 'cloudSync', stage: 'stable' },
  /** Card-by-card view of the spaced-repetition state, in the developer dashboard. */
  { id: 'srsInspector', stage: 'experimental' },
];

export function featureEnabled(id: string, principal: Principal | null | undefined): boolean {
  const flag = FEATURES.find((f) => f.id === id);
  if (!flag) return false;
  return flag.stage === 'stable' || can(principal, 'features.preview');
}
