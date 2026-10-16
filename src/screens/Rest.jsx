// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { list } from '../dc.js';

export default function Rest({ v }) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: v.restMinH,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img
        src="assets/observatory.webp"
        alt=""
        style={{
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 30%'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(16,45,53,.25) 0%, rgba(16,45,53,.55) 45%, rgba(16,45,53,.92) 100%)'
        }}
      ></div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          padding: v.pagePad,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'stretch'
        }}
      >
        {v.restMenu ? (
          <div
            style={{
              background: 'rgba(16,45,53,.86)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(235,213,163,.2)',
              borderRadius: '28px',
              padding: '26px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <h1 style={{ margin: '0', fontSize: v.h1Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.15' }}>
              Pihenő
            </h1>
            <p style={{ margin: '0 0 6px', color: '#E4D8BE' }}>Itt nincs feladat. Maradj, ameddig jólesik.</p>
            {list(v.restChoices).map((r, rIndex) => (
              <button
                key={rIndex}
                onClick={r.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  minHeight: '64px',
                  padding: '10px 16px',
                  borderRadius: '18px',
                  border: '1px solid rgba(235,213,163,.22)',
                  background: '#1C454D',
                  color: '#F6EAD2',
                  fontSize: '18px',
                  fontWeight: '800',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                className="nv-hover-6"
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '42px',
                    height: '42px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: 'rgba(243,197,104,.16)',
                    color: '#F3C568',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: "'Material Symbols Rounded'",
                    fontSize: '24px',
                    lineHeight: '1'
                  }}
                >
                  {r.icon}
                </span>
                {r.label}
              </button>
            ))}
          </div>
        ) : null}
        {v.restBreath ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px', textAlign: 'center' }}
          >
            <div style={{ width: '240px', height: '240px', display: 'grid', placeItems: 'center' }}>{v.sphereEl}</div>
            <div
              style={{
                background: 'rgba(16,45,53,.86)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(235,213,163,.2)',
                borderRadius: '24px',
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                alignItems: 'center'
              }}
            >
              <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '900', color: '#FFF4DF' }}>Lassan megérkezem</h1>
              <p style={{ margin: '0', fontSize: '19px', color: '#F6EAD2', textWrap: 'pretty' }}>
                Lélegezz kényelmesen, a saját ritmusodban. A fényt akkor követheted, ha jólesik.
              </p>
              {v.rmOn ? (
                <p style={{ margin: '0', fontSize: '15px', color: '#CFC3A8' }}>
                  Csökkentett mozgás: a fény most nyugalomban marad.
                </p>
              ) : null}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={v.toggleBreath}
                  style={{
                    minHeight: '52px',
                    padding: '0 20px',
                    borderRadius: '16px',
                    border: '0',
                    background: '#91D7E8',
                    color: '#18343A',
                    fontSize: '17px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '22px', lineHeight: '1' }}
                  >
                    {v.breathIcon}
                  </span>
                  {v.breathLabel}
                </button>
                <button
                  onClick={v.restExit}
                  style={{
                    minHeight: '52px',
                    padding: '0 20px',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(235,213,163,.45)',
                    background: 'transparent',
                    color: '#F6EAD2',
                    fontSize: '17px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Kilépés
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {v.restText ? (
          <div
            style={{
              background: 'rgba(16,45,53,.88)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(235,213,163,.2)',
              borderRadius: '28px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(243,197,104,.16)',
                color: '#F3C568',
                display: 'grid',
                placeItems: 'center',
                fontFamily: "'Material Symbols Rounded'",
                fontSize: '28px',
                lineHeight: '1'
              }}
            >
              {v.restInfo?.icon}
            </span>
            <h1 style={{ margin: '0', fontSize: '26px', fontWeight: '900', color: '#FFF4DF' }}>{v.restInfo?.title}</h1>
            <p style={{ margin: '0', fontSize: '20px', lineHeight: '1.6', color: '#F6EAD2', textWrap: 'pretty' }}>
              {v.restInfo?.text}
            </p>
            <button
              onClick={v.restExit}
              style={{
                alignSelf: 'flex-start',
                minHeight: '52px',
                padding: '0 20px',
                borderRadius: '16px',
                border: '1.5px solid rgba(235,213,163,.45)',
                background: 'transparent',
                color: '#F6EAD2',
                fontSize: '17px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Kilépés
            </button>
          </div>
        ) : null}
        {v.restFromMission ? (
          <button
            onClick={v.startMission}
            style={{
              minHeight: '52px',
              padding: '0 20px',
              borderRadius: '16px',
              border: '0',
              background: '#F3C568',
              color: '#18343A',
              fontSize: '17px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Vissza a küldetéshez
          </button>
        ) : null}
      </div>
    </div>
  );
}
