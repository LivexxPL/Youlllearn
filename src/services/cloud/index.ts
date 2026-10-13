/** Optional Google account and synchronised copy on Google Drive (see docs/CLOUD_SYNC.md). */
import { CloudSync } from './sync';

export const cloud = new CloudSync();

export type { CloudSnapshot, SyncState } from './sync';
export type { CloudAccount, CloudErrorCode } from './google';
