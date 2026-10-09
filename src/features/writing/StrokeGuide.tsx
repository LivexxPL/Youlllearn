import { useEffect, useState } from 'react';
import { getStrokes, pathEndpoints, STROKE_BOX } from './strokes';

export type GuideMode = 'faint' | 'solid' | 'animate' | 'numbers';

/** Renders KanjiVG strokes: faint tracing template, solid model or animated stroke order. */
export function StrokeGuide({ char, mode, replayKey = 0, speed = 1 }: { char: string; mode: GuideMode; replayKey?: number; speed?: number }) {
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
  return (
    <svg key={replayKey} className={`stroke-guide stroke-guide--${mode}`} viewBox={`0 0 ${STROKE_BOX} ${STROKE_BOX}`} aria-hidden="true">
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className="stroke-guide__path"
          style={mode === 'animate' ? { animationDelay: `${i * per}s`, animationDuration: `${per * 0.9}s` } : undefined}
        />
      ))}
      {(mode === 'numbers' || mode === 'animate') &&
        paths.map((d, i) => {
          const { start } = pathEndpoints(d);
          return (
            <g key={`n${i}`} className="stroke-guide__num" style={mode === 'animate' ? { animationDelay: `${i * per}s` } : undefined}>
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
