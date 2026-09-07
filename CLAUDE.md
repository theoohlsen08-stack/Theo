# Arbetskontext för det här repot

## Språk

Theo skriver svenska — svara på svenska. Commit-meddelanden följer språket som redan
används på grenen (roten och `shopify-admin/` är på engelska, `shopify-pages/` på svenska).

## Vad repot är

Ett personligt verkstadsrepo, inte en applikation. Flera helt fristående delprojekt bor
sida vid sida, vart och ett i sin egen mapp utan gemensam byggkedja. `package.json` och
Vite-uppsättningen i roten hör **bara** till 3D-rundturen — övriga delprojekt är
beroendefria och öppnas direkt i webbläsaren.

Nya projekt lever ofta kvar på sin egen gren utan att merges. Kolla `git branch -r` innan
du antar att något saknas.

| Delprojekt | Var | Gren |
| --- | --- | --- |
| 3D-rundtur av lägenhet i Åre (Three.js, WASD) | `src/`, `index.html` | `main` |
| Shopify Admin-klon med redigerbar mockdata | `shopify-admin/` | `main` |
| Landningssida + produktbeskrivning för nack- & axelmassage | `shopify-pages/` | `claude/kneadwell-futarax-website-scxjzl` |
| Webbplats för kafé/rosteri i Sollefteå | `kaffe-rosteri-solleftea/` | `claude/kaffe-rosteri-webbplats-ared26` |
| Ecom Jad (persona + Shopify-butik) | — (inget material i repot ännu) | `claude/ecom-jad-project-guwknl` |
| Garderob No.2 (andrahandskläder) | — | **nedlagt 2026-09-07**, butiken återanvänd till Ecom Jad |

## Ecom Jad

En **påhittad** TikTok-livsstilspersona byggd kring e-handelsframgång. Startad omkring
2026-08-19. Arbetet är innehållsproduktion — bild, video, visuell identitet — inte kod,
och inget av materialet ligger i repot ännu.

**Visuell identitet:** blackad 2025 Corvette C8 och 2025 Audi R8, svartvita "Ecom Jad"-skyltar,
Chrome Hearts-kläder, svarta jeans, LV-sneakers. Miljöer: Marbella, Laguna Beach, Dubai.

**Berättelse:** "two years earlier at McDonald's" som bakgrundshistoria.

**Konsistenskrav mellan alla bilder och videor** — det här är där det brukar gå fel:

- Registreringsskyltarna ska vara identiska överallt
- Audi R8:ans vinggeometri ska vara korrekt
- Tonade rutor
- Jads ansikte och identitet oförändrade genom hela materialet

Flera videor och bilder är levererade, tekniska fel rättade, resultatet godkänt.

Personan är fiktiv och ska framställas som en persona — inte som en verklig person eller
ett verkligt företag, och inte med påhittade intäktssiffror som utges för att vara äkta.
Det gäller särskilt butiken: så fort riktiga kunder betalar blir bakgrundshistorien och
livsstilsbilderna säljargument, och då måste de hållas som varumärke snarare än som bevis.

### Butiken

Shopify-butiken **Ecom Jad** (`xjqe0v-kr.myshopify.com`) är den tidigare andrahandsklädbutiken
Garderob No.2, återanvänd. Nudie Jeans-projektet är nedlagt: den 2026-09-07 raderades samtliga
17 produkter och kollektionerna `Jeans` och `Tröjor & Huvtröjor` permanent. Kvar finns Shopifys
tomma standardobjekt — kollektionen `Home page` (`frontpage`, som temat kräver), sidan `Contact`,
bloggen `News` och en integritetspolicy.

#### The Jad Method

Butikens enda produkt: en digital kurs i e-handel, **$9.90 USD**, engångsköp. Levereras som en
fil (PDF eller presentation) automatiskt via mejl direkt efter köp. Positionering: *inte*
dropshipping — helt digitalt, inget lager, ingen produkt, mycket lägre startkapital.
Kursens faktiska innehåll är ännu inte skrivet.

- Produkt `gid://shopify/Product/15936421462400`, variant `…/ProductVariant/58879923749248`,
  SKU `JAD-METHOD-01`. Status **DRAFT** tills mejlleveransen fungerar.
- Tre produktbilder (1600×2000) är inlagda, renderade ur `ecom-jad/product/product-images.html`
  på samma sätt som hero-bilden. Omslaget är huvudbild.
- `requiresShipping: false` och `tracked: false` är satta — utan det kräver kassan
  leveransadress och fraktpris, vilket bryter ett digitalt köp.
