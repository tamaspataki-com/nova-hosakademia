// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import { Fragment } from 'react';
import { list } from '../dc.js';

export default function Parent({ v }) {
  return (
    <div
      style={{
        padding: v.pagePad,
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '800',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: '#91D7E8'
            }}
          >
            Felnőtteknek
          </div>
          <h1 style={{ margin: '2px 0 0', fontSize: '30px', fontWeight: '800', color: '#FFF4DF' }}>Szülői tér</h1>
        </div>
        <button
          onClick={v.leaveParent}
          style={{
            minHeight: '48px',
            padding: '0 16px 0 10px',
            borderRadius: '12px',
            border: '1px solid rgba(235,213,163,.35)',
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
          Vissza a gyerekfelülethez
        </button>
      </div>
      {v.pGate ? (
        <div
          style={{
            background: '#1C454D',
            borderRadius: '18px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '480px'
          }}
        >
          <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '800' }}>{v.pinTitle}</h2>
          <p style={{ margin: '0', fontSize: '16px', color: '#CFC3A8' }}>
            Ez a helyi PIN csak kényelmi akadály, hogy a gyerek ne lépjen be véletlenül. Nem nyújt valódi
            fiókbiztonságot.
          </p>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '15px',
              fontWeight: '700',
              color: '#EBD5A3'
            }}
          >
            4 számjegyű PIN{' '}
            <input
              type="password"
              inputMode="numeric"
              maxLength="4"
              value={v.pinInput ?? ''}
              onChange={v.onPin}
              onKeyDown={v.pinKey}
              aria-label="PIN-kód"
              style={{
                minHeight: '52px',
                fontSize: '24px',
                letterSpacing: '.4em',
                padding: '0 16px',
                borderRadius: '12px',
                border: '1.5px solid rgba(235,213,163,.35)',
                background: '#102D35',
                color: '#FFF4DF',
                maxWidth: '200px'
              }}
            />
          </label>
          {v.pinErr ? (
            <div role="alert" style={{ fontSize: '15px', color: '#F3C568' }}>
              {v.pinErr}
            </div>
          ) : null}
          <button
            onClick={v.submitPin}
            style={{
              alignSelf: 'flex-start',
              minHeight: '52px',
              padding: '0 22px',
              borderRadius: '12px',
              border: '0',
              background: '#F3C568',
              color: '#18343A',
              fontSize: '17px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            {v.pinBtn}
          </button>
        </div>
      ) : null}
      {v.pIn ? (
        <Fragment>
          <div
            role="tablist"
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              borderBottom: '1px solid rgba(235,213,163,.15)',
              paddingBottom: '10px'
            }}
          >
            {list(v.pTabs).map((pt, ptIndex) => (
              <button
                key={ptIndex}
                role="tab"
                aria-selected={pt.selected}
                onClick={pt.onClick}
                style={{
                  minHeight: '48px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  border: '0',
                  background: pt.bg,
                  color: pt.color,
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {pt.label}
              </button>
            ))}
          </div>
          {v.pOverview ? (
            <Fragment>
              <p
                style={{
                  margin: '0',
                  fontSize: '16px',
                  color: '#CFC3A8',
                  borderLeft: '0',
                  background: 'rgba(145,215,232,.08)',
                  padding: '12px 16px',
                  borderRadius: '12px'
                }}
              >
                Az alkalmazás gyakorlást és megfigyelést támogat. A feladatok eredményei önmagukban nem állapítják meg a
                tanulási nehézség okát. Ugyanannak a küldetésnek az ismétlése gyakorlás, nem a fejlődés bizonyítéka.
              </p>
              {v.hasPractice ? (
                <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h2 style={{ margin: '6px 0 0', fontSize: '20px', fontWeight: '800' }}>
                    Gyakorlás: olvasás, hallgatás, felidézés
                  </h2>
                  <p style={{ margin: '0', fontSize: '15px', color: '#CFC3A8' }}>
                    „Első válasz helyes”: segítség előtt adott válasz. „Segítséggel megoldva”: tipp, újraolvasás,
                    újrahallgatás vagy átirat után. Egy hibás válasz önmagában nem utal emlékezeti vagy figyelmi
                    nehézségre, és az alkalmazás a kattintásokból vagy a válaszidőből nem következtet a figyelemre. Hogy
                    a gyakorlás segít-e a mindennapi tanulásban, azt új szövegekkel és iskolai feladatokkal érdemes
                    ellenőrizni.
                  </p>
                  {list(v.pracGroups).map((pg, pgIndex) => (
                    <div key={pgIndex} style={{ background: '#1C454D', borderRadius: '18px', overflow: 'hidden' }}>
                      <div
                        style={{
                          padding: '12px 20px 4px',
                          fontSize: '14px',
                          fontWeight: '900',
                          letterSpacing: '.08em',
                          textTransform: 'uppercase',
                          color: '#91D7E8'
                        }}
                      >
                        {pg.title}
                      </div>
                      {list(pg.rows).map((o2, o2Index) => (
                        <div
                          key={o2Index}
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: '4px 16px',
                            padding: '10px 20px',
                            borderBottom: '1px solid rgba(235,213,163,.08)',
                            fontSize: '16px'
                          }}
                        >
                          <span style={{ color: '#CFC3A8' }}>{o2.label}</span>
                          <span style={{ fontWeight: '800', textAlign: 'right' }}>{o2.value}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <h2 style={{ margin: '6px 0 0', fontSize: '18px', fontWeight: '800' }}>Feladatonként</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {list(v.pracLog).map((pl, plIndex) => (
                      <div
                        key={plIndex}
                        style={{
                          background: '#1C454D',
                          borderRadius: '14px',
                          padding: '12px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: '4px 12px'
                          }}
                        >
                          <span style={{ fontWeight: '800' }}>{pl.title}</span>
                          <span style={{ fontSize: '14px', color: '#CFC3A8' }}>{pl.time}</span>
                        </div>
                        <div style={{ fontSize: '15px', color: '#E4D8BE' }}>{pl.meta}</div>
                        <div style={{ fontSize: '15px' }}>
                          <span style={{ fontWeight: '800', color: pl.resultColor }}>{pl.result}</span>
                          <span style={{ color: '#CFC3A8' }}> · {pl.supports}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
              {v.noActivity ? (
                <div
                  style={{
                    background: '#1C454D',
                    borderRadius: '18px',
                    padding: '28px 24px',
                    color: '#E4D8BE',
                    fontSize: '17px'
                  }}
                >
                  Itt jelennek meg a küldetések során gyűjtött megfigyelések.
                </div>
              ) : null}
              {v.hasActivity ? (
                <Fragment>
                  <div style={{ background: '#1C454D', borderRadius: '18px', overflow: 'hidden' }}>
                    {list(v.obsRows).map((o, oIndex) => (
                      <div
                        key={oIndex}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '16px',
                          padding: '13px 20px',
                          borderBottom: '1px solid rgba(235,213,163,.1)',
                          fontSize: '16px'
                        }}
                      >
                        <span style={{ color: '#CFC3A8' }}>{o.label}</span>
                        <span style={{ fontWeight: '800', textAlign: 'right' }}>{o.value}</span>
                      </div>
                    ))}
                  </div>
                  {v.hasRetellTexts ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '800' }}>Leírt elmesélések</h2>
                      {list(v.retellTexts).map((rt, rtIndex) => (
                        <blockquote
                          key={rtIndex}
                          style={{
                            margin: '0',
                            background: '#FFF4DF',
                            color: '#18343A',
                            borderRadius: '14px',
                            padding: '14px 16px',
                            fontSize: '17px'
                          }}
                        >
                          {rt.text}
                          <div style={{ fontSize: '14px', color: '#5A6E6B', marginTop: '6px' }}>{rt.time}</div>
                        </blockquote>
                      ))}
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '800' }}>Legutóbbi események</h2>
                    <div style={{ background: '#1C454D', borderRadius: '18px', padding: '6px 0' }}>
                      {list(v.eventRows).map((e, eIndex) => (
                        <div
                          key={eIndex}
                          style={{ display: 'flex', gap: '14px', padding: '8px 20px', fontSize: '15px' }}
                        >
                          <span
                            style={{
                              color: '#91D7E8',
                              fontVariantNumeric: 'tabular-nums',
                              flex: 'none',
                              width: '96px'
                            }}
                          >
                            {e.time}
                          </span>
                          <span>{e.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ) : null}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '800' }}>Szülői jegyzetek</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {list(v.noteTagChips).map((nc, ncIndex) => (
                    <button
                      key={ncIndex}
                      onClick={nc.onClick}
                      aria-pressed={nc.pressed}
                      style={{
                        minHeight: '44px',
                        padding: '0 14px',
                        borderRadius: '999px',
                        border: `1.5px solid ${nc.border ?? ''}`,
                        background: nc.bg,
                        color: nc.color,
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {nc.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={v.noteDraft ?? ''}
                  onChange={v.onNoteDraft}
                  rows="3"
                  placeholder="Pl. a hallgatás előtt fáradt volt, vagy közben megszólalt a telefon."
                  aria-label="Új jegyzet"
                  style={{
                    fontSize: '16px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(235,213,163,.3)',
                    background: '#102D35',
                    color: '#FFF4DF',
                    resize: 'vertical'
                  }}
                ></textarea>
                <button
                  onClick={v.addNote}
                  style={{
                    alignSelf: 'flex-start',
                    minHeight: '48px',
                    padding: '0 18px',
                    borderRadius: '12px',
                    border: '0',
                    background: '#F3C568',
                    color: '#18343A',
                    fontSize: '16px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Jegyzet mentése
                </button>
                {list(v.notes).map((nt, ntIndex) => (
                  <div
                    key={ntIndex}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      background: '#1C454D',
                      borderRadius: '14px',
                      padding: '12px 14px'
                    }}
                  >
                    <div style={{ flex: '1' }}>
                      <div style={{ fontSize: '16px', whiteSpace: 'pre-wrap' }}>{nt.text}</div>
                      <div style={{ fontSize: '14px', color: '#CFC3A8', marginTop: '4px' }}>{nt.time}</div>
                    </div>
                    <button
                      onClick={nt.onDelete}
                      aria-label="Jegyzet törlése"
                      style={{
                        width: '48px',
                        height: '48px',
                        flex: 'none',
                        borderRadius: '12px',
                        border: '0',
                        background: 'transparent',
                        color: '#CFC3A8',
                        cursor: 'pointer',
                        fontFamily: "'Material Symbols Rounded'",
                        fontSize: '22px'
                      }}
                    >
                      delete
                    </button>
                  </div>
                ))}
              </div>
            </Fragment>
          ) : null}
          {v.pSettings ? (
            <div style={{ background: '#1C454D', borderRadius: '18px', padding: '8px 0' }}>
              <label
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(235,213,163,.1)'
                }}
              >
                <span style={{ fontWeight: '700' }}>Megjelenített név</span>
                <input
                  value={v.nameVal ?? ''}
                  onChange={v.onName}
                  maxLength="24"
                  style={{
                    minHeight: '48px',
                    fontSize: '17px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(235,213,163,.3)',
                    background: '#102D35',
                    color: '#FFF4DF',
                    width: '220px',
                    maxWidth: '100%'
                  }}
                />
              </label>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(235,213,163,.1)'
                }}
              >
                <label htmlFor="ts" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  Olvasási betűméret
                  <span style={{ color: '#91D7E8' }}>{v.textSizeLabel}</span>
                </label>
                <input
                  id="ts"
                  type="range"
                  min="18"
                  max="30"
                  step="1"
                  value={v.textSize ?? ''}
                  onChange={v.onTextSize}
                  style={{ width: '100%', accentColor: '#F3C568', minHeight: '32px' }}
                />
                <div
                  style={{
                    background: '#FFF4DF',
                    color: '#18343A',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: v.readSize,
                    lineHeight: '1.65'
                  }}
                >
                  Mira a műhelyhez sietett.
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(235,213,163,.1)'
                }}
              >
                <span style={{ fontWeight: '700' }}>Felolvasás sebessége</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {list(v.rateOpts).map((ro, roIndex) => (
                    <button
                      key={roIndex}
                      onClick={ro.onClick}
                      aria-pressed={ro.pressed}
                      style={{
                        minHeight: '48px',
                        padding: '0 16px',
                        borderRadius: '12px',
                        border: `1.5px solid ${ro.border ?? ''}`,
                        background: ro.bg,
                        color: ro.color,
                        fontSize: '16px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {ro.label}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '15px', color: '#CFC3A8' }}>{v.narrStatusText}</span>
              </div>
              {list(v.practiceSettings).map((psx, psxIndex) => (
                <div
                  key={psxIndex}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(235,213,163,.1)'
                  }}
                >
                  <span style={{ fontWeight: '700' }}>{psx.label}</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {list(psx.opts).map((po2, po2Index) => (
                      <button
                        key={po2Index}
                        onClick={po2.onClick}
                        aria-pressed={po2.pressed}
                        style={{
                          minHeight: '48px',
                          padding: '0 14px',
                          borderRadius: '12px',
                          border: `1.5px solid ${po2.border ?? ''}`,
                          background: po2.bg,
                          color: po2.color,
                          fontSize: '15px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {po2.label}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: '15px', color: '#CFC3A8' }}>{psx.sub}</span>
                </div>
              ))}
              {list(v.toggles).map((tg, tgIndex) => (
                <div
                  key={tgIndex}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(235,213,163,.1)'
                  }}
                >
                  <span>
                    <span style={{ fontWeight: '700', display: 'block' }}>{tg.label}</span>
                    <span style={{ fontSize: '15px', color: '#CFC3A8' }}>{tg.sub}</span>
                  </span>
                  <button
                    role="switch"
                    aria-checked={tg.on}
                    aria-label={tg.label}
                    onClick={tg.onClick}
                    style={{
                      position: 'relative',
                      width: '60px',
                      height: '34px',
                      flex: 'none',
                      borderRadius: '999px',
                      border: '0',
                      background: tg.track,
                      cursor: 'pointer',
                      padding: '0'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        left: tg.knob,
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#FFF4DF',
                        transition: 'left .15s'
                      }}
                    ></span>
                  </button>
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px 20px' }}>
                <span style={{ fontWeight: '700' }}>Helyi tevékenységadatok törlése</span>{' '}
                <span style={{ fontSize: '15px', color: '#CFC3A8' }}>
                  Törli a küldetés állapotát, az eseményeket, a jegyzeteket, a megszerzett eszközöket és a saját
                  szövegeket ezen az eszközön. A beállítások megmaradnak.
                </span>
                {v.notConfirmClear ? (
                  <button
                    onClick={v.askClear}
                    style={{
                      alignSelf: 'flex-start',
                      minHeight: '48px',
                      padding: '0 18px',
                      borderRadius: '12px',
                      border: '1.5px solid #EBD5A3',
                      background: 'transparent',
                      color: '#F6EAD2',
                      fontSize: '16px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Adatok törlése
                  </button>
                ) : null}
                {v.confirmClear ? (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#F3C568' }}>Biztosan törlöd?</span>
                    <button
                      onClick={v.doClear}
                      style={{
                        minHeight: '48px',
                        padding: '0 18px',
                        borderRadius: '12px',
                        border: '0',
                        background: '#F3C568',
                        color: '#18343A',
                        fontSize: '16px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      Igen, törlöm
                    </button>
                    <button
                      onClick={v.cancelClear}
                      style={{
                        minHeight: '48px',
                        padding: '0 18px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(235,213,163,.4)',
                        background: 'transparent',
                        color: '#F6EAD2',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Mégsem
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          {v.pHomework ? (
            <Fragment>
              {v.hwEditing ? (
                <Fragment>
                  <p style={{ margin: '0', color: '#CFC3A8', fontSize: '16px' }}>
                    Illessz be egy rövid magyar bekezdést, és készíts belőle egy gyakorlófeladatot. A kérdést és a
                    válaszokat te írod meg; az alkalmazás nem generál tartalmat.
                  </p>
                  <div
                    style={{
                      background: '#1C454D',
                      borderRadius: '18px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <h2 style={{ margin: '0', fontSize: '17px', fontWeight: '800', color: '#EBD5A3' }}>
                      1. Szöveg beillesztése
                    </h2>
                    <textarea
                      value={v.hw?.text ?? ''}
                      onChange={v.onHwText}
                      rows="6"
                      placeholder="Illeszd ide a szöveget…"
                      aria-label="Saját szöveg"
                      style={{
                        fontSize: '17px',
                        lineHeight: '1.6',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(235,213,163,.3)',
                        background: '#102D35',
                        color: '#FFF4DF',
                        resize: 'vertical'
                      }}
                    ></textarea>
                    <button
                      onClick={v.hwSplit}
                      style={{
                        alignSelf: 'flex-start',
                        minHeight: '48px',
                        padding: '0 18px',
                        borderRadius: '12px',
                        border: '1.5px solid #91D7E8',
                        background: 'transparent',
                        color: '#91D7E8',
                        fontSize: '16px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      Szakaszokra bontás
                    </button>
                  </div>
                  <div
                    style={{
                      background: '#1C454D',
                      borderRadius: '18px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <h2 style={{ margin: '0', fontSize: '17px', fontWeight: '800', color: '#EBD5A3' }}>
                      2. Szakaszok szerkesztése
                    </h2>
                    {v.hwNoSections ? (
                      <span style={{ fontSize: '15px', color: '#CFC3A8' }}>
                        Még nincsenek szakaszok. Bontsd fel a szöveget, vagy adj hozzá egyet.
                      </span>
                    ) : null}
                    {list(v.hwSections).map((hs, hsIndex) => (
                      <div key={hsIndex} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: '800', color: '#91D7E8', width: '28px', paddingTop: '12px' }}>
                          {hs.n}.
                        </span>
                        <textarea
                          value={hs.text ?? ''}
                          onChange={hs.onChange}
                          rows="3"
                          aria-label={hs.aria}
                          style={{
                            flex: '1',
                            minWidth: '0',
                            fontSize: '16px',
                            lineHeight: '1.55',
                            padding: '10px 12px',
                            borderRadius: '12px',
                            border: '1.5px solid rgba(235,213,163,.3)',
                            background: '#102D35',
                            color: '#FFF4DF',
                            resize: 'vertical'
                          }}
                        ></textarea>
                        <button
                          onClick={hs.onRemove}
                          aria-label="Szakasz törlése"
                          style={{
                            width: '48px',
                            height: '48px',
                            flex: 'none',
                            borderRadius: '12px',
                            border: '0',
                            background: 'transparent',
                            color: '#CFC3A8',
                            cursor: 'pointer',
                            fontFamily: "'Material Symbols Rounded'",
                            fontSize: '22px'
                          }}
                        >
                          delete
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={v.hwAddSection}
                      style={{
                        alignSelf: 'flex-start',
                        minHeight: '48px',
                        padding: '0 16px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(235,213,163,.35)',
                        background: 'transparent',
                        color: '#F6EAD2',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      + Új szakasz
                    </button>
                  </div>
                  <div
                    style={{
                      background: '#1C454D',
                      borderRadius: '18px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <h2 style={{ margin: '0', fontSize: '17px', fontWeight: '800', color: '#EBD5A3' }}>
                      3–4. Kérdés és válaszlehetőségek
                    </h2>
                    <input
                      value={v.hw?.question ?? ''}
                      onChange={v.onHwQuestion}
                      placeholder="Kérdés"
                      aria-label="Kérdés"
                      style={{
                        minHeight: '52px',
                        fontSize: '17px',
                        padding: '0 14px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(235,213,163,.3)',
                        background: '#102D35',
                        color: '#FFF4DF'
                      }}
                    />
                    {list(v.hwOptions).map((ho, hoIndex) => (
                      <div key={hoIndex} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={ho.onCorrect}
                          role="radio"
                          aria-checked={ho.isCorrect}
                          aria-label={ho.radioLabel}
                          style={{
                            width: '48px',
                            height: '48px',
                            flex: 'none',
                            borderRadius: '12px',
                            border: `1.5px solid ${ho.border ?? ''}`,
                            background: ho.bg,
                            color: ho.color,
                            cursor: 'pointer',
                            fontFamily: "'Material Symbols Rounded'",
                            fontSize: '24px'
                          }}
                        >
                          {ho.icon}
                        </button>
                        <input
                          value={ho.text ?? ''}
                          onChange={ho.onChange}
                          placeholder={ho.ph}
                          aria-label={ho.ph}
                          style={{
                            flex: '1',
                            minWidth: '0',
                            minHeight: '48px',
                            fontSize: '16px',
                            padding: '0 14px',
                            borderRadius: '12px',
                            border: '1.5px solid rgba(235,213,163,.3)',
                            background: '#102D35',
                            color: '#FFF4DF'
                          }}
                        />
                      </div>
                    ))}
                    <span style={{ fontSize: '14px', color: '#CFC3A8' }}>A pipával jelöld a helyes választ.</span>
                  </div>
                  {v.hwMsg ? (
                    <div role="status" style={{ color: '#F3C568', fontWeight: '700' }}>
                      {v.hwMsg}
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={v.hwPreviewOpen}
                      style={{
                        minHeight: '52px',
                        padding: '0 20px',
                        borderRadius: '12px',
                        border: '1.5px solid #91D7E8',
                        background: 'transparent',
                        color: '#91D7E8',
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
                        visibility
                      </span>
                      5. Előnézet
                    </button>
                    <button
                      onClick={v.hwSave}
                      style={{
                        minHeight: '52px',
                        padding: '0 20px',
                        borderRadius: '12px',
                        border: '0',
                        background: '#F3C568',
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
                        save
                      </span>
                      6. Mentés
                    </button>
                  </div>
                  {v.hwHasSaved ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h2 style={{ margin: '8px 0 0', fontSize: '18px', fontWeight: '800' }}>Mentett feladatok</h2>
                      {list(v.hwSaved).map((sv, svIndex) => (
                        <div
                          key={svIndex}
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            background: '#1C454D',
                            borderRadius: '14px',
                            padding: '8px 8px 8px 16px'
                          }}
                        >
                          <div style={{ flex: '1', minWidth: '0' }}>
                            <div style={{ fontWeight: '700' }}>{sv.title}</div>
                            <div style={{ fontSize: '14px', color: '#CFC3A8' }}>{sv.meta}</div>
                          </div>
                          <button
                            onClick={sv.onOpen}
                            style={{
                              minHeight: '48px',
                              padding: '0 14px',
                              borderRadius: '12px',
                              border: '1.5px solid #91D7E8',
                              background: 'transparent',
                              color: '#91D7E8',
                              fontSize: '15px',
                              fontWeight: '800',
                              cursor: 'pointer'
                            }}
                          >
                            Előnézet
                          </button>
                          <button
                            onClick={sv.onDelete}
                            aria-label="Feladat törlése"
                            style={{
                              width: '48px',
                              height: '48px',
                              flex: 'none',
                              borderRadius: '12px',
                              border: '0',
                              background: 'transparent',
                              color: '#CFC3A8',
                              cursor: 'pointer',
                              fontFamily: "'Material Symbols Rounded'",
                              fontSize: '22px'
                            }}
                          >
                            delete
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Fragment>
              ) : null}
              {v.hwPreviewing ? (
                <Fragment>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '900',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: '#18343A',
                        background: '#EBD5A3',
                        padding: '4px 10px',
                        borderRadius: '999px'
                      }}
                    >
                      Gyerek nézet · előnézet
                    </span>
                    <button
                      onClick={v.pvClose}
                      style={{
                        minHeight: '48px',
                        padding: '0 16px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(235,213,163,.4)',
                        background: 'transparent',
                        color: '#F6EAD2',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Vissza a szerkesztéshez
                    </button>
                  </div>
                  <div
                    style={{
                      background: '#0B2329',
                      borderRadius: '24px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    {list(v.pvSections).map((ps, psIndex) => (
                      <div
                        key={psIndex}
                        style={{
                          background: '#FFF4DF',
                          color: '#18343A',
                          borderRadius: '20px',
                          padding: '20px 22px',
                          fontSize: v.readSize,
                          lineHeight: '1.65',
                          maxWidth: '65ch'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '900',
                            letterSpacing: '.08em',
                            textTransform: 'uppercase',
                            color: '#5A6E6B',
                            marginBottom: '6px'
                          }}
                        >
                          {ps.label}
                        </div>
                        {ps.text}
                      </div>
                    ))}
                    <h2 style={{ margin: '6px 0 0', fontSize: '24px', fontWeight: '900', color: '#FFF4DF' }}>
                      {v.pv?.question}
                    </h2>
                    {list(v.pvOptions).map((po, poIndex) => (
                      <button
                        key={poIndex}
                        onClick={po.onClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          minHeight: '60px',
                          padding: '12px 16px',
                          borderRadius: '18px',
                          border: `2px solid ${po.border ?? ''}`,
                          background: po.bg,
                          color: '#F6EAD2',
                          fontSize: '18px',
                          fontWeight: '700',
                          textAlign: 'left',
                          cursor: 'pointer'
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
                              color: po.tagColor
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{ fontFamily: "'Material Symbols Rounded'", fontSize: '20px', lineHeight: '1' }}
                            >
                              {po.icon}
                            </span>
                            {po.tag}
                          </span>
                        ) : null}
                      </button>
                    ))}
                    {v.pvFeedback ? (
                      <div
                        role="status"
                        style={{
                          background: 'rgba(145,215,232,.12)',
                          border: '1px solid rgba(145,215,232,.5)',
                          borderRadius: '16px',
                          padding: '14px 16px',
                          fontSize: '18px'
                        }}
                      >
                        {v.pvFeedback}
                      </div>
                    ) : null}
                  </div>
                </Fragment>
              ) : null}
            </Fragment>
          ) : null}
        </Fragment>
      ) : null}
    </div>
  );
}
