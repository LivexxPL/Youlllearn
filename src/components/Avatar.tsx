import { useState } from 'react';
import { UserRound } from 'lucide-react';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => [...p][0]?.toUpperCase() ?? '')
    .join('');
}

/** Round profile picture: the Google photo when there is one (and it loads), else initials. */
export function Avatar({ name, picture, size = 40 }: { name: string; picture?: string; size?: number }) {
  const [failed, setFailed] = useState<string | null>(null);
  const showPicture = Boolean(picture) && failed !== picture;
  const letters = initials(name);
  return (
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
}
