# KaffeSmak – Monteriva-design (utkast)

Ändrade och nya filer i Shopify-temat "KaffeSmak – Monteriva-design (utkast)"
(opublicerad kopia av butikens Horizon-tema, tema-ID 199382237528 i butiken kaffesmak.se).
Resten av temat är oförändrat Horizon och ligger kvar i Shopify.

Etapp 1:

- `sections/ks-header.liquid`, `assets/ks-header.js`: svart sidhuvud med logga, sökfält,
  konto, varukorg och grön Kontakt-knapp, röd huvudmeny med mörkröda undermenyer som öppnas
  vid klick (hover kompletterar på dator), tangentbordsstyrning och mobilmeny.
  Menyn läses från Shopify-menyn `monteriva-utkast-huvudmeny` (separat från livebutikens meny).
- `sections/ks-hero.liquid`, `sections/ks-info-band.liquid`, `sections/ks-intro.liquid`:
  startsidans bildbanner, guldbruna infoband och beige introduktion.
- `assets/ks-theme.css`: gemensam formgivning (färger och typsnitt enligt underlaget).
- `sections/header-group.json`, `templates/index.json`, `config/settings_data.json`:
  utkasttemats inställningar (sidhuvud, startsidans ordning, typsnitten Noto Sans, Jost och
  Barlow Condensed ur Shopifys typsnittsbibliotek).

Temat publiceras inte utan Theos uttryckliga instruktion.

## Etapp 2 (startsida och sidfot)

- `sections/ks-category-cards.liquid` – kategorikort; kort för kategorier utan produkter döljs.
- `sections/ks-product-row.liquid` – produktrad/karusell från en kategori; döljs när kategorin är tom.
- `sections/ks-reviews.liquid` – Google-recensioner; visas först när "Recensionerna är verifierade" är ikryssat och verkliga recensioner (eller en recensionsapp) finns.
- `sections/ks-info-cards.liquid`, `sections/ks-contact-cards.liquid` – informations- och kontaktkort.
- `sections/ks-footer.liquid` – mörk sidfot med företagsuppgifter, meny "monteriva-utkast-sidfot", sociala länkar och policysidor.
- `snippets/ks-button.liquid`, `snippets/ks-icon.liquid`, `assets/ks-carousel.js` – gemensamma delar.

## Etapp 3 (sidmallar, förberedda startsidessektioner och katalog)

- `sections/ks-product-row.liquid` – knappen på produktkorten heter "Visa produkt" (inställningen "Knapptext på produktkort") eftersom den öppnar produktsidan.
- `sections/ks-contact-page.liquid`, `templates/page.contact.json` – kontaktsida på svenska med samma formgivning som startsidan: röd H1, kontaktformulär (Namn, E-post, Telefon, Företag, Meddelande) med grön knapp "Skicka meddelande" och beige kort med verifierade kontaktuppgifter. Öppettider, momsregistreringsnummer och karta visas först när de fyllts i.
- `sections/ks-article-cards.liquid` – kunskapskort från bloggen "Nyheter"; döljs tills bloggen har artiklar.
- `sections/ks-testimonials.liquid` – kundomdömen från företag och caféer; visas först när "Omdömena är verkliga och godkända" är ikryssat och minst ett citat med namn finns.
- `templates/index.json` – två guidekort (sektionen "KaffeSmak infokort", dold tills korten har rubrik) efter kategorikorten och kundomdömen efter tillbehörsraden, i referensens ordning.
- `templates/product.json` – i etapp 3 fick Horizons produktrekommendationer en svensk rubrik. Mallen ersattes i etapp 4 av en enda `ks-product`-sektion (se nedan).
- `sections/footer-group.json`, `sections/ks-footer.liquid`, `snippets/ks-icon.liquid` – e-postadressen i sidfoten med kuvertikon.

Katalogen (69 källänkar, ordagranna tillverkartexter och provimporten av tre utkastprodukter) dokumenteras i projektets mapp `etapp-3/`, inte i temat.

## Etapp 4 (kategori, sök, produkt, varukorg och sidor)

Egna ks-sektioner ersätter Horizons butikssektioner på undersidorna. Allt visar bara verkliga uppgifter: pris bara när
det är större än 0 kr, artikelnummer bara när varianten har SKU och lagerstatus bara när lagret spåras och produkten har pris.

Gemensamt:

