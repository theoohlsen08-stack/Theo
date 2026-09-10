# Inspelningslista — The Jad Method

Tio klipp. Theo spelar in, jag lägger in dem som länkar i version 1.1 av kursen.

Urvalsregeln: **rörlig bild vinner bara där läsaren måste följa ett levande
gränssnitt.** Är momentet ett resonemang eller ett arbetsblad tillför video
ingenting utom en pratande röst. Därför finns modul 3–8, 12, 20 och 21 inte här.

Sidnumren pekar på kursens 122-sidiga PDF (`jad-method-full.pdf`).

## Innan du spelar in något

- **Stäng av notiser.** En Slack-popup mitt i ett klipp betyder omtagning.
- **Använd en ren webbläsarprofil** utan bokmärkesfält fullt av flikar.
- **Låt muspekaren synas.** Läsaren följer den.
- **Ingen musik.** De flesta ser utan ljud ändå.
- **Spela in i 1080p eller bättre**, och zooma in gränssnittet ett snäpp — text
  som är läsbar på din skärm är för liten på en telefon.
- **Klipp bort dödtid.** Ett klipp där något laddar i nio sekunder tappar tittaren.

Maskeringsreglerna är kursens egna, från modul 07: API-nycklar, tokens,
e-postadresser, kundnamn, ordernummer, butiks-ID och betaluppgifter bort. Enklast
är att spela in i en butik utan riktiga ordrar — vilket Ecom Jad är före öppning.

---

# Grupp A — terminalinspelningar

Enklast att spela in, tydligast för läsaren, ingen risk för läckt kunddata.

## A1 · Installera Claude Code och bevisa att den kör

**Modul 13, s. 64–65** — *Install* och *Prove it worked*
**Varför klipp:** text kan beskriva ett kommando, men inte visa hur "det
fungerade" ser ut. Ett versionsnummer som skrivs ut är ett bevis man känner igen.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | Tom terminal. Installationskommandot skrivs. |
| 0:10 | Installationen rullar. |
| 0:25 | **Ny** terminal öppnas — poängen med steget. |
| 0:30 | `claude --version` skriver ut ett versionsnummer. |
| 0:40 | `claude doctor` skriver ut diagnostiken. |

**Längd** ~50 s · **Röst** nej
**Maska** hemkatalogens namn om det står i prompten

## A2 · Hämta ner temat och ta säkerhetskopian

**Modul 14, s. 70** — *Get the theme onto your machine*
**Varför klipp:** fem steg som måste ske i rätt ordning, där ett av dem
(läsa butiksnamnet på inloggningsskärmen) är lätt att slarva förbi i text.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | Admin: temat dupliceras, kopian får ett tydligt namn. |
| 0:12 | Tom lokal mapp, terminal öppnad i den. |
| 0:18 | `shopify theme pull --store …` |
| 0:26 | Webbläsarinloggningen. **Pausa här.** Textruta: *läs butiksnamnet innan du godkänner.* |
| 0:35 | Mapparna dyker upp: assets, config, layout, sections, snippets, templates. |
| 0:45 | `git init`, `git add .`, `git commit` — återställningspunkten. |

**Längd** ~60 s · **Röst** nej, men textrutan vid 0:26 är obligatorisk
**Maska** myshopify-domänen om du vill

## A3 · Förhandsgranska och kodkontrollera

**Modul 14, s. 73** — *Preview and check before anything leaves your machine*
**Varför klipp:** att en sparad fil laddar om förhandsvisningen av sig själv är
svårt att tro på i text och självklart när man ser det.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | `shopify theme dev --store …` |
| 0:10 | Förhandsvisningslänken öppnas. |
| 0:18 | En ändring i en fil, sparas. |
| 0:22 | **Förhandsvisningen laddar om av sig själv.** Klippets poäng. |
| 0:32 | `shopify theme check` |
| 0:42 | Utdata, med en varning läst högt eller markerad. |

**Längd** ~50 s · **Röst** nej
**Maska** inget

## A4 · Ladda upp opublicerat och publicera för hand

**Modul 14, s. 74** — *Upload as unpublished, publish by hand*
**Varför klipp:** hela poängen sitter i de sista fem sekunderna — att det gamla
temat fortfarande ligger kvar att gå tillbaka till.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | `shopify theme push --unpublished`, temat namnges. |
| 0:15 | Admin: temat dyker upp i listan, märkt opublicerat. |
| 0:22 | Förhandsvisning öppnas, produktsidan klickas. |
| 0:35 | Tillbaka till temalistan. Publicera klickas **för hand**. |
| 0:45 | Bekräftelsen — **och det gamla temat kvar i listan.** |

**Längd** ~50 s · **Röst** nej
**Maska** inget

---

# Grupp B — gränssnittsgenomgångar

Högre värde för läsaren, men kräver maskering.

## B1 · Skapa produkten och stänga av "fysisk vara"

**Modul 10, s. 45** — *Creating the product*
**Varför klipp:** en enda kryssruta avgör om kassan fungerar. Figur 10.1 visar
konsekvensen; klippet visar var rutan sitter.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | Products → lägg till produkt. |
| 0:08 | Titel och beskrivning klistras in. |
| 0:15 | Skrolla till fraktsektionen. |
| 0:20 | **Kryssrutan för fysisk vara bockas ur.** Håll kvar två sekunder. |
| 0:28 | Lagerspårning av. |
| 0:35 | Priset sätts. |
| 0:40 | Sparas som **utkast** — inte aktiv. |

**Längd** ~45 s · **Röst** nej, textruta vid 0:20
**Maska** inget känsligt i den här vyn

## B2 · Bifoga filen i leveransappen

