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

Butiken ska sälja **The Jad Method**, en kurs om att tjäna pengar. Innehåll, omfattning och pris
är ännu inte bestämda.

Kvar att göra: domänen är fortfarande `garderobno2.com` och kontakt-e-posten
`info.garderobno2@gmail.com` (Theo fixar båda själv); temat är kvar i klädbutiksskick.

Butiksnamnet går **inte** att ändra via Admin-API:t — det finns ingen `shopUpdate`-mutation,
`Shop` är i praktiken skrivskyddat. Namnet byts för hand i Inställningar → Butiksuppgifter.

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
