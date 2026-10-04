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
