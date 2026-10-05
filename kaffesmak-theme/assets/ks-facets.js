/* KaffeSmak – filter och sortering på kategorisidor och sökresultat.
   Formuläret är ett vanligt GET-formulär som fungerar utan JavaScript (knapparna "Visa produkter" och "Sortera"
   ligger i <noscript>). Det här skriptet förbättrar det:
   - skickar formuläret direkt när en kryssruta ändras eller sorteringen väljs med mus/pekskärm,
   - med tangentbordet laddas sidan inte om för varje piltryck: sorteringen och prisfälten skickas med Enter
     eller när fokus lämnar fältet (prisfälten: när fokus lämnar båda fälten),
   - sätter tillbaka fokus på samma fält efter omladdningen och läser upp antalet produkter (role="status"),
   - tar bort tomma fält ur adressen,
   - visar "Visa alla…" när en filtergrupp har fler än fem val,
   - håller filterpanelen öppen på dator och stängd på mobil (öppen igen efter ett val på mobil). */
(function () {
  'use strict';

  var DESKTOP = '(min-width: 990px)';
  var KEEP_OPEN_KEY = 'ks-facets-open';
  var FOCUS_KEY = 'ks-facets-focus';

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

  function isValueField(el) {
    return !!el && !!el.name && (el.tagName === 'SELECT' || (el.hasAttribute && el.hasAttribute('data-ks-price')));
  }

  // Skiljer sig fältet från sidans värde (det som står i HTML:en)?
  function isChanged(el) {
    if (el.tagName === 'SELECT') {
      var def = 0;
      for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].defaultSelected) { def = i; break; }
      }
      return el.selectedIndex !== def;
    }
    return String(el.value).trim() !== String(el.defaultValue).trim();
  }

  // Efter omladdningen: fokus tillbaka på fältet som ändrades, och antalet produkter läses upp.
  function restoreFocus(form) {
    var saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(FOCUS_KEY) || 'null');
      sessionStorage.removeItem(FOCUS_KEY);
    } catch (e) {}
    if (!saved || saved.path !== window.location.pathname) return;

    var target = saved.id ? document.getElementById(saved.id) : null;
    if (!target || !form.contains(target) || target.name !== saved.name || (target.type === 'checkbox' && target.value !== saved.value)) {
      target = null;
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!target && el.name === saved.name && el.type !== 'hidden' && (el.type !== 'checkbox' || el.value === saved.value)) target = el;
      });
    }
    if (target) target.focus();
    if (!target || document.activeElement !== target) {
      // Fältet syns inte (t.ex. stängd filterpanel på mobil): fokus på knappen "Filtrera".
      var toggle = form.querySelector('.ks-facets__toggle');
      if (toggle && toggle.offsetParent !== null) toggle.focus();
    }

    var count = form.querySelector('.ks-toolbar__count');
    if (count && !count.querySelector('a')) {
      var live = document.createElement('p');
      live.className = 'ks-visually-hidden';
      live.setAttribute('role', 'status');
      form.appendChild(live);
      window.setTimeout(function () {
        live.textContent = count.textContent.replace(/\s+/g, ' ').trim();
      }, 500);
    }
  }

  function setupForm(form) {
    if (form.dataset.ksFacetsReady) return;
    form.dataset.ksFacetsReady = 'true';

    var facets = form.querySelector('[data-ks-facets]');
    var drawer = form.querySelector('[data-ks-facets-drawer]');
    var submitting = false;
    var keyboard = false; // senaste ändringen i sorteringen eller prisfälten gjordes med tangentbordet

    if (facets) {
      facets.classList.add('ks-facets--js');
      Array.prototype.forEach.call(facets.querySelectorAll('[data-ks-more]'), setupMore);
    }

    function dirty() {
      return Array.prototype.some.call(form.elements, function (el) {
        return isValueField(el) && isChanged(el);
      });
    }

    function go(source) {
      if (submitting) return;
      submitting = true;

      // Kom ihåg att panelen var öppen på mobil, så att den är öppen även efter omladdningen.
      if (drawer && drawer.open && !isDesktop()) {
        try { sessionStorage.setItem(KEEP_OPEN_KEY, '1'); } catch (e) {}
      }
      // Kom ihåg fältet, så att fokus kan sättas tillbaka efter omladdningen.
      if (source && source.name && form.contains(source)) {
        try {
          sessionStorage.setItem(FOCUS_KEY, JSON.stringify({
            id: source.id || '',
            name: source.name,
            value: source.type === 'checkbox' ? source.value : '',
            path: new URL(form.getAttribute('action'), window.location.href).pathname
          }));
        } catch (e) {}
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
      go(document.activeElement);
    });

    // Mus/pekskärm eller tangentbord? Piltangenterna ändrar sorteringen och prisfälten direkt (och utlöser change),
    // så med tangentbordet skickas formuläret först med Enter eller när fokus lämnar fältet.
    form.addEventListener('pointerdown', function () {
      keyboard = false;
    });
    form.addEventListener('keydown', function (event) {
      var t = event.target;
      if (!isValueField(t)) return;
      keyboard = true;
      if (event.key === 'Enter' && dirty()) {
        event.preventDefault();
        go(t);
      }
    });

    form.addEventListener('change', function (event) {
      var t = event.target;
      if (!t || !t.name) return;
      if (t.type === 'checkbox') go(t);
      else if (t.tagName === 'SELECT' && !keyboard) go(t);
      // Prisfälten skickas med Enter eller när fokus lämnar dem (nedan).
    });

    form.addEventListener('focusout', function (event) {
      var t = event.target;
      if (!isValueField(t)) return;
      // Fönstret tappade fokus (annan flik eller app): vänta tills besökaren lämnar fältet på riktigt.
      if (!document.hasFocus()) return;
      // Från "Från" till "Till": vänta tills fokus lämnar båda prisfälten.
      var next = event.relatedTarget;
      if (next && form.contains(next) && t.hasAttribute('data-ks-price') && next.hasAttribute('data-ks-price')) return;
      if (dirty()) go(t);
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

    restoreFocus(form);

    // Tillbaka från webbläsarens cache (bakåtknappen): ta bort laddningsläget och visa sidans egna val igen.
    window.addEventListener('pageshow', function (event) {
      submitting = false;
      keyboard = false;
      form.classList.remove('is-loading');
      if (event.persisted) form.reset();
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
