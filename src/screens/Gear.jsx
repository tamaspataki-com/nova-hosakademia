// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { Fragment } from 'react';
import { list } from '../dc.js';

export default function Gear({ v }) {
  return (
    <div
      style={{
        padding: v.pagePad,
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {v.gearList ? (
        <Fragment>
          <div>
            <h1 style={{ margin: '0', fontSize: v.h1Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.15' }}>
              Felszerelés
            </h1>
            <p style={{ margin: '6px 0 0', color: '#CFC3A8' }}>
              {v.gearCount} / 5 eszköz megszerezve. Minden eszköz egy olvasási stratégiára emlékeztet.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: v.gearCols, gap: '14px' }}>
            {list(v.tools).map((t, tIndex) => (
              <button
                key={tIndex}
                onClick={t.onClick}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  textAlign: 'left',
                  padding: '14px 14px 16px',
                  borderRadius: '24px',
                  border: `1px solid ${t.border ?? ''}`,
                  background: '#1C454D',
                  color: '#F6EAD2',
                  cursor: 'pointer'
                }}
                className="nv-hover-5"
              >
                <span
                  style={{
                    display: 'block',
                    aspectRatio: '1/1',
                    borderRadius: '18px',
                    background: 'radial-gradient(70% 70% at 50% 45%, rgba(145,215,232,.16), rgba(11,35,41,.6))',
                    display: 'grid',
                    placeItems: 'center',
                    padding: '16px'
                  }}
                >
                  <img
                    src={t.src}
                    alt=""
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      opacity: t.opacity,
                      filter: t.filter
                    }}
                  />
                </span>{' '}
                <span style={{ fontSize: '17px', fontWeight: '800', lineHeight: '1.25' }}>{t.name}</span>{' '}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: t.statusColor
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '18px', lineHeight: '1' }}
                  >
                    {t.statusIcon}
                  </span>
                  {t.status}
                </span>
              </button>
            ))}
          </div>
        </Fragment>
      ) : null}
      {v.gearDetail ? (
        <Fragment>
          <button
            onClick={v.gearBack}
            style={{
              alignSelf: 'flex-start',
              minHeight: '48px',
              padding: '0 16px 0 10px',
              borderRadius: '14px',
              border: '1.5px solid rgba(235,213,163,.4)',
              background: 'transparent',
              color: '#F6EAD2',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span
              aria-hidden="true"
              style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '22px', lineHeight: '1' }}
            >
              arrow_back
            </span>
            Vissza a felszereléshez
          </button>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: v.detailCols,
              gap: '28px',
              alignItems: 'center',
              background: '#1C454D',
              border: '1px solid rgba(235,213,163,.2)',
              borderRadius: '28px',
              padding: v.detailPad
            }}
          >
            <div
              style={{
                aspectRatio: '1/1',
                borderRadius: '22px',
                background: 'radial-gradient(70% 70% at 50% 45%, rgba(145,215,232,.2), rgba(11,35,41,.7))',
                display: 'grid',
                placeItems: 'center',
                padding: '28px'
              }}
            >
              <img
                src={v.gd?.src}
                alt={v.gd?.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  opacity: v.gd?.opacity,
                  filter: v.gd?.filter
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '15px',
                  fontWeight: '800',
                  color: v.gd?.statusColor
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '20px', lineHeight: '1' }}
                >
                  {v.gd?.statusIcon}
                </span>
                {v.gd?.status}
              </span>
              <h1 style={{ margin: '0', fontSize: v.h2Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.15' }}>
                {v.gd?.name}
              </h1>
              <div style={{ background: '#FFF4DF', color: '#18343A', borderRadius: '18px', padding: '16px 18px' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '900',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: '#5A6E6B'
                  }}
                >
                  Stratégia
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>{v.gd?.strategy}</div>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#EBD5A3', marginBottom: '8px' }}>
                  Hogyan használd?
                </div>
                <ol
                  style={{
                    margin: '0',
                    paddingLeft: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    color: '#F6EAD2'
                  }}
                >
                  {list(v.gd?.steps).map((st, stIndex) => (
                    <li key={stIndex}>{st}</li>
                  ))}
                </ol>
              </div>
              <p style={{ margin: '0', fontSize: '16px', color: '#CFC3A8' }}>{v.gd?.note}</p>
            </div>
          </div>
        </Fragment>
      ) : null}
    </div>
  );
}
