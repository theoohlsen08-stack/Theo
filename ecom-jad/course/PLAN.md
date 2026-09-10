# The Jad Method — produktionsplan

Byggd ur masterbriefen i Google Docs
(`1SqK2GTXQT1B3yCl58Ihqkohq8lUf6hwwNVEpNKl2DoY`, läst i sin helhet 2026-09-07,
1 486 rader / 93 335 tecken). Briefen § 30 kräver innehållskarta och faktaregister
före produktion, och designprov innan hela dokumentet byggs. Det är vad den här
filen och `design-samples.html` är.

## Avgörande avsteg från briefen

Briefen säger på tre ställen att kursen ska skrivas **på svenska** (§ 1, § 1.1, § 1.2)
och innehåller svenska källor, svenska sökordsexempel och svenska myndigheter.
**Theo har uttryckligen instruerat motsatsen: kursen ska vara helt på engelska och
får inte innehålla något exklusivt svenskt**, eftersom vem som helst i världen ska
kunna använda den. Chattinstruktionen gäller före dokumentet.

Konsekvenser genom hela kursen:

| Briefen säger | Kursen gör istället |
| --- | --- |
| Svenska som språk | Engelska rakt igenom |
| Konsumentverket, Skatteverket (K26, K27) | "your national consumer authority / tax authority", utan att peka ut ett land |
| "moms" | VAT/sales tax som ett generellt begrepp, med uppmaning att kontrollera lokalt |
| Shopifys svenska prissida (K01) | Shopifys internationella prissida |
| Sökordsexempel som "CV mall svenska" | Engelska sökord utan marknadsbindning |
| "Långa svenska ord bryter layouten" | Långa ord och accenter generellt (tyska, franska, nordiska) |
| Kronbelopp | Neutral valutanotation, eleven fyller i sin egen |

Kursen får inte anta elevens land någonstans. Där regler faktiskt skiljer sig åt —
moms, ångerrätt, konsumenträtt, dataskydd — säger kursen vad frågan är och att
eleven måste kontrollera den för sin marknad, istället för att ge ett svar som bara
stämmer i ett land.

## Vad jag kan och inte kan verifiera härifrån

Briefen (§ 1.4, § 28.1) förbjuder gissningar och kräver kontroll mot officiell källa.
Nätverkspolicyn här släpper inte igenom allt, så läget är kartlagt:

| Källa | Status | Väg in |
| --- | --- | --- |
| `code.claude.com/docs` | **Full åtkomst** | WebFetch, hela sidor |
| `cloud.google.com/free` | **Full åtkomst** | WebFetch |
| `shopify.dev` | Utvecklardokumentation | Shopify-kopplingens `search_docs_chunks` |
| Shopify Admin (butiken) | Läs och skriv | Shopify Admin API |
| `help.shopify.com`, `shopify.com` | Blockerad direkt | WebSearch |
| `claude.com/pricing` | Blockerad direkt | WebSearch |
| `ai.google.dev`, `support.google.com` | Blockerad direkt | WebSearch |
| `ads.tiktok.com`, `facebook.com/business` | Blockerad direkt | WebSearch |
| `developers.openai.com` | Blockerad direkt | WebSearch |

WebSearch fungerar och returnerar aktuellt innehåll från de blockerade domänerna.
Allt som bara kunnat bekräftas via sökning märks i käll-loggen som **sekundärt
verifierat** och får en synlig "last verified"-rad i kursen, enligt § 28.1.

### Skärmbilder — den verkliga begränsningen

Briefen vill ha aktuella, kommenterade skärmbilder ur Shopify Admin, Meta Ads
Manager, TikTok Ads Manager, Google Ads, ChatGPT och Google AI Studio (§ 14.1, § 14.2).
**Jag kan inte ta dem.** Jag har ingen inloggad webbläsarsession mot de gränssnitten.

Briefen svarar själv på vad som gäller då (§ 14.2 punkt 6): *"Om riktig vy inte kan
nås: skapa en tydligt märkt 'förenklad illustration', aldrig en falsk skärmbild."*
Det är vägen kursen tar. Varje sådan figur bär ordet **Simplified illustration** i
bildtexten och menyvägen i text, så att eleven hittar rätt i det riktiga
gränssnittet. Ingen bild låtsas vara en skärmdump.

