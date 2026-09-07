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
| F01 | Shopifys planer, priser, provperiod, introduktionserbjudande | 9 | Att göra |
| F02 | Namnet på Shopifys officiella app för digitala produkter | 10 | **Preliminärt: heter numera "Shopify Digital Products", inte "Digital Downloads"** |
| F03 | Filstorleksgränser och länkstöd i leveransappen | 10 | Att göra |
| F04 | Claude-planer och vad som ingår | 13 | **Verifierat: Claude Code kräver Pro, Max, Team, Enterprise eller Console — gratisplanen ingår inte** |
| F05 | Installationskommandon för Claude Code, alla plattformar | 13 | **Verifierat mot code.claude.com/docs/en/setup** |
| F06 | `claude --version` och `claude doctor` som kontroll | 13 | **Verifierat** |
| F07 | Shopify CLI-installation och dagens `theme`-kommandon | 14 | Att göra |
| F08 | Shopify AI Toolkit: pluginkommando och Node-krav | 14 | Att göra |
| F09 | Shopify Dev MCP: dagens `claude mcp add`-rad | 14 | Att göra |
| F10 | ChatGPT bildgenerering: dagens funktionsnamn | 15 | Att göra |
| F11 | "Agent Studio" → rätt tjänst (sannolikt Google AI Studio) | 16 | Att göra — briefen § 13 kräver detta |
| F12 | Google Cloud-kreditens belopp, villkor och giltighet | 16 | Att göra — briefen § 13.1 rättar "3000 kr gratis" |
| F13 | Gemini videogenerering: modellnamn, pris, gratisnivå | 16 | Att göra |
| F14 | Meta: Sales-mål, Advantage+ placements, dagens menynamn | 17 | Att göra |
| F15 | Meta data sharing-nivåer och Conversions API | 17 | Att göra |
| F16 | TikTok: Smart+ mot Manual, Complete Payment-eventets namn | 18 | Att göra |
| F17 | Google Ads: Search-kampanjflöde, matchningstyper | 19 | Att göra |
| F18 | Merchant Center-policy för digitala produkter | 19 | Att göra — avgör om Shopping alls nämns |
| F19 | Ångerrätt vid omedelbar digital leverans | 12 | Att göra — måste skrivas landsneutralt |

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

## Produktionsordning

1. Innehållskarta och faktaregister — **den här filen, klar**
2. Designprov, 5 representativa sidor — `design-samples.html`, **klar**
3. Theo godkänner formen
4. Verifiera faktaregistret modul för modul, logga varje källa
5. Producera modul 1–21 i ordning, med bild- och käll-logg
6. QC enligt § 28: faktakontroll, täckning, visuell QA, platshållarsökning
7. Exportera slutlig PDF
