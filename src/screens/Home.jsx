// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { list } from '../dc.js';

export default function Home({ v }) {
  return (
    <div style={{ position: 'relative', minHeight: v.homeMinH, overflow: 'hidden', background: '#102D35' }}>
      <img
        src="assets/command-room.webp"
        alt=""
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          width: '100%',
          height: v.homeBgH,
          objectFit: 'cover',
          objectPosition: '60% 40%'
        }}
      />
      <div style={{ position: 'absolute', inset: '0', pointerEvents: 'none', background: v.homeScrim }}></div>
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: v.homeGrid,
          gap: '32px',
          padding: v.homePad,
          minHeight: v.homeMinH
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: v.homeGap,
            minWidth: '0',
            maxWidth: '860px',
            width: '100%',
            margin: '0 auto'
          }}
        >
          {v.isNarrow ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src="assets/nova-star.webp"
                  alt=""
                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                />{' '}
                <span style={{ fontWeight: '900', letterSpacing: '.2em', fontSize: '15px', color: '#EBD5A3' }}>
                  NOVA
                </span>
              </div>
              <button
                onClick={v.openProfile}
                aria-label="Profil és beállítások"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '2px solid rgba(235,213,163,.45)',
                  background: '#1C454D',
                  color: '#F6EAD2',
                  fontWeight: '900',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                {v.initial}
              </button>
            </div>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'center', gap: v.greetGap }}>
            {v.showPortraitM ? (
              <div
                aria-hidden="true"
                style={{
                  width: '112px',
                  height: '112px',
                  flex: 'none',
                  borderRadius: '28px',
                  border: '2px solid rgba(235,213,163,.45)',
                  background:
                    'url(assets/hero.webp) -73px 4px / 230% auto no-repeat, radial-gradient(circle at 50% 30%, #2A6470, #1C454D)'
                }}
              ></div>
            ) : null}
            {v.showPortraitS ? (
              <div
                aria-hidden="true"
                style={{
                  width: '64px',
                  height: '64px',
                  flex: 'none',
                  borderRadius: '50%',
                  border: '2px solid rgba(235,213,163,.5)',
                  background:
                    'url(assets/hero.webp) -41px 3px / 230% auto no-repeat, radial-gradient(circle at 50% 30%, #2A6470, #1C454D)'
                }}
              ></div>
            ) : null}
            <div style={{ minWidth: '0' }}>
              <h1
                style={{
                  margin: '0',
                  fontSize: v.h1Size,
                  lineHeight: '1.1',
                  fontWeight: '900',
                  letterSpacing: '-.01em',
                  color: '#FFF4DF'
                }}
              >
                Szia, {v.name}!
              </h1>
              <p style={{ margin: '6px 0 0', fontSize: v.leadSize, color: '#E4D8BE' }}>
                Új kaland vár a lebegő városban.
              </p>
            </div>
          </div>
          <article
            style={{
              display: 'grid',
              gridTemplateColumns: v.cardCols,
              background: '#1C454D',
              border: '1px solid rgba(235,213,163,.24)',
              borderRadius: '26px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(4,18,22,.45)'
            }}
          >
            <div style={{ position: 'relative', aspectRatio: v.cardImgAspect, minHeight: v.cardImgMinH }}>
              <img
                src="assets/map.webp"
                alt="A lebegő szigetek világa"
                style={{
                  position: 'absolute',
                  inset: '0',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 45%',
                  display: 'block'
                }}
              />
            </div>
            <div
              style={{
                padding: v.cardPad,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '12px',
                background: '#1C454D'
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '900',
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: '#F3C568'
                }}
              >
                Mai hősküldetés
              </div>
              <h2
                style={{
                  margin: '0',
                  fontSize: v.cardTitleSize,
                  lineHeight: '1.15',
                  fontWeight: '900',
                  color: '#FFF4DF',
                  textWrap: 'balance'
                }}
              >
                Olvass, hallgass, fedezd fel a lényeget!
              </h2>
              <ol
                style={{
                  margin: '0',
                  padding: '0',
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                {list(v.planRows).map((pr, prIndex) => (
                  <li key={prIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: '32px',
                        height: '32px',
                        flex: 'none',
                        borderRadius: '10px',
                        background: 'rgba(145,215,232,.12)',
                        color: pr.color,
                        display: 'grid',
                        placeItems: 'center',
                        fontFamily: "'Material Symbols Rounded'",
                        fontSize: '20px',
                        lineHeight: '1'
                      }}
                    >
                      {pr.icon}
                    </span>{' '}
                    <span style={{ flex: '1', minWidth: '0', fontWeight: pr.weight }}>{pr.label}</span>{' '}
                    <span style={{ fontSize: '14px', color: '#CFC3A8', textAlign: 'right' }}>{pr.sub}</span>
                  </li>
                ))}
              </ol>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
                <button
                  onClick={v.startDaily}
                  style={{
                    flex: v.ctaFlex,
                    minHeight: '58px',
                    padding: '0 30px',
                    border: '0',
                    borderRadius: '16px',
                    background: '#F3C568',
                    color: '#18343A',
                    fontSize: '18px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(243,197,104,.28)'
                  }}
                  className="nv-hover-2 nv-active-3"
                >
                  {v.planBtnLabel}
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                  >
                    arrow_forward
                  </span>
                </button>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '16px',
                    color: '#E4D8BE'
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '20px',
                      lineHeight: '1',
                      color: '#91D7E8'
                    }}
                  >
                    schedule
                  </span>
                  {v.planMinutes}
                </span>
              </div>
            </div>
          </article>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{ margin: '0', fontSize: '16px', fontWeight: '800', color: '#EBD5A3' }}>
              Vagy válassz egy gyakorlást
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: v.pathCols, gap: '10px' }}>
              {list(v.pathTiles).map((pt, ptIndex) => (
                <button
                  key={ptIndex}
                  onClick={pt.onClick}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '6px',
                    textAlign: 'left',
                    minHeight: '84px',
                    padding: '12px 14px',
                    borderRadius: '18px',
                    border: '1px solid rgba(235,213,163,.18)',
                    background: 'rgba(16,45,53,.86)',
                    color: '#F6EAD2',
                    cursor: 'pointer'
                  }}
                  className="nv-hover-4"
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '24px',
                      lineHeight: '1',
                      color: '#91D7E8'
                    }}
                  >
                    {pt.icon}
                  </span>{' '}
                  <span style={{ fontSize: '16px', fontWeight: '800', lineHeight: '1.2' }}>{pt.label}</span>{' '}
                  <span style={{ fontSize: '13px', color: '#CFC3A8' }}>{pt.sub}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: v.destCols, gap: '10px' }}>
            {list(v.destCards).map((d, dIndex) => (
              <button
                key={dIndex}
                onClick={d.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  minHeight: '60px',
                  padding: '8px 14px',
                  borderRadius: '18px',
                  border: '1px solid rgba(235,213,163,.14)',
                  background: 'rgba(16,45,53,.7)',
                  color: '#F6EAD2',
                  cursor: 'pointer'
                }}
                className="nv-hover-4"
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '36px',
                    height: '36px',
                    flex: 'none',
                    borderRadius: '12px',
                    background: 'rgba(235,213,163,.1)',
                    color: '#EBD5A3',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: "'Material Symbols Rounded'",
                    fontSize: '21px',
                    lineHeight: '1'
                  }}
                >
                  {d.icon}
                </span>{' '}
                <span style={{ display: 'flex', flexDirection: 'column', minWidth: '0', flex: '1' }}>
                  <span style={{ fontSize: '15px', fontWeight: '800', lineHeight: '1.25' }}>{d.label}</span>{' '}
                  <span style={{ fontSize: '14px', color: '#CFC3A8' }}>{d.sub}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        {v.showHeroRight ? (
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '36px',
              minWidth: '0'
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '-16%',
                  right: '-16%',
                  bottom: '-30px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(235,213,163,.35)',
                  background:
                    'radial-gradient(closest-side, rgba(145,215,232,.2), rgba(16,45,53,.65) 70%, rgba(16,45,53,0))'
                }}
              ></div>
              <div
                style={{
                  position: 'absolute',
                  left: '12%',
                  right: '12%',
                  bottom: '-12px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'radial-gradient(closest-side, rgba(4,18,22,.75), rgba(4,18,22,0))'
                }}
              ></div>
              <img
                src="assets/hero.webp"
                alt=""
                style={{
                  position: 'relative',
                  display: 'block',
                  height: v.heroH,
                  width: 'auto',
                  filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.35))'
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