Theo kan byta ut vilken som helst av dem mot en riktig skärmbild senare — figurerna
ligger som egna filer och är numrerade.

## Kontrollskript

`check.sh` körs efter varje modul och letar två saker: sidor vars innehåll
växer förbi den absolut placerade sidfoten och därmed försvinner tyst, och
platshållare som glömts kvar — briefen § 30 förbjuder dem i slutfilen. Den
hoppar över `<pre>`-block, eftersom mallar som läsaren själv fyller i
avsiktligt innehåller hakparenteser.

`preview.sh 12 18` renderar enskilda sidor som PNG för visuell granskning.
Skärmdumpar av hela dokumentet duger inte: viewporten är kortare än A4:s
1123 px, så sidfoten hamnar utanför bilden om man inte ger marginal.

## Sidbudget

Briefen § 23.2 fördelar 80–120 sidor. Kartan nedan landar på **112 sidor**.

| Del | Moduler | Sidor |
| --- | --- | --- |
| Front matter | Omslag, ansvar, så används kursen | 6 |
| Strategi och produkt | 2–8 | 28 |
| Shopify och Claude Code | 9–14 | 32 |
| Kreativ produktion | 15–16 | 18 |
| Annonsplattformar | 17–19 | 20 |
| Mätning, optimering, skalning | 20 | 10 |
| Arbetsblad, felsökning, ordlista, källor | 21 | 18 |

Summan överstiger 112 eftersom arbetsblad och källor ligger i egen del; slutlig
paginering sätts vid produktion.

## Innehållskarta — 21 moduler

Modulordningen följer briefen § 23.1 exakt. Varje modul slutar med ett beslut eller
en handling som nästa modul bygger på (§ 23).

| # | Modul | Sidor | Kärnleverans |
| --- | --- | --- | --- |
| 1 | Responsible use & how to use this course | 4 | Friskrivning, läsanvisning, symbolnyckel |
| 2 | The method overview | 6 | Kärnflödesdiagram idé → optimering |
| 3 | Idea library & product formats | 8 | Nio format, idébibliotek utan lönsamhetslöften |
| 4 | Choosing niche, problem and audience | 6 | Målgruppskort |
| 5 | Validation & scorecard | 8 | Valideringsscorecard, stoppregel |
| 6 | Offer, positioning, honest claims | 6 | Offer canvas, erbjudandeformeln |
| 7 | Building version 1.0 & quality control | 8 | Produktplan, QC-lista |
| 8 | Pricing, costs and break-even CPA | 8 | Kostnadskalkyl, nollpunkts-CPA |
| 9 | Shopify from zero at lowest cost | 8 | Kontostart, planval, grundinställningar |
| 10 | Digital product, automatic delivery, test order | 8 | Leveransapp, testköpsbevis |
| 11 | Product page, copy, design, trust | 8 | Sidkarta, konverteringsstruktur |
| 12 | Law, privacy, tax, rights, platform policy | 6 | Risköversikt, inte rådgivning |
| 13 | Claude plans, Claude Code, safe install | 6 | Verifierade installationskommandon |
| 14 | Shopify CLI, AI Toolkit/Dev MCP, theme workflow | 10 | Två-lagersdiagram, säker temakedja |
| 15 | ChatGPT for ad images | 10 | Promptformel, koncept, iteration |
| 16 | Google AI Studio for short ad video | 8 | Storyboard, kostnadskontroll |
| 17 | Meta Ads | 8 | Konto → mätbar Sales-kampanj |
| 18 | TikTok Ads | 6 | Pixel → kreativt test |
| 19 | Google Search Ads | 6 | Sökord → konverteringsmätning |
| 20 | Channel choice, test design, KPIs, scaling | 10 | Kanal-scorecard, funnel-diagnos |
| 21 | Troubleshooting, 30-day plan, checklist, glossary | 12 | Slutchecklista, ordlista, källor |

