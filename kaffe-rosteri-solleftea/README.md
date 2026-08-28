# Rosteri & Smak — kafferosteri i Sollefteå

En helt fristående webbplats för det påhittade kafferosteriet och caféet **Rosteri & Smak** i Sollefteå. Byggd som ett vanligt statiskt HTML/CSS/JS-projekt i en enda fil — ingen Shopify, inga byggverktyg, inga externa tjänster eller kopplingar.

## Visa sidan

Öppna `index.html` direkt i en webbläsare, eller kör en enkel lokal server från den här mappen:

```bash
npx serve .
```

## Design

Sidan är byggd som ett uppslag ur rosteriets egen rostlogg: linjerat papper, stämpelkant på knappar, och en riktig rostkurva (temperatur mot tid, med "första sprickan" markerad) som hero-bild istället för ett stockfoto. Varje ursprung i rosteriet har ett satsnummer och en rostgrad-mätare, som i en riktig produktionslogg. Ljust/mörkt läge följer besökarens systeminställning.

## Sidans innehåll

- **Hem** — rubrik, kort pitch och rostkurvan som hero-grafik
- **Om oss** — en tidslinje över rosteriets historia
- **Rosteriet** — fyra kaffeursprung med satsnummer, rostgrad och smaknoter
- **Menyn** — kaffe & dryck, bakverk och lunch
- **Besök oss** — adress, öppettider, kontaktuppgifter och ett nyhetsbrevsformulär (demo, utan backend)

## Att tänka på

Adress, telefonnummer, öppettider och priser är exempeltext. Byt ut dem mot de riktiga uppgifterna innan sidan publiceras skarpt.