- Landningssida: `/pages/the-jad-method`, `gid://shopify/Page/715405164928`. Källan ligger i
  `ecom-jad/landing-page.html`; Shopify-versionen är samma sida med all CSS scopad till
  `#jad-lp` (annars läcker stilarna ut i temat) och Google Fonts via `@import` (Shopify
  strippar `<link>` i sidinnehåll).
- Recensionssektionen renderas från listan `JAD_REVIEWS` högst upp i sidans skript. Den är
  avsiktligt tom. **Fyll den aldrig med påhittade omdömen** — falska recensioner står på
  svarta listan i direktivet om otillbörliga affärsmetoder och är förbjudna i svensk
  marknadsföringslag. Riktiga omdömen kommer via en recensionsapp, t.ex. Judge.me.

#### Temat

Butiken kör Shopifys **Horizon** (`themeStoreId` 2481), inte Dawn. Horizon härleder nästan alla
sina färger från ett enda `color_palette`-objekt i `config/settings_data.json`, så en
palettändring slår igenom i hela temat.

Temat är en kopia av klädbutikstemat med landningssidans design pålagd. Ändrade filer och en
tabell över alla utbytta texter finns i `ecom-jad/theme/` med förklaring i dess README.
Versioner: `Ecom Jad — Cyber` (`…/198272385408`, publicerat 2026-09-07) och
`Ecom Jad — Cyber v2 (texter)` (`…/198272549248`), som byter startsidans Garderob No.2- och
Nudie Jeans-texter mot Jad Method-texter.

Admin-API:t tillåter **inte** `themePublish`, och skrivningar mot det live-temat (role `MAIN`)
är blockerade. Arbetsgången är därför alltid: `themeDuplicate` → `themeFilesUpsert` mot kopian
→ Theo publicerar. Efter `themeDuplicate` är `processing: true` en stund; filer går inte att
läsa eller skriva förrän det slagit om till `false`.

Huvudbildens bild är egenbyggd, inte genererad: `ecom-jad/hero/hero.html` renderas med headless
Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome --headless --screenshot`). Det är
vägen att gå när en bild behövs — ElevenLabs-kontot är på gratisplanen och tog slut på krediter,
och Unsplash/Pexels är blockerade av nätverkspolicyn, så stockbilder går varken att hämta eller
granska härifrån.

Kvar att göra: mejlleveransen (appen Digital Downloads) är inte uppsatt; domänen är fortfarande
`garderobno2.com` och kontakt-e-posten `info.garderobno2@gmail.com` (Theo fixar båda själv).

Butiksnamnet och butiksvalutan går **inte** att ändra via Admin-API:t — det finns ingen
`shopUpdate`-mutation, `Shop` är i praktiken skrivskyddat. Båda byts för hand i Inställningar.
Valutan var SEK och är sedan 2026-09-07 **USD**; eftersom butiken redan hade 6 ordrar från
Garderob No.2-tiden var fältet låst i admin och bytet fick gå via Shopify Support.
Marknaden `Sweden` (`gid://shopify/Market/111880208768`) hade från början SEK som lokal valuta,
så svenska besökare fick ett omräknat kronpris. Den är sedan 2026-09-07 satt till `baseCurrency:
USD` med `localCurrencies: false`, så alla ser $9.90. Notera att `marketCurrencySettingsUpdate`
är utfasad — använd `marketUpdate` med `currencySettings`.

## Anslutna tjänster

- **Shopify** — kopplingen hanterar **en butik i taget**. `switch-shop` byter, men återkallar
  samtidigt åtkomsten till den föregående, så fråga Theo innan du byter. Två butiker finns:
  **Ecom Jad** (garderobno2.com, f.d. Garderob No.2) och **Kneadwell** (kneadwell.se).
  Båda Basic-plan, SEK, Sverige. Produkter, ordrar, kunder, kollektioner, analys och
  rabattkoder går att läsa och ändra.
- **Meta Ads** — kampanjer, katalog, pixel, insights.
- **ElevenLabs** — bild-, video- och röstgenerering. Det är verktyget för Ecom Jad-materialet.
- **Gmail** — läs och utkast.
- **Google Drive** — installerad men avstängd i chattarna; be Theo slå på den om den behövs.

## Minne

Claude Code-sessioner (inklusive fjärrsessioner från webben) har **ingen åtkomst till
claude.ai:s minne**. Den här filen är ersättningen — ligger det inte här, vet sessionen
inte om det. Lägg till bestående projektkontext här när den dyker upp.
