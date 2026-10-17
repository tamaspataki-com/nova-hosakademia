// The device cache for recorded narration. Only a successful response that really is audio is ever kept: a missing
// file can come back from the host as the app page (status 200, text/html) and must never be stored or played.
export const AUDIO_CACHE = 'nova-audio';

export const isAudioResponse = (res) => !!res && res.ok && /^audio\//i.test(res.headers.get('content-type') || '');

export async function evictRecording(url) {
  try {
    if (typeof caches !== 'undefined') await (await caches.open(AUDIO_CACHE)).delete(url);
  } catch (e) {
    /* no cache storage: nothing to remove */
  }
}

// Keep a validated copy, replacing whatever was stored for this url before.
export async function storeRecording(url, res) {
  try {
    if (typeof caches !== 'undefined' && isAudioResponse(res)) await (await caches.open(AUDIO_CACHE)).put(url, res);
  } catch (e) {
    /* the clip still plays; it just is not kept for offline use */
  }
}
