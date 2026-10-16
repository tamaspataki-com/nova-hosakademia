// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { list } from '../dc.js';

export default function MapScreen({ v }) {
  return (
    <div
      style={{
        padding: v.pagePad,
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}
    >
      <div>
        <h1 style={{ margin: '0', fontSize: v.h1Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.15' }}>
          Világok
        </h1>
        <p style={{ margin: '6px 0 0', color: '#CFC3A8' }}>Válassz egy szigetet a térképen.</p>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3/2',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(235,213,163,.2)',
          boxShadow: '0 20px 50px rgba(4,18,22,.4)'
        }}
      >
        <img
          src="assets/map.webp"
          alt="Hat lebegő sziget hidakkal összekötve"
          style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {list(v.hotspots).map((h, hIndex) => (
          <button
            key={hIndex}
            onClick={h.onClick}
            aria-label={h.label}
            aria-pressed={h.pressed}
            style={{
              position: 'absolute',
              left: h.left,
              top: h.top,
              transform: 'translate(-50%,-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minHeight: '48px',
              minWidth: '48px',
              padding: h.pad,
              borderRadius: '999px',
              border: `2px solid ${h.border ?? ''}`,
              background: h.bg,
              color: h.color,
              fontWeight: '800',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(4,18,22,.4)',
              whiteSpace: 'nowrap'
            }}
          >
            <span
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: h.numBg,
                color: h.numColor,
                display: 'grid',
                placeItems: 'center',
                fontSize: '15px',
                fontWeight: '900'
              }}
            >
              {h.n}
            </span>{' '}
            {h.showLabel ? <span>{h.label}</span> : null}
          </button>
        ))}
      </div>
      {v.mapHasSel ? (
        <section
          aria-live="polite"
          style={{
            background: '#1C454D',
            border: '1px solid rgba(235,213,163,.2)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '900', color: '#FFF4DF' }}>{v.mapSel?.label}</h2>
            <button
              onClick={v.mapClose}
              aria-label="Bezárás"
              style={{
                width: '48px',
                height: '48px',
                flex: 'none',
                borderRadius: '14px',
                border: '0',
                background: 'rgba(235,213,163,.1)',
                color: '#F6EAD2',
                cursor: 'pointer',
                fontFamily: "'Material Symbols Rounded'",
                fontSize: '24px'
              }}
            >
              close
            </button>
          </div>
          <p style={{ margin: '0', color: '#E4D8BE', textWrap: 'pretty' }}>{v.mapSel?.purpose}</p>
          {v.mapSel?.playable ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
              <button
                onClick={v.startMission}
                style={{
                  minHeight: '56px',
                  padding: '0 26px',
                  border: '0',
                  borderRadius: '16px',
                  background: '#F3C568',
                  color: '#18343A',
                  fontSize: '18px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                className="nv-hover-2"
              >
                {v.missionBtnLabel}
                <span
                  aria-hidden="true"
                  style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                >
                  arrow_forward
                </span>
              </button>
              <span style={{ fontSize: '16px', color: '#CFC3A8' }}>Az eltűnt energiamag · Kb. 8–10 perc</span>
            </div>
          ) : null}
          {v.mapSel?.soon ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '900',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: '#18343A',
                  background: '#EBD5A3',
                  padding: '4px 10px',
                  borderRadius: '999px'
                }}
              >
                Előnézet
              </span>{' '}
              <span style={{ color: '#91D7E8', fontWeight: '700' }}>
                Ez a terület hamarosan új küldetésekkel bővül.
              </span>
            </div>
          ) : null}
        </section>
      ) : null}
      {v.isNarrow ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ margin: '6px 0 2px', fontSize: '17px', fontWeight: '800', color: '#EBD5A3' }}>Úti célok</h2>
          {list(v.hotspots).map((h, hIndex) => (
            <button
              key={hIndex}
              onClick={h.onClick}
              aria-pressed={h.pressed}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minHeight: '56px',
                padding: '8px 14px',
                borderRadius: '16px',
                border: `1px solid ${h.listBorder ?? ''}`,
                background: '#1C454D',
                color: '#F6EAD2',
                fontSize: '17px',
                fontWeight: '700',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <span
                style={{
                  width: '30px',
                  height: '30px',
                  flex: 'none',
                  borderRadius: '50%',
                  background: h.numBg,
                  color: h.numColor,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '15px',
                  fontWeight: '900'
                }}
              >
                {h.n}
              </span>{' '}
              <span style={{ flex: '1' }}>{h.label}</span>{' '}
              <span style={{ fontSize: '14px', color: h.tagColor, fontWeight: '700' }}>{h.tag}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
