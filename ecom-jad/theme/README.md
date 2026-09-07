# Ecom Jad — temaöverlägg för Horizon

Filerna här är de enda som skiljer temat **"Ecom Jad — Cyber"**
(`gid://shopify/OnlineStoreTheme/198272385408`) från Horizon-originalet. De ligger
i repot för att ändringarna ska gå att läsa och återskapa — Shopify är källan som
gäller, den här mappen är kopian.

| Fil | Vad den gör |
| --- | --- |
| `config/settings_data.json` | Färgpaletten och formen: mörkblå grund, cyan accent, nollade hörnradier. Horizon härleder nästan alla sina färger från `color_palette`, så en ändring där slår igenom i hela temat. |
| `snippets/ecom-jad-brand.liquid` | Typsnitt (Chakra Petch / IBM Plex), avfasade knapphörn, blueprint-rutnätet och cyan-glödet. |
| `snippets/stylesheets.liquid` | Enda ändringen mot originalet är sista raden, som renderar `ecom-jad-brand`. |

## Två saker att veta om ordningen

`stylesheets` renderas **före** temats egen `color-palette`-snippet. Därför är
`body`-reglerna i brand-snippeten skrivna som `html body` — annars skriver
paletten över dem.

Färgerna kommer från `settings_data.json`, inte från brand-snippeten. Ska en färg
ändras görs det i paletten, så följer temats alla sektioner med. Brand-snippeten
bär bara typografi och form.

## Publicering

Admin-API:t tillåter inte `themePublish`, och skrivningar mot det live-temat är
blockerade. Därför är det här ett eget, opublicerat tema. Det publiceras för hand
under Butik → Teman.
