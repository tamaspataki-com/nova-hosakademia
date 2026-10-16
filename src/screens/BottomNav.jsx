// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { list } from '../dc.js';

export default function BottomNav({ v }) {
  return (
    <nav
      aria-label="Fő navigáció"
      style={{
        position: 'fixed',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: '5',
        background: 'rgba(11,35,41,.97)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(235,213,163,.14)',
        display: 'flex',
        padding: '6px 6px calc(6px + env(safe-area-inset-bottom))'
      }}
    >
      {list(v.navItems).map((item, itemIndex) => (
        <button
          key={itemIndex}
          onClick={item.onClick}
          aria-current={item.current}
          style={{
            flex: '1',
            minHeight: '62px',
            border: '0',
            borderRadius: '16px',
            background: item.bg,
            color: item.color,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '800'
          }}
        >
          <span
            aria-hidden="true"
            style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '26px', lineHeight: '1' }}
          >
            {item.icon}
          </span>{' '}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
