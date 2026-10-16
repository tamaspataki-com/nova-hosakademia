// NOVA content package 01: "A sáros lábnyomok rejtélye" – the dinosaur reference adventure.
// The Hungarian text, answers, hints, feedback and guided explanations are exactly as supplied. Nothing here is
// invented; interface wording that is not in the package (button labels of the shared system) lives in the
// activity components.
const src = (sectionId) => ({ passageId: 'story', sectionId });

export const DINO = {
  id: 'dino-muddy-footprints-01',
  version: 1,
  worldId: 'dinosaurs',
  seriesId: 'research-station',
  title: 'A sáros lábnyomok rejtélye',
  description: 'Különös nyomok vezetnek a kutatóállomás kapujához. Derítsd ki, mi történt!',
  intro:
    'A képzeletbeli dinoszauruszparkban különös nyomokat találtak. Csatlakozz Bencéhez és a gondozóhoz! Rövid részletekben fedezheted fel, mi történt.',
  modePrompt: {
    heading: 'Hogyan fedezzük fel a történetet?',
    text: 'Ha segítségre van szükséged, menet közben is kérheted.'
  },
  // An imaginary adventure in a fictional park: never presented as historical or scientific information.
  classification: 'fiction',
  sources: [],
  review: {
    status: 'unreviewed',
    note: 'A tartalmat a szülő adta át (content package 01); felnőtt általi felülvizsgálat még nincs rögzítve.'
  },
  format: 'investigation',
  status: 'available',
  context: 'practice',
  level: 1,
  modes: ['read', 'listen', 'combined'],
  objectives: ['detail', 'cause', 'sequence', 'evidence', 'retell'],
  coverIcon: 'dino', // restrained icon until illustrations are supplied
  badge: 'nyomkutato',
  glossary: [
    { key: 'kutatóállomás', word: 'kutatóállomás', def: 'Olyan hely, ahol megfigyeléseket és vizsgálatokat végeznek.' },
    { key: 'itató', word: 'itató', def: 'Olyan hely vagy edény, ahonnan az állatok vizet isznak.' },
    { key: 'gondozó', word: 'gondozó', def: 'Az a személy, aki ellátja az állatokat.' },
    {
      key: 'összehasonlít',
      word: 'összehasonlít',
      def: 'Két dolgot megvizsgál, hogy észrevegye a hasonlóságokat és a különbségeket.'
    },
    { key: 'útvonal', word: 'útvonal', def: 'Az az út, amelyen valaki vagy valami halad.' }
  ],
  passages: [
    {
      id: 'story',
      title: 'A sáros lábnyomok rejtélye',
      sections: [
        {
          id: 'p1',
          label: '1. rész',
          sentences: [
            { id: 'p1-s1', text: 'Bence reggel a dinoszauruszpark kutatóállomásához érkezett.' },
            { id: 'p1-s2', text: 'A kapu előtt nagy, sáros lábnyomokat vett észre.' },
            { id: 'p1-s3', text: 'A nyomok a közeli itatótól vezettek a kapuig.' }
          ],
          chunks: [['p1-s1', 'p1-s2'], ['p1-s3']]
        },
        {
          id: 'p2',
          label: '2. rész',
          sentences: [
            {
              id: 'p2-s1',
              text: 'A gondozó elmondta, hogy egy fiatal dinoszaurusz az itatónál belelépett a sárba.'
            },
            { id: 'p2-s2', text: 'Ezután a kapuhoz sétált.' },
            {
              id: 'p2-s3',
              text: 'Bence összehasonlította a lábnyomokat az állat lábával: az alakjuk megegyezett.'
            }
          ],
          chunks: [['p2-s1'], ['p2-s2', 'p2-s3']]
        },
        {
          id: 'p3',
          label: '3. rész',
          sentences: [
            {
              id: 'p3-s1',
              text: 'A dinoszaurusz a kapu mellett állt, ahol a gondozó egy kosár levelet készített elő neki.'
            },
            {
              id: 'p3-s2',
              text: 'Bence már értette az útvonalat: az állat az itatótól az ennivalóhoz sétált.'
            },
            { id: 'p3-s3', text: 'A gondozó ezután megtisztította a sáros járdát.' }
          ],
          chunks: [['p3-s1'], ['p3-s2', 'p3-s3']]
        }
      ]
    }
  ],
  steps: [
    { id: 'p1', type: 'passage', title: 'A történet – 1. rész', passageId: 'story', sectionId: 'p1' },
    {
      id: 'q1-detail',
      type: 'choice',
      title: 'Felidézés',
      objective: 'detail',
      prompt: 'Mit vett észre Bence a kapu előtt?',
      options: [
        { id: 'footprints', text: 'Nagy, sáros lábnyomokat.' },
        { id: 'branches', text: 'Egy halom letört ágat.' },
        { id: 'bucket', text: 'Egy felborult vödröt.' }
      ],
      correct: 'footprints',
      source: src('p1'),
      hints: ['Gondolj arra, mi maradhat a földön egy sáros láb után!'],
      guided: {
        quote: { ...src('p1'), sentenceId: 'p1-s2' },
        text: 'Bence nagy, sáros lábnyomokat vett észre a kapu előtt. Ebből indult a nyomozás.'
      },
      feedback: { correct: 'Felidézted a fontos részletet: Bence sáros lábnyomokat talált.' }
    },
    { id: 'p2', type: 'passage', title: 'A történet – 2. rész', passageId: 'story', sectionId: 'p2' },
    {
      id: 'q2-cause',
      type: 'choice',
      title: 'Ok és következmény',
      objective: 'cause',
      prompt: 'Miért maradtak sáros lábnyomok a dinoszaurusz után?',
      options: [
        { id: 'mud', text: 'Mert az itatónál belelépett a sárba.' },
        { id: 'rain', text: 'Mert Bence vizet öntött a kapura.' },
        { id: 'paint', text: 'Mert a gondozó befestette az állat lábát.' }
      ],
      correct: 'mud',
      source: src('p2'),
      hints: ['Mi történt az állat lábával az itatónál?'],
      guided: {
        quote: { ...src('p2'), sentenceId: 'p2-s1' },
        text: 'Az állat belelépett a sárba. Amikor továbbment, a lábáról sár került a földre.'
      },
      feedback: { correct: 'Összekapcsoltad az okot és a következményt: a sáros láb nyomot hagyott.' }
    },
    { id: 'p3', type: 'passage', title: 'A történet – 3. rész', passageId: 'story', sectionId: 'p3' },
    {
      id: 'q3-sequence',
      type: 'sequence',
      title: 'Sorrend',
      objective: 'sequence',
      prompt: 'Tedd sorrendbe, merre járt a dinoszaurusz!',
      labels: ['Először', 'Azután', 'Végül'],
      items: [
        { id: 'water', text: 'Az itatónál belelépett a sárba.', icon: 'water_drop' },
        { id: 'walk', text: 'A kapuhoz sétált.', icon: 'directions_walk' },
        { id: 'food', text: 'Megérkezett az előkészített ennivalóhoz.', icon: 'restaurant' }
      ],
      correctOrder: ['water', 'walk', 'food'],
      // Second support: the first card is placed for the child; recorded as guided support.
      support: { placeFirst: true },
      hints: ['Hol lett sáros a dinoszaurusz lába?'],
      guided: {
        text: 'Először az itatónál belelépett a sárba. Azután a kapuhoz sétált. Végül megérkezett az ennivalóhoz.'
      },
      feedback: { correct: 'Összeállítottad az útvonalat: itató, séta, ennivaló.' }
    },
    {
      id: 'q4-evidence',
      type: 'evidence',
      title: 'Bizonyíték',
      objective: 'evidence',
      prompt: 'Melyik mondat mutatja meg, hogyan ellenőrizte Bence, hogy az állattól származnak a nyomok?',
      passageId: 'story',
      sectionId: 'p2',
      correctSentenceId: 'p2-s3',
      source: src('p2'),
      illustration: 'goggles', // the clue-finder glasses as a small strategy picture
      hints: ['Keresd azt a mondatot, amelyikben Bence két dolgot összehasonlít!'],
      guided: {
        text: 'A harmadik mondat írja le az ellenőrzést. Bence megnézte, hogy egyezik-e a lábnyomok és az állat lábának alakja.'
      },
      feedback: { correct: 'Megtaláltad a bizonyítékot: Bence összehasonlította a nyomok és a láb alakját.' }
    },
    {
      id: 'q5-retell',
      type: 'retell',
      title: 'Elmesélés',
      objective: 'retell',
      heading: 'Te meséled el a rejtély megoldását!',
      prompt: 'Mondd el valakinek, mi történt, vagy írd le néhány mondatban!',
      options: { spoken: 'Elmondom valakinek', write: 'Leírom' },
      // Initially collapsed. Opening them counts as retelling support, never as a wrong answer.
      promptQuestions: ['Mit talált Bence?', 'Hogyan keletkeztek a nyomok?', 'Hová ment a dinoszaurusz?'],
      // Shown only to an adult, after the child's first retelling. No numeric score, no exact wording required.
      adultChecklist: [
        { id: 'footprints', text: 'Megemlítette a sáros lábnyomokat.' },
        { id: 'mud', text: 'Elmondta, hogy az állat belelépett a sárba.' },
        { id: 'food', text: 'Elmondta, hogy az állat az ennivalóhoz ment.' }
      ]
    },
    {
      id: 'q6-delayed',
      type: 'delayedRecall',
      title: 'Későbbi felidézés',
      objective: 'delayedRecall',
      // Revisits an earlier detail after the sequence, evidence and retelling steps. Not a standardised memory test.
      prompt: 'Emlékszel, honnan indultak a lábnyomok?',
      options: [
        { id: 'water', text: 'Az itatótól.' },
        { id: 'workshop', text: 'A műhelytől.' },
        { id: 'forest', text: 'Az erdőből.' }
      ],
      correct: 'water',
      source: src('p1'),
      hints: ['Hol lépett bele az állat a sárba?'],
      guided: {
        quote: { ...src('p1'), sentenceId: 'p1-s3' },
        text: 'A lábnyomok az itatótól indultak. Ott lett sáros a dinoszaurusz lába.'
      },
      feedback: { correct: 'Felidézted az útvonal kezdetét: a nyomok az itatótól vezettek a kapuig.' }
    },
    {
      id: 'reflection-01',
      type: 'reflection',
      title: 'Visszatekintés',
      heading: 'Mi segített a történet megértésében?',
      multi: true,
      // "requires": the choice is only shown when that action was available to the child.
      options: [
        { id: 'short', text: 'Rövid részekben haladtam.', requires: 'chunks' },
        { id: 'reread', text: 'Újra elolvastam.', requires: 'reread' },
        { id: 'replay', text: 'Újra meghallgattam.', requires: 'replay' },
        { id: 'sequence', text: 'Sorrendbe tettem az eseményeket.' },
        { id: 'retold', text: 'Elmondtam a saját szavaimmal.' },
        { id: 'help', text: 'Segítséget kértem.' },
        { id: 'unsure', text: 'Most még nem tudom.', exclusive: true }
      ]
    }
  ],
  discoveries: [
    {
      id: 'tracks',
      title: 'A nyomok történetet mesélnek',
      text: 'Ebben a kalandban a sáros lábnyomok megmutatták, merre járt az állat. Bence összehasonlítással ellenőrizte a feltételezését.',
      kind: 'fiction',
      label: 'Kitalált történetből származó felfedezés'
    }
  ],
  completion: {
    title: 'Megoldottad a sáros lábnyomok rejtélyét!',
    text: 'Kiderítetted, hogyan keletkeztek a nyomok, és összeállítottad a dinoszaurusz útvonalát.',
    actions: [
      { to: 'world', label: 'Vissza a kalandokhoz' },
      { to: 'discoveries', label: 'Megnézem a felfedezésemet' }
    ]
  }
};
