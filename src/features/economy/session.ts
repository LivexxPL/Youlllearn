/** Id of one practice session, so that its coin reward is granted once (services/economy.ts). */
export function newSessionId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
