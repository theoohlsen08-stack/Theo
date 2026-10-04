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
- `templates/product.json` – rubriken för produktrekommendationer på svenska ("Du kanske också gillar").
- `sections/footer-group.json`, `sections/ks-footer.liquid`, `snippets/ks-icon.liquid` – e-postadressen i sidfoten med kuvertikon.

Katalogen (69 källänkar, ordagranna tillverkartexter och provimporten av tre utkastprodukter) dokumenteras i projektets mapp `etapp-3/`, inte i temat.
