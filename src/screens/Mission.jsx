// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { Fragment } from 'react';
import { list } from '../dc.js';

export default function Mission({ v }) {
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
          onClick={v.exitMission}
          aria-label="Kilépés a küldetésből (az állapot mentve marad)"
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
            {v.stageNum} · {v.stageName}
          </div>
          <div aria-hidden="true" style={{ display: 'flex', gap: '5px' }}>
            {list(v.stageDots).map((sd, sdIndex) => (
              <span
                key={sdIndex}
                style={{ height: '6px', width: sd.w, borderRadius: '3px', background: sd.bg, transition: 'width .2s' }}
              ></span>
            ))}
          </div>
        </div>
        {v.showTopAudio ? (
          <button
            onClick={v.topAudio}
            aria-label={v.topAudioLabel}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              border: '0',
              background: 'rgba(145,215,232,.14)',
              color: '#91D7E8',
              cursor: 'pointer',
              fontFamily: "'Material Symbols Rounded'",
              fontSize: '24px'
            }}
          >
            {v.topAudioIcon}
          </button>
        ) : null}
        <button
          onClick={v.openHelp}
          style={{
            minHeight: '48px',
            padding: '0 14px 0 10px',
            borderRadius: '14px',
            border: '0',
            background: 'rgba(145,215,232,.14)',
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
            help
          </span>
          {v.helpLabel}
        </button>
      </header>
      <div
        style={{
          flex: '1',
          width: '100%',
          maxWidth: '780px',
          margin: '0 auto',
          padding: v.missionPad,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {v.st0 ? (
          <Fragment>
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                aspectRatio: '3/2',
                boxShadow: '0 20px 50px rgba(4,18,22,.4)'
              }}
            >
              <img
                src="assets/bridge.webp"
                alt="A kialudt fényhíd és a kapu melletti üres energiaállvány"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '900',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: '#F3C568'
              }}
            >
              Első küldetés
            </div>
            <h1
              style={{
                margin: '-8px 0 0',
                fontSize: v.h2Size,
                fontWeight: '900',
                color: '#FFF4DF',
                lineHeight: '1.15'
              }}
            >
              Az eltűnt energiamag
            </h1>
            <p style={{ margin: '0', fontSize: '20px', lineHeight: '1.6', color: '#F6EAD2', textWrap: 'pretty' }}>
              A lebegő város két része között kialudtak a fényhíd lámpái. Mira, az akadémia fiatal hőse, elindul
              kideríteni, mi történt. Segíts neki összegyűjteni és összekapcsolni a nyomokat!
            </p>
            <button
              onClick={v.begin}
              style={{
                alignSelf: 'flex-start',
                minHeight: '56px',
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
                boxShadow: '0 8px 24px rgba(243,197,104,.25)'
              }}
              className="nv-hover-2"
            >
              Indulhatunk
              <span
                aria-hidden="true"
                style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
              >
                arrow_forward
              </span>
            </button>
          </Fragment>
        ) : null}
        {v.st1 ? (
          <Fragment>
            <h1 style={{ margin: '0', fontSize: v.h2Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.2' }}>
              Hogyan ismerkednél meg a történettel?
            </h1>
            <p style={{ margin: '-6px 0 0', color: '#CFC3A8' }}>
              Ez csak azt választja ki, hogyan jelenik meg a szöveg. Legközelebb másikat is választhatsz.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {list(v.modes).map((md, mdIndex) => (
                <button
                  key={mdIndex}
                  onClick={md.onClick}
                  aria-disabled={md.disabled}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    minHeight: '80px',
                    padding: '14px 18px',
                    borderRadius: '22px',
                    border: `2px solid ${md.border ?? ''}`,
                    background: '#1C454D',
                    color: '#F6EAD2',
                    textAlign: 'left',
                    cursor: md.cursor,
                    opacity: md.opacity
                  }}
                  className="nv-hover-5"
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '52px',
                      height: '52px',
                      flex: 'none',
                      borderRadius: '16px',
                      background: 'rgba(243,197,104,.16)',
                      color: '#F3C568',
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '28px',
                      lineHeight: '1'
                    }}
                  >
                    {md.icon}
                  </span>{' '}
                  <span style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '19px', fontWeight: '900' }}>{md.label}</span>
                    <span style={{ fontSize: '15px', color: '#CFC3A8' }}>{md.desc}</span>
                  </span>{' '}
                  {md.disabled ? (
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#EBD5A3' }}>Nem elérhető</span>
                  ) : null}
                </button>
              ))}
            </div>
            {v.narrNotice ? (
              <div
                role="status"
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  background: 'rgba(235,213,163,.1)',
                  border: '1px solid rgba(235,213,163,.3)',
                  borderRadius: '18px',
                  padding: '14px 16px',
                  fontSize: '16px'
                }}
              >
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
                <span>{v.narrNoticeText}</span>
              </div>
            ) : null}
          </Fragment>
        ) : null}
        {v.st2 ? (
          <Fragment>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '170px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <div style={{ fontSize: '17px', fontWeight: '800', color: '#EBD5A3' }}>{v.secLabel}</div>
                <div aria-hidden="true" style={{ display: 'flex', gap: '6px' }}>
                  {list(v.secBars).map((sb, sbIndex) => (
                    <span
                      key={sbIndex}
                      style={{ height: '6px', width: '44px', borderRadius: '3px', background: sb.bg }}
                    ></span>
                  ))}
                </div>
              </div>
              {v.showSecAudio ? (
                <button
                  onClick={v.playSection}
                  aria-label={v.playLabel}
                  style={{
                    minHeight: '48px',
                    padding: '0 14px 0 10px',
                    borderRadius: '14px',
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
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                  >
                    {v.playIcon}
                  </span>
                  {v.playBtnLabel}
                </button>
              ) : null}
              <button
                onClick={v.openGlossary}
                style={{
                  minHeight: '48px',
                  padding: '0 14px 0 10px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(145,215,232,.5)',
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
                  diamond
                </span>
                Szómagyarázat
              </button>
            </div>
            {v.textVisible ? (
              <article
                style={{
                  background: '#FFF4DF',
                  color: '#18343A',
                  borderRadius: '24px',
                  padding: v.readPad,
                  boxShadow: '0 16px 40px rgba(4,18,22,.35)'
                }}
              >
                <p
                  style={{ margin: '0', fontSize: v.readSize, lineHeight: '1.65', maxWidth: '58ch', textAlign: 'left' }}
                >
                  {list(v.secSegs).map((sg, sgIndex) => (
                    <Fragment key={sgIndex}>
                      {sg.isWord ? (
                        <button
                          onClick={sg.onClick}
                          aria-label={sg.aria}
                          style={{
                            font: 'inherit',
                            lineHeight: 'inherit',
                            color: '#18343A',
                            background: 'rgba(243,197,104,.42)',
                            border: '0',
                            borderBottom: '2px dotted #18343A',
                            padding: '0 3px',
                            margin: '0',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          {sg.text}
                        </button>
                      ) : null}
                      {sg.plain ? <span>{sg.text}</span> : null}
                    </Fragment>
                  ))}
                </p>
                <p style={{ margin: '20px 0 0', fontSize: '15px', color: '#4E6461' }}>
                  A kiemelt szavakra koppintva megnézheted a jelentésüket.
                </p>
              </article>
            ) : null}
            {v.textHidden ? (
              <div
                style={{
                  background: '#1C454D',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'center'
                }}
              >
                <button
                  onClick={v.playSection}
                  aria-label={v.playLabel}
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
                  {v.playIcon}
                </button>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>{v.playLabel}</div>
                <button
                  onClick={v.toggleText}
                  style={{
                    minHeight: '48px',
                    padding: '0 16px',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(235,213,163,.4)',
                    background: 'transparent',
                    color: '#F6EAD2',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Szöveg megjelenítése
                </button>
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={v.readBack}
                style={{
                  minHeight: '56px',
                  padding: '0 18px 0 12px',
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
                  arrow_back
                </span>
                Vissza
              </button>
              <div style={{ flex: '1' }}></div>
              <button
                onClick={v.readNext}
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
                  gap: '8px'
                }}
                className="nv-hover-2"
              >
                Tovább
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
        {v.st3 ? (
          <Fragment>
            <h1 style={{ margin: '0', fontSize: v.h2Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.2' }}>
              Miért aludtak ki a híd lámpái?
            </h1>
            <div
              role="radiogroup"
              aria-label="Válaszlehetőségek"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {list(v.qOptions).map((qo, qoIndex) => (
                <button
                  key={qoIndex}
                  onClick={qo.onClick}
                  aria-pressed={qo.pressed}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minHeight: '64px',
                    padding: '14px 18px',
                    borderRadius: '20px',
                    border: `2px solid ${qo.border ?? ''}`,
                    background: qo.bg,
                    color: '#F6EAD2',
                    fontSize: '19px',
                    fontWeight: '700',
                    textAlign: 'left',
                    cursor: 'pointer',
                    opacity: qo.opacity
                  }}
                  className="nv-hover-7"
                >
                  <span style={{ flex: '1' }}>{qo.text}</span>{' '}
                  {qo.showTag ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '15px',
                        fontWeight: '800',
                        color: qo.tagColor,
                        flex: 'none'
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '22px', lineHeight: '1' }}
                      >
                        {qo.icon}
                      </span>
                      {qo.tag}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            {v.qWrong ? (
              <div
                role="status"
                style={{
                  background: 'rgba(235,213,163,.1)',
                  border: '1px solid rgba(235,213,163,.4)',
                  borderRadius: '20px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {v.qHintOnly ? (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '18px' }}>
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
                    <span>Keressük meg együtt a nyomot! Mit mondott a hídőr az energiamagról?</span>
                  </div>
                ) : null}
                {v.qGuided ? (
                  <div
                    style={{
                      background: '#FFF4DF',
                      color: '#18343A',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      fontSize: '18px',
                      lineHeight: '1.6'
                    }}
                  >
                    Nézd meg ezt a mondatot:{' '}
                    <mark
                      style={{
                        background: 'rgba(243,197,104,.6)',
                        color: '#18343A',
                        padding: '0 3px',
                        borderRadius: '4px'
                      }}
                    >
                      „A hídőr elmondta, hogy reggel egy szerelő vitte el az energiamagot ellenőrzésre.”
                    </mark>{' '}
                    Hol volt akkor az energiamag?
                  </div>
                ) : null}
                <button
                  onClick={v.openStory2}
                  style={{
                    alignSelf: 'flex-start',
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
                    menu_book
                  </span>
                  Megnézem a történetet
                </button>
              </div>
            ) : null}
            {v.qSolved ? (
              <Fragment>
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
                  <span>Jól összekapcsoltad a nyomokat. Az energiamag hiányzott a foglalatból.</span>
                </div>
                <button
                  onClick={v.toStage4}
                  style={{
                    alignSelf: 'flex-end',
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
                    gap: '8px'
                  }}
                >
                  Tovább
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                  >
                    arrow_forward
                  </span>
                </button>
              </Fragment>
            ) : null}
          </Fragment>
        ) : null}
        {v.st4 ? (
          <Fragment>
            <h1 style={{ margin: '0', fontSize: v.h2Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.2' }}>
              Tedd sorrendbe az eseményeket!
            </h1>
            <p style={{ margin: '-6px 0 0', fontSize: '16px', color: '#CFC3A8' }}>
              Koppints egy kártyára, majd a helyére, vagy húzd oda. Ha meggondolod magad, koppints a behelyezett
              kártyára, és visszakerül.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {list(v.seqSlots).map((sl, slIndex) => (
                <div
                  key={slIndex}
                  data-drop={slIndex}
                  onDragOver={sl.onDragOver}
                  onDrop={sl.onDrop}
                  style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
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
                      gap: '14px',
                      minHeight: '92px',
                      padding: '10px 14px',
                      borderRadius: '20px',
                      border: `2px ${sl.borderStyle ?? ''} ${sl.border ?? ''}`,
                      background: sl.bg,
                      color: sl.color,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '17px',
                      fontWeight: '700'
                    }}
                  >
                    {sl.filled ? (
                      <Fragment>
                        <img
                          src={sl.src}
                          alt=""
                          style={{ width: '70px', height: '70px', objectFit: 'contain', flex: 'none' }}
                        />
                        <span style={{ flex: '1' }}>{sl.text}</span>
                      </Fragment>
                    ) : null}{' '}
                    {sl.empty ? (
                      <span style={{ flex: '1', textAlign: 'center', fontSize: '16px', color: sl.color }}>
                        {sl.emptyText}
                      </span>
                    ) : null}
                  </button>
                </div>
              ))}
            </div>
            {v.seqPoolHas ? (
              <div
                data-drop="pool"
                onDragOver={v.poolDragOver}
                onDrop={v.poolDrop}
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
                {list(v.seqPool).map((pc, pcIndex) => (
                  <button
                    key={pcIndex}
                    onClick={pc.onClick}
                    draggable="true"
                    onDragStart={pc.onDragStart}
                    onTouchStart={pc.onTouchStart}
                    data-drag=""
                    aria-pressed={pc.pressed}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      minHeight: '88px',
                      padding: '10px 14px',
                      borderRadius: '18px',
                      border: `3px solid ${pc.border ?? ''}`,
                      background: '#FFF4DF',
                      color: '#18343A',
                      textAlign: 'left',
                      cursor: 'grab',
                      fontSize: '17px',
                      fontWeight: '700',
                      boxShadow: pc.shadow,
                      transform: pc.lift,
                      transition: 'transform .12s, box-shadow .12s'
                    }}
                  >
                    <img
                      src={pc.src}
                      alt=""
                      style={{ width: '66px', height: '66px', objectFit: 'contain', flex: 'none' }}
                    />{' '}
                    <span style={{ flex: '1' }}>{pc.text}</span>{' '}
                    {pc.pressed ? (
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '900',
                          color: '#18343A',
                          background: '#F3C568',
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
            {v.seqHintShow ? (
              <div
                role="status"
                style={{
                  background: 'rgba(235,213,163,.1)',
                  border: '1px solid rgba(235,213,163,.4)',
                  borderRadius: '18px',
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
                <span>Melyik eseményt vette észre Mira, amikor megérkezett a hídhoz?</span>
              </div>
            ) : null}
            {v.seqSolved ? (
              <div
                role="status"
                style={{
                  background: 'rgba(145,215,232,.12)',
                  border: '1px solid rgba(145,215,232,.55)',
                  borderRadius: '20px',
                  padding: '16px 18px',
                  display: 'flex',
                  gap: '10px',
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
                <span>Pontos sorrend! Végigkövetted, hogyan oldódott meg a probléma.</span>
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              {v.seqShowHintBtn ? (
                <button
                  onClick={v.seqHint}
                  style={{
                    minHeight: '52px',
                    padding: '0 16px 0 12px',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(235,213,163,.45)',
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
                    lightbulb
                  </span>
                  Tipp
                </button>
              ) : null}
              <div style={{ flex: '1' }}></div>
              {v.seqCanRetry ? (
                <button
                  onClick={v.seqRetry}
                  style={{
                    minHeight: '56px',
                    padding: '0 22px',
                    borderRadius: '16px',
                    border: '0',
                    background: '#F3C568',
                    color: '#18343A',
                    fontSize: '18px',
                    fontWeight: '900',
                    cursor: 'pointer'
                  }}
                >
                  Újrapróbálom
                </button>
              ) : null}
              {v.seqCanCheckShow ? (
                <button
                  onClick={v.seqCheck}
                  disabled={v.seqCheckDisabled}
                  style={{
                    minHeight: '56px',
                    padding: '0 22px',
                    borderRadius: '16px',
                    border: '0',
                    background: '#F3C568',
                    color: '#18343A',
                    fontSize: '18px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    opacity: v.seqCheckOpacity
                  }}
                >
                  Megnézem a sorrendet
                </button>
              ) : null}
              {v.seqSolved ? (
                <button
                  onClick={v.toStage5}
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
                    gap: '8px'
                  }}
                >
                  Tovább
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                  >
                    arrow_forward
                  </span>
                </button>
              ) : null}
            </div>
          </Fragment>
        ) : null}
        {v.st5 ? (
          <Fragment>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img
                src="assets/tool-goggles.webp"
                alt="Nyomkereső szemüveg"
                style={{ width: '96px', height: 'auto', flex: 'none' }}
              />
              <h1 style={{ margin: '0', fontSize: v.h2Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.2' }}>
                Melyik mondatból tudjuk, hogy a szerelő befejezte a munkát?
              </h1>
            </div>
            <p style={{ margin: '-6px 0 0', fontSize: '16px', color: '#CFC3A8' }}>
              Koppints a mondatra, amely a bizonyítékot tartalmazza.
            </p>
            <article
              style={{
                background: '#FFF4DF',
                color: '#18343A',
                borderRadius: '24px',
                padding: v.evPad,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '900',
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: '#5A6E6B',
                  padding: '0 12px 4px'
                }}
              >
                2. rész
              </div>
              {list(v.evSentences).map((es, esIndex) => (
                <button
                  key={esIndex}
                  onClick={es.onClick}
                  aria-pressed={es.pressed}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    width: '100%',
                    minHeight: '48px',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    border: `2px solid ${es.border ?? ''}`,
                    background: es.bg,
                    color: '#18343A',
                    fontSize: v.readSize,
                    lineHeight: '1.6',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: es.weight
                  }}
                  className="nv-hover-8"
                >
                  <span style={{ flex: '1' }}>{es.text}</span>{' '}
                  {es.showTag ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '14px',
                        fontWeight: '900',
                        color: es.tagColor,
                        flex: 'none',
                        paddingTop: '4px'
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '20px', lineHeight: '1' }}
                      >
                        {es.icon}
                      </span>
                      {es.tag}
                    </span>
                  ) : null}
                </button>
              ))}
            </article>
            {v.evWrong ? (
              <div
                role="status"
                style={{
                  background: 'rgba(235,213,163,.1)',
                  border: '1px solid rgba(235,213,163,.4)',
                  borderRadius: '18px',
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
                <span>{v.evWrongText}</span>
              </div>
            ) : null}
            {v.evSolved ? (
              <Fragment>
                <div
                  role="status"
                  style={{
                    background: 'rgba(145,215,232,.12)',
                    border: '1px solid rgba(145,215,232,.55)',
                    borderRadius: '20px',
                    padding: '16px 18px',
                    display: 'flex',
                    gap: '10px',
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
                  <span>Megtaláltad a mondatot, amely segít megérteni a történetet.</span>
                </div>
                <button
                  onClick={v.toStage6}
                  style={{
                    alignSelf: 'flex-end',
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
                    gap: '8px'
                  }}
                >
                  Tovább
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                  >
                    arrow_forward
                  </span>
                </button>
              </Fragment>
            ) : null}
          </Fragment>
        ) : null}
        {v.st6 ? (
          <Fragment>
            <h1 style={{ margin: '0', fontSize: v.h2Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.2' }}>
              Most te vagy a küldetés mesélője. Mondd el a saját szavaiddal, mi történt!
            </h1>
            <div
              style={{
                background: '#1C454D',
                borderRadius: '20px',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#EBD5A3' }}>
                Segítő kérdések, ha jólesik:
              </span>
              {list(v.exGuides).map((g, gIndex) => (
                <div key={gIndex} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '18px' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "'Material Symbols Rounded'",
                      fontSize: '20px',
                      lineHeight: '1',
                      color: '#91D7E8'
                    }}
                  >
                    chevron_right
                  </span>
                  {g}
                </div>
              ))}
            </div>
            <div role="tablist" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {list(v.exTabs).map((xt, xtIndex) => (
                <button
                  key={xtIndex}
                  role="tab"
                  aria-selected={xt.selected}
                  onClick={xt.onClick}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    minHeight: '92px',
                    padding: '12px',
                    borderRadius: '20px',
                    border: `2px solid ${xt.border ?? ''}`,
                    background: xt.bg,
                    color: xt.color,
                    fontSize: '17px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '30px', lineHeight: '1' }}
                  >
                    {xt.icon}
                  </span>
                  {xt.label}
                </button>
              ))}
            </div>
            {v.exSpokenOpen ? (
              <div
                style={{
                  background: '#1C454D',
                  borderRadius: '20px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <p style={{ margin: '0', fontSize: '18px' }}>
                  Mesélj el mindent egy felnőttnek vagy egy barátodnak. Ha végeztetek, a felnőtt jelölje meg itt.
                </p>
                {v.exNotSpoken ? (
                  <button
                    onClick={v.markSpoken}
                    style={{
                      alignSelf: 'flex-start',
                      minHeight: '52px',
                      padding: '0 18px 0 12px',
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
                {v.exSpoken ? (
                  <div
                    role="status"
                    style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#91D7E8', fontWeight: '800' }}
                  >
                    <span
                      aria-hidden="true"
                      style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '24px', lineHeight: '1' }}
                    >
                      check_circle
                    </span>
                    Elmesélve – egy felnőtt megjelölte.
                  </div>
                ) : null}
              </div>
            ) : null}
            {v.exWriteOpen ? (
              <div
                style={{
                  background: '#1C454D',
                  borderRadius: '20px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <label htmlFor="retell" style={{ fontSize: '16px', fontWeight: '700', color: '#EBD5A3' }}>
                  Írd le két-három mondatban:
                </label>
                <textarea
                  id="retell"
                  value={v.exText ?? ''}
                  onChange={v.onExText}
                  rows="4"
                  placeholder="A probléma az volt, hogy…"
                  style={{
                    fontSize: v.readSize,
                    lineHeight: '1.6',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    border: '2px solid rgba(235,213,163,.3)',
                    background: '#FFF4DF',
                    color: '#18343A',
                    resize: 'vertical'
                  }}
                ></textarea>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={v.saveEx}
                    style={{
                      minHeight: '52px',
                      padding: '0 18px',
                      borderRadius: '14px',
                      border: '1.5px solid #91D7E8',
                      background: 'transparent',
                      color: '#91D7E8',
                      fontSize: '16px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Mentés
                  </button>
                  {v.exSaved ? (
                    <span
                      role="status"
                      style={{
                        display: 'inline-flex',
                        gap: '6px',
                        alignItems: 'center',
                        color: '#91D7E8',
                        fontWeight: '800'
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '22px', lineHeight: '1' }}
                      >
                        check_circle
                      </span>
                      Elmentve ezen az eszközön
                    </span>
                  ) : null}{' '}
                  {v.exMsg ? <span style={{ color: '#F3C568', fontWeight: '700' }}>{v.exMsg}</span> : null}
                </div>
              </div>
            ) : null}
            {v.exCanFinish ? (
              <button
                onClick={v.finishMission}
                style={{
                  alignSelf: 'flex-end',
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
                  gap: '8px'
                }}
              >
                Küldetés lezárása
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
        {v.st7 ? (
          <Fragment>
            <div
              style={{
                position: 'relative',
                borderRadius: '28px',
                overflow: 'hidden',
                background: 'radial-gradient(90% 80% at 50% 70%, #1C454D, #0B2329)',
                aspectRatio: v.resAspect,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '4%',
                padding: '6% 6% 5%'
              }}
            >
              {v.glowEl}{' '}
              <img
                src="assets/obj-bridge-lit.webp"
                alt="A kivilágított híd"
                style={{ position: 'relative', width: '52%', height: 'auto', objectFit: 'contain' }}
              />{' '}
              <img
                src="assets/obj-pedestal-lit.webp"
                alt="Az energiaállvány a helyére tett energiamaggal"
                style={{ position: 'relative', width: '26%', height: 'auto', objectFit: 'contain' }}
              />
            </div>
            <h1 style={{ margin: '0', fontSize: v.h1Size, fontWeight: '900', color: '#FFF4DF', lineHeight: '1.15' }}>
              Újra világít a fényhíd!
            </h1>
            <p style={{ margin: '-6px 0 0', fontSize: '20px', color: '#F6EAD2', textWrap: 'pretty' }}>
              Összegyűjtötted a nyomokat, sorrendbe rendezted az eseményeket, és elmesélted a megoldást.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                background: '#1C454D',
                border: '1px solid rgba(235,213,163,.3)',
                borderRadius: '24px',
                padding: '16px 18px'
              }}
            >
              <div
                style={{
                  width: '110px',
                  height: '110px',
                  flex: 'none',
                  borderRadius: '20px',
                  background: 'radial-gradient(70% 70% at 50% 45%, rgba(145,215,232,.22), rgba(11,35,41,.7))',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '10px'
                }}
              >
                <img
                  src="assets/tool-goggles.webp"
                  alt=""
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '900',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#EBD5A3'
                  }}
                >
                  Új felszerelés
                </span>{' '}
                <span style={{ fontSize: '21px', fontWeight: '900', color: '#FFF4DF' }}>Nyomkereső szemüveg</span>{' '}
                <span style={{ fontSize: '17px', color: '#E4D8BE' }}>
                  Ezzel a stratégiával megkeresheted a válaszhoz tartozó mondatot.
                </span>
              </div>
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
                  cursor: 'pointer'
                }}
              >
                Vissza a bázisra
              </button>
              <button
                onClick={v.goGearGoggles}
                style={{
                  minHeight: '56px',
                  padding: '0 22px',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(235,213,163,.45)',
                  background: 'transparent',
                  color: '#F6EAD2',
                  fontSize: '17px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Megnézem a felszerelést
              </button>
            </div>
          </Fragment>
        ) : null}
      </div>
    </div>
  );
}
