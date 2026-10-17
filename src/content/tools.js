import { TOOLS as RAW } from './authored.js';

// The five strategy tools. All are open from the start; a tool is a reminder of a strategy, never a reward gate.
const EXPLAIN = {
  goggles: 'Megkeresem a választ a szövegben.',
  glove: 'Sorrendbe teszem az eseményeket.',
  shield: 'Kiemelem a legfontosabb gondolatot.',
  crystal: 'Megértem az ismeretlen szavakat.',
  compass: 'Segítséget választok, amikor elakadok.'
};

// Approved texts that go with a tool. `why`: a short explanation of the strategy. `example`: a worked example from one
// story (shown only after that adventure is completed, see EXAMPLE_FROM in screens/MyWorld.jsx).
const EXTRA = {
  shield: {
    why: 'A lényegből megértjük, miről szól az egész szöveg. Nem kell minden eseményt felsorolnod.',
    example: {
      heading: 'Példa: Az eltűnt energiamag',
      text: 'Mira megtalálja és visszahelyezi a hiányzó energiamagot, így újra működik a fényhíd világítása.',
      whyHeading: 'Miért ez a lényeg?',
      whyText:
        'Ebből megértjük a problémát és a megoldást. A foglalat alakja és a jelzőfény színe részlet: nélkülük is érthető, mi történt.'
    }
  }
};

export const TOOLS = RAW.map((t) => ({ ...t, explain: EXPLAIN[t.id], ...EXTRA[t.id] }));

// The compass explains the help options that already exist (the labels are the real control labels; nothing here is a
// new button). Shown on the compass page above the list.
export const HELP_INTRO =
  'Mindig azok a lehetőségek jelennek meg, amelyeket az adott résznél használhatsz. Segítséget kérni nem hiba.';
export const HELP_EXPLAIN = [
  ['Kapok egy támpontot', 'Egy kis segítséget kapsz ahhoz, hogy tovább tudj gondolkodni.'],
  ['Újra elolvasom', 'Visszanézheted a feladathoz tartozó szöveget.'],
  ['Megmutatom a szöveget', 'Ha eddig csak hallgattad, most el is olvashatod.'],
  ['Újra meghallgatom', 'Még egyszer meghallgathatod a feladathoz tartozó részt.'],
  [
    'Kisebb részekben haladok / Rövidebb részt kérek',
    'Egyszerre kevesebb szöveget kapsz. A részek között te léphetsz tovább.'
  ],
  ['Szünetet tartok', 'Megpihenhetsz, majd ugyanott folytathatod a kalandot.']
];

// The routine taught across all adventures.
export const ROUTINE = [
  { icon: 'pan_tool', label: 'Megállok', text: 'Egy rövid részre figyelek.' },
  { icon: 'psychology', label: 'Átgondolom', text: 'Mi történt? Mi volt fontos?' },
  { icon: 'record_voice_over', label: 'Elmondom', text: 'Megfogalmazom a saját szavaimmal.' },
  { icon: 'fact_check', label: 'Ellenőrzöm', text: 'Visszanézek vagy újra meghallgatom.' }
];
