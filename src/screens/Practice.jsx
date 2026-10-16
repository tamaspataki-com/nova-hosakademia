// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { Fragment } from 'react';
import { list } from '../dc.js';

export default function Practice({ v }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          position: 'sticky',
          top: '0',
          zIndex: '6',
          background: '#0B2329',
          borderBottom: '1px solid rgba(235,213,163,.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding:
            'calc(8px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) 8px calc(12px + env(safe-area-inset-left))',
          minHeight: '66px'
        }}
      >
        <button
          onClick={v.pExit}
          aria-label="Kilépés (a haladás mentve marad)"
          style={{
            minHeight: '48px',
            padding: '0 14px 0 10px',
            borderRadius: '14px',
            border: '0',
            background: 'rgba(235,213,163,.08)',
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
            close
          </span>
          {v.exitLabel}
        </button>
        <div
          style={{
            flex: '1',
            minWidth: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <div
            style={{
              fontSize: '15px',
              fontWeight: '800',
              color: '#EBD5A3',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}
          >
            {v.pHead}
          </div>
          <div aria-hidden="true" style={{ display: 'flex', gap: '5px' }}>
            {list(v.pDots).map((sd, sdIndex) => (
              <span key={sdIndex} style={{ height: '6px', width: sd.w, borderRadius: '3px', background: sd.bg }}></span>
            ))}
          </div>
        </div>
        <button
          onClick={v.openHelp}
          style={{
            minHeight: '48px',
            padding: '0 14px 0 10px',
            borderRadius: '14px',
            border: '0',
            background: '#91D7E8',
            color: '#18343A',
            fontSize: '16px',
            fontWeight: '900',
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
            help
          </span>
          {v.pHelpLabel}
        </button>
      </header>
      <div
        style={{
          flex: '1',
          width: '100%',
          maxWidth: '760px',
          margin: '0 auto',
          padding: v.missionPad,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {v.pShowStrip ? (
          <div
            role="list"
            aria-label="A hősök módszere"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '6px' }}
          >
            {list(v.pStrip).map((sp, spIndex) => (
              <div
                key={spIndex}
                role="listitem"
                aria-current={sp.current}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  minHeight: '38px',
                  padding: '4px 6px',
                  borderRadius: '12px',
                  background: sp.bg,
                  color: sp.color,
                  fontSize: sp.font,
                  fontWeight: '800',
                  textAlign: 'center'
                }}
              >
                {sp.showIcon ? (
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '18px', lineHeight: '1' }}
                  >
                    {sp.icon}
                  </span>
                ) : null}
                <span>{sp.label}</span>
              </div>
            ))}
          </div>
        ) : null}
        {v.phIntro ? (
          <Fragment>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                aria-hidden="true"
                style={{
                  width: '96px',
                  height: '96px',
                  flex: 'none',
                  borderRadius: '24px',
                  border: '2px solid rgba(235,213,163,.45)',
                  background:
                    'url(assets/hero.webp) -62px 5px / 230% auto no-repeat, radial-gradient(circle at 50% 30%, #2A6470, #1C454D)'
                }}
              ></div>
              <div>
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
                <h1
                  style={{
                    margin: '0',
                    fontSize: v.h2Size,
                    fontWeight: '900',
                    color: '#FFF4DF',
                    lineHeight: '1.2',
                    textWrap: 'balance'
                  }}
                >
                  A hősök módszere
                </h1>
              </div>
            </div>
            <p style={{ margin: '0', fontSize: '19px', color: '#F6EAD2', textWrap: 'pretty' }}>
              Minden feladatnál ezt a négy lépést használjuk. Az elején emlékeztetlek rá, később már egyedül is menni
              fog.
            </p>
            <ol
              style={{
                margin: '0',
                padding: '0',
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {list(v.stratList).map((sl2, sl2Index) => (
                <li
                  key={sl2Index}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'center',
                    background: '#1C454D',
                    borderRadius: '18px',
                    padding: '12px 16px'
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '44px',
                      height: '44px',
                      flex: 'none',
                      borderRadius: '14px',
                      background: 'rgba(243,197,104,.16)',
                      color: '#F3C568',
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '24px',
                      lineHeight: '1'
                    }}
                  >
                    {sl2.icon}
                  </span>{' '}
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900' }}>
                      {sl2.n}. {sl2.label}
                    </span>
                    <span style={{ fontSize: '16px', color: '#E4D8BE' }}>{sl2.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <button
              onClick={v.pIntroDone}
              style={{
                alignSelf: 'flex-end',
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
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Értem, kezdjük
              <span
                aria-hidden="true"
                style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
              >
                arrow_forward
              </span>
            </button>
          </Fragment>
        ) : null}
        {v.phPresent ? (
          <Fragment>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '900',
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: '#F3C568'
                }}
              >
                {v.pEyebrow}
              </span>
              {v.pTransfer ? (
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '900',
                    color: '#18343A',
                    background: '#EBD5A3',
                    padding: '3px 9px',
                    borderRadius: '999px'
                  }}
                >
                  Új történet
                </span>
              ) : null}
            </div>
            <h1
              style={{
                margin: '0',
                fontSize: v.h2Size,
                fontWeight: '900',
                color: '#FFF4DF',
                lineHeight: '1.2',
                textWrap: 'balance'
              }}
            >
              {v.pInstr}
            </h1>
            {v.pListenCard ? (
              <div
                style={{
                  background: '#1C454D',
                  borderRadius: '24px',
                  padding: '26px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  textAlign: 'center'
                }}
              >
                <button
                  onClick={v.pSpeak}
                  aria-label={v.pPlayLabel}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    border: '0',
                    background: '#91D7E8',
                    color: '#18343A',
                    cursor: 'pointer',
                    fontFamily: "'Material Symbols Rounded'",
                    fontSize: '48px'
                  }}
                >
                  {v.pPlayIcon}
                </button>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>{v.pPlayLabel}</div>
                {v.pPresentTranscriptBtn ? (
                  <button
                    onClick={v.pTranscript}
                    style={{
                      minHeight: '48px',
                      padding: '0 16px',
                      borderRadius: '14px',
                      border: '1.5px solid #91D7E8',
                      background: 'transparent',
                      color: '#91D7E8',
                      fontSize: '16px',
                      fontWeight: '800',
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
                      subject
                    </span>
                    Átirat megjelenítése
                  </button>
                ) : null}
              </div>
            ) : null}
            {v.pAdultCard ? (
              <div
                role="status"
                style={{
                  background: 'rgba(235,213,163,.1)',
                  border: '1px solid rgba(235,213,163,.35)',
                  borderRadius: '20px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', fontSize: '17px' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '24px',
                      lineHeight: '1',
                      color: '#EBD5A3'
                    }}
                  >
                    info
                  </span>
                  <span>{v.pAdultText}</span>
                </div>
                <button
                  onClick={v.pAdultToggle}
                  style={{
                    alignSelf: 'flex-start',
                    minHeight: '48px',
                    padding: '0 16px',
                    borderRadius: '14px',
                    border: '1.5px solid #91D7E8',
                    background: 'transparent',
                    color: '#91D7E8',
                    fontSize: '16px',
                    fontWeight: '800',
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
                    supervisor_account
                  </span>
                  {v.pAdultBtn}
                </button>
              </div>
            ) : null}
            {v.pPresentText ? (
              <article
                style={{
                  background: '#FFF4DF',
                  color: '#18343A',
                  borderRadius: '24px',
                  padding: v.readPad,
                  boxShadow: '0 16px 40px rgba(4,18,22,.3)'
                }}
              >
                {v.pPresentLabel ? (
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '900',
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: '#5A6E6B',
                      marginBottom: '8px'
                    }}
                  >
                    {v.pPresentLabel}
                  </div>
                ) : null}
                <p style={{ margin: '0', fontSize: v.readSize, lineHeight: '1.65', maxWidth: '58ch' }}>
                  {list(v.pSents).map((ps, psIndex) => (
                    <span
                      key={psIndex}
                      style={{
                        background: ps.bg,
                        borderRadius: '4px',
                        boxDecorationBreak: 'clone',
                        WebkitBoxDecorationBreak: 'clone'
                      }}
                    >
                      {ps.text}
                    </span>
                  ))}
                </p>
              </article>
            ) : null}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {v.pCanListenAlong ? (
                <button
                  onClick={v.pListenAlong}
                  style={{
                    minHeight: '52px',
                    padding: '0 16px 0 12px',
                    borderRadius: '16px',
                    border: '0',
                    background: 'rgba(145,215,232,.16)',
                    color: '#91D7E8',
                    fontSize: '16px',
                    fontWeight: '800',
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
                    headphones
                  </span>
                  Közben meg is hallgatom
                </button>
              ) : null}
              <div style={{ flex: '1' }}></div>
              <button
                onClick={v.pPresentDone}
                disabled={v.pDoneDisabled}
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
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: v.pDoneOpacity
                }}
              >
                {v.pDoneLabel}
                <span
                  aria-hidden="true"
                  style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </Fragment>
        ) : null}
        {v.phPause ? (
          <Fragment>
            <div
              style={{
                background: '#1C454D',
                border: '1px solid rgba(235,213,163,.22)',
                borderRadius: '24px',
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: '48px',
                    height: '48px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: 'rgba(243,197,104,.16)',
                    color: '#F3C568',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: "'Material Symbols Rounded'",
                    fontSize: '26px',
                    lineHeight: '1'
                  }}
                >
                  pan_tool
                </span>
                <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '900', color: '#FFF4DF' }}>
                  Megállok és átgondolom
                </h1>
              </div>
              <p style={{ margin: '0', fontSize: '20px', lineHeight: '1.55', color: '#F6EAD2', textWrap: 'pretty' }}>
                {v.pPauseText}
              </p>
              {v.pPauseSay ? (
                <p
                  style={{
                    margin: '0',
                    fontSize: '18px',
                    color: '#E4D8BE',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start'
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '22px',
                      lineHeight: '1',
                      color: '#91D7E8'
                    }}
                  >
                    record_voice_over
                  </span>
                  <span>Elmondom: mondd el magadban vagy hangosan egy mondatban.</span>
                </p>
              ) : null}
            </div>
            <button
              onClick={v.pPauseDone}
              style={{
                alignSelf: 'flex-end',
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
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Készen állok a kérdésre
              <span
                aria-hidden="true"
                style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
              >
                arrow_forward
              </span>
            </button>
          </Fragment>
        ) : null}
        {v.phLaterIntro ? (
          <Fragment>
            <div
              style={{
                background: '#1C454D',
                border: '1px solid rgba(235,213,163,.22)',
                borderRadius: '24px',
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: '48px',
                    height: '48px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: 'rgba(145,215,232,.16)',
                    color: '#91D7E8',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: "'Material Symbols Rounded'",
                    fontSize: '26px',
                    lineHeight: '1'
                  }}
                >
                  history
                </span>
                <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '900', color: '#FFF4DF' }}>Emlékszel még?</h1>
              </div>
              <p style={{ margin: '0', fontSize: '20px', lineHeight: '1.55', color: '#F6EAD2', textWrap: 'pretty' }}>
                Most egy korábbi szövegről kérdezlek: „{v.pLaterTitle}”. Nem kell visszanézni, csak gondold át, mire
                emlékszel.
              </p>
            </div>
            <button
              onClick={v.pLaterGo}
              style={{
                alignSelf: 'flex-end',
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
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Kérem a kérdést
              <span
                aria-hidden="true"
                style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
              >
                arrow_forward
              </span>
            </button>
          </Fragment>
        ) : null}
        {v.phTask ? (
          <Fragment>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '900',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: '#F3C568'
              }}
            >
              {v.pTaskEyebrow}
            </div>
            <h1
              style={{
                margin: '0',
                fontSize: v.h2Size,
                fontWeight: '900',
                color: '#FFF4DF',
                lineHeight: '1.2',
                textWrap: 'balance',
                marginTop: '-10px'
              }}
            >
              {v.pPrompt}
            </h1>
            {v.pTaskNote ? (
              <p style={{ margin: '-8px 0 0', fontSize: '16px', color: '#CFC3A8' }}>{v.pTaskNote}</p>
            ) : null}
            {v.pIsChoice ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {list(v.pOptions).map((po, poIndex) => (
                  <button
                    key={poIndex}
                    onClick={po.onClick}
                    aria-pressed={po.pressed}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minHeight: '64px',
                      padding: '14px 18px',
                      borderRadius: '20px',
                      border: `2px solid ${po.border ?? ''}`,
                      background: po.bg,
                      color: '#F6EAD2',
                      fontSize: '19px',
                      fontWeight: '700',
                      textAlign: 'left',
                      cursor: 'pointer',
                      opacity: po.opacity
                    }}
                  >
                    <span style={{ flex: '1' }}>{po.text}</span>{' '}
                    {po.showTag ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '15px',
                          fontWeight: '800',
                          color: po.tagColor,
                          flex: 'none'
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '22px', lineHeight: '1' }}
                        >
                          {po.icon}
                        </span>
                        {po.tag}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
            {v.pIsSeq ? (
              <Fragment>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {list(v.pSeqSlots).map((sl, slIndex) => (
                    <div
                      key={slIndex}
                      data-drop={slIndex}
                      onDragOver={sl.onDragOver}
                      onDrop={sl.onDrop}
                      style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
                      >
                        <span
                          style={{
                            fontSize: '15px',
                            fontWeight: '900',
                            letterSpacing: '.08em',
                            textTransform: 'uppercase',
                            color: '#F3C568'
                          }}
                        >
                          {sl.label}
                        </span>{' '}
                        {sl.showStatus ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '15px',
                              fontWeight: '800',
                              color: sl.statusColor
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '20px', lineHeight: '1' }}
                            >
                              {sl.statusIcon}
                            </span>
                            {sl.status}
                          </span>
                        ) : null}
                      </div>
                      <button
                        onClick={sl.onClick}
                        draggable={sl.draggable}
                        onTouchStart={sl.onTouchStart}
                        data-drag=""
                        onDragStart={sl.onDragStart}
                        aria-label={sl.aria}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          minHeight: '68px',
                          padding: '10px 16px',
                          borderRadius: '18px',
                          border: `2px ${sl.borderStyle ?? ''} ${sl.border ?? ''}`,
                          background: sl.bg,
                          color: sl.color,
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: '700'
                        }}
                      >
                        <span style={{ flex: '1', textAlign: sl.align }}>{sl.text}</span>
                      </button>
                    </div>
                  ))}
                </div>
                {v.pSeqPoolHas ? (
                  <div
                    data-drop="pool"
                    onDragOver={v.pPoolDragOver}
                    onDrop={v.pPoolDrop}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '14px',
                      borderRadius: '22px',
                      background: 'rgba(11,35,41,.6)',
                      border: '1px solid rgba(235,213,163,.14)'
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#EBD5A3' }}>Eseménykártyák</span>
                    {list(v.pSeqPool).map((pc, pcIndex) => (
                      <button
                        key={pcIndex}
                        onClick={pc.onClick}
                        draggable="true"
                        onDragStart={pc.onDragStart}
                        onTouchStart={pc.onTouchStart}
                        data-drag=""
                        aria-pressed={pc.pressedStr}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          minHeight: '64px',
                          padding: '10px 16px',
                          borderRadius: '16px',
                          border: `3px solid ${pc.border ?? ''}`,
                          background: '#FFF4DF',
                          color: '#18343A',
                          textAlign: 'left',
                          cursor: 'grab',
                          fontSize: '18px',
                          fontWeight: '700'
                        }}
                      >
                        <span style={{ flex: '1' }}>{pc.text}</span>{' '}
                        {pc.pressed ? (
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '900',
                              background: '#F3C568',
                              color: '#18343A',
                              padding: '3px 9px',
                              borderRadius: '999px',
                              flex: 'none'
                            }}
                          >
                            Kiválasztva
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {v.pSeqCanRetry ? (
                    <button
                      onClick={v.pSeqRetry}
                      style={{
                        minHeight: '56px',
                        padding: '0 22px',
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
                        gap: '8px'
                      }}
                    >
                      Újrapróbálom
                    </button>
                  ) : null}
                  {v.pSeqCanCheck ? (
                    <button
                      onClick={v.pSeqCheck}
                      disabled={v.pSeqCheckDisabled}
                      style={{
                        minHeight: '56px',
                        padding: '0 22px',
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
                        opacity: v.pSeqCheckOpacity
                      }}
                    >
                      Megnézem a sorrendet
                    </button>
                  ) : null}
                </div>
              </Fragment>
            ) : null}
            {v.pHintShow ? (
              <div
                role="status"
                style={{
                  background: 'rgba(235,213,163,.1)',
                  border: '1px solid rgba(235,213,163,.4)',
                  borderRadius: '18px',
                  padding: '14px 16px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  fontSize: '18px'
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
                <span>{v.pHintText}</span>
              </div>
            ) : null}
            {v.pSupportRow ? (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={v.pSupport}
                  style={{
                    minHeight: '48px',
                    padding: '0 16px 0 12px',
                    borderRadius: '14px',
                    border: '1.5px solid #91D7E8',
                    background: 'transparent',
                    color: '#91D7E8',
                    fontSize: '16px',
                    fontWeight: '800',
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
                    {v.pSupportIcon}
                  </span>
                  {v.pSupportLabel}
                </button>
                {v.pTranscriptTaskBtn ? (
                  <button
                    onClick={v.pTranscript}
                    style={{
                      minHeight: '48px',
                      padding: '0 16px 0 12px',
                      borderRadius: '14px',
                      border: '1.5px solid #91D7E8',
                      background: 'transparent',
                      color: '#91D7E8',
                      fontSize: '16px',
                      fontWeight: '800',
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
                      subject
                    </span>
                    Átirat
                  </button>
                ) : null}
              </div>
            ) : null}
            {v.pSolved ? (
              <div
                role="status"
                style={{
                  background: 'rgba(145,215,232,.12)',
                  border: '1px solid rgba(145,215,232,.55)',
                  borderRadius: '20px',
                  padding: '16px 18px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  fontSize: '18px'
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "'Material Symbols Rounded'",
                    fontSize: '26px',
                    lineHeight: '1',
                    color: '#91D7E8'
                  }}
                >
                  check_circle
                </span>
                <span>{v.pOkText}</span>
              </div>
            ) : null}
            {v.pPassageShow ? (
              <article
                style={{
                  background: '#FFF4DF',
                  color: '#18343A',
                  borderRadius: '24px',
                  padding: v.readPad,
                  boxShadow: '0 16px 40px rgba(4,18,22,.3)'
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '900',
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    color: '#5A6E6B',
                    marginBottom: '8px'
                  }}
                >
                  {v.pPassageLabel}
                </div>
                <p style={{ margin: '0', fontSize: v.readSize, lineHeight: '1.65', maxWidth: '58ch' }}>
                  {list(v.pSents).map((ps, psIndex) => (
                    <span
                      key={psIndex}
                      style={{
                        background: ps.bg,
                        borderRadius: '4px',
                        boxDecorationBreak: 'clone',
                        WebkitBoxDecorationBreak: 'clone'
                      }}
                    >
                      {ps.text}
                    </span>
                  ))}
                </p>
              </article>
            ) : null}
            {v.pSayShow ? (
              <div
                style={{
                  background: '#1C454D',
                  borderRadius: '20px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <p style={{ margin: '0', fontSize: '18px', display: 'flex', gap: '8px' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '22px',
                      lineHeight: '1',
                      color: '#91D7E8'
                    }}
                  >
                    record_voice_over
                  </span>
                  <span>Elmondom: mondd el a lényeget a saját szavaiddal egy felnőttnek! (Nem kötelező.)</span>
                </p>
                {v.pNotSaid ? (
                  <button
                    onClick={v.pMarkSaid}
                    style={{
                      alignSelf: 'flex-start',
                      minHeight: '48px',
                      padding: '0 16px 0 12px',
                      borderRadius: '14px',
                      border: '1.5px solid #EBD5A3',
                      background: 'transparent',
                      color: '#F6EAD2',
                      fontSize: '16px',
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
                      supervisor_account
                    </span>
                    Felnőtt: elmondta, megjelölöm
                  </button>
                ) : null}
                {v.pSaid ? (
                  <span
                    style={{
                      color: '#91D7E8',
                      fontWeight: '800',
                      display: 'inline-flex',
                      gap: '6px',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '22px', lineHeight: '1' }}
                    >
                      check_circle
                    </span>
                    Elmondta – egy felnőtt megjelölte.
                  </span>
                ) : null}
              </div>
            ) : null}
            {v.pSolved ? (
              <button
                onClick={v.pNext}
                style={{
                  alignSelf: 'flex-end',
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
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {v.pNextLabel}
                <span
                  aria-hidden="true"
                  style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                >
                  arrow_forward
                </span>
              </button>
            ) : null}
          </Fragment>
        ) : null}
        {v.phBreak ? (
          <div
            style={{
              background: '#1C454D',
              borderRadius: '24px',
              padding: '26px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <h1 style={{ margin: '0', fontSize: '26px', fontWeight: '900', color: '#FFF4DF' }}>Szünet</h1>
            <p style={{ margin: '0', fontSize: '19px', color: '#F6EAD2' }}>
              Tarts egy kis szünetet. A feladat megvár, ott folytatod, ahol abbahagytad.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={v.pResume}
                style={{
                  minHeight: '56px',
                  padding: '0 24px',
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
                  gap: '8px'
                }}
              >
                Folytatom
              </button>
              <button
                onClick={v.pToRest}
                style={{
                  minHeight: '56px',
                  padding: '0 20px',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(235,213,163,.45)',
                  background: 'transparent',
                  color: '#F6EAD2',
                  fontSize: '17px',
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
                  nights_stay
                </span>
                Átmegyek a Pihenőbe
              </button>
            </div>
          </div>
        ) : null}
        {v.phEnd ? (
          <Fragment>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                aria-hidden="true"
                style={{
                  width: '96px',
                  height: '96px',
                  flex: 'none',
                  borderRadius: '24px',
                  border: '2px solid rgba(235,213,163,.45)',
                  background:
                    'url(assets/hero.webp) -62px 5px / 230% auto no-repeat, radial-gradient(circle at 50% 30%, #2A6470, #1C454D)'
                }}
              ></div>
              <h1
                style={{
                  margin: '0',
                  fontSize: v.h2Size,
                  fontWeight: '900',
                  color: '#FFF4DF',
                  lineHeight: '1.2',
                  textWrap: 'balance'
                }}
              >
                {v.pEndTitle}
              </h1>
            </div>
            <p style={{ margin: '0', fontSize: '19px', color: '#F6EAD2' }}>
              Ma ezeket gyakoroltad, és közben a hősök módszerét használtad:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {list(v.pEndRows).map((er, erIndex) => (
                <div
                  key={erIndex}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    background: '#1C454D',
                    borderRadius: '16px',
                    padding: '12px 14px'
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '38px',
                      height: '38px',
                      flex: 'none',
                      borderRadius: '12px',
                      background: 'rgba(145,215,232,.12)',
                      color: '#91D7E8',
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '22px',
                      lineHeight: '1'
                    }}
                  >
                    {er.icon}
                  </span>{' '}
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '17px', fontWeight: '800' }}>{er.label}</span>
                    <span style={{ fontSize: '14px', color: '#CFC3A8' }}>{er.sub}</span>
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={v.goHome}
                style={{
                  minHeight: '56px',
                  padding: '0 24px',
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
                  gap: '8px'
                }}
              >
                Vissza a bázisra
              </button>
              <button
                onClick={v.pToRest}
                style={{
                  minHeight: '56px',
                  padding: '0 20px',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(235,213,163,.45)',
                  background: 'transparent',
                  color: '#F6EAD2',
                  fontSize: '17px',
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
                  nights_stay
                </span>
                Pihenek egyet
              </button>
            </div>
          </Fragment>
        ) : null}
      </div>
    </div>
  );
}
