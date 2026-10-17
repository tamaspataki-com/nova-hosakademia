// NOVA content package 06: "Az első bátor lépés" – the first adventure of „Bátorság bolygója”.
// The Hungarian text is exactly as approved by the owner (design/world-5-courage-proposal.md §7, with the owner's five
// corrections). Interface wording that is not in the package (button labels of the shared system) lives in the
// activity components. A fictional story about the character Léna: nothing here is a claim about the child.
//
// Narration: the 15 recordings in public/audio/courage1-*.mp3 (registered in audio.js). The intro video is not set.
const src = (sectionId) => ({ passageId: 'story', sectionId });

export const COURAGE = {
  id: 'courage-first-step-01',
  version: 1,
  worldId: 'courage',
  seriesId: 'star-map-station',
  title: 'Az első bátor lépés',
  description: 'Léna ma először mutat be valamit a csapatnak. Segíts neki kis lépésekkel elindulni!',
  intro:
    'Léna az űrállomás csillagtérképénél áll. Ma neki kell bemutatnia az első csillagképet, és kicsit izgul. Segíts neki megtalálni az első kis lépést!',
  startLabel: 'Elindulok Lénával',
  stepWords: true, // task steps offer the glossary words they contain
  classification: 'fiction',
  sources: [],
  review: {
    status: 'unreviewed',
    note: 'A tartalmat a szülő hagyta jóvá (content package 06); felnőtt általi felülvizsgálat még nincs rögzítve.'
  },
  format: 'story',
  status: 'available',
  context: 'practice',
  level: 1,
  modes: ['read', 'listen', 'combined'],
  objectives: ['detail', 'mainIdea'], // technical labels: parent area only
  hideObjectives: true,
  // Cover: Léna and Csipp at the star-map table before the presentation (nothing of the outcome), generated from the
  // locked character reference sheet. Shown only on the card and the introduction – never inside an activity.
  // Master: design/source-art/courage/courage-first-step.png. The icon is the fallback while it loads.
  coverAsset: 'assets/courage-first-step.webp',
  coverSet: 'assets/courage-first-step-768.webp 768w, assets/courage-first-step.webp 1536w',
  // On wide screens the cover is cut to a 360 px band; centred, it would clip the top of Léna's hair and graze the flower.
  coverPosition: '50% 22%',
  coverIcon: 'flag',
  coverAlt: 'Léna és Csipp, a kis robot a csillagtérkép asztalánál az űrállomáson',
  // OPTIONAL intro video: not set, because the final (Hedra) file has not been supplied and checked. When it arrives, encode it
  // with scripts/encode-intro-video.swift, put it in public/video/ and set { src: 'video/<file>.mp4', width, height } (the final
  // size; keep captions out unless someone speaks). Shown only on the introduction, started by the child, skippable, no loop.
  introVideo: null,
  badge: 'elso-lepes',
  glossary: [
    {
      key: 'csillagkép',
      word: 'csillagkép',
      def: 'Az égbolton egymáshoz közelinek látszó csillagok csoportja, amelynek nevet adtak.'
    },
    { key: 'beszámoló', word: 'beszámoló', def: 'Rövid előadás arról, amit megtudtunk vagy elvégeztünk.' },
    { key: 'segítőrobot', word: 'segítőrobot', def: 'Olyan robot, amely a munkában segít.' }
  ],
  passages: [
    {
      id: 'story',
      title: 'Az első bátor lépés',
      sections: [
        {
          id: 'p1',
          label: '1. rész',
          sentences: [
            { id: 'p1-s1', text: 'Léna az űrállomás csillagtérképe előtt állt.' },
            { id: 'p1-s2', text: 'Ma neki kellett bemutatnia a csapatnak az első csillagképet.' },
            { id: 'p1-s3', text: 'A keze kicsit remegett, a szíve pedig gyorsabban vert.' },
            { id: 'p1-s4', text: 'Csipp, a kis segítőrobot odagurult mellé.' }
          ],
          chunks: [
            ['p1-s1', 'p1-s2'],
            ['p1-s3', 'p1-s4']
          ]
        },
        {
          id: 'p2',
          label: '2. rész',
          sentences: [
            { id: 'p2-s1', text: 'A csapat összegyűlt a térkép körül.' },
            { id: 'p2-s2', text: 'Léna megérintette a legelső csillagot, az pedig halványkéken felvillant.' },
            { id: 'p2-s3', text: 'Elkezdte mondani a csillagkép nevét és a történetét, de közben elakadt.' },
            { id: 'p2-s4', text: 'Egy pillanatra elhallgatott.' }
          ],
          chunks: [
            ['p2-s1', 'p2-s2'],
            ['p2-s3', 'p2-s4']
          ]
        },
        {
          id: 'p3',
          label: '3. rész',
          sentences: [
            { id: 'p3-s1', text: 'Léna befejezte a beszámolót.' },
            { id: 'p3-s2', text: 'Nem lett tökéletes, de elkezdte, elakadt, és mégis folytatta.' },
            { id: 'p3-s3', text: 'Csipp beírta az állomás naplójába: „Ma Léna megtette az első lépést.”' }
          ],
          chunks: [['p3-s1'], ['p3-s2', 'p3-s3']]
        }
      ]
    },
    {
      // The consequences of the two choices. Each is a short narrated section of its own (clip ids
      // `courage-first-step-01:paths:<id>`); the three narrated story parts above stay identical for every child.
      id: 'paths',
      title: 'Következmények',
      sections: [
        {
          id: 'x1a',
          label: 'Következmény',
          sentences: [
            { id: 'x1a-s1', text: 'Léna halkan elmondta az első mondatot.' },
            { id: 'x1a-s2', text: 'Csipp vidáman pittyentett.' },
            { id: 'x1a-s3', text: 'Léna úgy érezte, hogy most már könnyebb lesz kimondania a következőt.' }
          ]
        },
        {
          id: 'x1b',
          label: 'Következmény',
          sentences: [
            { id: 'x1b-s1', text: 'Léna elmondta az egész beszámolót, de a közepén elakadt.' },
            { id: 'x1b-s2', text: 'Csipp azt mondta: „Most már tudjuk, melyik részt érdemes még átnézni.”' },
            { id: 'x1b-s3', text: 'Léna még egyszer átnézte azt a részt, mielőtt megérkezett a csapat.' }
          ]
        },
        {
          id: 'x1c',
          label: 'Következmény',
          sentences: [
            { id: 'x1c-s1', text: 'Léna várt, de az izgulás nem múlt el magától.' },
            { id: 'x1c-s2', text: 'Közben a csapat gyülekezni kezdett.' },
            { id: 'x1c-s3', text: 'Csipp halkan azt javasolta: induljon egy nagyon kicsi lépéssel.' },
            { id: 'x1c-s4', text: 'Léna megpróbálta, és halkan elmondta az első mondatot.' }
          ]
        },
        {
          id: 'x2a',
          label: 'Következmény',
          sentences: [
            { id: 'x2a-s1', text: 'Léna mély levegőt vett, és újrakezdte az utolsó mondatot.' },
            { id: 'x2a-s2', text: 'Másodszorra már végig tudta mondani.' }
          ]
        },
        {
          id: 'x2b',
          label: 'Következmény',
          sentences: [
            { id: 'x2b-s1', text: 'Léna elővette a zsebéből a jegyzetkártyát.' },
            { id: 'x2b-s2', text: 'Megtalálta rajta, hol tartott, és folytatta.' }
          ]
        },
        {
          id: 'x2c',
          label: 'Következmény',
          sentences: [
            { id: 'x2c-s1', text: 'Léna rövidebben mondta el a többit.' },
            {
              id: 'x2c-s2',
              text: 'Néhány részletet kihagyott, de elmondta, melyik csillagképet mutatja, és miről kapta a nevét.'
            }
          ]
        }
      ]
    }
  ],
  steps: [
    { id: 'p1', type: 'passage', title: 'A történet – 1. rész', passageId: 'story', sectionId: 'p1' },
    {
      id: 'a1-detail',
      type: 'choice',
      title: 'Felidézés',
      objective: 'detail',
      prompt: 'Mit kellett Lénának bemutatnia a csapatnak?',
      options: [
        { id: 'constellation', text: 'Az első csillagképet.' },
        { id: 'ship', text: 'Egy új űrhajót.' },
        { id: 'planet', text: 'Egy új bolygót.' }
      ],
      correct: 'constellation',
      source: src('p1'),
      hints: ['A történet első mondatai elmondják, mit kellett bemutatnia.'],
      guided: { text: 'Lénának az első csillagképet kellett bemutatnia a csapatnak.' },
      feedback: { correct: 'Jól felidézted, mi volt Léna feladata.' }
    },
    {
      // Lacika advises; there is no wrong option, and each option has its own consequence.
      id: 'choice-first',
      type: 'storyChoice',
      title: 'Az első lépés',
      prompt: 'Mit tanácsolsz Lénának: mi legyen az első kis lépése?',
      note: 'Válassz egy lehetőséget, és nézd meg, mi történik utána!',
      submitLabel: 'Ezt választom',
      options: [
        { id: 'first-sentence', text: 'Csak az első mondatot mondja el halkan Csippnek.', section: 'x1a' },
        { id: 'whole-try', text: 'Végigpróbálja az egész beszámolót Csipp előtt.', section: 'x1b' },
        { id: 'wait', text: 'Megvárja, amíg egyáltalán nem izgul.', section: 'x1c' }
      ]
    },
    { id: 'p2', type: 'passage', title: 'A történet – 2. rész', passageId: 'story', sectionId: 'p2' },
    {
      id: 'a2-detail',
      type: 'choice',
      title: 'Felidézés',
      objective: 'detail',
      prompt: 'Mi történt, amikor Léna megérintette az első csillagot?',
      options: [
        { id: 'flash', text: 'Halványkéken felvillant.' },
        { id: 'dark', text: 'Kialudt a térkép.' },
        { id: 'rolled', text: 'Csipp elgurult.' }
      ],
      correct: 'flash',
      source: src('p2'),
      hints: ['Nézd meg, mi történt a csillaggal!'],
      guided: { text: 'Amikor Léna megérintette a legelső csillagot, az halványkéken felvillant.' },
      feedback: { correct: 'Jól felidézted a részletet.' }
    },
    {
      id: 'choice-stuck',
      type: 'storyChoice',
      title: 'Elakadás',
      prompt: 'Léna elakadt. Mit tanácsolsz neki?',
      note: 'Válassz egy lehetőséget, és nézd meg, mi történik utána!',
      submitLabel: 'Ezt választom',
      options: [
        { id: 'breathe', text: 'Mély levegőt vesz, és újrakezdi az utolsó mondatot.', section: 'x2a' },
        { id: 'card', text: 'Ránéz a jegyzetkártyájára.', section: 'x2b' },
        { id: 'shorter', text: 'Rövidebben mondja el a többit.', section: 'x2c' }
      ]
    },
    { id: 'p3', type: 'passage', title: 'A történet – 3. rész', passageId: 'story', sectionId: 'p3' },
    {
      id: 'a3-main',
      type: 'choice',
      title: 'Összefoglalás',
      objective: 'mainIdea',
      prompt: 'Melyik mondat foglalja össze legjobban a történetet?',
      options: [
        {
          id: 'summary',
          text: 'Léna kis lépésekkel elkezdte a beszámolót, és akkor is folytatta, amikor elakadt.'
        },
        { id: 'perfect', text: 'Léna hibátlanul elmondott mindent, ezért nem kellett izgulnia.' },
        { id: 'quit', text: 'Léna úgy döntött, hogy inkább nem mutatja be a csillagképet.' }
      ],
      correct: 'summary',
      sources: [src('p1'), src('p2'), src('p3')],
      source: src('p3'),
      hints: ['Melyik válasz szól az egész történetről, az elejétől a végéig?'],
      guided: { text: 'Léna kis lépésekkel elkezdte a beszámolót, és akkor is folytatta, amikor elakadt.' },
      feedback: { correct: 'Összefoglaltad a történet lényegét.' }
    },
    {
      id: 'reflection-help',
      type: 'reflection',
      title: 'Visszatekintés',
      heading: 'Mi segített most?',
      multi: true,
      scored: false,
      options: [
        { id: 'imagine', text: 'Elképzeltem, mi lehet az első kis lépés.' },
        { id: 'after-choice', text: 'Megnéztem, mi történt a választásom után.' },
        { id: 'reread', text: 'Visszakerestem a történetben.' },
        { id: 'replay', text: 'Újra meghallgattam a szöveget.', requires: 'replay' },
        { id: 'help', text: 'Segítséget kértem.' },
        { id: 'unsure', text: 'Most még nem tudom.', exclusive: true }
      ]
    },
    {
      // Personal: one choice, no free text. The parent view shows only that it was completed (`private`).
      id: 'reflection-life',
      type: 'reflection',
      title: 'Egy kis lépés nálad',
      heading: 'Mi lehetne neked az első kis lépés valamiben, ami nehéznek tűnik?',
      single: true,
      scored: false,
      private: true,
      options: [
        { id: 'tell', text: 'Elmondanám valakinek, akiben bízom.' },
        { id: 'try-small', text: 'Kipróbálnám egy nagyon kicsi részét.' },
        { id: 'write', text: 'Felírnám vagy lerajzolnám az első lépést.' },
        { id: 'skip', text: 'Most nem szeretnék válaszolni.', exclusive: true }
      ],
      after: 'Ezt most nem kell megtenned. Egyelőre elég kigondolnod, mi lehetne az első kis lépésed.'
    }
  ],
  discoveries: [
    {
      id: 'small-step',
      title: 'A kis lépés is lépés',
      text: 'Léna nem várta meg, hogy az izgulás teljesen elmúljon. Egy kicsi lépéssel kezdett, és folytatta, amikor elakadt.',
      kind: 'fiction',
      label: 'Kitalált történetből származó felfedezés'
    }
  ],
  completion: {
    title: 'Léna megtette az első lépést!',
    text: 'Végigkövetted, hogyan kezdett el Léna kis lépésekkel valamit, ami nehéznek tűnt. Két helyzetben segítettél neki dönteni. Láttad, hogyan tudott elindulni, majd folytatni, amikor elakadt.',
    actions: [
      { to: 'world', label: 'Vissza a kalandokhoz' },
      { to: 'discoveries', label: 'Megnézem a felfedezésemet' }
    ]
  }
};
