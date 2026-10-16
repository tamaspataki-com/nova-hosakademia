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
              <p style={{ margin: '6px 0 0', fontSize: v.leadSize, color: '#E4D8BE' }}>{v.homeLead}</p>
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
            <div
              style={{
                position: 'relative',
                aspectRatio: v.cardImgAspect,
                minHeight: v.cardImgMinH,
                overflow: 'hidden'
              }}
            >
              <img
                src="assets/map.webp"
                alt={v.nextCard.title}
                style={{
                  position: 'absolute',
                  inset: '0',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: v.nextCard.imgPos,
                  transform: 'scale(1.7)',
                  transformOrigin: v.nextCard.imgPos,
                  display: 'block'
                }}
              />
              <img
                src={v.nextCard.toolSrc}
                alt=""
                style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '10px',
                  width: '34%',
                  maxWidth: '140px',
                  filter: 'drop-shadow(0 10px 18px rgba(0,0,0,.45))'
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
                {v.nextCard.eyebrow}
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
                {v.nextCard.title}
              </h2>
              <p style={{ margin: '0', fontSize: '18px', color: '#F6EAD2', textWrap: 'pretty' }}>{v.nextCard.task}</p>
              {v.nextCard.reward ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', color: '#E4D8BE' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '20px',
                      lineHeight: '1',
                      color: '#91D7E8'
                    }}
                  >
                    redeem
                  </span>
                  <span>
                    Jutalom: <b style={{ color: '#FFF4DF' }}>{v.nextCard.reward}</b>
                  </span>
                </div>
              ) : null}
              <div style={{ display: 'flex', marginTop: '4px' }}>
                <button
                  onClick={v.nextCard.onClick}
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
                  {v.nextCard.btnLabel}
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </article>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{ margin: '0', fontSize: '16px', fontWeight: '800', color: '#EBD5A3' }}>{v.trailTitle}</h2>
            <ol
              style={{
                margin: '0',
                padding: '0',
                listStyle: 'none',
                display: 'grid',
                gridTemplateColumns: v.trailCols,
                gap: '10px'
              }}
            >
              {list(v.trail).map((t, tIndex) => (
                <li key={tIndex} style={{ display: 'flex' }}>
                  <button
                    onClick={t.onClick}
                    aria-label={t.n + '. állomás: ' + t.label + ', ' + t.toolName + ' – ' + t.sub}
                    style={{
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      textAlign: 'center',
                      minHeight: '120px',
                      padding: '10px 8px 12px',
                      borderRadius: '18px',
                      border: `2px solid ${t.border ?? ''}`,
                      background: 'rgba(16,45,53,.86)',
                      color: '#F6EAD2',
                      cursor: 'pointer'
                    }}
                    className="nv-hover-4"
                  >
                    <img
                      src={t.toolSrc}
                      alt=""
                      style={{
                        width: '56px',
                        height: '56px',
                        objectFit: 'contain',
                        opacity: t.opacity,
                        filter: t.filter
                      }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1.2' }}>
                      {t.n}. {t.label}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: t.badgeColor
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '16px', lineHeight: '1' }}
                      >
                        {t.badge}
                      </span>
                      {t.sub}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: v.extraCols, gap: '10px' }}>
            {list(v.homeExtras).map((d, dIndex) => (
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
