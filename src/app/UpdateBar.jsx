import { useEffect, useRef } from 'react';
import { applyUpdate, useUpdateReady } from './update.js';
import { Btn, Icon } from './ui.jsx';

// PERMANENT RULE (see CLAUDE.md): whenever a new version is ready, this bar appears at the top of the main app and
// stays until the app is updated. It is NOT rendered while an adventure is active (App.jsx: adventure screens and their
// help panels, a break taken from an adventure, the completion screen) – it is offered once the child is back in the
// main app. It never reloads by itself, only when someone taps „Frissítés"; saved progress survives the reload.
export default function UpdateBar() {
  const ready = useUpdateReady();
  const ref = useRef(null);

  // Other sticky elements (the side rail, the adventure bar) sit below it: publish its height as --update-h.
  useEffect(() => {
    const root = document.documentElement;
    if (!ready || !ref.current) {
      root.style.setProperty('--update-h', '0px');
      return;
    }
    const set = () => root.style.setProperty('--update-h', `${ref.current.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      root.style.setProperty('--update-h', '0px');
    };
  }, [ready]);

  if (!ready) return null;
  return (
    <div ref={ref} className="update-bar" role="status">
      <span className="update-text">
        <Icon name="system_update" /> <strong>Új verzió érhető el</strong>
        <span className="muted"> A haladásod megmarad.</span>
      </span>
      <Btn className="small" onClick={applyUpdate}>
        Frissítés
      </Btn>
    </div>
  );
}
