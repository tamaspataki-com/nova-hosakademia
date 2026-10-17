// The six worlds. Adventures reference a world by id; a world with no available adventure shows an honest
// "upcoming" state. Only the heroes world has artwork (its six-island map); the others use designed icon cards.
export const WORLDS = [
  {
    id: 'heroes',
    name: 'Hősök városa',
    description: 'Rejtélyek, találmányok és mentőakciók a lebegő városban.',
    icon: 'shield',
    art: 'assets/map.webp',
    artAlt: 'A lebegő szigetek világa',
    series: [
      { id: 'academy', name: 'Akadémiai küldetések' },
      {
        id: 'practice',
        name: 'Gyakorlás (nem kötelező)',
        note: 'Rövid gyakorló szövegek az előző változatból. Nem tartoznak a kalandok sorrendjéhez: bármikor elérhetők, és nem kell őket befejezned ahhoz, hogy a következő kaland megnyíljon.'
      }
    ]
  },
  {
    id: 'dinosaurs',
    name: 'Dinoszaurusz-expedíció',
    description: 'Ősi nyomok, különös felfedezések és kutatókalandok.',
    icon: 'dino',
    art: 'assets/dino-world.webp',
    artAlt: 'A dinoszauruszpark kutatóállomása, előtte egy háromszarvú és egy hosszú nyakú dinoszaurusz',
    series: [{ id: 'research-station', name: 'A kutatóállomás rejtélyei' }]
  },
  {
    id: 'animals',
    name: 'Állati különlegességek',
    description: 'Meglepő képességek és izgalmas történetek az állatvilágból.',
    icon: 'octopus',
    art: 'assets/animals-world.webp',
    artAlt:
      'Tengerparti természetvédelmi központ, előtte egy róka és egy jégmadár, a nagy akváriumablakban pedig egy polip',
    series: [{ id: 'observation-station', name: 'A tengeri megfigyelőállomás' }]
  },
  {
    id: 'space',
    name: 'Űrfelfedezők',
    description: 'Bolygók, űreszközök és távoli kutatóküldetések.',
    icon: 'rover',
    art: 'assets/space-world.webp',
    artSet: 'assets/space-world-768.webp 768w, assets/space-world.webp 1536w',
    artAlt: 'Űrkutató központ megfigyelőtoronnyal, egy űrhajóval és egy gyűrűs bolygóval az égen, előtte egy marsjáró',
    series: [{ id: 'red-planet-messages', name: 'Üzenetek a vörös bolygóról' }]
  },
  {
    id: 'courage',
    name: 'Bátorság bolygója',
    description:
      'Segíts Lénának elindulni akkor is, amikor bizonytalan! Próbáljátok ki, hogyan segíthet egy kis lépés, egy újabb próbálkozás vagy egy jókor kért segítség.',
    // World art: a star-map table in a bright, arched station with Léna and Csipp (generated from the locked character
    // reference sheet, see design/world-5-courage-proposal.md). Master: design/source-art/courage/courage-world.png.
    icon: 'flag',
    art: 'assets/courage-world.webp',
    artSet: 'assets/courage-world-768.webp 768w, assets/courage-world.webp 1536w',
    artAlt: 'Csillagtérképasztal egy világos, boltíves állomáson, mellette Léna és Csipp.',
    series: [{ id: 'star-map-station', name: 'A csillagtérkép-állomás' }]
  },
  {
    id: 'connection',
    name: 'Kapcsolatok bolygója',
    description: 'Segíts a barátoknak megtalálni a szavakat, hogy megértsék egymást.',
    icon: 'forum', // no artwork yet: the icon card is used
    series: [{ id: 'star-playground', name: 'A csillagjátszótér' }]
  }
];

export const UPCOMING_TEXT = 'Az első kaland előkészületben van.';

export const FORMATS = [
  { id: 'story', label: 'Történet' },
  { id: 'fact', label: 'Érdekesség' },
  { id: 'investigation', label: 'Nyomozás' },
  { id: 'instructions', label: 'Útmutató' }
];

export const MODE_NAMES = { read: 'Olvasok', listen: 'Hallgatok', combined: 'Olvasok és hallgatok' };

export const OBJECTIVE_NAMES = {
  detail: 'Részletek felidézése',
  evidence: 'Bizonyíték keresése',
  sequence: 'Sorrend',
  cause: 'Ok és következmény',
  mainIdea: 'A lényeg',
  vocabulary: 'Szavak megértése',
  retell: 'Elmesélés',
  delayedRecall: 'Későbbi felidézés',
  connect: 'Információk összekapcsolása',
  instruction: 'Utasítás követése',
  check: 'Ellenőrzés',
  relevant: 'Releváns információ',
  prediction: 'Alátámasztott feltételezés',
  verify: 'Következtetés ellenőrzése',
  compare: 'Összehasonlítás',
  infoCheck: 'Információ ellenőrzése'
};
