# Tegefjällsvägen 79 — 3D-rundtur

En interaktiv 3D-modell av lägenheten [Tegefjällsvägen 79, lgh A, Tegefjäll, Åre kommun](https://www.hemnet.se/bostad/lagenhet-4rum-tegefjall-are-kommun-tegefjallsvagen-79,-lgh-a-21668279) (Hemnet #21668279), byggd med [Three.js](https://threejs.org/). Du navigerar med **WASD** och tittar runt med musen, precis som i ett förstapersonsspel.

## Kör lokalt

```bash
npm install
npm run dev
```

Öppna adressen som Vite skriver ut (`http://localhost:5173`), klicka på panelen för att låsa muspekaren, och gå runt:

| Tangent | Funktion |
| --- | --- |
| `W A S D` / piltangenter | Gå |
| Mus | Vrid dig om / titta runt |
| `Shift` | Spring |
| `M` | Visa/dölj planlösning (minikarta) |
| `Esc` | Pausa / lämna muslåset |

`npm run build` bygger en fristående produktionsversion i `dist/`.

## Om datakällan

hemnet.se och booli.se är blockerade av nätverkspolicyn i den sandlåda den här sessionen körs i (`EGRESS_BLOCKED`), så annonsens bilder gick inte att hämta direkt via länken. Layouten, materialen och möbleringen i den här modellen är istället byggda utifrån **den riktiga planritningen och samtliga annonsbilder**, som klistrades in direkt i konversationen och analyserades bild för bild.

Det som är hämtat direkt från planritningen:

- Rummens inbördes placering: **Sovrum 1–3** ligger i rad längs norrfasaden och öppnar var för sig rakt ut mot **Allrum** — ingen separat hall/korridor finns.
- **Allrum** och **Kök** är en sammanhängande öppen yta (bekräftat av bildtexten "Kök och allrum i öppen planlösning").
- **Entré** möter Allrum vid en öppen tröskel (streckad linje på ritningen, dvs. ingen dörr).
- **Bastu** nås inifrån **Badrum**, inte direkt utifrån.
- Rummens ungefärliga proportioner, skalade mot annonsens uppgivna 57 m² boarea (ritningen saknar utsatta mått, så exakta siffror är en rimlig skalning, inte en uppmätning).

Det som är hämtat från fotona (stil, material, möblering):

- Brädtak i ljus furu genomgående i hela lägenheten.
- Träpanelvägg (liggande, honungsbrun) på väggen mellan sovrummen och Allrum, med vita dörrar, TV och korslagda skidor monterade på den.
- Grått kök i en rak rad med vitt kakel, rostfria vitvaror och öppna trähyllor.
- Hörnsoffa, rund matbord med vita korsryggstolar, och två rentaljuskronor i Allrum/matplats.
- Helkaklat badrum (vitt kakel, grått klinker) med dusch, tvättmaskin och en glasdörr in till bastun.
- Sovrum 1 (störst) med dubbelsäng, träpanelvägg med skidor och rådjurshornstavla; Sovrum 2 och 3 med enkelsängar, rutiga gardiner och djurmotiv på väggarna.
- Entré med bänk, klädkrokar, förvaringsfack och en dörr rakt ut mot snön.

Det som fortfarande är rimliga antaganden (annonsen ger inga exakta mått eller kompassriktningar):

- Exakta väggmått, takhöjd och dörrbredder.
- Fönstrens exakta placering på fasaderna (annonstexten nämner en söderbalkong; den stora utsiktsfönstret sitter i den här modellen på Allrums västvägg, i linje med fönstermarkeringen på ritningen).

Se `src/data/floorplan.js` för den fullständiga planlösningsdatan och kommentaren högst upp i filen.

## Struktur

```
src/
  data/floorplan.js  Rums-/vägg-/dörr-/fönsterdata (källan till sanningen för layouten)
  apartment.js       Bygger golv, tak, väggar, fönster och dörröppningar från floorplan.js
  furniture.js        Möbler per rum (kök, hörnsoffa, sängar, bastu, etc.), utifrån bilderna
  sky.js               Himmel, fjällsiluetter, snö och skog utanför fönstren
  controls.js         Förstapersonskontroller: WASD + muslås + kollision mot väggar
  textures.js          Procedurellt genererade texturer (trägolv, brädtak, timmerpanel, kakel, ...)
  main.js              Sätter ihop scenen, belysning, HUD och spelloop
```

## Tekniska val

- **Kollision**: spelaren är en cirkel (radie 0,24 m) som testas mot väggarnas axelparallella boxar; dörröppningar och den öppna tröskeln mellan Allrum/Kök/Entré lämnar medvetet luckor i kollisionslistan, medan fönster (som har en solid bröstning) blockerar.
- **Rörelse**: världsrymdens rörelseriktning härleds direkt från kamerans egen quaternion (inte handskriven trigonometri), så att WASD alltid matchar tittriktningen; diagonal rörelse är hastighetsbegränsad så att den inte blir snabbare än att gå rakt fram.
- **Belysning**: ett lågt solljus genom Allrums västfönster plus varma taklampor i badrum/entré/bastu (rummen utan egna fönster), för att hålla antalet realtidsljus lågt utan att rum blir mörka.
