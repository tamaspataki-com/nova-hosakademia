import { useEffect, useRef, useState } from 'react';
import { Btn, Icon } from './ui.jsx';

// A talking-character clip inside an adventure step. The child starts it (no autoplay, no loop). Like the recordings and
// the intro video it is fetched whole and played from memory (a static host answers range requests with the whole file
// and iPhones may refuse such video). The spoken words are always shown as text by the step, so a clip that cannot play
// never blocks the adventure. Clips are online-only: no offline claim covers them.
export default function ClipPlayer({ clip, label, onPlayed }) {
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);
  const [tries, setTries] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const ctl = new AbortController();
    setSrc(null);
    setFailed(false);
    fetch(clip.src, { signal: ctl.signal })
      .then((r) => {
        if (!r.ok || !/^video\//i.test(r.headers.get('content-type') || '')) throw new Error('not a video');
        return r.blob();
      })
      .then((b) => setSrc(URL.createObjectURL(b)))
      .catch((e) => {
        if (e.name !== 'AbortError') setFailed(true);
      });
    return () => ctl.abort();
  }, [clip.src, tries]);
  useEffect(() => () => src && URL.revokeObjectURL(src), [src]);
  const ratio = clip.width && clip.height ? { aspectRatio: `${clip.width} / ${clip.height}` } : undefined;
  if (failed)
    return (
      <div className="note soft" role="alert">
        <Icon name="error" />
        <div className="stack tight">
          <span>A videót most nem sikerült lejátszani. A szöveg alatta olvasható, a kaland így is folytatható.</span>
          <div>
            <Btn icon="refresh" onClick={() => setTries((n) => n + 1)}>
              Újrapróbálom
            </Btn>
          </div>
        </div>
      </div>
    );
  return src ? (
    <video
      ref={ref}
      className="intro-video"
      src={`${src}#t=0.1`} // a picture instead of a black box before play
      style={ratio}
      controls
      playsInline
      preload="metadata"
      aria-label={label}
      onPlay={onPlayed}
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="intro-video loading" style={ratio} role="status">
      A videó betöltődik…
    </div>
  );
}