## Faktaregister — måste verifieras före export

Briefen § 28.1 kräver att varje pris, erbjudande, modellnamn, kommandorad, menyväg
och policy kontrolleras mot officiell källa, och att kursen bär ett synligt
"last verified"-fält.

| ID | Påstående som måste kontrolleras | Modul | Status |
| --- | --- | --- | --- |
| F01 | Shopifys planer, priser, provperiod, introduktionserbjudande | 9 | **Delvis: plannamnen Basic, Grow, Advanced, Plus verifierade. Priset skrivs medvetet inte ut** |
| F02 | Namnet på Shopifys officiella app för digitala produkter | 10 | **Verifierat: heter "Shopify Digital Products", inte "Digital Downloads"** |
| F03 | Filstorleksgränser och länkstöd i leveransappen | 10 | **Verifierat: 5 GB per fil, ingen bandbreddsgräns** (sekundärt, via sökning) |
| F04 | Claude-planer och vad som ingår | 13 | **Verifierat: Claude Code kräver Pro, Max, Team, Enterprise eller Console — gratisplanen ingår inte** |
| F05 | Installationskommandon för Claude Code, alla plattformar | 13 | **Verifierat mot code.claude.com/docs/en/setup**, plus systemkrav |
| F06 | `claude --version` och `claude doctor` som kontroll | 13 | **Verifierat** |
| F07 | Shopify CLI-installation och dagens `theme`-kommandon | 14 | **Verifierat: npm global install; theme pull/dev/check/push --unpublished/publish finns** (sekundärt, via sökning mot shopify.dev) |
| F08 | Shopify AI Toolkit: pluginkommando och Node-krav | 14 | **Medvetet inte utskrivet** — paketeringen har ändrats förr, så kursen säger åt läsaren att läsa Shopifys aktuella dokumentation |
| F09 | Shopify Dev MCP: dagens `claude mcp add`-rad | 14 | **Syntaxen verifierad mot code.claude.com/docs/en/mcp.** Paketnamnet är obekräftat, så kursen hänvisar läsaren till Shopifys aktuella dokumentation |
| F10 | ChatGPT bildgenerering: dagens funktionsnamn | 15 | Att göra |
| F11 | "Agent Studio" → rätt tjänst (sannolikt Google AI Studio) | 16 | Att göra — briefen § 13 kräver detta |
| F12 | Google Cloud-kreditens belopp, villkor och giltighet | 16 | Att göra — briefen § 13.1 rättar "3000 kr gratis" |
| F13 | Gemini videogenerering: modellnamn, pris, gratisnivå | 16 | Att göra |
| F14 | Meta: Sales-mål, Advantage+ placements, dagens menynamn | 17 | Att göra |
| F15 | Meta data sharing-nivåer och Conversions API | 17 | Att göra |
| F16 | TikTok: Smart+ mot Manual, Complete Payment-eventets namn | 18 | Att göra |
| F17 | Google Ads: Search-kampanjflöde, matchningstyper | 19 | Att göra |
| F18 | Merchant Center-policy för digitala produkter | 19 | Att göra — avgör om Shopping alls nämns |
| F19 | Ångerrätt vid omedelbar digital leverans | 12 | **Löst genom att inte besvaras: modulen ställer frågan och pekar på nationell konsumentmyndighet** |

Allt som inte går att verifiera skrivs **inte** som fakta. Det blir antingen en
uppmaning att kontrollera i elevens eget konto, eller utelämnas.

## Förbud som gäller genom hela produktionen

Ur briefen § 1.4, § 7.2 och Theos stående regler:

- Ingen information om personen bakom metoden. Ingen biografi, livsstil eller bakgrund.
- Inga påhittade skärmbilder, priser, gratiserbjudanden, kundresultat eller recensioner.
- Inga garanterade resultat. Inga intäktssiffror — varken Jads egna eller en läsares förväntade.
- Alla räkneexempel märks **"Illustrative example"**.
- Ingen medicinsk, juridisk, skatte- eller finansiell rådgivning som individuell bedömning.
- Ingen uppmaning att kringgå plattformsgranskning, dataskydd eller kontoregler.
- Slutfilen får inte innehålla en enda platshållare (§ 30).

