// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.

export default function Welcome({ v }) {
  return (
    <div
      onClick={v.splashSkip}
      style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden', background: '#102D35', display: 'flex' }}
    >
      {v.splashRunning ? (
        <button
          onClick={v.splashSkip}
          style={{
            position: 'absolute',
            zIndex: '3',
            top: 'calc(14px + env(safe-area-inset-top))',
            right: 'calc(14px + env(safe-area-inset-right))',
            minHeight: '44px',
            padding: '0 16px',
            borderRadius: '999px',
            border: '1px solid rgba(235,213,163,.35)',
            background: 'rgba(16,45,53,.7)',
            color: '#F6EAD2',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Kihagyás
        </button>
      ) : null}
      <img
        src="assets/command-room.webp"
        alt=""
        style={{
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '55% 40%'
        }}
      />
      <div style={{ position: 'absolute', inset: '0', pointerEvents: 'none', background: v.welcomeScrim }}></div>
      <div
        style={{
          position: 'relative',
          flex: '1',
          display: 'grid',
          gridTemplateColumns: v.welcomeGrid,
          alignItems: 'center',
          gap: '24px',
          padding: v.welcomePad,
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: v.welcomeAlign,
            textAlign: v.welcomeText,
            order: v.welcomeTextOrder
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: v.welcomeAlign,
              gap: '10px',
              opacity: v.sLogoOp,
              transform: v.sLogoTf,
              transition: 'opacity .7s ease, transform .7s ease'
            }}
          >
            <img
              src="assets/nova-star.webp"
              alt=""
              style={{
                width: v.starSize,
                height: v.starSize,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 28px rgba(243,197,104,.45))'
              }}
            />
            <h1
              style={{
                margin: '0',
                fontSize: v.wordmarkSize,
                lineHeight: '1',
                fontWeight: '900',
                letterSpacing: '.16em',
                color: '#FFF4DF',
                paddingLeft: '.16em'
              }}
            >
              NOVA
            </h1>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              alignItems: v.welcomeAlign,
              opacity: v.sTextOp,
              transform: v.sTextTf,
              transition: 'opacity .6s ease, transform .6s ease'
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: v.welcomeLead,
                lineHeight: '1.35',
                fontWeight: '700',
                color: '#F6EAD2',
                maxWidth: '22ch',
                textWrap: 'balance'
              }}
            >
              A megértés kalandot nyit.
            </p>
            <p style={{ margin: '0', fontSize: '18px', color: '#CFC3A8', maxWidth: '34ch', textWrap: 'pretty' }}>
              Szia, {v.name}! Az akadémia hősei már várnak a lebegő városban.
            </p>
            <button
              onClick={v.enterAcademy}
              style={{
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
                gap: '10px',
                boxShadow: '0 10px 30px rgba(243,197,104,.3)'
              }}
              className="nv-hover-2 nv-active-3"
            >
              Belépés az akadémiára
              <span
                aria-hidden="true"
                style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
              >
                arrow_forward
              </span>
            </button>
          </div>
        </div>
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            order: v.welcomeHeroOrder,
            paddingBottom: '28px'
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '-14%',
                right: '-14%',
                bottom: '-30px',
                height: '64px',
                borderRadius: '50%',
                border: '1.5px solid rgba(235,213,163,.4)',
                background:
                  'radial-gradient(closest-side, rgba(145,215,232,.22), rgba(16,45,53,.6) 70%, rgba(16,45,53,0))'
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
                height: v.welcomeHeroH,
                width: 'auto',
                filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.35))',
                opacity: v.sHeroOp,
                transform: v.sHeroTf,
                transition: 'opacity .9s ease, transform .9s ease'
              }}
            />{' '}
            {v.splashFx}
          </div>
        </div>
      </div>
    </div>
  );
}
