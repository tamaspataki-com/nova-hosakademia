// NOVA content package 07: „A kimondatlan nem" – the first adventure of „Kapcsolatok bolygója".
// The Hungarian dialogue, screen texts, answer choices and responses are exactly as in the owner's storyboard
// (the pilot storyboard of this conversation, 2026-10-17). The seven talking clips were made through Hedra and approved
// by the owner; they are re-encoded with scripts/encode-clip-video.swift (960 × 540, H.264 + AAC, fast start; masters in
// design/source-video/kapcsolatok/, not committed). Wording that is NOT in the storyboard (step titles in the progress bar,
// the world and series names, the world description, the completion text, the button labels of the shared system) is
// listed in README.md under „Kapcsolatok bolygója" and still needs the owner's approval.
//
// There are no recordings and no passages: the spoken words are carried by the videos and always shown as text beside them.
const clip = (n, ms) => ({ src: `video/kapcsolatok1-v${n}.mp4`, width: 960, height: 540, seconds: ms });

export const KAPCSOLATOK = {
  id: 'kapcsolatok-unspoken-no-01',
  version: 1,
  worldId: 'connection',
  seriesId: 'star-playground',
  title: 'A kimondatlan nem',
  description:
    'Segíts Mirának elmondani, mit szeretne, és találjatok olyan megoldást, amelyben mindkét barátnak van választása.',
  intro:
    'Segíts Mirának elmondani, mit szeretne, és találjatok olyan megoldást, amelyben mindkét barátnak van választása.',
  startLabel: 'Segítek Mirának',
  onlineNote: 'A beszélgetések videók: lejátszásukhoz internetkapcsolat kell. A szövegük a videók alatt olvasható.',
  classification: 'fiction',
  sources: [],
  review: {
    status: 'adult-reviewed',
    note: 'A szülő 2026-10-17-én jóváhagyta a hét videót, a forgatókönyvet és a végleges felületi szövegeket. Még nincs kész: a borítók, a záró kép és a jelvénykép. Valódi eszközön még nem tesztelték.'
  },
  format: 'story',
  status: 'available',
  context: 'practice',
  level: null, // not a reading-length text: no length label
  modes: ['read'], // the dialogue is in the videos and shown as text; there is no narration to choose
  objectives: [],
  hideObjectives: true,
  // Cover: Mira hesitating beside Zénó at the meteor racetrack (nothing of the outcome). Shown only on the card and the
  // introduction – never inside an activity. Master: design/source-art/kapcsolatok/kapcsolatok-unspoken-no.png.
  coverAsset: 'assets/kapcsolatok-unspoken-no.webp',
  coverSet: 'assets/kapcsolatok-unspoken-no-768.webp 768w, assets/kapcsolatok-unspoken-no.webp 1536w',
  coverPosition: '50% 35%',
  coverIcon: 'forum', // fallback while the cover loads
  coverAlt: 'Mira bizonytalanul áll a csillagtérkép asztalánál, mellette Zénó a meteorversenypályát mutatja.',
  badge: 'sajat-hang',
  glossary: [],
  passages: [],
  steps: [
    {
      id: 'v1-mira',
      type: 'clip',
      title: 'Mira üzenete',
      speaker: 'Mira',
      clip: clip(1),
      screenText: 'Mira szeretne valami mást. Segíts neki megtalálni a saját szavait!',
      say: 'Szia! Segítenél nekem? Zénó már készíti a meteorversenyt. Tegnap is azt játszottuk. Én ma inkább csillagtérképet készítenék vele. Csak… nem tudom, hogyan mondjam el neki. Mi van, ha megharagszik?',
      nextLabel: 'Meghallgatom Zénót'
    },
    {
      id: 'v2-zeno',
      type: 'clip',
      title: 'Zénó története',
      speaker: 'Zénó',
      clip: clip(2),
      say: 'Szia! Nézd, új kanyarokat építettem a pályára! Mira mindig olyan jókat nevet verseny közben. Biztos ma is tetszeni fog neki. Már két űrjárgányt is odakészítettem!'
    },
    {
      id: 'd1-know',
      type: 'talkChoice',
      title: 'Mit tudunk biztosan?',
      prompt: 'Mit tudunk most biztosan?',
      options: [
        {
          id: 'hurt',
          text: 'Zénó azt szeretné, hogy Mira rosszul érezze magát.',
          feedback: 'Ezt nem hallottuk tőle. Zénó örül a versenynek, és azt gondolja, Mira is örülni fog.'
        },
        {
          id: 'unknown',
          text: 'Mira mást szeretne, de Zénó ezt még nem tudja.',
          correct: true,
          feedback: 'Így van. Mi már hallottuk mindkettőjüket. Most abban segíthetünk, hogy ők is meghallják egymást.'
        },
        {
          id: 'never',
          text: 'Mira biztosan nem akar többé Zénóval játszani.',
          feedback:
            'Mira azt mondta, csillagtérképet készítene vele. A barátjával szeretne lenni, csak más játékra vágyik.'
        }
      ]
    },
    {
      id: 'd2-sentence',
      type: 'talkChoice',
      title: 'Melyik mondat segítene?',
      sentences: true,
      prompt: 'Mira odalép Zénóhoz. Melyik mondat mondja el világosan, mit szeretne, anélkül hogy bántaná a barátját?',
      options: [
        {
          id: 'a',
          letter: 'A',
          text: 'Jó, legyen verseny. Mindegy.',
          feedback:
            'Mira most beleegyezett, de Zénó még mindig nem tudja, hogy ő mást szeretne. Próbálj olyan mondatot találni, amelyben Mira kívánsága is hallatszik!'
        },
        {
          id: 'b',
          letter: 'B',
          text: 'Veled mindig csak azt lehet játszani, amit te akarsz!',
          feedback:
            'Ebből hallatszik, hogy Mirának elege van. De Zénó azt még nem tudja meg, mit szeretne helyette. Hogyan mondhatná el ezt Mira pontosabban?'
        },
        {
          id: 'c',
          letter: 'C',
          text: 'Én ma nem szeretnék versenyezni. Inkább csillagtérképet készítenék. Van kedved hozzá?',
          correct: true
        }
      ]
    },
    {
      id: 'v3-mira',
      type: 'clip',
      title: 'Mira kimondja',
      speaker: 'Mira',
      clip: clip(3),
      say: 'Zénó, látom, mennyit dolgoztál a pályán. Én ma nem szeretnék versenyezni. Inkább csillagtérképet készítenék. Van kedved velem tartani?'
    },
    {
      id: 'v4-zeno',
      type: 'clip',
      title: 'Zénó válasza',
      speaker: 'Zénó',
      clip: clip(4),
      say: 'Ó… pedig annyira vártam, hogy kipróbáljuk együtt. Biztos nem jössz legalább egy körre?'
    },
    {
      id: 'd3-reply',
      type: 'talkChoice',
      title: 'Mit mondhat Mira?',
      sentences: true,
      prompt: 'Mira továbbra sem szeretne versenyezni. Mit mondhat?',
      options: [
        {
          id: 'a',
          letter: 'A',
          text: 'Na jó… csak ne legyél szomorú.',
          feedback:
            'Mira meggondolhatja magát, ha valóban szeretné. Most viszont csak Zénó kedvéért mondott igent. Keress egy mondatot, amelyben a saját döntését is megtarthatja!'
        },
        {
          id: 'b',
          letter: 'B',
          text: 'Értem, hogy vártad. Én most akkor sem szeretnék versenyezni. A térképnél szívesen látlak.',
          correct: true,
          feedback: 'Mira meghallotta, hogy Zénó csalódott, és közben világosan elmondta a saját döntését is.'
        },
        {
          id: 'c',
          letter: 'C',
          text: 'Ne legyél már ilyen! Ez csak egy játék.',
          feedback: 'Zénónak szabad csalódottnak lennie. Mira akkor is mondhat nemet, ha a barátja más választ remélt.'
        }
      ]
    },
    {
      id: 'v5-mira',
      type: 'clip',
      title: 'Mira döntése',
      speaker: 'Mira',
      clip: clip(5),
      say: 'Értem, hogy vártad. Én most akkor sem szeretnék versenyezni. Elkezdem a csillagtérképet. Ha később van kedved, csatlakozhatsz.'
    },
    {
      id: 'v6-zeno',
      type: 'clip',
      title: 'Zénó döntése',
      speaker: 'Zénó',
      clip: clip(6),
      say: 'Rendben. Én még kipróbálom az új kanyart. Utána megnézem, milyen térképet készítettél. Hagyj rajta helyet a gyűrűs bolygónak!',
      after: 'Most mást választottak. A barátságuk ettől még megmaradt.',
      // Closing picture (shown only here, after video 6, once both choices are made). Master: design/source-art/kapcsolatok/kapcsolatok-closing.png.
      image: {
        src: 'assets/kapcsolatok-closing.webp',
        srcSet: 'assets/kapcsolatok-closing-768.webp 768w, assets/kapcsolatok-closing.webp 1536w',
        width: 1536,
        height: 857,
        alt: 'Mira a csillagtérkép asztalánál, Zénó a versenyjárgányában a pálya mellett; mindketten mosolyognak.'
      }
    },
    {
      id: 'say-yours',
      type: 'sayIt',
      title: 'Most te következel',
      private: true,
      prompt: 'Gondolj egy játékra, amihez most nem lenne kedved. Próbáld ki hangosan!',
      starters: [
        { id: 'nem-szeretnek', text: 'Én most nem szeretnék…' },
        { id: 'inkabb', text: 'Inkább azt választanám, hogy…' },
        { id: 'nincs-kedvem', text: 'Ehhez most nincs kedvem. Szívesen…' }
      ],
      doneLabel: 'Megtaláltam a mondatomat'
    },
    {
      id: 'v7-mira',
      type: 'clip',
      title: 'Mira megköszöni',
      speaker: 'Mira',
      clip: clip(7),
      say: 'Köszönöm, hogy segítettél! Elmondtam, mit szeretnék, és meghallgattam Zénót is. Kicsit izgultam közben. De jó érzés, hogy most már tudja.',
      after: 'Elmondhatod, mit szeretnél. A másikat is meghallgathatod. Mindkettőtök döntése számít.'
    }
  ],
  discoveries: [],
  completion: {
    title: 'Segítettél Mirának!',
    text: 'Segítettél Mirának elmondani, mit szeretne, és közben meghallgatni Zénót is. A két barát most mást választott, és ezt mindketten elfogadták.',
    actions: [{ to: 'world', label: 'Vissza a kalandokhoz' }]
  }
};
