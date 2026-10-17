import { useEffect, useRef } from 'react';

export const Icon = ({ name, size, fill, className = '' }) => (
  <span
    aria-hidden="true"
    className={`ms ${className}`}
    style={{ ...(size ? { fontSize: size } : null), ...(fill ? { fontVariationSettings: "'FILL' 1" } : null) }}
  >
    {name}
  </span>
);

// A restrained dinosaur silhouette (a long-necked herbivore) used until illustrations are supplied.
export const DinoIcon = ({ size = 48 }) => (
  <svg
    viewBox="0 0 120 80"
    width={size}
    height={(size * 80) / 120}
    aria-hidden="true"
    fill="currentColor"
    stroke="currentColor"
  >
    <ellipse cx="52" cy="46" rx="27" ry="14" stroke="none" />
    <path d="M70 40 C 82 38, 87 26, 89 14" fill="none" strokeWidth="9" strokeLinecap="round" />
    <ellipse cx="94" cy="11" rx="9" ry="5.5" stroke="none" transform="rotate(-12 94 11)" />
    <path d="M27 44 C 16 46, 9 53, 4 63" fill="none" strokeWidth="8" strokeLinecap="round" />
    {[34, 46, 60, 72].map((x) => (
      <rect key={x} x={x} y="52" width="8" height="20" rx="4" stroke="none" />
    ))}
  </svg>
);

// Material icon by name, or the dinosaur silhouette for the name 'dino'.
export const Glyph = ({ name, size = 24 }) =>
  name === 'dino' ? <DinoIcon size={size} /> : <Icon name={name} size={size} />;

export function Btn({ kind = 'primary', icon, iconAfter, children, className = '', ...rest }) {
  return (
    <button type="button" className={`btn btn-${kind} ${className}`} {...rest}>
      {icon ? <Icon name={icon} /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} /> : null}
    </button>
  );
}

export const Chip = ({ tone = '', children, ...rest }) => (
  <span className={`chip ${tone}`} {...rest}>
    {children}
  </span>
);

// Modal bottom sheet: Escape and backdrop close it, focus moves in and returns to where it came from.
export function Sheet({ title, onClose, children, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const tabbables = () =>
      [...(ref.current?.querySelectorAll('button,a[href],input,select,textarea,[tabindex]') || [])].filter(
        (e) => !e.disabled && e.tabIndex >= 0 && e.getClientRects().length
      );
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      // Keep Tab inside the panel while it is open.
      if (e.key === 'Tab' && ref.current) {
        const list = tabbables();
        if (!list.length) return e.preventDefault();
        const at = list.indexOf(document.activeElement);
        if (e.shiftKey && at <= 0) {
          e.preventDefault();
          list[list.length - 1].focus();
        } else if (!e.shiftKey && (at === list.length - 1 || !ref.current.contains(document.activeElement))) {
          e.preventDefault();
          list[0].focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // Back to whatever opened the panel; if that is gone, to the step heading.
      const target = prev && document.contains(prev) ? prev : document.querySelector('[data-focus-fallback]');
      target?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="sheet-back" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`sheet ${wide ? 'wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" aria-label="Bezárás" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const fmtTime = (t) => {
  const d = new Date(t);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getMonth() + 1)}.${p(d.getDate())}. ${p(d.getHours())}:${p(d.getMinutes())}`;
};

// A heading that receives focus when its screen opens (tabindex -1), so the next Tab reaches the first control.
export function useHeadingFocus() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}
