import { useEffect, useState, type CSSProperties } from 'react';
import { getStrokes, pathEndpoints, STROKE_BOX } from './strokes';

export type GuideMode = 'faint' | 'solid' | 'animate' | 'numbers';

/**
 * Renders KanjiVG strokes: faint tracing template, solid model or animated stroke order.
 * The animation shows how to write the character, so it also plays with reduced motion
 * (see .stroke-guide--animate in features.css). `onDone` fires when the last stroke is drawn.
 */
export function StrokeGuide({ char, mode, replayKey = 0, speed = 1, onDone }: { char: string; mode: GuideMode; replayKey?: number; speed?: number; onDone?: () => void }) {
  const [paths, setPaths] = useState<string[] | null>(null);
  useEffect(() => {
    let alive = true;
    getStrokes(char).then((p) => alive && setPaths(p));
    return () => {
      alive = false;
    };
  }, [char]);
  if (!paths) return null;
  const per = 0.75 / speed;
  const timing = (i: number) => ({ '--stroke-delay': `${i * per}s`, '--stroke-dur': `${per * 0.9}s` }) as CSSProperties;
  return (
    <svg key={replayKey} className={`stroke-guide stroke-guide--${mode}`} viewBox={`0 0 ${STROKE_BOX} ${STROKE_BOX}`} aria-hidden="true" data-testid="stroke-guide">
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className="stroke-guide__path"
          style={mode === 'animate' ? timing(i) : undefined}
          onAnimationEnd={mode === 'animate' && i === paths.length - 1 ? onDone : undefined}
        />
      ))}
      {(mode === 'numbers' || mode === 'animate') &&
        paths.map((d, i) => {
          const { start } = pathEndpoints(d);
          return (
            <g key={`n${i}`} className="stroke-guide__num" style={mode === 'animate' ? timing(i) : undefined}>
              <circle cx={start.x} cy={start.y} r={4.2} />
              <text x={start.x} y={start.y + 1.6} textAnchor="middle">
                {i + 1}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
