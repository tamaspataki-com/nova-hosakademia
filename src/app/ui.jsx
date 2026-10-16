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
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
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
