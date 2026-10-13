import { useState } from 'react';
import { UserRound } from 'lucide-react';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => [...p][0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Round profile picture: the Google photo when there is one (and it loads), else initials.
 * `frame` is an equipped avatar frame item (e.g. `frame-gold`, drawn by CSS).
 */
export function Avatar({ name, picture, size = 40, frame }: { name: string; picture?: string; size?: number; frame?: string | null }) {
  const [failed, setFailed] = useState<string | null>(null);
  const showPicture = Boolean(picture) && failed !== picture;
  const letters = initials(name);
  const face = (
    <span className="avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }} aria-hidden="true">
      {showPicture ? (
        // Google profile photos refuse requests that carry a referrer.
        <img src={picture} alt="" referrerPolicy="no-referrer" onError={() => setFailed(picture ?? null)} />
      ) : letters ? (
        letters
      ) : (
        <UserRound size={Math.round(size * 0.55)} />
      )}
    </span>
  );
  if (!frame) return face;
  return (
    <span className="avatar-frame" data-frame={frame.replace(/^frame-/, '')} style={{ ['--frame-w' as string]: `${Math.max(3, Math.round(size * 0.07))}px` }}>
      {face}
    </span>
  );
}
