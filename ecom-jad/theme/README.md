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

## Texter på startsidan

Innehållet i `templates/index.json`, `sections/header-group.json` och
`sections/footer-group.json` är **autogenererat av temaredigeraren** — Shopify skriver om
filerna när någon redigerar en sektion, så de sparas inte som kopior här. Det som är värt
att kunna slå upp är vad som byttes:

| Var | Garderob No.2 | Ecom Jad |
| --- | --- | --- |
| Meddelandefält | Garderob No.2 Stockholm | The Jad Method — in your inbox in seconds |
| Huvudbild, överrubrik | DROP LIVE NOW!! | NOT DROPSHIPPING *(cyan)* |
| Huvudbild, rubrik | Garderob No.2 | The Jad Method |
| Infobox 1 | Fri frakt med 1–2 dagars leverans i Sverige! | Delivered by email in seconds |
| Infobox 2 | Köp 2 par – få en överaskning på köpet! | No inventory. No supplier. Nothing to ship. |
| Produktsektion | Nudie Jeans | The Jad Method |
| Produktsektion, knapp | View all | Read more |
| Sidfot, rubrik | Gå med i våra nyhetsbrev | Get the method first |
| Sidfot, text | Få exklusiva deals och tidig åtkomst till produkter | Updates to the method and new material, straight to your inbox. |

Allt är på engelska, som landningssidan — butiken säljer i USD till en global TikTok-publik.

Meddelandefältet och huvudbilden länkar nu till `/pages/the-jad-method`. Sidfotens
sociala ikoner är nedskalade till enbart TikTok, och nyhetsbrevsknappen är cyan.

**Kvar:** huvudbildens bakgrund är fortfarande fotot på jeansen
(`shopify://shop_images/ChatGPT_Image_23_aug._2026_22_31_02.png`). Den byts under Innehåll →
Filer, eller genereras ny.
