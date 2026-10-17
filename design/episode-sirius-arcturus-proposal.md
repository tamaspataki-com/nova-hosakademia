# „A csillaghíd” – új epizód, javaslat (barátság és bátorság)

**Állapot: javaslat a tulajdonosnak jóváhagyásra vagy javításra.** Az appba semmi nem került be (CLAUDE.md §2). A nevek, a helyszínek
és a szöveg mind *helyőrző javaslat*, nem döntés. Tárgyi (csillagászati) állítást nem tartalmaz: kitalált mese.

## 1. Szereplők (a két kép alapján)

- **Szíriusz-fiú – „Siri”** (álló kép): fehér, borzas haj, kék szem, arany rombusz a homlokán, sötét ruha arany vonalakkal, áttetsző,
  szikrázó köpeny. Bátor, gyors, de nem szeret segítséget kérni.
- **Arkturuszi lény – „Arki”** (fekvő kép): kicsi, halványkék, nagy kék szemű, fehér-arany köntösben, kezében fénygömb. Csendes,
  óvatos, nagyon figyelmes. Fél a sötéttől és a nagy ugrásoktól.
- Helyszín: a **Kristálycsarnok** (Arki otthona) és a **Csillagszakadék**, amelyen át egy ragyogó híd vezet – de a híd csak akkor
  gyullad fel, ha ketten lépnek rá.

## 2. A történet (rövid, felolvasható szöveg – magyarul)

**1. Találkozás.**
Siri a Kristálycsarnok előtt állt, és a köpenye szikrázott. Arki a fénygömbjével a kezében lépett ki hozzá.
– Szia! Én Arki vagyok – mondta halkan. – Te vagy az, aki mindig gyorsan fut?
– Siri vagyok – mosolygott a fiú. – Igen, én futok. És te?
– Én inkább nézek – felelte Arki. – Sok mindent látok, amit mások nem.

**2. A feladat.**
A csarnok közepén a padló fénye kialudt. A fénygömb csak úgy gyulladhat újra, ha valaki átviszi a Csillagszakadék túlsó
oldalára, a Fényoltárhoz. A szakadék fölött egy híd húzódott, de a híd sötét volt.
– Átfutok, és visszahozom! – szólt Siri.
Arki lehajtotta a fejét. – Én is szeretnék menni. De félek.

**3. Siri bátorsága.**
Siri rálépett a hídra. A híd nem világított. Egy lépés, kettő – a híd remegni kezdett, és Siri megállt.
Már nem érezte olyan bátornak magát. De nem akarta bevallani.

**4. Arki bátorsága.**
Arki mély levegőt vett. Eszébe jutott, hogy a fénygömb mindig melegebb lesz, ha kimondja, amit érez.
– Siri – mondta –, én félek. De veled szívesen mennék.

**5. Közös lépés.**
Siri hátranézett, és kinyújtotta a kezét. Arki megfogta. Együtt léptek, és a híd alatt egy-egy csillag gyulladt fel,
minden lépésnél újabb.

**6. A Fényoltár.**
A túlsó oldalon a fénygömb felragyogott, és a csarnok padlója újra világított.
– Egyedül nem ment volna – mondta Arki.
– Nem – válaszolta Siri. – Én a bátorságot hoztam, te a bátorság kimondását. Együtt lett belőle híd.

## 3. Döntési pontok (a már meglévő „storyChoice” mintára – javaslat)

**A) 3. lépés után** – *Mit tehet Siri, amikor megáll a hídon?*
1. Hátranéz, és azt mondja: „Egy kicsit félek. Gyere velem!” → *Mi történt?* A híd egy csillaggal világosabb lett. Arki közelebb lépett.
2. Úgy tesz, mintha semmi baj nem lenne, és tovább megy. → *Mi történt?* A híd még jobban remegett. Siri egyedül érezte magát.
3. Visszafordul, és nem szól semmit. → *Mi történt?* Arki nem tudta, mi történt, és ő is bizonytalan lett.

**B) 4. lépés után** – *Mit mondjon Arki?*
1. „Félek, de veled szívesen mennék.” → Siri megfogja a kezét.
2. „Menj egyedül, én itt maradok.” → Siri továbbmegy, de a híd sötét marad.
3. „Nem félek semmitől.” → Siri nem tudja, hogy segíthet.

(Nincs „rossz válasz” pontszám, sebesség vagy értékelés: a következményt csak elmeséljük, a CLAUDE.md szerint.)

## 4. Befejező gondolat (a gyereknek, rövid)

„A bátorság nem az, hogy nem félsz. Hanem az, hogy kimondod, és együtt lépsz.”

## 4b. Owner's answers (2026-10-17) and the revised plan

Approved: names (Siri, Arki, Kristálycsarnok, Csillagszakadék, Fényoltár, „A csillaghíd”). New world, stellar theme. Not longer, but **new types of
exercises**. Video through Hedra (owner's Chrome). The two images are the owner's own (GPT and Midjourney) and may be used.

**New world (placeholder names, for approval):** „Csillaghidak bolygója” – series „A Kristálycsarnok”. Description (proposal):
„Segíts Sirinek és Arkinak átjutni a Csillagszakadékon, és találjátok meg, hogyan lehet együtt bátornak lenni.” World art: to be made (or the
owner's two images composed); the two images cannot be used as they are inside any activity (artwork never gives an answer away).

**Exercise types.** The shared system already has: `passage`, `clip`, `storyChoice`, `talkChoice`, `sayIt`, `sequence`, `sort`, `selectClues`,
`route`, `reflection`, `retell`. The new types below do **not** exist yet and need new shared code (flagged, not substituted):

| # | New type | What the child does | Replaces |
|---|----------|---------------------|----------|
| N1 | `constellation` | taps the stars of the bridge in the story order to light it, no timer | – |
| N2 | `matchPairs` | joins what Siri says with what Arki answers (pairs), untimed | – |
| N3 | `stepTogether` | two big buttons, „Siri lép” and „Arki lép”: the bridge lights only when both were chosen, in either order | – |

Proposed running order (7 steps, about the same length): 1 `clip` Találkozás → 2 `clip` A feladat → 3 `storyChoice` A) → 4 `clip` Arki bátorsága →
5 `matchPairs` → 6 `stepTogether` → 7 `constellation` + záró gondolat. All unscored apart from the clearly right/wrong pair and order checks;
no speed, no points, no claims about attention or the brain.

**Videos:** about 5 short talking clips (Siri, Arki, shared text always shown beside the video, online-only like Kapcsolatok). Lines are the story
text above. **Blocked right now:** Claude in Chrome is not connected, so Hedra cannot be opened.

## 5. Mit kell eldöntened (older list, answered above)

1. Jók-e a nevek (**Siri**, **Arki**, **Kristálycsarnok**, **Csillagszakadék**, **Fényoltár**, a mese címe)?
2. Melyik világba kerüljön: Bátorság bolygója, Kapcsolatok bolygója, vagy új világ?
3. Korosztály és hossz: ez most kb. 6 rövid szakasz és 2 döntés; legyen hosszabb, vagy kérdésekkel kiegészítve?
4. Hang/videó: felolvasás (ElevenLabs), videó, vagy csak olvasás?
5. A képek használati jogai nincsenek ellenőrizve – a két kép forrását jelezd, mielőtt borító vagy karakterlap készül belőlük.

## 6. Nincs még kész

- Az appba nem került át semmi, nincs telepítés, nincs hang, kép vagy jelvény.
- Jóváhagyás után: az epizód a megosztott lépéstípusokra kerül (mint `courage.js`, `kapcsolatok.js`), „felülvizsgálatlan” jelzéssel.
