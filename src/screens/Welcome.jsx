import { useEffect, useState } from 'react';
import { useStore } from '../app/store.jsx';
import { Icon } from '../app/ui.jsx';

// The animated intro, as in the original design. Stages (splash 0 → 5):
//   1  the hero rises into place        2  the watch pulses (light and ring)
//   3  a beam flies to the chest, the star lands there with a halo
//   4  the NOVA logo appears            5  the text and the "Belépés az akadémiára" button appear
// "Kihagyás" (or a tap anywhere) jumps to the end. With reduced motion (system or Beállítások) it starts at the end.
const STAGES = [
  [1, 80],
  [2, 1000],
  [3, 2300],
  [4, 3300],
  [5, 3900]
];

const useSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const on = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return size;
};

// A spot of light positioned on the hero picture (percentages of the picture).
const dot = (x, y, animation, extra) => ({
  position: 'absolute',
  left: x,
  top: y,
  pointerEvents: 'none',
  animation,
  ...extra
});

export default function Welcome({ go }) {
  const { state } = useStore();
  const [w, h] = useSize();
  // A phone turned sideways is short and wide: it gets the two-column layout with small type, so that everything still
  // fits on the first screen. Otherwise width decides.
  const short = h < 560 && w > h;
  const wide = w >= 900 || short;
  const tablet = !short && w >= 600 && w < 900;
  // Everything on the splash screen must fit on the first screen, without scrolling: the type scales with the height
  // and the hero picture takes whatever height is left.
  const fit = !wide;
  const name = (state.settings.name || '').trim() || 'Hős';

  const reduced =
    state.settings.reducedMotion ||
    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [splash, setSplash] = useState(reduced ? 5 : 0);

  useEffect(() => {
    if (reduced) return undefined;
    const timers = STAGES.map(([s, t]) => setTimeout(() => setSplash((cur) => (cur < s ? s : cur)), t));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = splash;
  const skip = () => {
    if (s < 5) setSplash(5);
  };

  const fx = (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {s >= 2 && s < 5 ? (
        <div
          key="watch"
          style={dot('68.8%', '39.3%', 'novaWatch 1.3s ease-in-out both', {
            width: '9%',
            aspectRatio: '1',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(145,215,232,.95) 0%, rgba(145,215,232,.45) 40%, rgba(145,215,232,0) 70%)'
          })}
        />
      ) : null}
      {s >= 2 && s < 4 ? (
        <div
          key="ring"
          style={dot('68.8%', '39.3%', 'novaRing 1.2s ease-out .15s both', {
            width: '7%',
            aspectRatio: '1',
            borderRadius: '50%',
            border: '2px solid rgba(145,215,232,.8)'
          })}
        />
      ) : null}
      {s >= 3 && s < 4 ? (
        <div
          key="beam"
          style={dot('60%', '34.5%', 'novaBeam .9s ease-out both', {
            width: '20%',
            height: '3px',
            borderRadius: '3px',
            transformOrigin: '100% 50%',
            rotate: '-30deg',
            background: 'linear-gradient(90deg, rgba(243,197,104,0), rgba(243,197,104,.9), rgba(145,215,232,.9))'
          })}
        />
      ) : null}
      {s >= 3 ? (
        <div
          key="halo"
          style={dot('52.2%', '29.8%', 'novaHalo 1.4s ease-out both', {
            width: '26%',
            aspectRatio: '1',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,228,160,.9) 0%, rgba(243,197,104,.5) 30%, rgba(243,197,104,0) 68%)'
          })}
        />
      ) : null}
      {s >= 3 ? (
        <img
          key="chest"
          src="assets/nova-star.webp"
          alt=""
          style={dot('52.2%', '29.8%', 'novaChest 1.1s cubic-bezier(.2,.9,.3,1.2) both', {
            width: '9%',
            height: 'auto',
            filter: 'drop-shadow(0 0 10px rgba(255,236,180,.95)) drop-shadow(0 0 22px rgba(243,197,104,.8))'
          })}
        />
      ) : null}
    </div>
  );

  const align = wide ? 'flex-start' : 'center';

  return (
    <div
      onClick={skip}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        height: wide && !short ? undefined : '100dvh',
        overflow: 'hidden',
        background: '#102D35',
        display: 'flex'
      }}
    >
      {s < 5 ? (
        <button
          type="button"
          onClick={skip}
          style={{
            position: 'absolute',
            zIndex: 3,
            top: 'calc(14px + env(safe-area-inset-top))',
            right: 'calc(14px + env(safe-area-inset-right))',
            minHeight: '48px',
            padding: '0 18px',
            borderRadius: '999px',
            border: '1px solid rgba(235,213,163,.35)',
            background: 'rgba(16,45,53,.7)',
            color: '#F6EAD2',
            fontSize: '15px',
            fontWeight: 700,
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
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '55% 40%'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: wide
            ? 'linear-gradient(90deg, rgba(16,45,53,.94) 0%, rgba(16,45,53,.8) 45%, rgba(16,45,53,.45) 100%)'
            : 'linear-gradient(180deg, rgba(16,45,53,.55) 0%, rgba(16,45,53,.72) 42%, rgba(16,45,53,.96) 68%)'
        }}
      />
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr',
          alignItems: 'center',
          gap: short ? '16px' : fit ? 'clamp(8px, 2dvh, 24px)' : '24px',
          minHeight: 0,
          padding: short
            ? '12px 28px'
            : wide
              ? '48px 64px'
              : 'calc(clamp(14px, 3dvh, 28px) + env(safe-area-inset-top)) 20px calc(clamp(16px, 3.5dvh, 36px) + env(safe-area-inset-bottom))',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: fit ? 'clamp(8px, 2dvh, 20px)' : short ? '10px' : '20px',
            alignItems: align,
            textAlign: wide ? 'left' : 'center',
            order: wide ? 0 : 1
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: align,
              gap: fit ? 'clamp(4px, 1dvh, 10px)' : '10px',
              opacity: s >= 4 ? 1 : 0,
              transform: s >= 4 ? 'none' : 'scale(.9) translateY(10px)',
              transition: 'opacity .7s ease, transform .7s ease'
            }}
          >
            <img
              src="assets/nova-star.webp"
              alt=""
              style={{
                width: short ? '44px' : wide ? '120px' : 'clamp(40px, 8dvh, 72px)',
                height: short ? '44px' : wide ? '120px' : 'clamp(40px, 8dvh, 72px)',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 28px rgba(243,197,104,.45))'
              }}
            />
            <h1
              style={{
                margin: 0,
                fontSize: short ? '40px' : wide ? '88px' : tablet ? '72px' : 'clamp(36px, 8dvh, 56px)',
                lineHeight: 1,
                fontWeight: 900,
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
              gap: fit ? 'clamp(8px, 2dvh, 20px)' : short ? '8px' : '20px',
              alignItems: align,
              opacity: s >= 5 ? 1 : 0,
              transform: s >= 5 ? 'none' : 'translateY(12px)',
              transition: 'opacity .6s ease, transform .6s ease'
            }}
          >
            <p
              className="welcome-lead"
              style={{
                margin: 0,
                fontSize: short ? '20px' : wide ? '30px' : 'clamp(18px, 3.4dvh, 22px)',
                lineHeight: 1.35,
                fontWeight: 700,
                color: '#F6EAD2',
                maxWidth: '22ch',
                textWrap: 'balance'
              }}
            >
              A megértés kalandot nyit.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: short ? '15px' : fit ? 'clamp(15px, 2.6dvh, 18px)' : '18px',
                color: '#CFC3A8',
                maxWidth: '34ch',
                textWrap: 'pretty'
              }}
            >
              Szia, {name}! Az akadémia hősei már várnak a lebegő városban.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                minHeight: short || fit ? '52px' : '58px',
                padding: '0 30px',
                fontSize: '18px',
                borderRadius: '16px',
                gap: '10px'
              }}
              onClick={() => go({ name: 'today', replace: true })}
            >
              Belépés az akadémiára
              <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            order: wide ? 1 : 0,
            paddingBottom: short ? '14px' : fit ? 'clamp(10px, 2.5dvh, 28px)' : '28px',
            // the picture area gets the remaining height; it can shrink instead of pushing the text off screen
            minHeight: 0,
            flex: fit ? '1 1 0' : undefined
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
            />
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
            />
            <img
              src="assets/hero.webp"
              alt=""
              style={{
                position: 'relative',
                display: 'block',
                height: short
                  ? 'min(70dvh, 260px)'
                  : wide
                    ? 'min(76dvh,720px)'
                    : tablet
                      ? 'min(46dvh,520px)'
                      : 'min(34dvh, calc(100dvh - 400px), 340px)',
                minHeight: '96px',
                width: 'auto',
                filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.35))',
                opacity: s >= 1 ? 1 : 0,
                transform: s >= 1 ? 'none' : 'translateY(28px)',
                transition: 'opacity .9s ease, transform .9s ease'
              }}
            />
            {fx}
          </div>
        </div>
      </div>
    </div>
  );
}
