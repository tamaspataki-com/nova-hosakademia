import { useCallback, useEffect, useState } from 'react';
import { RECORDINGS } from '../content/audio.js';
import { isAudioResponse } from './recordings.js';

// Offline readiness is never assumed. An adventure is "available offline" only after its required files have been
// found in the device's caches: the app shell (the page, controlled by the service worker), its cover picture, and
// every recording that belongs to it. Adventures without recordings make no offline claim (see offlineApplies).
export const adventureFiles = (adv) => ({
  images: [adv.coverAsset].filter(Boolean),
  audio: Object.entries(RECORDINGS)
    .filter(([id]) => id.startsWith(`${adv.id}:`))
    .map(([, url]) => url)
});
export const offlineApplies = (adv) => adventureFiles(adv).audio.length > 0;

const cached = async (url, ignoreSearch) => {
  try {
    return !!(await caches.match(url, { ignoreSearch })); // precached files carry a revision query
  } catch (e) {
    return false;
  }
};

// A recording only counts when the cached entry is a valid audio response (not an app page or a failed download).
const cachedAudio = async (url) => {
  try {
    return isAudioResponse(await caches.match(url));
  } catch (e) {
    return false;
  }
};

// -> { ready, shell, missing: number, total: number }
export async function checkOffline(adv) {
  if (typeof caches === 'undefined') return { ready: false, shell: false, missing: -1, total: 0, unsupported: true };
  const f = adventureFiles(adv);
  const shell = !!navigator.serviceWorker?.controller && (await cached('index.html', true));
  const have = [
    ...(await Promise.all(f.images.map((u) => cached(u, true)))),
    ...(await Promise.all(f.audio.map((u) => cachedAudio(u))))
  ];
  const total = have.length;
  const missing = have.filter((x) => !x).length;
  return { ready: shell && missing === 0, shell, missing, total };
}

// 'checking' | 'ready' | 'preparing' (online, files still arriving) | 'unavailable' (offline and not all cached)
// | 'unsupported' (this browser has no cache storage) | null (this adventure makes no offline claim)
export function useOfflineStatus(adv) {
  const [state, setState] = useState(offlineApplies(adv) ? 'checking' : null);
  const run = useCallback(async () => {
    if (!offlineApplies(adv)) return setState(null);
    const r = await checkOffline(adv);
    if (r.unsupported) return setState('unsupported');
    setState(r.ready ? 'ready' : navigator.onLine ? 'preparing' : 'unavailable');
  }, [adv]);

  useEffect(() => {
    run();
    const again = () => run();
    window.addEventListener('online', again);
    window.addEventListener('offline', again);
    window.addEventListener('nova:warmed', again);
    // While files are still arriving, look again every few seconds (stops once ready).
    const t = setInterval(() => run(), 4000);
    return () => {
      window.removeEventListener('online', again);
      window.removeEventListener('offline', again);
      window.removeEventListener('nova:warmed', again);
      clearInterval(t);
    };
  }, [run]);
  return state;
}

export const OFFLINE_UNAVAILABLE_TEXT =
  'Ez a kaland offline most nem érhető el teljesen: néhány felvétel még nincs letöltve ezen az eszközön. Csatlakozz az internethez, vagy olvasással is folytathatod.';