- `assets/ks-shop.css` – gemensam grund för undersidorna: grått titelband, brödsmulor, tom ruta, inaktiv knapp,
  kontrollfält, antalsväljare, pris med upphöjda ören, lagerfärger, produktrutnät och sidnumrering.
- `assets/ks-theme.css` – nya färger (länkröd, lagergrön, grått band, kontrollfält), sökförslagen och regler för
  tvingade färger (fokuskontur och vanliga kryssrutor i t.ex. Windows kontrastteman). Sidfoten länkar filen en gång till
  efter `ks-shop.css`, så att dess regler vinner över lika specifika regler i `ks-shop.css`.
- `snippets/ks-product-card.liquid` – produktkort för rutnät: bild, röd titel, artikelnummer | lagerstatus, pris och
  knappen "Visa produkt". "I lager" kräver spårat saldo över 0.
- `snippets/ks-price.liquid` – pris som "120,⁰⁰ kr" med hela beloppet i klartext för skärmläsare.
- `snippets/ks-breadcrumb.liquid` – brödsmulor "Hem › …".
- `snippets/ks-button.liquid` – nya parametrar: `tag: 'button'` (med `button_type`, `name`, `form_id`) ger en `<button>`,
  och `disabled: true` ger referensens gråa, inaktiva knapp. En inaktiv knapp utan `tag` blir en
  `<button type="button" disabled>` utan name, form och länk.
- `sections/ks-header.liquid`, `assets/ks-header.js`, `sections/ks-predictive-search.liquid` – sökfältet skickar
  `type=product` (bara produkter i sökresultatet). Efter minst två tecken visas Shopifys sökförslag under fältet
  (bild, produktnamn, artikelnummer när det finns och produkttyp, inget pris). Pil upp/ned väljer, Enter öppnar valt
  förslag (annars sökresultatsidan) och Escape stänger. Shopify föreslår bara publicerade produkter.
- `snippets/meta-tags.liquid` – kopia av Horizons fil där `og:price:amount` och `og:price:currency` bara skrivs när
  produktens pris är större än 0 kr (annars hamnar "0,00" i sidhuvudet för delning i sociala medier).
- `config/settings_data.json` – `cart_type` är `page`: varukorgsikonen öppnar varukorgssidan i stället för Horizons låda.

Kategorier och sök:

- `sections/ks-collection.liquid`, `templates/collection.json` – kategorisida med grått titelband, Shopifys filter
  i vänsterspalten, antal, sortering, rutnät och sidnumrering. Tom kategori visar en lugn tom ruta.
- `templates/list-collections.json` – samma sektion visar översikten över kategorierna på `/collections`.
- `sections/ks-search.liquid`, `templates/search.json` – sökresultat ("Sökte efter: …") med samma filter och rutnät,
  egen ruta för inga träffar och tom sökning.
- `snippets/ks-facets.liquid`, `snippets/ks-pagination.liquid`, `assets/ks-collection.css`, `assets/ks-facets.js` –
  filter (filterpanel på mobil), aktiva filter, sortering och sidnumrering.

Produktsidan:

- `sections/ks-product.liquid`, `snippets/ks-product-gallery.liquid`, `snippets/ks-product-buy.liquid`,
  `snippets/ks-product-tabs.liquid`, `assets/ks-product.css`, `assets/ks-product.js` – galleri med förstoring,
  köpruta, flikar (Beskrivning med tillverkarens text ordagrant, Specifikationer och Reservdelar när verkliga
  uppgifter finns) och fler produkter i samma kategori.
- Inställningen "Försäljning" (`sales_mode`): `none` (varken köp eller offert), `buy` (köpformulär till varukorgen),
  `quote` ("Begär offert" länkar till `/pages/contact?produkt=<produktnamn>`) eller `both`. Köpknappen visas bara när
  priset är större än 0 kr. I standardmallen får produkttyperna i "Produkttyper utan köp i standardmallen"
  (Espressomaskin, Kaffekvarn) varken köp eller offert.
- `review_preview` (granskningsläge) visar de förberedda köp- och offertalternativen som inaktiva knappar med en
  förklarande ruta. Inget kan läggas i varukorgen eller skickas.
- Mallar: `templates/product.json` (`buy`, används av de fyra aktiva kaffeprodukterna), `templates/product.maskin.json`
  (`none`, förberedd maskinmall) och `templates/product.maskin-granskning.json` (`both` med granskningsläge; granskas
  via `?view=maskin-granskning` och ska inte tilldelas produkter).
