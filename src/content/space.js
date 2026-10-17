// NOVA content package 05: "A marsjáró elveszett üzenete" – the first adventure of the space world.
// The Hungarian text, answers, hints, feedback and guided explanations are exactly as supplied. Interface wording
// that is not in the package (button labels of the shared system) lives in the activity components.
// A fictional future Mars mission: nothing here describes a real expedition.
const src = (sectionId) => ({ passageId: 'story', sectionId });

export const SPACE = {
  id: 'space-rover-message-01',
  version: 1,
  worldId: 'space',
  seriesId: 'red-planet-messages',
  title: 'A marsjáró elveszett üzenete',
  description: 'Egy üzenet hiányosan érkezett meg. Segíts helyreállítani, majd vezesd a marsjárót a megfelelő helyre!',
  intro:
    'Nóri az űrállomás irányítótermében dolgozik. Egy marsjáró üzenetéből kimaradt néhány szó. Olvasd el vagy hallgasd meg a részleteket, és segíts a küldetésben!',
  startLabel: 'Fogadom az üzenetet',
  classification: 'fiction',
  sources: [],
  review: {
    status: 'unreviewed',
    note: 'A tartalmat a szülő adta át (content package 05); felnőtt általi felülvizsgálat még nincs rögzítve.'
  },
  format: 'story',
  status: 'available',
  context: 'practice',
  level: 1,
  modes: ['read', 'listen', 'combined'],
  // Technical labels (parent area only). The last question asks how a problem was solved: information connection,
  // not "main idea".
  objectives: ['detail', 'connect', 'instruction'],
  hideObjectives: true,
  // Neutral rover icon until the adventure cover is supplied.
  coverIcon: 'rover',
  badge: 'urbeli-utkereso',
  glossary: [
    { key: 'marsjáró', word: 'marsjáró', def: 'A Mars felszínén közlekedő kutatóeszköz.' },
    { key: 'minta', word: 'minta', def: 'Vizsgálathoz összegyűjtött kis mennyiség, például egy kődarab.' },
    {
      key: 'küldetési',
      word: 'küldetési napló',
      def: 'Feljegyzés a küldetés feladatairól és eseményeiről.'
    },
    {
      key: 'kutatópont',
      word: 'kutatópont',
      def: 'A történetben kijelölt hely, ahol a mintát megvizsgálják.'
    },
    {
      key: 'napelem',
      word: 'napelem',
      def: 'Olyan eszköz, amely a napfényből elektromos energiát állít elő.'
    }
  ],
  passages: [
    {
      id: 'story',
      title: 'A marsjáró elveszett üzenete',
      sections: [
        {
          id: 'p1',
          label: '1. rész',
          sentences: [
            { id: 'p1-s1', text: 'A marsjáró egy piros zászló mellett állt.' },
            { id: 'p1-s2', text: 'A kutatók egy kis kődarab összegyűjtésére küldték.' },
            { id: 'p1-s3', text: 'A mintát a kék jelzésű tárolóba kellett tennie.' }
          ],
          chunks: [['p1-s1'], ['p1-s2', 'p1-s3']]
        },
        {
          id: 'p2',
          label: '2. rész',
          sentences: [
            { id: 'p2-s1', text: 'Nóri a küldetési naplót olvasta.' },
            { id: 'p2-s2', text: 'A marsjárónak a kőmintával a kutatópontra kellett mennie.' },
            {
              id: 'p2-s3',
              text: 'A rádión azonban csak ez érkezett: „A mintát összegyűjtöttem. A célállomásom…”'
            },
            { id: 'p2-s4', text: 'A mondat vége elveszett.' }
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
            { id: 'p3-s1', text: 'A térképen a piros zászlótól egyenes út vezetett a szikláig.' },
            {
              id: 'p3-s2',
              text: 'Ott kétfelé ágazott: a bal oldali út a kutatóponthoz, a jobb oldali a napelemekhez vezetett.'
            },
            { id: 'p3-s3', text: 'Nóri a kutatópont felé küldte a marsjárót.' }
          ],
          chunks: [['p3-s1'], ['p3-s2', 'p3-s3']]
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
      prompt: 'Milyen jelzésű tárolóba kellett tenni a mintát?',
      options: [
        { id: 'blue', text: 'Kék jelzésűbe.' },
        { id: 'yellow', text: 'Sárga jelzésűbe.' },
        { id: 'red', text: 'Piros jelzésűbe.' }
      ],
      correct: 'blue',
      source: src('p1'),
      hints: ['A zászló és a tároló jelzése különböző színű volt.'],
      guided: { text: 'A történet szerint a mintát a kék jelzésű tárolóba kellett tenni.' },
      feedback: { correct: 'Felidézted a tároló jelzését: kéket kellett keresni.' }
    },
    { id: 'p2', type: 'passage', title: 'A történet – 2. rész', passageId: 'story', sectionId: 'p2' },
    {
      id: 'restore-message',
      type: 'fillBlank',
      title: 'Az üzenet helyreállítása',
      objective: 'connect',
      // Reference-based retrieval, not a memory test: the log (passage 2) stays visible while reading, and is
      // offered through the transcript control when only listening.
      referenceLabel: 'A történet',
      messageLabel: 'A rádióüzenet',
      before: 'A mintát összegyűjtöttem. A célállomásom',
      after: '.',
      prompt: 'Melyik szóval egészíthetjük ki az üzenetet a küldetési napló alapján?',
      options: [
        { id: 'research', text: 'a kutatópont' },
        { id: 'garage', text: 'a garázs' },
        { id: 'tower', text: 'a megfigyelőtorony' }
      ],
      correct: 'research',
      submitLabel: 'Helyreállítom az üzenetet',
      source: src('p2'),
      hints: ['Hová kellett mennie a marsjárónak a napló szerint?'],
      guided: { text: 'A napló ezt írta: a marsjárónak a kőmintával a kutatópontra kellett mennie.' },
      feedback: { correct: 'A napló segített kiegészíteni a hiányzó üzenetet. A cél a kutatópont.' },
      record: (run) => ({
        referenceBased: true,
        memoryTest: false,
        reference: run.mode === 'listen' ? 'transcript-on-request' : 'visible'
      })
    },
    { id: 'p3', type: 'passage', title: 'A történet – 3. rész', passageId: 'story', sectionId: 'p3' },
    {
      id: 'rover-route',
      type: 'route',
      title: 'Az útvonal',
      objective: 'instruction',
      source: src('p3'),
      // The labelled map stays visible; following directions with a visual reference.
      record: { reference: 'visible', memoryTest: false },
      map: {
        start: 'flag',
        description:
          'Térkép: alul a Piros zászló, fölötte egyenes úton a Szikla. A sziklánál az út kétfelé ágazik: balra a Kutatópont, jobbra a Napelemek.',
        nodes: [
          {
            id: 'flag',
            label: 'Piros zászló',
            shape: 'flag',
            x: 160,
            y: 310,
            lx: 0,
            ly: 346,
            anchor: 'middle',
            mx: 40
          },
          { id: 'rock', label: 'Szikla', shape: 'rock', x: 160, y: 190, lx: 34, ly: 30, anchor: 'start', mx: -44 },
          {
            id: 'research',
            label: 'Kutatópont',
            shape: 'research',
            x: 70,
            y: 70,
            lx: 0,
            ly: -26,
            anchor: 'middle',
            mx: 44
          },
          { id: 'solar', label: 'Napelemek', shape: 'solar', x: 250, y: 70, lx: 0, ly: -26, anchor: 'middle', mx: -44 }
        ],
        paths: [
          { from: 'flag', to: 'rock' },
          { from: 'rock', to: 'research' },
          { from: 'rock', to: 'solar' }
        ]
      },
      decisions: [
        {
          id: 'first-stop',
          to: 'rock',
          prompt: 'Vezesd a marsjárót a kutatóponthoz! Először válaszd ki a következő megállót.',
          options: [
            { id: 'rock', text: 'Szikla' },
            { id: 'solar', text: 'Napelemek' }
          ],
          correct: 'rock',
          hint: 'Nézd meg, melyik állomáshoz vezet közvetlenül az út a piros zászlótól!'
        },
        {
          id: 'branch',
          to: 'research',
          prompt: 'Merre folytassa az útját?',
          fixedOrder: true,
          options: [
            { id: 'left', text: 'Balra, a kutatóponthoz.' },
            { id: 'right', text: 'Jobbra, a napelemekhez.' }
          ],
          correct: 'left',
          hint: 'A cél a kutatópont. Keresd meg a hozzá vezető ágat a térképen!'
        }
      ],
      guided: 'A piros zászlótól a sziklához vezet az út. A sziklánál balra fordulunk, és megérkezünk a kutatóponthoz.',
      feedback: {
        correct: 'Megérkeztél! A marsjáró a zászlótól a sziklához ment, majd a kutatóponthoz fordult.'
      }
    },
    {
      id: 'outcome',
      type: 'outcome',
      title: 'Az eredmény',
      heading: 'Az eredmény',
      // An outcome panel, not a fourth scored passage. Text only: no recording exists for it.
      text: 'A marsjáró megérkezett a kutatóponthoz. A kőminta a kék jelzésű tárolóban várta a vizsgálatot. Nóri feljegyezte a sikeres szállítást.'
    },
    {
      id: 'a4-connect',
      type: 'choice',
      title: 'Összekapcsolás',
      objective: 'connect',
      prompt: 'Mi segített Nórinak helyreállítani a hiányos üzenetet?',
      options: [
        { id: 'log', text: 'A küldetési naplóban szereplő információ.' },
        { id: 'colour', text: 'A piros zászló színe.' },
        { id: 'guess', text: 'Egy találomra választott szó.' }
      ],
      correct: 'log',
      sources: [src('p1'), src('p2'), src('p3')],
      source: src('p2'),
      hints: ['Melyik szöveg mondta el, hová kellett mennie a marsjárónak?'],
      guided: { text: 'A küldetési napló nevezte meg a kutatópontot célállomásként.' },
      feedback: { correct: 'A hiányzó részt egy másik, rendelkezésre álló információval egészítette ki.' }
    },
    {
      id: 'reflection-05',
      type: 'reflection',
      title: 'Visszatekintés',
      heading: 'Mi segített most?',
      multi: true,
      scored: false,
      options: [
        { id: 'log', text: 'Visszakerestem a naplóban.' },
        { id: 'compare', text: 'Összehasonlítottam a részleteket.' },
        { id: 'map', text: 'Megnéztem a térképet.' },
        { id: 'replay', text: 'Újra meghallgattam a szöveget.', requires: 'replay' },
        { id: 'help', text: 'Segítséget kértem.' },
        { id: 'unsure', text: 'Most még nem tudom.', exclusive: true }
      ]
    }
  ],
  discoveries: [
    {
      id: 'two-pieces',
      title: 'Két információ együtt segít',
      text: 'Nóri a küldetési naplóból pótolta a rádióüzenet hiányzó részét. A térkép ezután megmutatta az utat a célhoz.',
      kind: 'fiction',
      label: 'Kitalált történetből származó felfedezés'
    }
  ],
  completion: {
    title: 'Az üzenet helyreállt, a marsjáró megérkezett!',
    text: 'Felidéztél egy részletet, összekapcsoltad a naplót az üzenettel, és követted az útvonalat.',
    actions: [
      { to: 'world', label: 'Vissza a kalandokhoz' },
      { to: 'discoveries', label: 'Megnézem a felfedezésemet' }
    ]
  }
};