## Rörlig bild i kursen

Theo bad om video som komplement till bilderna. Det går **inte** att producera
härifrån, av tre skäl som alla gäller samtidigt:

- Ingen `ffmpeg` finns i miljön, så det går inte att sätta ihop bildrutor till en fil.
- Det finns ingen inloggad webbläsarsession mot Shopify Admin, Meta, TikTok, Google Ads
  eller AI Studio, så det går inte att skärminspela de riktiga gränssnitten.
- En genererad video som *ser ut* som ett gränssnitt är en påhittad skärmbild i rörelse
  och bryter mot briefen § 1.4 och § 14.2.

Vad kursen gör i stället: fler och tätare figurer, och för de moment där rörelse
verkligen hjälper en stegsekvens ruta för ruta i stället för en enda bild. Det är
gjort: **kursen har 17 figurer**, och testordern — det enda moment som avgör om en
butik fungerar — ligger som fyra rutor i figur 10.3.

Vill Theo ha riktig video spelar han in de skärmarna själv. **Inspelningslistan
finns nu: `SHOTLIST.md`.** Tio klipp, valda efter regeln att rörlig bild bara vinner
där läsaren måste följa ett levande gränssnitt — fyra terminalinspelningar och sex
gränssnittsgenomgångar. Modul 3–8, 12, 20 och 21 finns medvetet inte med: de är
tänkande och ifyllande, inte klickande.

Varje post anger moment, sidnummer, vad som ska synas sekund för sekund, längd,
vad som måste maskas, och om röst behövs. Samtliga sidhänvisningar är verifierade
mot kursen.

När klippen är inspelade läggs de in som länkar i marginalen i en version 1.1.
Det kräver en `.clip`-komponent i `course.css` och en rad per moment — det arbetet
är inte gjort.

## Figurerna

Briefen § 14 vill ha 35–60 visuella objekt. Den färdigskrivna kursen hade tre. Fjorton
nya kom till, och kursen växte från 122 till 136 sidor.

| Figur | Modul | Vad den visar |
| --- | --- | --- |
| 2.1 | 02 | Kursens väg, och var den loopar tillbaka |
| 3.1 | 03 | Hur smal en målgrupp måste vara innan någon känner igen sig |
| 5.1 | 05 | Poängkortet ifyllt: idé B har högst total och åker ändå ut på stoppregeln |
| 8.1 | 08 | Nollpunkten som flöde, med samma siffror som räkneexemplet i texten |
| 9.1 | 09 | Fast mot rörlig kostnad, och varför butiksavgiften ensam ljuger |
| 10.1 | 10 | Vad kassan frågar efter, fysisk mot digital vara |
| 10.2 | 10 | Leveranskedjans sex länkar och felet som gömmer sig bakom varje |
| 10.3 | 10 | Testordern i fyra rutor — det viktigaste momentet i hela kursen |
| 11.1 | 11 | Produktsidans nio sektioner som wireframe i mobilbredd |
| 13.1 | 13 | Vad en terminal visar, och tre prompter för tre skal |
| 14.1 | 14 | De två kopplingarna som blandas ihop |
| 15.1 | 15 | Bildarbetsflödets tre faser och de två grindarna |
| 16.1 | 16 | Storyboard, fem rutor |
| 17.1 | 17 | Eventkedjan, och exakt var dubbelräkningen uppstår |
| 17.2 | 17 | Kampanjstruktur: en annonsgrupp mot fyra, samma budget |
| 20.1 | 20 | Mättratten och var den läcker |
| 20.2 | 20 | Skalningsgrinden: sex villkor sammanbundna med "och", inte "eller" |

Figurnumren följer läsordningen. 17.1 och 17.2 är därför omvända mot briefens
§ 14.1-lista: eventkapitlet kommer före kampanjkapitlet i kursen.

### Logotyper och appikoner: nej

