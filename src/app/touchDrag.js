// Finger dragging for the sequencing cards. HTML5 drag-and-drop (onDragStart/onDrop) only works with a mouse.
// Hold a card briefly, then drag it onto an element marked data-drop ("pool" or a slot index).
// A tap (quick or slow) still fires the normal click (tap-to-place); a swipe that starts moving at once still scrolls.
const HOLD_MS = 180;
const MOVE_TOLERANCE = 8;

export function touchDrag(onDrop) {
  return (e) => {
    if (e.touches.length !== 1) return;
    const card = e.currentTarget;
    const { clientX: x0, clientY: y0 } = e.touches[0];
    let ghost = null;
    let over = null;
    let moved = false;

    const begin = () => {
      const r = card.getBoundingClientRect();
      ghost = card.cloneNode(true);
      ghost.removeAttribute('id');
      // The copy lives on <body>, outside the app root, so carry over the inherited text styles.
      const cs = getComputedStyle(card);
      Object.assign(ghost.style, {
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        position: 'fixed',
        left: r.left + 'px',
        top: r.top + 'px',
        width: r.width + 'px',
        height: r.height + 'px',
        margin: '0',
        zIndex: '50',
        pointerEvents: 'none',
        transform: 'scale(1.03)',
        boxShadow: '0 16px 36px rgba(4,18,22,.5)'
      });
      document.body.appendChild(ghost);
      card.classList.add('nv-dragging');
      try {
        navigator.vibrate?.(10);
      } catch (_) {}
    };
    const timer = setTimeout(begin, HOLD_MS);

    const targetAt = (x, y) => document.elementFromPoint(x, y)?.closest('[data-drop]') || null;
    const setOver = (t) => {
      if (t === over) return;
      over?.classList.remove('nv-drop-over');
      t?.classList.add('nv-drop-over');
      over = t;
    };

    const move = (ev) => {
      const p = ev.touches[0];
      if (!ghost) {
        // Moved before the hold finished: treat it as a scroll.
        if (Math.hypot(p.clientX - x0, p.clientY - y0) > MOVE_TOLERANCE) end();
        return;
      }
      ev.preventDefault();
      if (Math.hypot(p.clientX - x0, p.clientY - y0) > MOVE_TOLERANCE) moved = true;
      ghost.style.translate = `${p.clientX - x0}px ${p.clientY - y0}px`;
      setOver(targetAt(p.clientX, p.clientY));
    };
    const up = (ev) => {
      // A slow tap that never moved stays a tap: let the click through.
      if (ghost && moved) {
        ev.preventDefault(); // no click after a drag
        const p = ev.changedTouches[0];
        const t = targetAt(p.clientX, p.clientY);
        end();
        if (t) onDrop(t.dataset.drop);
        return;
      }
      end();
    };
    const end = () => {
      clearTimeout(timer);
      setOver(null);
      ghost?.remove();
      ghost = null;
      card.classList.remove('nv-dragging');
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
      document.removeEventListener('touchcancel', end);
    };

    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', up, { passive: false });
    document.addEventListener('touchcancel', end);
  };
}
