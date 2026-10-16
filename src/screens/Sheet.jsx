// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { Fragment } from 'react';
import { list } from '../dc.js';

export default function Sheet({ v }) {
  return (
    <div
      onClick={v.closeSheet}
      style={{
        position: 'fixed',
        inset: '0',
        zIndex: '20',
        background: 'rgba(6,20,24,.72)',
        display: 'flex',
        alignItems: v.sheetAlign,
        justifyContent: 'center',
        padding: v.sheetOuterPad
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={v.sheetTitle}
        onClick={v.stop}
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '86dvh',
          overflow: 'auto',
          background: '#1C454D',
          border: '1px solid rgba(235,213,163,.2)',
          borderRadius: v.sheetRadius,
          padding: '22px 22px calc(26px + env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 -10px 50px rgba(0,0,0,.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <h2 style={{ margin: '0', fontSize: '22px', fontWeight: '900', color: '#FFF4DF' }}>{v.sheetTitle}</h2>
          <button
            onClick={v.closeSheet}
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
        {v.shGlossary ? (
          <Fragment>
            {list(v.glossList).map((gl, glIndex) => (
              <div
                key={glIndex}
                style={{
                  background: '#FFF4DF',
                  color: '#18343A',
                  borderRadius: '18px',
                  padding: '14px 16px',
                  border: `3px solid ${gl.border ?? ''}`
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: '900' }}>{gl.word}</div>
                <div style={{ fontSize: '18px', lineHeight: '1.55', marginTop: '2px' }}>{gl.def}</div>
              </div>
            ))}
          </Fragment>
        ) : null}
        {v.shStory ? (
          <Fragment>
            {list(v.storySecs).map((ss, ssIndex) => (
              <article
                key={ssIndex}
                style={{ background: '#FFF4DF', color: '#18343A', borderRadius: '18px', padding: '16px 18px' }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '900',
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    color: '#5A6E6B',
                    marginBottom: '4px'
                  }}
                >
                  {ss.label}
                </div>
                <p style={{ margin: '0', fontSize: v.readSize, lineHeight: '1.65' }}>
                  {list(ss.sentences).map((sn, snIndex) => (
                    <span key={snIndex} style={{ background: sn.bg, borderRadius: '4px' }}>
                      {sn.text}{' '}
                    </span>
                  ))}
                </p>
              </article>
            ))}
          </Fragment>
        ) : null}
        {v.shHelp ? (
          <Fragment>
            {v.helpHintShown ? (
              <div
                style={{
                  background: 'rgba(235,213,163,.1)',
                  border: '1px solid rgba(235,213,163,.4)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  gap: '10px',
                  fontSize: '17px'
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "'Material Symbols Rounded'",
                    fontSize: '24px',
                    lineHeight: '1',
                    color: '#F3C568'
                  }}
                >
                  lightbulb
                </span>
                <span>{v.helpHintText}</span>
              </div>
            ) : null}
            {list(v.helpActions).map((ha, haIndex) => (
              <button
                key={haIndex}
                onClick={ha.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  minHeight: '60px',
                  padding: '10px 16px',
                  borderRadius: '16px',
                  border: '1px solid rgba(235,213,163,.2)',
                  background: '#102D35',
                  color: '#F6EAD2',
                  fontSize: '17px',
                  fontWeight: '800',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                className="nv-hover-1"
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '40px',
                    height: '40px',
                    flex: 'none',
                    borderRadius: '12px',
                    background: 'rgba(145,215,232,.14)',
                    color: '#91D7E8',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: "'Material Symbols Rounded'",
                    fontSize: '22px',
                    lineHeight: '1'
                  }}
                >
                  {ha.icon}
                </span>{' '}
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{ha.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#CFC3A8' }}>{ha.sub}</span>
                </span>
              </button>
            ))}
            <p style={{ margin: '0', fontSize: '15px', color: '#CFC3A8' }}>Amit eddig csináltál, el van mentve.</p>
          </Fragment>
        ) : null}
        {v.shStrategy ? (
          <Fragment>
            {list(v.stratList).map((sl3, sl3Index) => (
              <div
                key={sl3Index}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  background: '#102D35',
                  borderRadius: '16px',
                  padding: '12px 14px'
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '40px',
                    height: '40px',
                    flex: 'none',
                    borderRadius: '12px',
                    background: 'rgba(243,197,104,.16)',
                    color: '#F3C568',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: "'Material Symbols Rounded'",
                    fontSize: '22px',
                    lineHeight: '1'
                  }}
                >
                  {sl3.icon}
                </span>{' '}
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '17px', fontWeight: '900' }}>
                    {sl3.n}. {sl3.label}
                  </span>
                  <span style={{ fontSize: '15px', color: '#E4D8BE' }}>{sl3.text}</span>
                </span>
              </div>
            ))}
          </Fragment>
        ) : null}
        {v.shProfile ? (
          <Fragment>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#102D35',
                  border: '2px solid #EBD5A3',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '26px',
                  fontWeight: '900'
                }}
              >
                {v.initial}
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900' }}>{v.name}</div>
                <div style={{ fontSize: '15px', color: '#CFC3A8' }}>Az akadémia tanulója</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#102D35', borderRadius: '16px', padding: '12px 14px' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#F3C568' }}>{v.completedCount} / 1</div>
                <div style={{ fontSize: '14px', color: '#CFC3A8' }}>teljesített küldetés</div>
              </div>
              <div style={{ background: '#102D35', borderRadius: '16px', padding: '12px 14px' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#F3C568' }}>{v.gearCount} / 5</div>
                <div style={{ fontSize: '14px', color: '#CFC3A8' }}>felfedezett eszköz</div>
              </div>
            </div>
            <button
              onClick={v.goParent}
              style={{
                alignSelf: 'flex-start',
                minHeight: '48px',
                padding: '0 14px 0 10px',
                borderRadius: '12px',
                border: '1px solid rgba(235,213,163,.3)',
                background: 'transparent',
                color: '#CFC3A8',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span
                aria-hidden="true"
                style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '20px', lineHeight: '1' }}
              >
                lock
              </span>
              Szülői tér
            </button>
          </Fragment>
        ) : null}
      </div>
    </div>
  );
}
