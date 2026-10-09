/**
 * Handwriting canvas.
 *
 * - Pointer Events with pointer capture and coalesced events for smooth lines.
 * - Pen pressure changes the line width (when the device reports it).
 * - Palm rejection: in "pen only" mode touch pointers are ignored; once a pen
 *   has been seen, large touch contacts are ignored too. CSS `touch-action:
 *   none` only stops scrolling on the canvas — it does not reject palms by itself.
 * - Strokes are stored in normalised coordinates (0..1), so the drawing
 *   rescales without distortion and can be saved/resumed.
 * - Undo/redo covers drawing, erasing and clearing.
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import { Eraser, Grid3x3, PenLine, Redo2, Trash2, Undo2 } from 'lucide-react';
import type { Stroke, StrokePoint } from '../../services/db';
import { t } from '../../i18n';
import { activity } from '../../services/activity';

type Action = { type: 'add'; stroke: Stroke } | { type: 'erase'; index: number; stroke: Stroke } | { type: 'clear'; strokes: Stroke[] };

export interface WritingPadHandle {
  clear(): void;
  strokes(): Stroke[];
}

export interface WritingPadProps {
  initial?: Stroke[];
  onChange?: (strokes: Stroke[]) => void;
  penOnly: boolean;
  brushSize: number;
  onBrushSize?: (size: number) => void;
  leftHanded?: boolean;
  /** Layer rendered under the ink (tracing template / grid). */
  underlay?: ReactNode;
  /** Layer rendered above the ink (model comparison). */
  overlay?: ReactNode;
  showGridToggle?: boolean;
  grid?: boolean;
  onGrid?: (on: boolean) => void;
  stylusMode?: boolean;
  label?: string;
  aspect?: number;
}

const SIZES = [0.025, 0.04, 0.06];