- `sections/ks-contact-page.liquid` – `?produkt=` fyller i ett tomt meddelandefält med produktnamnet (som text).

Varukorg och sidor:

- `sections/ks-cart.liquid`, `assets/ks-cart.css`, `assets/ks-cart.js`, `templates/cart.json` – varukorgssida på
  svenska med Shopifys kassa. Tom varukorg visar den grå rutan, "Fortsätt handla" och en inaktiv kassaknapp.
- `sections/ks-page.liquid`, `assets/ks-pages.css` – enkel sida med valfri banner, text, faktaruta och knappar.
- `templates/page.om-oss.json` – Om oss med verifierade företagsuppgifter. Sidan Om oss finns inte i Shopify ännu,
  så mallen granskas via `/pages/contact?view=om-oss`.
- `templates/404.json` – "Sidan hittades inte" med länkar till startsidan och produkterna.

## Etapp 5 (slutgranskning)

Justeringar efter genomgången mot Monteriva-referenserna. Inga köp- eller offertalternativ är aktiverade och inget
innehåll är påhittat.

Navigering och brödsmulor:

- `sections/ks-header.liquid`, `snippets/ks-nav-children.liquid`, `snippets/ks-nav-current.liquid` – dator- och
  mobilmenyn bygger undermenyn med samma regler: tomma länkar och `#`, länkar till opublicerade kategorier, produkter
  och sidor och (med inställningen "Dölj undermenylänkar som går till samma sida som huvudlänken", på i
  `sections/header-group.json`) platshållare till huvudpunktens egen sida visas inte. En huvudpunkt utan undermeny blir
  en vanlig länk, och en huvudpunkt utan både undermeny och länk visas inte. Aktuell sida markeras på högst en rad, och
  länkar med `?view=` (Om oss på `/pages/contact?view=om-oss`) markeras bara när den vyn visas.
- `sections/ks-product.liquid`, `snippets/ks-breadcrumb.liquid` – produktsidans brödsmulor följer menyn i
  "Meny för brödsmulor" ("Hem › Kaffemaskiner › Espressomaskiner" som referensen) och slutar med kategorin.
  Samma kategori används för "Tillbaka till översikt" och "Fler produkter i samma kategori".
- `sections/ks-collection.liquid`, `templates/collection.json` – brödsmulor med överkategori från menyn, rubriken
  "Alla produkter" för `/collections/all` och kategorirutor som använder första produktens bild när kategorin saknar
  egen bild (utan bild en grå yta, platshållarteckningen bara i temaredigeraren).

Sidor:

- `sections/ks-page.liquid`, `templates/page.om-oss.json`, `assets/ks-pages.css` – nya block "Bild och text" och
  "Bildgalleri" för kundens historia och foton. Tomma block visas inte för besökare. Sidans eget innehåll visas bara
  när sidan själv använder mallen (inte via `?view=`). Sidan Om oss finns i Shopify som opublicerad sida
  `/pages/om-oss` med mallen `page.om-oss`.
- `templates/page.json` – standardmallen för sidor använder `ks-page` (rubrik = sidans titel, text = sidans innehåll).
- `sections/ks-article.liquid`, `templates/article.json` – bloggartikel i samma formgivning som Om oss (bloggen har
  inga artiklar ännu).
- `assets/ks-theme.css` – Shopifys policysidor (`/policies/…`) får centrerad röd H1, en textkolumn på 850 px och
  röda underrubriker som Om oss.
- `snippets/meta-tags.liquid` – sidtitlar på svenska för taggade kategorier och sidnummer.

Övrigt:

- `sections/ks-product-row.liquid`, `assets/ks-theme.css` – startsidans produktrad visar priset som kategorisidan
  ("120,⁰⁰ kr"); prisreglerna ligger nu i `ks-theme.css`.
- `assets/ks-theme.css` – fyra produktkort ryms på surfplatta (768 px), större tryckytor i infobandet på mobil och
  aktuell sida i mobilmenyn.
- `assets/ks-shop.css` – titelbandets nederkant och brödsmulornas sista länk som referensen.
- `templates/index.json` – YouTube-kortet säger bara det som är verifierat: "Vår kanal på YouTube heter @Adamkaffe."
- Horizons `templates/password.json` lämnas orörd (ingen egen lösenordssida).
