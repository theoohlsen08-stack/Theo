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

## Viktigt om datakällan

**hemnet.se och booli.se är blockerade av nätverkspolicyn i den sandlåda den här sessionen kör i** (`EGRESS_BLOCKED`), så annonsens faktiska bilder och den riktiga planritningen gick inte att hämta direkt. Den här modellen är därför en **rekonstruktion baserad på annonsens textuppgifter**, insamlade via sökmotorträffar på annonsens innehåll — inte en skanning av den riktiga ritningen.

Uppgifter som är hämtade från annonsen (bekräftade via flera oberoende sökträffar):

- 4 rum och kök, 57 m² boarea, våning 1 av 3, ingen hiss
- 3 sovrum — ett större och två mindre
- Öppen planlösning kök/vardagsrum med stora fönster mot fjällvärlden
- Helkaklat badrum med bastu
- Parkettgolv och golvvärme i hela lägenheten
- Södervänd balkong/uteplats med fjällutsikt
- Ski-in/ski-out — Gunnilbacken direkt bakom huset
- Byggår 2017, avgift 3 672 kr/mån, pris 3 300 000 kr

Det som **inte** kunde verifieras (och som är rimliga antaganden, inte fakta ur annonsen):

- Rummens exakta form, mått och inbördes placering
- Möblering, färgval, material och exakta fönsterplaceringar
- Exakt takhöjd, dörrbredder och husets exakta fasadutseende

Se `src/data/floorplan.js` för den fullständiga planlösningsdatan och kommentaren högst upp i filen. Om du har tillgång till de riktiga bilderna eller planritningen (t.ex. genom att öppna annonsen själv och beskriva den, eller klistra in bilderna) går layouten enkelt att korrigera i den filen.

## Struktur

```
src/
  data/floorplan.js  Rums-/vägg-/dörr-/fönsterdata (källan till sanningen för layouten)
  apartment.js       Bygger golv, tak, väggar, fönster och dörröppningar från floorplan.js
  furniture.js        Möbler per rum (kök, sängar, våningssäng, bastu, etc.)
  sky.js               Himmel, fjällsiluetter, snö och skog utanför fönstren
  controls.js         Förstapersonskontroller: WASD + muslås + kollision mot väggar
  textures.js          Procedurellt genererade texturer (parkett, kakel, bastupanel, ...)
  main.js              Sätter ihop scenen, belysning, HUD och spelloop
```

## Tekniska val

- **Kollision**: spelaren är en cirkel (radie 0,28 m) som testas mot väggarnas axelparallella boxar; dörröppningar lämnar medvetet luckor i kollisionslistan så att man kan gå igenom dem, medan fönster (som har en solid bröstning) blockerar.
- **Rörelse**: dämpad acceleration mot målhastighet ger mjuk start/stopp, med rörelsen upplöst axel för axel så att man glider längs väggar istället för att fastna.
- **Belysning**: ett lågt "solljus" från söder genom balkongfönstren plus varma taklampor i varje rum, så att alla utrymmen är läsbara oavsett solvinkel.
