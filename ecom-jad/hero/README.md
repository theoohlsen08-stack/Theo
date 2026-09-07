# Hero-bilden

`ecom-jad-hero.png` (2560×1097) renderas ur `hero.html` med headless Chromium — ingen
bildgenerering, inga licensfrågor, och färgerna är exakt temats egna hexvärden i stället för
"ungefär rätt blått".

```bash
/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
  --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=2560,1097 --virtual-time-budget=6000 \
  --screenshot=ecom-jad-hero.png "file://$PWD/hero.html"
```

Vill du ändra något — kurvans form, hur långt panelen är vriden, hur mörkt det är till
vänster — så ligger allt i `hero.html`. Kör kommandot igen så kommer en ny PNG ut.

## Två avsiktliga val

**Vänstra halvan är tom.** Huvudbilden lägger rubriken "The Jad Method" ovanpå, och en bild med
motiv över hela ytan gör rubriken oläslig. Mörkerskalan (`.scrim`) tonar dessutom ner vänsterkanten
ytterligare.

**Inga siffror på instrumentpanelen.** KPI-korten visar staplar i stället för belopp, och
y-axeln saknar skala. En hero-bild med "$284 320 i månaden" på skärmen är ett intäktspåstående
även när det är dekor — och det är exakt den sortens påstående som fäller annonser hos Meta och
faller under otillbörlig marknadsföring. Formen säljer känslan; siffrorna behövs inte.

Bilden ligger i Shopify som `ecom-jad-hero.png`
(`gid://shopify/MediaImage/70539484823936`), refereras som
`shopify://shop_images/ecom-jad-hero.png`.
