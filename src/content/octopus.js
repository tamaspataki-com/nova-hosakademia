// NOVA content package 04: "A polip búvóhelye" – the first adventure of the animal world.
// The Hungarian text, answers, hints, feedback and guided explanations are exactly as supplied. Interface wording
// that is not in the package (button labels of the shared system) lives in the activity components.
// A fictional observation-station story: nothing here is a biological fact about octopuses.
const src = (sectionId) => ({ passageId: 'story', sectionId });

export const OCTOPUS = {
  id: 'animals-octopus-hideout-01',
  version: 1,
  worldId: 'animals',
  seriesId: 'observation-station',
  title: 'A polip búvóhelye',
  description: 'Három búvóhely, néhány fontos részlet és egy rejtőzködő polip. Melyik hely illik a leíráshoz?',
  intro:
    'Lili a tengeri megfigyelőállomásra látogat. Segíts neki összehasonlítani a búvóhelyeket, majd különítsd el, mit tudunk a történetből, és mit kellene még megfigyelni!',
  startLabel: 'Kezdődhet a megfigyelés',
  classification: 'fiction',
  sources: [],
  review: {
    status: 'unreviewed',
    note: 'A tartalmat a szülő adta át (content package 04); felnőtt általi felülvizsgálat még nincs rögzítve.'
  },
  format: 'story',
  status: 'available',
  context: 'practice',
  level: 1,
  modes: ['read', 'listen', 'combined'],
  objectives: ['detail', 'compare', 'infoCheck', 'mainIdea'], // technical labels: parent area only
  hideObjectives: true,
  // Neutral octopus icon until artwork is supplied (animal-world cover and adventure cover come later). Never the
  // dinosaur artwork, and never a picture of the polip leaving the correct hiding place.
  coverIcon: 'octopus',
  badge: 'pontos-megfigyelo',
  glossary: [
    { key: 'búvóhely', word: 'búvóhely', def: 'Olyan hely, ahol egy állat elrejtőzhet.' },
    { key: 'sziklaüreg', word: 'sziklaüreg', def: 'A sziklában lévő üres tér.' },
    { key: 'agyagkorsó', word: 'agyagkorsó', def: 'Agyagból készített, kiégetett edény.' },
    {
      key: 'szabálytalan',
      word: 'szabálytalan',
      def: 'Olyan alakú, amelynek a részei eltérnek egymástól.'
    },
    {
      key: 'megfigyelési jegyzet',
      word: 'megfigyelési jegyzet',
      def: 'Rövid feljegyzés arról, amit valaki megfigyelt.'
    }
  ],
  passages: [
    {
      id: 'story',
      title: 'A polip búvóhelye',
      sections: [
        {
          id: 'p1',
          label: '1. rész',
          sentences: [
            { id: 'p1-s1', text: 'Lili a megfigyelőablaknál állt.' },
            {
              id: 'p1-s2',
              text: 'A vízben három búvóhely látszott: egy világos sziklaüreg, egy barna agyagkorsó és egy szürke kőalagút.'
            },
            { id: 'p1-s3', text: 'A korsó mellett fehér kavics feküdt.' }
          ],
          chunks: [['p1-s1'], ['p1-s2', 'p1-s3']]
        },
        {
          id: 'p2',
          label: '2. rész',
          sentences: [
            { id: 'p2-s1', text: 'A gondozó három képet mutatott a búvóhelyekről.' },
            { id: 'p2-s2', text: 'A sziklaüregnek széles, szabálytalan bejárata volt.' },
            { id: 'p2-s3', text: 'A korsón egyetlen kerek nyílás látszott.' },
            { id: 'p2-s4', text: 'A kőalagút két végén is volt kijárat.' }
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
            { id: 'p3-s1', text: 'Néhány perccel később a polip a barna korsóból bújt elő.' },
            { id: 'p3-s2', text: 'Lili feljegyezte a megfigyelést.' },
            {
              id: 'p3-s3',
              text: 'Arra is kíváncsi volt, melyik búvóhelyet használja az állat éjszaka, de akkor még délelőtt volt.'
            }
          ],
          chunks: [['p3-s1', 'p3-s2'], ['p3-s3']]
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
      prompt: 'Mi feküdt a barna korsó mellett?',
      options: [
        { id: 'pebble', text: 'Egy fehér kavics.' },
        { id: 'shell', text: 'Egy csíkos kagyló.' },
        { id: 'rope', text: 'Egy rövid kötél.' }
      ],
      correct: 'pebble',
      source: src('p1'),
      hints: ['Egy apró, világos tárgyat említett a történet.'],
      guided: { text: 'A barna agyagkorsó mellett fehér kavics feküdt.' },
      feedback: { correct: 'Megjegyezted a korsó melletti részletet: a fehér kavicsot.' }
    },
    { id: 'p2', type: 'passage', title: 'A történet – 2. rész', passageId: 'story', sectionId: 'p2' },
    {
      id: 'compare-hideouts',
      type: 'choice',
      title: 'Összehasonlítás',
      objective: 'compare',
      prompt: 'Melyik búvóhely illik erre a leírásra?',
      // A visible-reference comparison, not a memory test: the three description cards stay on screen.
      cards: [
        { id: 'rock', title: 'Sziklaüreg', text: 'Széles, szabálytalan bejárat.' },
        { id: 'jug', title: 'Agyagkorsó', text: 'Egyetlen kerek nyílás.' },
        { id: 'tunnel', title: 'Kőalagút', text: 'Két kijárat, egy-egy a két végén.' }
      ],
      cardsLabel: 'Leírások',
      description: 'Egyetlen kerek nyílása van.',
      options: [
        { id: 'rock', text: 'Sziklaüreg' },
        { id: 'jug', text: 'Agyagkorsó' },
        { id: 'tunnel', text: 'Kőalagút' }
      ],
      correct: 'jug',
      submitLabel: 'Ezt választom',
      source: src('p2'),
      hints: ['Keresd meg ugyanazt a tulajdonságot a három kártyán!'],
      guided: { text: 'Az agyagkorsó leírásában szerepel az egyetlen kerek nyílás.' },
      feedback: { correct: 'Összehasonlítottad a leírásokat. Az egyetlen kerek nyílás a korsóhoz tartozik.' },
      record: { reference: 'visible', memoryTest: false }
    },
    { id: 'p3', type: 'passage', title: 'A történet – 3. rész', passageId: 'story', sectionId: 'p3' },
    {
      id: 'information-check',
      type: 'informationCheck',
      title: 'Mit mond a történet?',
      objective: 'infoCheck',
      intro: 'Most a történet alapján döntünk.',
      categories: [
        { id: 'true', label: 'Igaz', text: 'A történet ezt mondja.' },
        { id: 'false', label: 'Hamis', text: 'A történet ennek az ellenkezőjét mondja.' },
        { id: 'unknown', label: 'Nem derül ki', text: 'A történetből ezt még nem tudjuk.' }
      ],
      // The whole story told so far may be opened; opening it counts as support, never as a wrong answer.
      sources: [src('p1'), src('p2'), src('p3')],
      source: src('p3'),
      statements: [
        {
          id: 'jug-emerged',
          text: 'A polip a barna korsóból bújt elő.',
          correct: 'true',
          feedback: 'Igen, ezt Lili megfigyelése közvetlenül elmondja.',
          hint: 'Honnan bújt elő az állat a harmadik részben?',
          guided: 'A harmadik rész szerint a polip a barna korsóból bújt elő, ezért az állítás igaz.'
        },
        {
          id: 'tunnel-exit',
          text: 'A kőalagútnak csak egy kijárata volt.',
          correct: 'false',
          feedback: 'A történet szerint a kőalagút mindkét végén volt kijárat.',
          hint: 'Nézd meg, hány kijáratot említett az alagút leírása!',
          guided: 'A kőalagút két végén is volt kijárat. Az egyetlen kijáratról szóló állítás ezért hamis.'
        },
        {
          id: 'night-jug',
          text: 'A polip éjszaka is a korsóban tartózkodott.',
          correct: 'unknown',
          feedback: 'Lili délelőtt figyelte meg az állatot. Az éjszakai búvóhelyéről még nincs információnk.',
          hint: 'Lili látott éjszakai megfigyelést is, vagy csak délelőttit?',
          guided: 'A történet délelőtti megfigyelésről szól. Az éjszakáról nem mondja el, hol volt a polip.'
        }
      ]
    },
    {
      id: 'main-idea',
      type: 'choice',
      title: 'Összefoglalás',
      objective: 'mainIdea',
      prompt: 'Melyik cím illik legjobban Lili megfigyeléséhez?',
      options: [
        { id: 'observation', text: 'Három búvóhely és egy délelőtti megfigyelés.' },
        { id: 'night', text: 'Egy teljes éjszaka a polippal.' },
        { id: 'feeding', text: 'A polip kedvenc ennivalója.' }
      ],
      correct: 'observation',
      sources: [src('p1'), src('p2'), src('p3')],
      source: src('p3'),
      hints: ['A cím foglalja össze azt, amiről valóban olvastál vagy hallottál!'],
      guided: { text: 'A történet három búvóhely bemutatásáról és Lili délelőtti megfigyeléséről szólt.' },
      feedback: { correct: 'Olyan címet választottál, amely a történet fontos részeihez kapcsolódik.' }
    },
    {
      id: 'reflection-04',
      type: 'reflection',
      title: 'Visszatekintés',
      heading: 'Mit tennél, ha a történetből hiányzik egy válasz?',
      multi: true,
      scored: false,
      // Every option is a constructive response; none is wrong. The closing line appears once something is chosen.
      options: [
        { id: 'more', text: 'Megnézném, van-e további információ.' },
        { id: 'ask', text: 'Megkérdeznék valakit.' },
        { id: 'say', text: 'Elmondanám, hogy ezt még nem tudjuk.' }
      ],
      after: 'Hasznos lépés felismerni, milyen információra van még szükséged.'
    }
  ],
  discoveries: [
    {
      id: 'know-and-observe',
      title: 'Amit tudok, és amit még megfigyelnék',
      text: 'Lili látta, hogy a polip délelőtt a korsóból bújt elő. Az éjszakai búvóhelyéről további megfigyelésre lenne szüksége.',
      kind: 'fiction',
      label: 'Kitalált történetből származó felfedezés'
    }
  ],
  completion: {
    title: 'Elkészült a megfigyelési jegyzet!',
    text: 'Összehasonlítottad a búvóhelyeket, felidéztél egy részletet, és megkülönböztetted, mit mond el a történet.',
    actions: [
      { to: 'world', label: 'Vissza a kalandokhoz' },
      { to: 'discoveries', label: 'Megnézem a felfedezésemet' }
    ]
  }
};
