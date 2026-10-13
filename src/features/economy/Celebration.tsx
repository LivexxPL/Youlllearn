/**
 * Equipped completion effect (shop item, slot "fx") shown over the summary of a lesson or
 * session. Purely decorative and short; with reduced motion the particles do not appear.
 */
import { useMemo } from 'react';

const COUNT: Record<string, number> = { 'fx-confetti': 36, 'fx-stars': 18, 'fx-fireworks': 30, 'fx-petals': 22 };

export function Celebration({ fx }: { fx: string | null }) {
  const particles = useMemo(() => {
    if (!fx || !COUNT[fx]) return [];
    return Array.from({ length: COUNT[fx] }, (_, i) => ({
      i,
      x: Math.random(),
      y: Math.random(),
      delay: Math.random() * (fx === 'fx-fireworks' ? 0.9 : 0.6),
      turn: Math.round(Math.random() * 720 - 360),
      size: 0.7 + Math.random() * 0.7,
      color: i % 4,
    }));
  }, [fx]);
  if (!particles.length) return null;
  const kind = fx!.replace('fx-', '');
  return (
    <div className={`celebration celebration--${kind}`} aria-hidden="true" data-testid="celebration">
      {particles.map((p) => (
        <span
          key={p.i}
          className={`celebration__p celebration__p--c${p.color}`}
          style={
            {
              '--x': p.x,
              '--y': p.y,
              '--delay': `${p.delay}s`,
              '--turn': `${p.turn}deg`,
              '--size': p.size,
              '--burst': p.i % 3,
              '--angle': `${(p.i * 360) / 10}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
