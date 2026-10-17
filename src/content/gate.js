// NOVA content package 03: "A Triceratops a kapunál" – the third dinosaur adventure.
// The Hungarian text, answers, hints, feedback and guided explanations are exactly as supplied. Interface wording
// that is not in the package (button labels of the shared system) lives in the activity components.
// A fictional park story: the animal's behaviour is never presented as a general claim about the species.
const src = (sectionId) => ({ passageId: 'story', sectionId });

export const GATE = {
  id: 'dino-gate-clues-03',
  version: 1,
  worldId: 'dinosaurs',
  seriesId: 'research-station',
  title: 'A Triceratops a kapunál',
  description: 'Egy fiatal dinoszaurusz a kapunál várakozik. Melyik megfigyelés segít megérteni, miért?',
  intro:
    'Bence egy fiatal Triceratopsot figyel meg. Az állat a kapunál várakozik. Gyűjtsd össze a fontos részleteket, és gondold át, mire utalhatnak!',
  startLabel: 'Megfigyelem',
  stepWords: true, // task steps offer the glossary words they contain
  classification: 'fiction',
  sources: [],
  review: {
    status: 'unreviewed',
    note: 'A tartalmat a szülő adta át (content package 03); felnőtt általi felülvizsgálat még nincs rögzítve.'
  },
  format: 'investigation',
  status: 'available',
  context: 'practice',
  level: 1,
  modes: ['read', 'listen', 'combined'],
  objectives: ['relevant', 'prediction', 'verify'], // technical labels: parent area only
  hideObjectives: true,
  // Cover: Bence and the Triceratops at the gate. Shown only in the library and on the introduction – never inside an
  // activity. It shows no outcome (no feeding, no bucket); the dinosaur icon is the fallback while it loads.
  coverAsset: 'assets/dino-gate.webp',
  coverAlt: 'Bence a kifutó korlátjánál áll, és egy fiatal Triceratopsot néz a kapu előtt',
  coverIcon: 'dino',
  badge: 'figyelmes-megfigyelo',
  glossary: [
    { key: 'kifutó', word: 'kifutó', def: 'Az állatok számára kialakított, elkerített terület.' },
    { key: 'etetőhely', word: 'etetőhely', def: 'Az a hely, ahová az állatok ennivalóját teszik.' },
    {
      key: 'megfigyelés',
      word: 'megfigyelés',
      def: 'Amikor figyelmesen megnézzük vagy meghallgatjuk, mi történik.'
    },
    {
      key: 'feltételezés',
      word: 'feltételezés',
      def: 'Egy lehetséges magyarázat, amelyet később ellenőrizhetünk.'
    },
    { key: 'következtet', word: 'következtet', def: 'A megfigyelt részletekből kialakít egy magyarázatot.' }
  ],
  passages: [
    {
      id: 'story',
      title: 'A Triceratops a kapunál',
      sections: [
        {
          id: 'p1',
          label: '1. rész',
          sentences: [
            { id: 'p1-s1', text: 'A fiatal Triceratops a kifutó kapujánál állt.' },
            { id: 'p1-s2', text: 'Bence észrevette, hogy az állat többször az etetőhely felé fordítja a fejét.' },
            { id: 'p1-s3', text: 'A kerítés mellett egy piros vödör hevert.' }
          ],
          chunks: [['p1-s1'], ['p1-s2', 'p1-s3']]
        },
        {
          id: 'p2',
          label: '2. rész',
          sentences: [
            { id: 'p2-s1', text: 'A gondozó egy kocsit tolt az etetőhely felé.' },
            { id: 'p2-s2', text: 'A kocsin friss levelek voltak.' },
            { id: 'p2-s3', text: 'Amikor az állat meglátta, közelebb lépett a kapuhoz.' },
            { id: 'p2-s4', text: 'Bence cipőfűzője közben kioldódott.' }
          ],
          chunks: [
            ['p2-s1', 'p2-s2'],
            ['p2-s3', 'p2-s4']
          ]
        },
        {
          id: 'p3',
          label: '3. rész',
          // The outcome: not offered (read, heard, reread or replayed) until the prediction step has been submitted.
          unlockAfter: 'prediction',
          sentences: [
            { id: 'p3-s1', text: 'A gondozó a leveleket az etetőhelyre tette, majd kinyitotta a belső kaput.' },
            { id: 'p3-s2', text: 'A Triceratops odasétált, és enni kezdett.' },
            {
              id: 'p3-s3',
              text: 'Bence feljegyezte, hogy az állat az ennivalóhoz ment, miközben a piros vödör a helyén maradt.'
            }
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
      prompt: 'Merre fordította a fejét a Triceratops?',
      options: [
        { id: 'feeding', text: 'Az etetőhely felé.' },
        { id: 'bucket', text: 'A piros vödör felé.' },
        { id: 'tower', text: 'A megfigyelőtorony felé.' }
      ],
      correct: 'feeding',
      source: src('p1'),
      hints: ['A történet elmondta, melyik hely felé fordult többször.'],
      guided: { text: 'A Triceratops többször az etetőhely felé fordította a fejét.' },
      feedback: { correct: 'Felidézted, merre figyelt az állat. Ez később fontos nyom lehet.' }
    },
    { id: 'p2', type: 'passage', title: 'A történet – 2. rész', passageId: 'story', sectionId: 'p2' },
    {
      id: 'relevant-clues',
      type: 'selectClues',
      title: 'Nyomok',
      objective: 'relevant',
      prompt: 'Melyik két megfigyelés segít leginkább megérteni, miért várakozik az állat a kapunál?',
      // The story so far stays visible: this task is about relevance, not unaided memory.
      reference: [src('p1'), src('p2')],
      sources: [src('p1'), src('p2')],
      source: src('p2'),
      pick: 2,
      options: [
        { id: 'looks', text: 'Többször az etetőhely felé fordult.' },
        { id: 'approaches', text: 'A leveles kocsi láttán közelebb lépett.' },
        { id: 'bucket', text: 'A kerítés mellett piros vödör hevert.' },
        { id: 'shoelace', text: 'Bence cipőfűzője kioldódott.' }
      ],
      correct: ['looks', 'approaches'],
      submitLabel: 'Ellenőrzöm a nyomokat',
      hints: ['Figyeld azt a két mondatot, amelyik arról szól, mit tett a Triceratops!'],
      guided: {
        text: 'Az etetőhely felé fordulás és a leveles kocsihoz közeledés kapcsolódik a várakozásához. A vödörről és a cipőfűzőről szóló részletek ezt nem magyarázzák.'
      },
      feedback: { correct: 'Az állat viselkedéséhez kapcsolódó részleteket választottad ki.' },
      record: { reference: 'visible', memoryTest: false }
    },
    {
      id: 'prediction',
      type: 'prediction',
      title: 'Feltételezés',
      objective: 'prediction',
      summary: 'Az állat az etetőhely felé figyel. A friss leveleket szállító kocsi láttán közelebb lép.',
      prompt: 'Mit várhat most a Triceratops a legvalószínűbben?',
      // Only the first two parts may be reread here: the outcome stays hidden until the prediction is submitted.
      sources: [src('p1'), src('p2')],
      source: src('p2'),
      options: [
        { id: 'food', text: 'Hogy megkapja az ennivalót.', best: true },
        { id: 'bucket', text: 'Hogy Bence elvigye a piros vödröt.' },
        { id: 'shoelace', text: 'Hogy Bence bekösse a cipőjét.' }
      ],
      submitLabel: 'Ez a feltételezésem',
      feedback: {
        best: 'Ezt támasztják alá legjobban az eddigi nyomok. Nézzük meg, mi történik!',
        other:
          'Ez is egy feltételezés. Az eddigi nyomok inkább az etetőhelyhez és a levelekhez kapcsolódnak. Nézzük meg a folytatást!'
      }
    },
    { id: 'p3', type: 'passage', title: 'A történet – 3. rész', passageId: 'story', sectionId: 'p3' },
    {
      id: 'check-prediction',
      type: 'choice',
      title: 'Ellenőrzés',
      objective: 'verify',
      prompt: 'Mi történt a folytatásban?',
      // The child's own earlier prediction is shown above the question (read from the saved prediction step).
      recallFrom: { step: 'prediction', field: 'prediction', label: 'Ezt gondoltad a folytatás előtt:' },
      options: [
        { id: 'ate', text: 'A Triceratops az etetőhelyhez ment, és enni kezdett.' },
        { id: 'bucket', text: 'A Triceratops megvárta, amíg elviszik a vödröt.' },
        { id: 'stayed', text: 'A Triceratops a kapunál maradt, miután kinyitották.' }
      ],
      correct: 'ate',
      source: src('p3'),
      hints: ['Mit tett az állat, amikor a gondozó kinyitotta a kaput?'],
      guided: { text: 'A Triceratops odasétált az etetőhelyhez, és enni kezdett.' },
      feedback: {
        correct: 'Az új információ segített pontosítani a feltételezést: az állat az ennivalóhoz ment.',
        correctBy: {
          food: 'A folytatás összhangban volt a feltételezéseddel. Az állat az ennivalóhoz ment.'
        }
      }
    },
    {
      id: 'main-idea',
      type: 'choice',
      title: 'Összefoglalás',
      objective: 'mainIdea',
      prompt: 'Melyik mondat foglalja össze legjobban Bence nyomozását?',
      options: [
        { id: 'summary', text: 'Bence az állat viselkedéséből következtetett, majd megfigyelte a folytatást.' },
        { id: 'bucket', text: 'Bence megkereste a piros vödör gazdáját.' },
        { id: 'shoe', text: 'Bence új cipőt választott a kutatóállomáson.' }
      ],
      correct: 'summary',
      sources: [src('p1'), src('p2'), src('p3')],
      source: src('p3'),
      hints: ['Melyik válasz szól az egész nyomozásról?'],
      guided: { text: 'Bence az állat viselkedéséből következtetett, majd megfigyelte a folytatást.' },
      feedback: { correct: 'Összekapcsoltad a megfigyelést, a feltételezést és az ellenőrzést.' }
    },
    {
      id: 'reflection-03',
      type: 'reflection',
      title: 'Visszatekintés',
      heading: 'Mi segített most a legtöbbet?',
      multi: true,
      scored: false,
      options: [
        { id: 'behaviour', text: 'Az állat viselkedését figyeltem.' },
        { id: 'clues', text: 'Kiválasztottam a fontos nyomokat.' },
        { id: 'later', text: 'Megnéztem, mi történt később.' },
        { id: 'help', text: 'Segítséget kértem.' },
        { id: 'unsure', text: 'Most még nem tudom.', exclusive: true }
      ]
    }
  ],
  discoveries: [
    {
      id: 'observe-think-check',
      title: 'Megfigyelem, átgondolom, ellenőrzöm',
      text: 'Ebben a kalandban Bence az állat viselkedésére figyelt. A folytatás segített ellenőrizni, hogy a feltételezése illik-e a történtekhez.',
      kind: 'fiction',
      label: 'Kitalált történetből származó felfedezés'
    }
  ],
  completion: {
    title: 'A megfigyelések összeálltak!',
    text: 'Kiválasztottad a fontos nyomokat, megfogalmaztál egy feltételezést, és összevetetted a folytatással.',
    actions: [
      { to: 'world', label: 'Vissza a kalandokhoz' },
      { to: 'discoveries', label: 'Megnézem a felfedezésemet' }
    ]
  }
};
