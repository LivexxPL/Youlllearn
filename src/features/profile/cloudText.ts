import { formatRelative, t } from '../../i18n';
import type { CloudErrorCode, CloudSnapshot } from '../../services/cloud';

export function cloudErrorText(code: CloudErrorCode): string {
  switch (code) {
    case 'popup':
      return t('cloud.error.popup');
    case 'scope':
      return t('cloud.error.scope');
    case 'quota':
      return t('cloud.error.quota');
    case 'format':
      return t('cloud.error.format');
    case 'network':
      return t('cloud.state.offline');
    default:
      return t('cloud.error.server');
  }
}

/** One line describing where the synchronisation stands, and how it should look. */
export function cloudStatus(c: CloudSnapshot): { text: string; tone: 'ok' | 'warn' | 'busy' | 'muted' } {
  if (c.state === 'connecting') return { text: t('cloud.state.connecting'), tone: 'busy' };
  if (c.state === 'syncing') return { text: t('cloud.state.syncing'), tone: 'busy' };
  if (c.state === 'offline') return { text: t('cloud.state.offline'), tone: 'muted' };
  if (c.state === 'error' && c.error) return { text: cloudErrorText(c.error), tone: 'warn' };
  if (c.dirty && !c.connected) return { text: t('cloud.state.expired'), tone: 'warn' };
  if (c.dirty) return { text: t('cloud.state.pending'), tone: 'muted' };
  if (c.lastSyncAt) return { text: t('cloud.state.synced', { when: formatRelative(c.lastSyncAt) }), tone: 'ok' };
  return { text: t('cloud.state.never'), tone: 'muted' };
}
