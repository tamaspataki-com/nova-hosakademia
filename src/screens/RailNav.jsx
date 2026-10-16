// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { list } from '../dc.js';

export default function RailNav({ v }) {
  return (
    <nav
      aria-label="Fő navigáció"
      style={{
        width: '108px',
        flex: 'none',
        position: 'sticky',
        top: '0',
        height: '100dvh',
        background: '#0B2329',
        borderRight: '1px solid rgba(235,213,163,.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '22px 0 18px',
        gap: '8px',
        zIndex: '5'
      }}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', paddingBottom: '18px' }}
      >
        <img src="assets/nova-star.webp" alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />{' '}
        <span
          style={{ fontWeight: '900', letterSpacing: '.2em', fontSize: '14px', color: '#EBD5A3', paddingLeft: '.2em' }}
        >
          NOVA
        </span>
      </div>
      {list(v.navItems).map((item, itemIndex) => (
        <button
          key={itemIndex}
          onClick={item.onClick}
          aria-current={item.current}
          style={{
            width: '88px',
            minHeight: '74px',
            border: '0',
            borderRadius: '20px',
            background: item.bg,
            color: item.color,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '800',
            transition: 'background .15s'
          }}
          className="nv-hover-0"
        >
          <span
            aria-hidden="true"
            style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '27px', lineHeight: '1' }}
          >
            {item.icon}
          </span>{' '}
          <span>{item.label}</span>
        </button>
      ))}
      <div style={{ flex: '1' }}></div>
      <button
        onClick={v.openProfile}
        aria-label="Profil és beállítások"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '2px solid rgba(235,213,163,.4)',
          background: '#1C454D',
          color: '#F6EAD2',
          fontWeight: '900',
          fontSize: '19px',
          cursor: 'pointer'
        }}
      >
        {v.initial}
      </button>
    </nav>
  );
}