**Modul 10, s. 47** — *Attaching the file*
**Varför klipp:** kort och konkret, och slutet är en avsiktlig utelämning som
text lätt får att låta som ett misstag.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | Appar → Digital Products. |
| 0:06 | Produkten väljs. |
| 0:12 | Filen väljs, uppladdningen rullar. |
| 0:25 | Nedladdningsgränsen sätts. |
| 0:32 | **Automatisk leverans lämnas AV.** Textruta: *slås på efter testordern, inte före.* |

**Längd** ~40 s · **Röst** nej
**Maska** filnamnet om det avslöjar något

## B3 · Testordern

**Modul 10, s. 48** — *The test order*
**Det viktigaste klippet i listan.** Testordern är det enda momentet som avgör
om en butik fungerar, och det är det moment nybörjare oftast hoppar över.
Det är också längst — ta den tiden.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | Butiken förhandsgranskas **på en telefon**. |
| 0:10 | Produkten läggs i varukorgen. |
| 0:18 | Kassan. **Ingen leveransadress efterfrågas.** Håll kvar, textruta. |
| 0:28 | **Ingen fraktmetod att välja.** Håll kvar. |
| 0:35 | Betalningen genomförs. |
| 0:45 | Admin: ordern finns, betalstatus syns. |
| 0:55 | Fullföljningen skedde automatiskt. |
| 1:05 | **Byt till en annan enhet.** Öppna mejlet där. |
| 1:20 | Nedladdningslänken klickas. |
| 1:35 | PDF:en öppnas, bläddra två sidor. |
| 1:50 | Tillbaka: testläget stängs av. |

**Längd** ~2 min · **Röst** ja — det här är klippet där berättarrösten gör nytta
**Maska** köparens e-post, ordernumret, kortuppgifter. Använd en slaskadress.

## B4 · Koppla butiken och verifiera köp-eventet

**Modul 17, s. 90** — *Connecting the store*
**Varför klipp:** kursen säger att eventet ska avfyras *exakt en gång*. Att se
det hända i testverktyget är skillnaden mellan att tro och att veta.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | Admin: försäljningskanalen installeras, utgivaren kontrolleras. |
| 0:10 | Portfölj, sida, annonskonto och pixel väljs — ett i taget. |
| 0:25 | **Den gamla manuella pixeln tas bort.** Textruta: *annars räknas varje köp två gånger.* |
| 0:35 | Events Manager öppnas, testverktyget startas. |
| 0:45 | Testköpet körs. |
| 0:55 | **Purchase avfyras — en gång — med rätt värde och valuta.** Håll kvar. |

**Längd** ~70 s · **Röst** ja
**Maska** pixel-ID, annonskonto-ID, företagsnamn

## B5 · Bygga den första kampanjen

**Modul 17, s. 92** — *The first campaign*
**Varför klipp:** bokens längsta procedur, tolv steg, där varje steg är ett val
och inte en knapptryckning.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | Create → **Sales**. |
| 0:15 | Konverteringsplats: webbplatsen. Rätt pixel väljs. |
| 0:25 | Purchase som optimeringshändelse. |
| 0:35 | Kampanjen namnges enligt standarden. |
| 0:45 | **En annonsgrupp, inte fem.** Textruta: *en liten budget delad på många lär sig ingenting.* |
| 1:00 | Land, språk, åldersgräns. |
| 1:10 | Placeringar. |
| 1:20 | Tre till fem kreativer laddas upp — **olika hooks**, inte färgvarianter. |
| 1:40 | Text, rubrik, CTA, slut-URL med spårningsparametrar. |
| 1:55 | Förhandsgranskning över placeringar. |

**Längd** ~2 min · **Röst** nej — använd textrutor, eftersom menynamnen ändras
**Maska** annonskonto, betalningsmetod, budgetsiffror om du vill

> **Publicera inte kampanjen i inspelningen.** Klipp innan den går live, annars
> kostar klippet pengar varje gång du spelar in det.

## B6 · Bildarbetsflödet

**Modul 15, s. 78** — *The workflow that produces usable images*
**Varför klipp:** nio steg där ordningen är hela poängen, och där det vanligaste
felet — att be om bilder direkt — är lätt att visa och svårt att beskriva.

| Tid | Vad som syns |
| --- | --- |
| 0:00 | En ny konversation, briefen klistras in. |
| 0:10 | **Sex koncept begärs — i ord.** Inga bilder än. |
| 0:25 | Ett koncept väljs, en bildprompt begärs. |
| 0:35 | Basbilden genereras — **utan text i bilden**. |
| 0:50 | En riktad redigering: mer tomyta upptill. |
| 1:05 | Tre varianter, en faktor ändrad i varje. |
| 1:20 | Rubriken läggs på i ett designverktyg. Textruta: *text sist, där du styr stavningen.* |

**Längd** ~90 s · **Röst** nej
**Maska** kontouppgifter om de syns

---

## Hur klippen kommer in i kursen

PDF kan tekniskt bädda in video, men stödet är opålitligt — det fungerar i Acrobat
och går sönder i de flesta läsare och på mobil. Det duger inte för en fil som
levereras via mejl.

I stället får varje klipp **en länk i marginalen** vid det moment den hör till,
med en kort etikett och en synlig URL så att den fungerar även utskriven.

Du väljer värd. Olistad YouTube är enklast och gratis; Shopify Files håller allt
på ett ställe men saknar uppspelare. Skicka listan med URL:er när klippen är
inspelade, så bygger jag komponenten och lägger in dem i version 1.1.

## Om du bara hinner spela in tre

**B3, A1, B1** — i den ordningen. Testordern är det enda som avgör om en butik
fungerar. Installationen är det första stället en nybörjare fastnar. Och den
utelämnade kryssrutan är det dyraste enskilda misstaget i hela kursen.