function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke, w: number, h: number, color: string) {
  const pts = s.points;
  if (!pts.length) return;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const width = (p: StrokePoint) => s.size * w * (s.pointerType === 'pen' ? 0.45 + p[2] * 1.1 : 1);
  if (pts.length === 1) {
    ctx.beginPath();
    ctx.arc(pts[0][0] * w, pts[0][1] * h, width(pts[0]) / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const c = pts[i + 1];
    ctx.lineWidth = width(b);
    ctx.beginPath();
    const mx0 = ((a[0] + b[0]) / 2) * w;
    const my0 = ((a[1] + b[1]) / 2) * h;
    const mx1 = c ? ((b[0] + c[0]) / 2) * w : b[0] * w;
    const my1 = c ? ((b[1] + c[1]) / 2) * h : b[1] * h;
    ctx.moveTo(i === 1 ? a[0] * w : mx0, i === 1 ? a[1] * h : my0);
    ctx.quadraticCurveTo(b[0] * w, b[1] * h, mx1, my1);
    ctx.stroke();
  }
}

export const WritingPad = forwardRef<WritingPadHandle, WritingPadProps>(function WritingPad(props, ref) {
  const { initial, onChange, penOnly, brushSize, onBrushSize, leftHanded, underlay, overlay, showGridToggle, grid, onGrid, stylusMode, label, aspect = 1 } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>(initial ?? []);
  // Synchronous mirror of `strokes` so several erase/undo events within one
  // frame operate on the latest list.
  const strokesRef = useRef<Stroke[]>(initial ?? []);
  const [undo, setUndo] = useState<Action[]>([]);
  const [redo, setRedo] = useState<Action[]>([]);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [penSeen, setPenSeen] = useState(false);
  const active = useRef<{ id: number; stroke: Stroke } | null>(null);
  const sizeRef = useRef({ w: 300, h: 300 });

  useImperativeHandle(ref, () => ({
    clear: () => apply({ type: 'clear', strokes: strokesRef.current }),
    strokes: () => strokesRef.current,
  }));

  const inkColor = () => getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#17202b';

  const redraw = useCallback(
    (list: Stroke[], extra?: Stroke) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { w, h } = sizeRef.current;
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const color = inkColor();
      for (const s of list) drawStroke(ctx, s, w, h, color);
      if (extra) drawStroke(ctx, extra, w, h, color);
    },
    [],
  );

  // Size the canvas to its container (crisp on high-DPI screens).
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      const h = Math.round(w * aspect);
      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = { w, h };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      redraw(strokes);
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [aspect, redraw, strokes]);

  useEffect(() => {
    redraw(strokes);
  }, [strokes, redraw]);

  const commit = (next: Stroke[]) => {
    strokesRef.current = next;
    setStrokes(next);
    onChange?.(next);
  };

  function apply(action: Action, record = true) {
    const cur = strokesRef.current;
    let next = cur;
    if (action.type === 'add') next = [...cur, action.stroke];
    if (action.type === 'erase') next = cur.filter((_, i) => i !== action.index);
    if (action.type === 'clear') {
      if (!cur.length) return;
      next = [];
    }
    commit(next);
    if (record) {
      setUndo((u) => [...u, action]);
      setRedo([]);
    }
  }

  const doUndo = () => {
    const last = undo.at(-1);
    if (!last) return;
    const cur = strokesRef.current;
    let next = cur;
    if (last.type === 'add') next = cur.slice(0, -1);
    if (last.type === 'erase') next = [...cur.slice(0, last.index), last.stroke, ...cur.slice(last.index)];
    if (last.type === 'clear') next = last.strokes;
    commit(next);
    setUndo((u) => u.slice(0, -1));
    setRedo((r) => [...r, last]);
  };

  const doRedo = () => {
    const last = redo.at(-1);
    if (!last) return;
    apply(last, false);
    setUndo((u) => [...u, last]);
    setRedo((r) => r.slice(0, -1));
  };

  // Keyboard shortcuts: Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
      e.preventDefault();
      if (e.shiftKey) doRedo();
      else doUndo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const toPoint = (e: PointerEvent | React.PointerEvent): StrokePoint => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const pressure = e.pointerType === 'pen' ? (e.pressure || 0.5) : 0.5;
    return [Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)), Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)), pressure];
  };

  const rejected = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch' && penOnly) return true;
    // Large contact areas are almost certainly a palm once a pen is in use.
    if (e.pointerType === 'touch' && penSeen && (e.width > 30 || e.height > 30)) return true;
    return false;
  };

  const eraseAt = (p: StrokePoint) => {
    const r = 0.04;
    const cur = strokesRef.current;
    const idx = cur.findIndex((s) => s.points.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < r + s.size));
    if (idx >= 0) apply({ type: 'erase', index: idx, stroke: cur[idx] });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'pen' && !penSeen) setPenSeen(true);
    if (rejected(e) || active.current || e.button > 0) return;
    e.preventDefault();
    activity.ping();
    canvasRef.current?.setPointerCapture(e.pointerId);
    if (stylusMode) document.body.classList.add('is-writing');
    const p = toPoint(e);
    if (tool === 'eraser') {
      active.current = { id: e.pointerId, stroke: { points: [p], size: brushSize, pointerType: e.pointerType } };
      eraseAt(p);
      return;
    }
    active.current = { id: e.pointerId, stroke: { points: [p], size: brushSize, pointerType: e.pointerType } };
    redraw(strokesRef.current, active.current.stroke);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cur = active.current;
    if (!cur || cur.id !== e.pointerId) return;
    e.preventDefault();
    const events = (e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent]) as PointerEvent[];
    for (const ev of events) {
      const p = toPoint(ev);
      if (tool === 'eraser') {
        eraseAt(p);
        continue;
      }
      const last = cur.stroke.points.at(-1)!;
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) > 0.002) cur.stroke.points.push(p);
    }
    if (tool === 'pen') redraw(strokesRef.current, cur.stroke);
  };

  const finish = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cur = active.current;
    if (!cur || cur.id !== e.pointerId) return;
    active.current = null;
    document.body.classList.remove('is-writing');
    if (tool === 'pen') apply({ type: 'add', stroke: cur.stroke });
  };

  useEffect(() => () => document.body.classList.remove('is-writing'), []);

  const tools = (
    <div className="pad-tools" role="toolbar" aria-label={label ?? t('write.canvasLabel')}>
      <button type="button" className="icon-btn" aria-pressed={tool === 'pen'} onClick={() => setTool('pen')} aria-label={t('write.pen')} title={t('write.pen')}>
        <PenLine size={22} />
      </button>
      <button type="button" className="icon-btn" aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')} aria-label={t('write.eraser')} title={t('write.eraser')}>
        <Eraser size={22} />
      </button>
      <button type="button" className="icon-btn" onClick={doUndo} disabled={!undo.length} aria-label={t('write.undo')} title={t('write.undo')}>
        <Undo2 size={22} />
      </button>
      <button type="button" className="icon-btn" onClick={doRedo} disabled={!redo.length} aria-label={t('write.redo')} title={t('write.redo')}>
        <Redo2 size={22} />
      </button>
      <button type="button" className="icon-btn" onClick={() => apply({ type: 'clear', strokes: strokesRef.current })} disabled={!strokes.length} aria-label={t('write.clear')} title={t('write.clear')}>
        <Trash2 size={22} />
      </button>
      {showGridToggle && (
        <button type="button" className="icon-btn" aria-pressed={grid} onClick={() => onGrid?.(!grid)} aria-label={t('write.grid')} title={t('write.grid')}>
          <Grid3x3 size={22} />
        </button>
      )}
      {onBrushSize && (
        <div className="pad-sizes" role="group" aria-label={t('write.size')}>
          {SIZES.map((s) => (
            <button key={s} type="button" className="pad-size" aria-pressed={Math.abs(s - brushSize) < 0.001} onClick={() => onBrushSize(s)} aria-label={`${t('write.size')} ${SIZES.indexOf(s) + 1}`}>
              <span style={{ width: 6 + SIZES.indexOf(s) * 5, height: 6 + SIZES.indexOf(s) * 5 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`pad${leftHanded ? ' pad--left' : ''}${stylusMode ? ' pad--stylus' : ''}`}>
      {tools}
      <div className="pad-surface" ref={wrapRef}>
        {grid && <div className="pad-grid" aria-hidden="true" />}
        {underlay && <div className="pad-layer">{underlay}</div>}
        <canvas
          ref={canvasRef}
          className="pad-canvas"
          role="img"
          aria-label={label ?? t('write.canvasLabel')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finish}
          onPointerCancel={finish}
          onContextMenu={(e) => e.preventDefault()}
        />
        {overlay && <div className="pad-layer pad-layer--over">{overlay}</div>}
      </div>
      {penSeen && <p className="subtle pad-note">{penOnly ? t('write.penDetected') : t('write.pressure')}</p>}
    </div>
  );
});
