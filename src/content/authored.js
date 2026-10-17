// Authored learning content carried over from the design prototype: the energy-core mission, the five tools and
// the practice passages. Nothing here is rendered directly; src/content/*.js arrange it into adventures.

// Mission content is data; screens only render it.
export const MISSION = {
  id: 'energiamag',
  sections: [
    [
      'Mira az akadémia műhelyében dolgozott, amikor jelzés érkezett a fényhídról.',
      'A híd lámpái kialudtak.',
      'Mira odament, és észrevette, hogy a kapu melletti energiaállvány foglalata üres.'
    ],
    [
      'A hídőr elmondta, hogy reggel egy szerelő vitte el az energiamagot ellenőrzésre.',
      'Mira a műhelyhez sietett.',
      'Ott megtalálta a szerelőt, aki már végzett az ellenőrzéssel.',
      'Az energiamag egy nyitott szállítódobozban feküdt.'
    ],
    [
      'Mira visszavitte az energiamagot a hídhoz.',
      'Óvatosan a hatszögletű foglalatba illesztette.',
      'A jelzőfény kéken felragyogott, és a híd lámpái sorban bekapcsoltak.',
      'Mira szólt a hídőrnek, hogy a világítás újra működik.'
    ]
  ],
  glossary: [
    { key: 'foglalat', word: 'foglalat', def: 'Az a hely, ahová egy alkatrész pontosan beleilleszkedik.' },
    {
      key: 'energiamag',
      word: 'energiamag',
      def: 'A történetben egy olyan eszköz, amely energiát ad a híd lámpáinak.'
    },
    { key: 'ellenőrzés', word: 'ellenőrzés', def: 'Amikor valaki megvizsgálja, hogy egy eszköz megfelelően működik-e.' }
  ],
  question: {
    options: [
      { id: 'a', text: 'Az energiamagot elvitték ellenőrzésre.', correct: true },
      { id: 'b', text: 'A hídőr kikapcsolta a világítást.' },
      { id: 'c', text: 'Mira bezárta az akadémiát.' }
    ]
  },
  sequence: {
    labels: ['Először', 'Azután', 'Végül'],
    correct: ['e1', 'e2', 'e3'],
    events: {
      e1: { text: 'Az energiaállvány foglalata üres.', src: 'assets/obj-pedestal-empty.webp' },
      e2: { text: 'Mira megtalálja az energiamagot a műhelyben.', src: 'assets/obj-box.webp' },
      e3: {
        text: 'Mira visszahelyezi az energiamagot, és a lámpák felgyulladnak.',
        src: 'assets/obj-pedestal-lit.webp'
      }
    }
  },
  evidence: {
    section: 1,
    correct: 2,
    wrong1: 'Ez a mondat mást mond el. Keress olyan mondatot, amely a szerelő munkájáról szól!',
    wrong2: 'Figyeld a „végzett” szót! Melyik mondatban szerepel?'
  },
  hints: [
    'Olvasd el a küldetés leírását, majd indulj el Mirával!',
    'Válaszd azt a módot, amelyik most kényelmes.',
    'Ha egy szó ismeretlen, koppints rá, vagy nyisd meg a Szómagyarázatot.',
    'Keressük meg együtt a nyomot! Mit mondott a hídőr az energiamagról?',
    'Melyik eseményt vette észre Mira, amikor megérkezett a hídhoz?',
    'Keress olyan mondatot, amely arról szól, hogy a szerelő végzett a munkával.',
    'Kezdheted így: „A probléma az volt, hogy…”',
    'Visszamehetsz a bázisra, vagy megnézheted a felszerelésedet.'
  ],
  adaptation: {
    passageLength: 11,
    vocabulary: ['foglalat', 'energiamag', 'ellenőrzés'],
    hintLevels: 2,
    taskTypes: ['choice', 'sequence', 'evidence', 'retell']
  }
};
export const TOOLS = [
  {
    id: 'goggles',
    name: 'Nyomkereső szemüveg',
    strategy: 'Megkeresem a választ alátámasztó mondatot.',
    src: 'assets/tool-goggles.webp',
    steps: [
      'Olvasd el újra a kérdést.',
      'Keresd meg a szövegben azt a részt, amelyről a kérdés szól.',
      'Mutass rá arra a mondatra, amely bizonyítja a válaszodat.'
    ]
  },
  {
    id: 'glove',
    name: 'Időrendező kesztyű',
    strategy: 'Sorrendbe rendezem az eseményeket.',
    src: 'assets/tool-glove.webp',
    steps: [
      'Keresd meg, mi történt legelőször.',
      'Kérdezd meg magadtól: és utána mi jött?',
      'Nézd meg, hogyan oldódott meg a végén a probléma.'
    ]
  },
  {
    id: 'shield',
    name: 'Lényeglátó pajzs',
    strategy: 'Kiválasztom, mi a szöveg legfontosabb mondanivalója.',
    src: 'assets/tool-shield.webp',
    steps: [
      'Gondold át, miről szól az egész szöveg.',
      'Mi az, amit mindenképpen elmondanál róla?',
      'Fogalmazd meg röviden. Az apró részleteket most elhagyhatod.'
    ]
  },
  {
    id: 'crystal',
    name: 'Szómagyarázó kristály',
    strategy: 'Utánajárok az ismeretlen szavaknak.',
    src: 'assets/tool-crystal.webp',
    steps: [
      'Vedd észre a szót, amelyet nem értesz.',
      'Nézd meg a szómagyarázatot, vagy kérdezz meg valakit.',
      'Olvasd el újra a mondatot az új jelentéssel.'
    ]
  },
  {
    id: 'compass',
    name: 'Újratervező iránytű',
    strategy: 'Választok egy másik segítséget vagy megközelítést.',
    src: 'assets/tool-compass.webp',
    steps: [
      'Ha elakadsz, állj meg egy pillanatra.',
      'Gondold át, mi segítene: egy támpont, újraolvasás, meghallgatás vagy rövidebb rész.',
      'Nyisd meg a Segítséget kérek menüt, és válassz. Szünetet is tarthatsz.'
    ]
  }
];
// ---- Practice library: reviewed starter collection (structured content, separate from screens)
export const PATHS = {
  read: { label: 'Olvasok és megértem', icon: 'menu_book' },
  listen: { label: 'Hallgatok és megjegyzem', icon: 'headphones' },
  seq: { label: 'Sorrendbe rendezem', icon: 'format_list_numbered' },
  main: { label: 'Elmondom a lényeget', icon: 'record_voice_over' }
};
export const TASK_CHILD = {
  understand: 'Megértés',
  recall: 'Emlékezz!',
  seq: 'Sorrend',
  main: 'A lényeg',
  later: 'Emlékszel még?'
};
export const ACTS = {
  r1: {
    path: 'read',
    level: 1,
    title: 'A kék doboz',
    sentences: [
      'Mira egy kék dobozt vitt a műhelybe.',
      'A dobozban egy energiamag volt.',
      'A szerelő az asztalra tette.'
    ],
    tasks: [
      {
        type: 'recall',
        prompt: 'Mi volt a dobozban?',
        options: ['Egy térkép', 'Egy energiamag', 'Egy szemüveg'],
        correct: 1,
        ev: 1,
        hint: 'Gondolj arra, mit vitt Mira a műhelybe a dobozban!'
      }
    ],
    later: {
      prompt: 'Hová vitte Mira a kék dobozt?',
      options: ['A hídra', 'A kertbe', 'A műhelybe'],
      correct: 2,
      ev: 0,
      hint: 'Hol dolgozik a szerelő?'
    }
  },
  r2: {
    path: 'read',
    level: 1,
    title: 'Az antenna',
    sentences: [
      'Bence ma a Jelzőállomáson segített.',
      'Egy erős szél miatt leesett az antenna.',
      'Bence egy kötéllel rögzítette, és a jelek újra megérkeztek.'
    ],
    tasks: [
      {
        type: 'understand',
        prompt: 'Miért nem érkeztek meg a jelek?',
        options: ['Mert Bence elaludt.', 'Mert elfogyott az energia.', 'Mert a szél miatt leesett az antenna.'],
        correct: 2,
        ev: 1,
        hint: 'Mi történt a szél miatt?'
      }
    ],
    later: {
      prompt: 'Mivel rögzítette Bence az antennát?',
      options: ['Egy kötéllel', 'Ragasztóval', 'Egy szöggel'],
      correct: 0,
      ev: 2,
      hint: 'Mit használt Bence?'
    }
  },
  r6: {
    path: 'read',
    level: 2,
    transfer: true,
    title: 'Zsófi első napja',
    sentences: [
      'Zsófi új tanuló volt az akadémián.',
      'Az első napon eltévedt a folyosókon.',
      'Egy idősebb diák megmutatta neki a térképet a falon.',
      'Ezután Zsófi könnyen megtalálta a termét.'
    ],
    tasks: [
      {
        type: 'understand',
        prompt: 'Mi segített Zsófinak megtalálni a termét?',
        options: ['Egy csengő', 'A térkép a falon', 'Egy robot'],
        correct: 1,
        ev: 2,
        hint: 'Mit mutatott meg neki az idősebb diák?'
      },
      {
        type: 'recall',
        prompt: 'Ki segített Zsófinak?',
        options: ['A tanára', 'Egy idősebb diák', 'A barátja'],
        correct: 1,
        ev: 2,
        hint: 'Egy másik tanuló volt.'
      }
    ],
    later: {
      prompt: 'Mi történt Zsófival az első napon?',
      options: ['Eltévedt a folyosókon.', 'Elvesztette a táskáját.', 'Elkésett az óráról.'],
      correct: 0,
      ev: 1,
      hint: 'Mi volt a baj a folyosókon?'
    }
  },
  r3: {
    path: 'read',
    level: 2,
    title: 'Az Emlékkert fája',
    sentences: [
      'Az Emlékkertben egy öreg fa áll.',
      'Ősszel a levelei aranyszínűek lesznek.',
      'Mira minden reggel meglocsolja a fa melletti virágokat.',
      'Egy nap egy kis madárfészket talált az egyik ágon.'
    ],
    tasks: [
      {
        type: 'understand',
        prompt: 'Hol talált Mira madárfészket?',
        options: ['A virágok között.', 'A fa egyik ágán.', 'A műhely tetején.'],
        correct: 1,
        ev: 3,
        hint: 'Keresd a mondatot, amelyben a fészek szerepel!'
      },
      {
        type: 'recall',
        prompt: 'Mit csinál Mira minden reggel?',
        options: ['Leveleket gyűjt.', 'Madarakat etet.', 'Meglocsolja a virágokat.'],
        correct: 2,
        ev: 2,
        hint: 'Mi történik minden reggel a fa mellett?'
      }
    ],
    later: {
      prompt: 'Milyen színűek lesznek ősszel a fa levelei?',
      options: ['Aranyszínűek', 'Pirosak', 'Kékek'],
      correct: 0,
      ev: 1,
      hint: 'Ősszel csillogó színűek.'
    }
  },
  r5: {
    path: 'read',
    level: 3,
    title: 'A három lámpa',
    sentences: [
      'A Jelzőállomáson három lámpa van: egy piros, egy sárga és egy kék.',
      'A piros lámpa vihart jelez.',
      'A sárga lámpa azt jelzi, hogy erős a szél.',
      'A kék lámpa azt mutatja, hogy minden rendben van.',
      'Ma reggel a kék lámpa világított.'
    ],
    tasks: [
      {
        type: 'understand',
        prompt: 'Milyen volt ma reggel az idő?',
        options: ['Viharos', 'Nyugodt, minden rendben volt', 'Nagyon szeles'],
        correct: 1,
        ev: 4,
        hint: 'Melyik lámpa világított ma reggel, és mit jelent?'
      },
      {
        type: 'recall',
        prompt: 'Mit jelez a piros lámpa?',
        options: ['Vihart', 'Erős szelet', 'Hogy minden rendben van'],
        correct: 0,
        ev: 1,
        hint: 'A piros lámpa veszélyre figyelmeztet.'
      }
    ],
    later: {
      prompt: 'Hány lámpa van a Jelzőállomáson?',
      options: ['Kettő', 'Három', 'Négy'],
      correct: 1,
      ev: 0,
      hint: 'Gondolj a színekre!'
    }
  },
  r4: {
    path: 'read',
    level: 3,
    transfer: true,
    title: 'Dani a Szókönyvtárban',
    sentences: [
      'Dani először járt a Szókönyvtárban.',
      'A polcokon világító könyvek sorakoztak.',
      'A könyvtáros megmutatta neki, hogyan kell keresni.',
      'Dani egy könyvet keresett a felhőkről.',
      'Végül a legfelső polcon találta meg, egy létra segítségével.'
    ],
    tasks: [
      {
        type: 'understand',
        prompt: 'Miért kellett Daninak létra?',
        options: ['Mert sötét volt.', 'Mert a könyv a legfelső polcon volt.', 'Mert a könyvtáros kérte.'],
        correct: 1,
        ev: 4,
        hint: 'Hol találta meg Dani a könyvet?'
      },
      {
        type: 'recall',
        prompt: 'Miről szólt a könyv, amelyet Dani keresett?',
        options: ['A felhőkről', 'A madarakról', 'A hidakról'],
        correct: 0,
        ev: 3,
        hint: 'Mit keresett Dani?'
      }
    ],
    later: {
      prompt: 'Hol járt Dani először?',
      options: ['A Nyomozólaborban', 'A Szókönyvtárban', 'Az Emlékkertben'],
      correct: 1,
      ev: 0,
      hint: 'Könyvek voltak ott.'
    }
  },
  l1: {
    path: 'listen',
    level: 1,
    title: 'A sárga zászló',
    sentences: ['Az akadémián ma sárga zászlót tűztek ki.', 'A sárga zászló azt jelenti, hogy repülőnap van.'],
    tasks: [
      {
        type: 'recall',
        prompt: 'Milyen színű zászlót tűztek ki?',
        options: ['Kéket', 'Pirosat', 'Sárgát'],
        correct: 2,
        ev: 0,
        hint: 'A zászló színe azt is elárulta, milyen nap van.'
      }
    ],
    later: {
      prompt: 'Mit jelent a sárga zászló?',
      options: ['Esni fog.', 'Repülőnap van.', 'Ünnep van.'],
      correct: 1,
      ev: 1,
      hint: 'Valami a levegőben történik.'
    }
  },
  l2: {
    path: 'listen',
    level: 1,
    kind: 'instruction',
    title: 'Hősutasítás: a kristály',
    sentences: ['Vedd fel a kék kristályt.', 'Aztán tedd bele a nyitott dobozba.'],
    tasks: [
      {
        type: 'recall',
        prompt: 'Mit kell csinálni először?',
        options: ['Becsukni a dobozt.', 'Felvenni a kék kristályt.', 'Elvinni a dobozt a hídhoz.'],
        correct: 1,
        ev: 0,
        hint: 'Hogyan kezdődött az utasítás: „Vedd fel…”?'
      }
    ],
    later: {
      prompt: 'Hová kell tenni a kristályt?',
      options: ['Az asztalra', 'A zsebedbe', 'A nyitott dobozba'],
      correct: 2,
      ev: 1,
      hint: 'Valamibe bele kell tenni.'
    }
  },
  l3: {
    path: 'listen',
    level: 2,
    title: 'Lábnyom a laborban',
    sentences: [
      'Lili a Nyomozólaborban dolgozott.',
      'Egy nagyítóval egy lábnyomot vizsgált.',
      'A lábnyom kicsi volt, és csillag alakú mintája volt.',
      'Lili rájött, hogy egy robotkutya járt ott.'
    ],
    tasks: [
      {
        type: 'understand',
        prompt: 'Mire jött rá Lili?',
        options: ['Hogy eltört a nagyító.', 'Hogy egy robotkutya járt ott.', 'Hogy a labor zárva van.'],
        correct: 1,
        ev: 3,
        hint: 'Mit árult el a különös lábnyom?'
      },
      {
        type: 'recall',
        prompt: 'Milyen mintája volt a lábnyomnak?',
        options: ['Csillag alakú', 'Kör alakú', 'Csíkos'],
        correct: 0,
        ev: 2,
        hint: 'Az égen is látsz ilyen alakot éjszaka.'
      }
    ],
    later: {
      prompt: 'Mivel vizsgálta Lili a lábnyomot?',
      options: ['Egy lámpával', 'Egy vonalzóval', 'Egy nagyítóval'],
      correct: 2,
      ev: 1,
      hint: 'Ezzel a kis dolgok nagyobbnak látszanak.'
    }
  },
  l5: {
    path: 'listen',
    level: 2,
    kind: 'instruction',
    title: 'Hősutasítás: a zöld gomb',
    sentences: [
      'Először húzd fel a kesztyűt.',
      'Utána nyomd meg a zöld gombot.',
      'Végül várj, amíg a lámpa kéken világít.'
    ],
    tasks: [
      {
        type: 'recall',
        prompt: 'Milyen színű gombot kell megnyomni?',
        options: ['Pirosat', 'Zöldet', 'Sárgát'],
        correct: 1,
        ev: 1,
        hint: 'A második lépésben egy gombról volt szó.'
      },
      {
        type: 'recall',
        prompt: 'Mire kell várni a végén?',
        options: ['Hogy megszólaljon a csengő.', 'Hogy kinyíljon az ajtó.', 'Hogy a lámpa kéken világítson.'],
        correct: 2,
        ev: 2,
        hint: 'Mi történik a lámpával?'
      }
    ],
    later: {
      prompt: 'Mit kell először felhúzni?',
      options: ['A kesztyűt', 'A cipőt', 'A sisakot'],
      correct: 0,
      ev: 0,
      hint: 'A kezedre kerül.'
    }
  },
  l6: {
    path: 'listen',
    level: 3,
    title: 'Piknik az Emlékkertben',
    sentences: [
      'Mira és Bence piknikre készült az Emlékkertben.',
      'Mira szendvicseket csomagolt, Bence pedig almát és vizet hozott.',
      'Amikor odaértek, észrevették, hogy otthon hagyták a plédet.',
      'Bence visszaszaladt érte az akadémiára.',
      'Közben Mira megkereste a legszebb helyet a nagy fa alatt.'
    ],
    tasks: [
      {
        type: 'understand',
        prompt: 'Miért szaladt vissza Bence az akadémiára?',
        options: ['Mert otthon hagyták a plédet.', 'Mert esni kezdett.', 'Mert éhes volt.'],
        correct: 0,
        ev: 2,
        hint: 'Mit vettek észre, amikor odaértek?'
      },
      {
        type: 'recall',
        prompt: 'Mit hozott Bence?',
        options: ['Szendvicseket', 'Almát és vizet', 'Süteményt'],
        correct: 1,
        ev: 1,
        hint: 'Ki mit csomagolt?'
      }
    ],
    later: {
      prompt: 'Hol kereste Mira a legszebb helyet?',
      options: ['A szökőkút mellett', 'A híd alatt', 'A nagy fa alatt'],
      correct: 2,
      ev: 4,
      hint: 'Árnyékos hely volt.'
    }
  },
  l4: {
    path: 'listen',
    level: 3,
    transfer: true,
    title: 'A poros napelem',
    sentences: [
      'Reggel az Energiaállomáson megszólalt egy halk csengő.',
      'Ez azt jelezte, hogy az egyik napelem poros lett.',
      'Bence és Mira létrát hozott.',
      'Bence tartotta a létrát, Mira pedig puha kendővel letörölte a port.',
      'Utána a csengő elhallgatott.'
    ],
    tasks: [
      {
        type: 'understand',
        prompt: 'Miért szólalt meg a csengő?',
        options: ['Mert ebédidő volt.', 'Mert Bence elesett.', 'Mert az egyik napelem poros lett.'],
        correct: 2,
        ev: 1,
        hint: 'Mit jelzett a csengő?'
      },
      {
        type: 'recall',
        prompt: 'Ki törölte le a port?',
        options: ['Mira', 'Bence', 'A szerelő'],
        correct: 0,
        ev: 3,
        hint: 'Ki tartotta a létrát, és ki dolgozott a kendővel?'
      }
    ],
    later: {
      prompt: 'Mit hozott Bence és Mira?',
      options: ['Vödröt', 'Létrát', 'Seprűt'],
      correct: 1,
      ev: 2,
      hint: 'Magasra kellett felmászni.'
    }
  },
  s1: {
    path: 'seq',
    level: 1,
    title: 'Mira reggele',
    sentences: ['Mira felébredt, és felöltözött.', 'Elsietett az akadémiára.', 'Az órán egy új térképet rajzolt.'],
    tasks: [
      {
        type: 'seq',
        prompt: 'Tedd sorrendbe az eseményeket!',
        events: ['Mira felöltözik.', 'Mira az akadémiára siet.', 'Mira térképet rajzol.'],
        hint: 'Mit csinált Mira, amikor felébredt?'
      }
    ]
  },
  s2: {
    path: 'seq',
    level: 2,
    title: 'A papírsárkány',
    sentences: [
      'A szél egy papírsárkányt sodort a híd alá.',
      'Bence lehajolt, és meglátta a sárkányt.',
      'Egy hosszú bottal kihúzta.',
      'Végül visszaadta egy kisfiúnak, akié volt.'
    ],
    tasks: [
      {
        type: 'seq',
        prompt: 'Tedd sorrendbe az eseményeket!',
        events: [
          'A szél a híd alá sodorja a sárkányt.',
          'Bence egy bottal kihúzza a sárkányt.',
          'Bence visszaadja a sárkányt a kisfiúnak.'
        ],
        hint: 'Mi történt, mielőtt Bence meglátta a sárkányt?'
      }
    ]
  },
  s3: {
    path: 'seq',
    level: 3,
    kind: 'instruction',
    title: 'Így készül a jelzőfény',
    sentences: [
      'Először Lili kinyitotta a lámpa fedelét.',
      'Aztán beletett egy kis kristályt.',
      'Ezután becsukta a fedelet.',
      'Megnyomta a kapcsolót.',
      'Végül a lámpa kéken felvillant.'
    ],
    tasks: [
      {
        type: 'seq',
        prompt: 'Tedd sorrendbe a lépéseket!',
        events: ['Lili kinyitja a fedelet.', 'Lili beteszi a kristályt.', 'A lámpa kéken felvillan.'],
        hint: 'Mit kell csinálni, mielőtt a kristály a lámpába kerül?'
      }
    ]
  },
  m1: {
    path: 'main',
    level: 1,
    title: 'Az akadémia kertje',
    sentences: [
      'Az akadémia kertjében sok virág nőtt.',
      'A diákok minden héten együtt gondozták őket.',
      'Így a kert egész nyáron színes maradt.'
    ],
    tasks: [
      {
        type: 'main',
        prompt: 'Mi a legfontosabb ebben a szövegben?',
        options: [
          'A virágok sárgák voltak.',
          'A diákok együtt gondozták a kertet, ezért szép maradt.',
          'Nyáron meleg volt.'
        ],
        correct: 1,
        hint: 'Melyik válasz mondja el röviden az egész szöveget?'
      }
    ]
  },
  m2: {
    path: 'main',
    level: 2,
    transfer: true,
    title: 'Mira a magas hídon',
    sentences: [
      'Mira először félt átmenni a magas hídon.',
      'Bence megmutatta neki, hogy a korlátba kapaszkodhat.',
      'Mira lassan elindult, és közben a túlsó partot nézte.',
      'Amikor átért, büszkén integetett vissza.'
    ],
    tasks: [
      {
        type: 'main',
        prompt: 'Mi a legfontosabb ebben a szövegben?',
        options: [
          'A hídnak korlátja van.',
          'Bence magas fiú.',
          'Mira segítséggel legyőzte a félelmét, és átment a hídon.'
        ],
        correct: 2,
        hint: 'Hogyan érzett Mira az elején, és mi történt a végén?'
      }
    ]
  },
  m3: {
    path: 'main',
    level: 3,
    title: 'Az elveszett kulcs',
    sentences: [
      'A Nyomozólabor tanulói egy elveszett kulcsot kerestek.',
      'Először a padok alatt néztek körül.',
      'Aztán megkérdezték a takarítórobotot.',
      'A robot emlékezett, hogy egy fényes tárgyat vitt a talált tárgyak dobozába.',
      'Ott meg is találták a kulcsot.'
    ],
    tasks: [
      {
        type: 'main',
        prompt: 'Mi a legfontosabb ebben a szövegben?',
        options: [
          'A takarítórobot fényes.',
          'A tanulók kérdezősködéssel megtalálták az elveszett kulcsot.',
          'A padok alatt sötét van.'
        ],
        correct: 1,
        hint: 'Mit kerestek, és sikerült-e megtalálni?'
      }
    ]
  }
};
