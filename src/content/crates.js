// NOVA content package 02: "Az összecserélt ládák" – the second dinosaur adventure.
// The Hungarian text, answers, hints, feedback and guided explanations are exactly as supplied. Interface wording
// that is not in the package (button labels of the shared system) lives in the activity components.
const src = (sectionId) => ({ passageId: 'story', sectionId });

export const CRATES = {
  id: 'dino-mixed-crates-02',
  version: 1,
  worldId: 'dinosaurs',
  seriesId: 'research-station',
  title: 'Az összecserélt ládák',
  description: 'Két láda érkezett a parkba. Segíts Bencének a megfelelő helyre küldeni őket!',
  intro:
    'Új szállítmány érkezett a dinoszauruszparkba. A ládák különböző helyekre tartoznak. Figyeld meg a részleteket, és segíts a szállításban!',
  startLabel: 'Megnézem a szállítmányt',
  introGlossary: true, // the introduction offers the glossary words it contains
  classification: 'fiction',
  sources: [],
  review: {
    status: 'unreviewed',
    note: 'A tartalmat a szülő adta át (content package 02); felnőtt általi felülvizsgálat még nincs rögzítve.'
  },
  format: 'story',
  status: 'available',
  context: 'practice',
  level: 1,
  modes: ['read', 'listen', 'combined'],
  objectives: ['detail', 'connect', 'instruction', 'check'], // technical labels: parent area only
  hideObjectives: true,
  // No cover yet: a neutral crate icon is shown on the library card and the introduction.
  coverIcon: 'inventory_2',
  badge: 'szallitasi-nyomozo',
  glossary: [
    { key: 'szállítmány', word: 'szállítmány', def: 'Együtt érkező tárgyak vagy áruk.' },
    {
      key: 'megfigyelőtorony',
      word: 'megfigyelőtorony',
      def: 'Magas építmény, ahonnan jól lehet figyelni a környéket.'
    },
    { key: 'üvegház', word: 'üvegház', def: 'Világos, átlátszó falú építmény, ahol növényeket nevelnek.' },
    {
      key: 'szállítólevél',
      word: 'szállítólevél',
      def: 'Lista arról, milyen tárgyakat szállítanak és hová kerülnek.'
    }
  ],
  passages: [
    {
      id: 'story',
      title: 'Az összecserélt ládák',
      sections: [
        {
          id: 'p1',
          label: '1. rész',
          sentences: [
            { id: 'p1-s1', text: 'Reggel két láda érkezett a kutatóállomásra.' },
            { id: 'p1-s2', text: 'A kék ládában távcső és jegyzetfüzet volt.' },
            { id: 'p1-s3', text: 'A sárga ládában kis ásó és locsolókanna lapult.' }
          ],
          chunks: [['p1-s1'], ['p1-s2', 'p1-s3']]
        },
        {
          id: 'p2',
          label: '2. rész',
          sentences: [
            { id: 'p2-s1', text: 'A gondozó a megfigyelőtoronyból figyeli a dinoszauruszokat.' },
            { id: 'p2-s2', text: 'Oda kéri a távcsövet és a jegyzetfüzetet.' },
            { id: 'p2-s3', text: 'A kertész az üvegházban dolgozik, ezért oda kerülnek a kerti eszközök.' }
          ],
          chunks: [['p2-s1', 'p2-s2'], ['p2-s3']]
        },
        {
          id: 'p3',
          label: '3. rész',
          sentences: [
            {
              id: 'p3-s1',
              text: 'A szállítórobot összecserélte a ládákat: a kéket az üvegházhoz, a sárgát a megfigyelőtoronyhoz vitte.'
            },
            { id: 'p3-s2', text: 'Bence ezt az üzenetet kapta: „Vidd a kék ládát a megfigyelőtoronyhoz!”' },
            { id: 'p3-s3', text: 'Először ezt a szállítást kell kijavítania.' }
          ],
          chunks: [['p3-s1'], ['p3-s2', 'p3-s3']]
        }
      ]
    }
  ],
  steps: [
    { id: 'p1', type: 'passage', title: 'A történet – 1. rész', passageId: 'story', sectionId: 'p1' },
    {
      id: 'a1-pack',
      type: 'sort',
      title: 'Csoportosítás',
      objective: 'detail',
      prompt: 'Mi melyik ládában volt? Tedd a tárgyakat a megfelelő helyre!',
      destinations: [
        { id: 'blue', label: 'Kék láda', swatch: '#4a86c8' },
        { id: 'yellow', label: 'Sárga láda', swatch: '#e2b83a' }
      ],
      items: [
        { id: 'binoculars', text: 'Távcső', to: 'blue' },
        { id: 'notebook', text: 'Jegyzetfüzet', to: 'blue' },
        { id: 'shovel', text: 'Kis ásó', to: 'yellow' },
        { id: 'watering-can', text: 'Locsolókanna', to: 'yellow' }
      ],
      source: src('p1'),
      hints: ['A távcső és a jegyzetfüzet együtt érkezett.'],
      partialText: 'Néhány tárgy már jó helyen van. Nézd meg újra, melyik ládában mi érkezett!',
      guided: { text: 'A kék ládában távcső és jegyzetfüzet volt. A sárga ládában kis ásó és locsolókanna.' },
      revealAt: 2,
      revealLabel: 'Megmutatod a megoldást?',
      feedback: { correct: 'Jól megjegyezted a ládák tartalmát.' }
    },
    { id: 'p2', type: 'passage', title: 'A történet – 2. rész', passageId: 'story', sectionId: 'p2' },
    {
      id: 'a2-destination',
      type: 'sort',
      title: 'Célállomás',
      objective: 'connect',
      prompt: 'Hová küldjük a ládákat?',
      // The cards are the crates (contents stay visible); the destinations are the places. One crate per place.
      destinations: [
        { id: 'tower', label: 'Megfigyelőtorony', icon: 'cell_tower' },
        { id: 'greenhouse', label: 'Üvegház', icon: 'yard' }
      ],
      items: [
        { id: 'blue-crate', text: 'Kék láda: távcső és jegyzetfüzet', to: 'tower', swatch: '#4a86c8' },
        { id: 'yellow-crate', text: 'Sárga láda: kis ásó és locsolókanna', to: 'greenhouse', swatch: '#e2b83a' }
      ],
      capacity: 1,
      poolTitle: 'Ládák',
      submitLabel: 'Elküldöm a ládákat',
      source: src('p2'),
      hints: ['Hol dolgozik az, aki a távcsövet kérte?'],
      guided: {
        text: 'A megfigyelőtoronyba kerül a távcső és a jegyzetfüzet. Az üvegházba kerülnek a kerti eszközök.'
      },
      // Only two arrangements exist, so the solution is offered after the first miss: no repeated guessing.
      revealAt: 1,
      feedback: { correct: 'Mindkét láda oda kerül, ahol használni fogják a benne lévő eszközöket.' }
    },
    { id: 'p3', type: 'passage', title: 'A történet – 3. rész', passageId: 'story', sectionId: 'p3' },
    {
      id: 'a3-instruction',
      type: 'instruction',
      title: 'Utasítás',
      objective: 'instruction',
      heading: 'Javítsd ki az első szállítást!',
      prompt: 'Válaszd ki, melyik ládát kell elvinni, majd jelöld meg, hová kerüljön!',
      // The passage is hidden here; replay and rereading stay in the help panel.
      what: [
        { id: 'blue', text: 'Kék láda', swatch: '#4a86c8' },
        { id: 'yellow', text: 'Sárga láda', swatch: '#e2b83a' }
      ],
      where: [
        { id: 'tower', text: 'Megfigyelőtorony' },
        { id: 'greenhouse', text: 'Üvegház' }
      ],
      correct: { what: 'blue', where: 'tower' },
      submitLabel: 'Elvégzem a feladatot',
      source: src('p3'),
      // Further support: show only the quoted instruction (see Adventure.jsx, `quote`).
      quote: { ...src('p3'), sentenceId: 'p3-s2' },
      hints: ['Az üzenet egy színt és egy helyet nevezett meg.'],
      guided: {
        text: 'Az üzenet a kék ládát és a megfigyelőtornyot nevezte meg. Ezért a kék ládát a megfigyelőtoronyhoz kell vinni.'
      },
      revealLabel: 'Megmutatod a megoldást?',
      feedback: { correct: 'Követted az üzenetet: a kék ládát a megfigyelőtoronyhoz küldted.' },
      after: 'Bence ezután a sárga ládát is az üvegházhoz vitte. Mindkét szállítmány megérkezett a helyére.'
    },
    {
      id: 'a4-note',
      type: 'correctPlacement',
      title: 'Ellenőrzés',
      objective: 'check',
      heading: 'Ellenőrizd a szállítólevelet!',
      // A checking task with a visible reference, not a memory test: recorded as such.
      record: { reference: 'visible', memoryTest: false },
      reference: {
        title: 'Helyes lista',
        rows: [
          { id: 'tower', place: 'Megfigyelőtorony', contents: 'távcső és jegyzetfüzet.' },
          { id: 'greenhouse', place: 'Üvegház', contents: 'kis ásó és locsolókanna.' }
        ]
      },
      note: {
        title: 'Szállítólevél',
        rows: [
          { id: 'tower', place: 'Megfigyelőtorony', contents: 'Távcső és locsolókanna' },
          { id: 'greenhouse', place: 'Üvegház', contents: 'Kis ásó és jegyzetfüzet' }
        ],
        // The corrected rows, shown in the guided solution with the two swapped objects marked.
        fixed: [
          { id: 'tower', place: 'Megfigyelőtorony', contents: 'Távcső és jegyzetfüzet', marks: ['jegyzetfüzet'] },
          { id: 'greenhouse', place: 'Üvegház', contents: 'Kis ásó és locsolókanna', marks: ['locsolókanna'] }
        ],
        wrongMarks: { tower: 'locsolókanna', greenhouse: 'jegyzetfüzet' }
      },
      prompt: 'Melyik két tárgyat kell felcserélni?',
      options: [
        { id: 'can-notebook', text: 'A locsolókannát és a jegyzetfüzetet.' },
        { id: 'binoculars-shovel', text: 'A távcsövet és a kis ásót.' },
        { id: 'binoculars-notebook', text: 'A távcsövet és a jegyzetfüzetet.' }
      ],
      correct: 'can-notebook',
      hints: ['Hasonlítsd össze a szállítólevél sorait a fölötte lévő helyes listával!'],
      // The package supplies one explanation; it is used for the guided solution too.
      guided: { text: 'A jegyzetfüzet a toronyba, a locsolókanna az üvegházba tartozik.' },
      feedback: { correct: 'Észrevetted az eltérést. A jegyzetfüzet a toronyba, a locsolókanna az üvegházba tartozik.' }
    },
    {
      id: 'reflection-02',
      type: 'reflection',
      title: 'Visszatekintés',
      heading: 'Mit ellenőriznél egy új szállítás előtt?',
      single: true,
      scored: false, // unscored: any choice is accepted
      options: [
        { id: 'what', text: 'Mit kell elvinni?' },
        { id: 'where', text: 'Hová kell vinni?' },
        { id: 'both', text: 'Mindkettőt.' }
      ],
      after: 'Segít, ha indulás előtt átgondolod: mit és hová.'
    }
  ],
  discoveries: [
    {
      id: 'what-and-where',
      title: 'Mit és hová?',
      text: 'Ebben a kalandban az utasítás két fontos részlete segített: melyik ládát kell elvinni, és hová kell kerülnie.',
      kind: 'fiction',
      label: 'Kitalált történetből származó felfedezés'
    }
  ],
  completion: {
    title: 'A ládák a helyükre kerültek!',
    text: 'Megfigyelted a tartalmukat, kiválasztottad a célállomást, és ellenőrizted a szállítást.',
    actions: [
      { to: 'world', label: 'Vissza a kalandokhoz' },
      { to: 'discoveries', label: 'Megnézem a felfedezésemet' }
    ]
  }
};
