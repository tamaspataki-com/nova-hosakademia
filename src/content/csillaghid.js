// NOVA content package 08: „A csillaghíd" – the first adventure of „Csillaghidak bolygója".
// Story, names, world name and the three new exercise types were approved by the owner on 2026-10-17 (see
// design/episode-sirius-arcturus-proposal.md, §4b). Wording that was adapted for the screen (the five clip texts, the
// step titles, the instruction lines of the new exercises, the consequence texts) is listed in README.md and still needs
// the owner's approval. Review status stays „unreviewed" until the owner has finished the review.
//
// The five talking clips are made through Hedra (owner's Chrome) and are NOT in `public/video/` yet. Until all five files
// exist the adventure must not be deployed; the clip player shows the words as text when a video cannot be played.
const clip = (n, ms) => ({ src: `video/csillaghid1-v${n}.mp4`, width: 960, height: 540, seconds: ms });

export const CSILLAGHID = {
  id: 'csillaghid-bridge-01',
  version: 1,
  worldId: 'bridges',
  seriesId: 'crystal-hall',
  title: 'A csillaghíd',
  description:
    'Segíts Sirinek és Arkinak átjutni a Csillagszakadékon: a híd csak akkor gyullad fel, ha ketten lépnek rá.',
  intro:
    'Segíts Sirinek és Arkinak átjutni a Csillagszakadékon: a híd csak akkor gyullad fel, ha ketten lépnek rá.',
  startLabel: 'Segítek Sirinek és Arkinak',
  onlineNote: 'A beszélgetések videók: lejátszásukhoz internetkapcsolat kell. A szövegük a videók alatt olvasható.',
  classification: 'fiction',
  sources: [],
  review: {
    status: 'unreviewed',
    note: 'Új epizód: a szöveget a tulajdonos jóváhagyta javaslatként, a képernyős szövegek és a videók felülvizsgálata még hátravan. Valódi eszközön még nem tesztelték.'
  },
  format: 'story',
  status: 'available',
  context: 'practice',
  level: null,
  modes: ['read'],
  objectives: [],
  hideObjectives: true,
  // Cover: Siri (owner's own Midjourney image, 2026-10-17). Master: design/source-art/csillag/siri-midjourney.webp.
  // Shown only on the card and the introduction – never inside an activity.
  coverAsset: 'assets/stars-bridge-cover.webp',
  coverPosition: '50% 20%',
  coverIcon: 'star',
  coverAlt: 'Siri, a fehér hajú fiú arany rombusszal a homlokán és áttetsző, csillogó köpennyel.',
  badge: null,
  glossary: [],
  passages: [
    {
      // The consequences of Siri's choice on the bridge. Read-only (no recordings); the story continues the same for everyone.
      id: 'paths',
      title: 'Következmények',
      sections: [
        {
          id: 'x1a',
          label: 'Következmény',
          sentences: [
            { id: 'x1a-s1', text: 'Siri hátranézett, és halkan azt mondta: „Egy kicsit félek. Gyere velem!”' },
            { id: 'x1a-s2', text: 'A híd egy csillaggal világosabb lett.' },
            { id: 'x1a-s3', text: 'Arki közelebb lépett.' }
          ]
        },
        {
          id: 'x1b',
          label: 'Következmény',
          sentences: [
            { id: 'x1b-s1', text: 'Siri úgy tett, mintha semmi baj nem lenne, és tovább ment.' },
            { id: 'x1b-s2', text: 'A híd még jobban remegett.' },
            { id: 'x1b-s3', text: 'Siri egyedül érezte magát.' }
          ]
        },
        {
          id: 'x1c',
          label: 'Következmény',
          sentences: [
            { id: 'x1c-s1', text: 'Siri visszafordult, és nem szólt semmit.' },
            { id: 'x1c-s2', text: 'Arki nem tudta, mi történt, és ő is bizonytalan lett.' }
          ]
        }
      ]
    }
  ],
  steps: [
    {
      id: 'v1-arki',
      type: 'clip',
      title: 'Találkozás',
      speaker: 'Arki',
      clip: clip(1),
      screenText:
        'Siri a Kristálycsarnok előtt áll, a köpenye szikrázik. Arki a fénygömbjével a kezében lép ki hozzá.',
      say: 'Szia! Én Arki vagyok. Te vagy az, aki mindig gyorsan fut?',
      nextLabel: 'Meghallgatom Sirit'
    },
    {
      id: 'v2-siri',
      type: 'clip',
      title: 'A feladat',
      speaker: 'Siri',
      clip: clip(2),
      screenText:
        'A csarnok közepén a padló fénye kialudt. A fénygömb csak úgy gyulladhat újra, ha valaki átviszi a Csillagszakadék túlsó oldalára, a Fényoltárhoz. A szakadék fölött egy híd húzódik, de a híd sötét.',
      say: 'Siri vagyok. Igen, én futok. Átfutok, és visszahozom a fénygömböt!',
      after: 'Arki lehajtotta a fejét. Ő is szeretne menni, de fél.',
      nextLabel: 'Tovább a hídhoz'
    },
    {
      id: 'c1-bridge',
      type: 'storyChoice',
      title: 'Siri a hídon',
      prompt: 'Mit tanácsolsz Sirinek, amikor megáll a hídon?',
      note: 'Siri rálépett a hídra. A híd nem világított. Egy lépés, kettő – a híd remegni kezdett, és Siri megállt. Válassz egy lehetőséget, és nézd meg, mi történik utána!',
      submitLabel: 'Ezt választom',
      options: [
        { id: 'say-fear', text: 'Hátranéz, és azt mondja: „Egy kicsit félek. Gyere velem!”', section: 'x1a' },
        { id: 'pretend', text: 'Úgy tesz, mintha semmi baj nem lenne, és tovább megy.', section: 'x1b' },
        { id: 'turn-back', text: 'Visszafordul, és nem szól semmit.', section: 'x1c' }
      ]
    },
    {
      id: 'v3-arki',
      type: 'clip',
      title: 'Arki bátorsága',
      speaker: 'Arki',
      clip: clip(3),
      screenText: 'Arki mély levegőt vesz. Eszébe jut, hogy a fénygömb melegebb lesz, ha kimondja, amit érez.',
      say: 'Siri, én félek. De veled szívesen mennék.',
      after: 'Siri hátranézett, és kinyújtotta a kezét. Arki megfogta.',
      nextLabel: 'Tovább'
    },
    {
      id: 'm1-pairs',
      type: 'matchPairs',
      title: 'Ki mit felelt?',
      prompt: 'Keresd meg, melyik mondat melyikre felelt!',
      leftLabel: 'Ezt mondták vagy tették',
      rightLabel: 'Erre ezt felelték vagy tették',
      pairs: [
        {
          id: 'p1',
          left: 'Arki: „Te vagy az, aki mindig gyorsan fut?”',
          right: 'Siri: „Siri vagyok. Igen, én futok.”'
        },
        {
          id: 'p2',
          left: 'Siri: „Átfutok, és visszahozom a fénygömböt!”',
          right: 'Arki lehajtotta a fejét: ő is szeretne menni, de fél.'
        },
        {
          id: 'p3',
          left: 'Arki: „Siri, én félek. De veled szívesen mennék.”',
          right: 'Siri hátranézett, és kinyújtotta a kezét.'
        }
      ]
    },
    {
      id: 's1-together',
      type: 'stepTogether',
      title: 'Együtt a hídon',
      prompt: 'Lépjetek együtt!',
      lead: 'Siri és Arki megfogták egymás kezét. A híd csak akkor gyullad fel, ha mindketten lépnek. Koppints Sirire és Arkira, hogy lépjenek!',
      who: [
        { id: 'siri', name: 'Siri', label: 'Siri lép' },
        { id: 'arki', name: 'Arki', label: 'Arki lép' }
      ],
      rounds: 5,
      doneText: 'A híd minden csillaga felgyulladt.',
      after: 'Együtt léptek, és a híd alatt minden lépésnél újabb csillag gyulladt fel.'
    },
    {
      id: 'v4-siri',
      type: 'clip',
      title: 'A Fényoltár',
      speaker: 'Siri',
      clip: clip(4),
      screenText:
        'A túlsó oldalon a fénygömb felragyog, és a csarnok padlója újra világít. Arki azt mondja: „Egyedül nem ment volna.”',
      say: 'Nem. Én a bátorságot hoztam, te a bátorság kimondását. Együtt lett belőle híd.',
      nextLabel: 'Tovább'
    },
    {
      id: 'k1-stars',
      type: 'constellation',
      title: 'A híd csillagai',
      prompt: 'Gyújtsd fel a híd csillagait a történet sorrendjében!',
      stars: [
        { id: 'k1', text: 'Siri megáll a hídon.' },
        { id: 'k2', text: 'Arki kimondja, hogy fél.' },
        { id: 'k3', text: 'Kézen fogják egymást.' },
        { id: 'k4', text: 'A fénygömb felragyog a Fényoltárnál.' }
      ],
      doneText: 'Mind a négy csillag felgyulladt.',
      after: 'A bátorság nem az, hogy nem félsz. Hanem az, hogy kimondod, és együtt lépsz.',
      nextLabel: 'Befejezem'
    }
  ],
  discoveries: [],
  completion: {
    title: 'Segítettél Sirinek és Arkinak!',
    text: 'Siri és Arki együtt átjutott a Csillagszakadékon. Arki kimondta, hogy fél, Siri pedig megvárta őt, és a híd felgyulladt.',
    actions: [{ to: 'world', label: 'Vissza a kalandokhoz' }]
  }
};
