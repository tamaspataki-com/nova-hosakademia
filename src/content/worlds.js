// The four worlds. Adventures reference a world by id; a world with no available adventure shows an honest
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
      { id: 'practice', name: 'Gyakorló szövegek' }
    ]
  },
  {
    id: 'dinosaurs',
    name: 'Dinoszaurusz-expedíció',
    description: 'Ősi nyomok, különös felfedezések és kutatókalandok.',
    icon: 'footprint',
    series: []
  },
  {
    id: 'animals',
    name: 'Állati különlegességek',
    description: 'Meglepő képességek és izgalmas történetek az állatvilágból.',
    icon: 'pets',
    series: []
  },
  {
    id: 'space',
    name: 'Űrfelfedezők',
    description: 'Bolygók, űreszközök és távoli kutatóküldetések.',
    icon: 'rocket_launch',
    series: []
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
  sequence: 'Sorrend',
  cause: 'Ok és következmény',
  mainIdea: 'A lényeg',
  vocabulary: 'Szavak megértése',
  retell: 'Elmesélés',
  delayedRecall: 'Későbbi felidézés'
};
