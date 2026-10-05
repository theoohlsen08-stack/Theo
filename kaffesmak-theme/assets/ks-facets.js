/* KaffeSmak – filter och sortering på kategorisidor och sökresultat.
   Formuläret är ett vanligt GET-formulär som fungerar utan JavaScript (knapparna "Visa produkter" och "Sortera"
   ligger i <noscript>). Det här skriptet förbättrar det:
   - skickar formuläret direkt när en kryssruta eller sorteringen ändras (prisfälten efter en kort paus),
   - tar bort tomma fält ur adressen,
   - visar "Visa alla…" när en filtergrupp har fler än fem val,
   - håller filterpanelen öppen på dator och stängd på mobil (öppen igen efter ett val på mobil). */
(function () {
  'use strict';

  var DESKTOP = '(min-width: 990px)';
  var KEEP_OPEN_KEY = 'ks-facets-open';

  function isDesktop() {
    return !!(window.matchMedia && window.matchMedia(DESKTOP).matches);
  }

  function setupMore(button) {
    var list = document.getElementById(button.getAttribute('aria-controls'));
    if (!list) return;
    var label = button.textContent.trim();
    var expanded = false;

    function render() {
      list.classList.toggle('is-expanded', expanded);
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      button.textContent = expanded ? 'Visa färre' : label;
    }

    // Visa alla direkt om ett dolt val redan är markerat.
    expanded = !!list.querySelector('.ks-facet__item--extra input:checked');
    button.hidden = false;
    render();
    button.addEventListener('click', function () {
      expanded = !expanded;
      render();
      if (expanded) {
        var first = list.querySelector('.ks-facet__item--extra input');
        if (first) first.focus();
      }
    });
  }

  function setupForm(form) {
    if (form.dataset.ksFacetsReady) return;
    form.dataset.ksFacetsReady = 'true';

    var facets = form.querySelector('[data-ks-facets]');
    var drawer = form.querySelector('[data-ks-facets-drawer]');
    var timer = null;
    var submitting = false;

    if (facets) {
      facets.classList.add('ks-facets--js');
      Array.prototype.forEach.call(facets.querySelectorAll('[data-ks-more]'), setupMore);
    }

    function go() {
      if (submitting) return;
      submitting = true;
      window.clearTimeout(timer);

      // Kom ihåg att panelen var öppen på mobil, så att den är öppen även efter omladdningen.
      if (drawer && drawer.open && !isDesktop()) {
        try { sessionStorage.setItem(KEEP_OPEN_KEY, '1'); } catch (e) {}
      }

      var params = new URLSearchParams();
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.disabled) return;
        if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
        if (el.type === 'submit' || el.type === 'button') return;
        var value = String(el.value).trim();
        if (value === '') return;
        if (el.hasAttribute('data-ks-price')) {
          var n = Math.max(0, Math.round(Number(value.replace(',', '.'))));
          if (!isFinite(n)) return;
          value = String(n);
        }
        params.append(el.name, value);
      });

      form.classList.add('is-loading');
      var query = params.toString();
      window.location.assign(form.getAttribute('action') + (query ? '?' + query : ''));
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      go();
    });

    form.addEventListener('change', function (event) {
      var t = event.target;
      if (!t || !t.name) return;
      if (t.type === 'checkbox' || t.tagName === 'SELECT' || t.hasAttribute('data-ks-price')) go();
    });

    form.addEventListener('input', function (event) {
      var t = event.target;
      if (!t || !t.hasAttribute('data-ks-price')) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(go, 1200);
    });

    // Filterpanelen: alltid öppen på dator (knappen "Filtrera" syns bara på surfplatta och mobil).
    if (drawer && window.matchMedia) {
      var mq = window.matchMedia(DESKTOP);
      var sync = function () {
        if (mq.matches) drawer.open = true;
      };
      sync();
      if (mq.addEventListener) mq.addEventListener('change', sync);
      else if (mq.addListener) mq.addListener(sync);
    }

    // Tillbaka från webbläsarens cache (bakåtknappen): ta bort laddningsläget.
    window.addEventListener('pageshow', function () {
      submitting = false;
      form.classList.remove('is-loading');
    });
  }

  function init(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('[data-ks-facets-form]'), setupForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }
  // Temaredigeraren laddar om sektioner utan att ladda om sidan.
  document.addEventListener('shopify:section:load', function (event) { init(event.target); });
})();
