import type { ReactNode } from 'react';

/** Bottom action area: stays above the on-screen keyboard and the safe area. */
export function ActionBar({ children, hidden }: { children: ReactNode; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <div className="action-bar">
      <div className="action-bar__inner">{children}</div>
    </div>
  );
}
