# Produktbilder

Tre bilder på produkten `The Jad Method`, alla 1600×2000 (4:5), renderade ur
`product-images.html` med samma metod som hero-bilden. Filen har tre varianter som väljs
med en query-parameter:

```bash
for v in 1 2 3; do
  /opt/pw-browsers/chromium-1194/chrome-linux/chrome \
    --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=1600,2000 --virtual-time-budget=4000 \
    --screenshot="product-$v.png" "file://$PWD/product-images.html?v=$v"
done
```

| # | Fil | Vad den visar |
| --- | --- | --- |
| 1 | `jad-method-cover.png` | Omslaget. Titel, underrubrik, stigande kurva. Detta är produktens huvudbild. |
| 2 | `jad-method-delivery.png` | Leveransen i tre steg — kassa, mejl, kom igång. Steg 2 är markerat. |
| 3 | `jad-method-contents.png` | De fyra delarna guiden består av. |

Omslaget duger som förstasida till själva PDF:en också — rendera i A4-format i stället
(`--window-size=1240,1754`) så passar det.

## Varför inga siffror

Ingen av bilderna innehåller belopp, intäkter eller resultat. Samma resonemang som för
hero-bilden: ett påstått resultat i en produktbild är ett intäktspåstående även när det är
dekor, och det är den sortens påstående som fäller annonser hos Meta och faller under
otillbörlig marknadsföring.

## Typsnitt

Google Fonts är blockerat av nätverkspolicyn, så renderingen faller tillbaka på systemets
sans-serif i stället för Chakra Petch. Bilderna matchar därför butikens färger exakt men inte
dess rubriktypsnitt. Skillnaden är liten på den här skalan; ska den bort måste
typsnittsfilerna in i mappen och bäddas in med `@font-face`.
