import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type LedgerEntry } from '../../services/db';
import { walletOf, type Wallet } from '../../services/economy';

/** The coin history, newest first; undefined while loading. */
export function useLedger(): LedgerEntry[] | undefined {
  return useLiveQuery(() => db.ledger.toArray().then((all) => all.sort((a, b) => b.at - a.at || (a.id < b.id ? 1 : -1))), []);
}

/** Balance and owned items, updated live after every reward or purchase. */
export function useWallet(): Wallet | undefined {
  const ledger = useLedger();
  return useMemo(() => (ledger ? walletOf(ledger) : undefined), [ledger]);
}