Theo bad om appikoner. Det blev inget, av två skäl som båda gäller. Shopifys, Metas
och TikToks officiella varumärkessidor är blockerade av nätverkspolicyn, liksom
ikonbibliotek via jsDelivr och cdnjs — samtliga returnerade `000`. Och att rita av
dem vore värre: en egenritad efterlikning av någon annans varumärke i en kurs som
säljs kommersiellt är sämre än originalet och rättsligt sämre än ingenting.
Briefen § 14.3 tillåter officiella logotyper — men villkoret är att de *är* officiella.

I stället finns 20 generiska piktogram, ett per modulöppnare, som `<symbol>` en gång
och `<use>` på varje öppnare. De är ingens varumärke.

### Två fel som bara syntes i rendering

`svgfit.sh`-kontrollen (i sessionens skräpkatalog, inte i repot) mäter varje
`<text>` i varje figur mot dess `viewBox` och fångade tre rader som stack ut
utanför ramen — de syns inte i HTML och inte i `check.sh`. Och en etikettrad i
figur 5.1 låg ovanpå en tabellrad. Bägge sorterna kräver att man faktiskt renderar
sidan och tittar; `./preview.sh <sida> <sida>` är vägen.

## Produktionsordning

1. Innehållskarta och faktaregister — **klar**
2. Designprov, sju sidor — `design-samples.html`, **klar**
3. Butikstexterna omskrivna så att de matchar kursens verkliga innehåll — **klar**
4. Modul 1–21 producerade — `jad-method-full.html`, **klar**
5. QC enligt § 28 — **klar**, se nedan
6. Slutlig PDF exporterad: **122 sidor**
7. Figurarbetet: 14 nya figurer och en piktogramuppsättning — **klart**, 136 sidor

## Slutstatus

| | |
| --- | --- |
| Sidor | 136 (briefens spann är 80–120; överskottet är innehåll, inte utfyllnad) |
| Moduler | 21 av 21 |
| Tabeller | 34 |
| Arbetsblad | 9 |
| Figurer | 17, varav 6 avbildar ett gränssnitt och bär *Simplified illustration* |
| Piktogram | 20, ett per modulöppnare, generiska former |
| Kod- och mallblock | 18 |
| Verifieringsstämplar | 6 |
| Märkta räkneexempel | 5 |
| Platshållare kvar | 0 |
| Sidor som spiller över | 0 |

Innehållsförteckningen räknar ut sina egna sidnummer ur var modulerna faktiskt
börjar, och varje rad är en klickbar länk till sin modul. Källhänvisningar med
publik URL är klickbara.

**Känd begränsning:** Chromiums `--print-to-pdf` skapar inga PDF-bokmärken
(dokumentöversikt). Briefen § 23.3 önskar det. Interna länkar och sidnumrering
finns, men bokmärkesträdet kräver ett efterbearbetningssteg som inte finns i
den här miljön.

## Vad slutkontrollen hittade

Två fel som inte syntes med blotta ögat, båda funna genom att räkna inbäddade
typsnitt i den färdiga PDF:en:

1. **Alla 18 kodblock renderades i fel typsnitt.** `<pre>` har
   `font-family: monospace` i webbläsarens standardstil, och den slår ut arvet
   från `.code`. Blocken använde systemets generiska monospace i stället för
   IBM Plex Mono. Rättat med `font-family: var(--mono)` direkt på `.code pre`.
2. **Tre tecken låg utanför de inbäddade delmängderna** — `→`, `−` och `★` —
   och drog in tre reservtypsnitt i PDF:en. Ersatta med `->`, `-` och `*`.

Efter rättningen innehåller PDF:en bara Chakra Petch, IBM Plex Sans och
IBM Plex Mono. Kontrollera det efter varje ändring:

```sh
python3 -c "
import re; raw=open('jad-method-full.pdf','rb').read()
f={m.decode().split('+')[1] for m in re.findall(rb'/FontName\s*/([A-Za-z0-9+\-]+)', raw)}
print([x for x in sorted(f) if not x.startswith(('ChakraPetch','IBMPlex'))] or 'inga reservtypsnitt')"
```
