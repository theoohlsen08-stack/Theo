/* KaffeSmak – etapp 4: produktsida (sections/ks-product.liquid).
   Progressiv förbättring: sidan fungerar utan JavaScript (formuläret skickas till /cart/add,
   miniatyrer och förstoring är vanliga bildlänkar, alla flikar visas under varandra).
   Här: bildbyte och förstoring i dialogruta, variantbyte (pris, artikelnummer, lager, knapp och ?variant=
   i adressen), antalsväljare samt flikar (dator/surfplatta) och dragspel (mobil, högst 749 px).
   Länken "Läs fullständig beskrivning" väljer fliken Beskrivning (eller öppnar dragspelet). */
(function () {
  'use strict';

  var MOBILE = '(max-width: 749px)';

  /* ---------- Galleri ---------- */
  function initGallery(root) {
    var gallery = root.querySelector('[data-ks-gallery]');
    if (!gallery) return null;
    var mainImg = gallery.querySelector('[data-ks-main-img]');
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('[data-ks-thumb]'));
    var zoomLinks = gallery.querySelectorAll('[data-ks-zoom]');
    var dialog = gallery.querySelector('[data-ks-lightbox]');
    var current = parseInt(gallery.getAttribute('data-start'), 10) || 0;
    var opener = null;

    function item(i) {
      var t = thumbs[i];
      if (t) {
        return {
          src: t.getAttribute('data-src'),
          srcset: t.getAttribute('data-srcset'),
          full: t.getAttribute('data-full'),
          alt: t.getAttribute('data-alt') || '',
          width: t.getAttribute('data-width'),
          height: t.getAttribute('data-height')
        };
      }
      return mainImg
        ? { src: mainImg.getAttribute('src'), srcset: mainImg.getAttribute('srcset'), full: zoomLinks[0] && zoomLinks[0].getAttribute('href'), alt: mainImg.getAttribute('alt') || '' }
        : null;
    }

    function show(i) {
      if (!thumbs.length || !mainImg) return;
      if (i < 0) i = thumbs.length - 1;
      if (i >= thumbs.length) i = 0;
      current = i;
      var it = item(i);
      mainImg.setAttribute('src', it.src);
      if (it.srcset) mainImg.setAttribute('srcset', it.srcset);
      mainImg.setAttribute('alt', it.alt);
      if (it.width) mainImg.setAttribute('width', it.width);
      if (it.height) mainImg.setAttribute('height', it.height);
      for (var z = 0; z < zoomLinks.length; z++) zoomLinks[z].setAttribute('href', it.full);
      thumbs.forEach(function (t, n) {
        if (n === i) t.setAttribute('aria-current', 'true');
        else t.removeAttribute('aria-current');
      });
      if (dialog && dialog.open) fillDialog();
    }

    thumbs.forEach(function (t, n) {
      t.setAttribute('role', 'button');
      t.addEventListener('click', function (e) {
        e.preventDefault();
        show(n);
      });
      t.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          show(n);
        }
      });
    });

    function fillDialog() {
      var img = dialog.querySelector('[data-ks-lightbox-img]');
      var count = dialog.querySelector('[data-ks-lightbox-count]');
      var it = item(current);
      if (!it) return;
      img.setAttribute('src', it.full || it.src);
      img.setAttribute('alt', it.alt);
      if (it.width) img.setAttribute('width', it.width);
      if (it.height) img.setAttribute('height', it.height);
      if (count) count.textContent = 'Bild ' + (current + 1) + ' av ' + thumbs.length;
    }

    if (dialog && typeof dialog.showModal === 'function') {
      for (var z = 0; z < zoomLinks.length; z++) {
        zoomLinks[z].addEventListener('click', function (e) {
          e.preventDefault();
          opener = e.currentTarget.getAttribute('tabindex') === '-1' ? gallery.querySelector('.ks-gallery__zoom [data-ks-zoom]') : e.currentTarget;
          fillDialog();
          dialog.showModal();
          var close = dialog.querySelector('[data-ks-lightbox-close]');
          if (close) close.focus();
        });
      }
      var closeBtn = dialog.querySelector('[data-ks-lightbox-close]');
      if (closeBtn) closeBtn.addEventListener('click', function () { dialog.close(); });
      var prev = dialog.querySelector('[data-ks-lightbox-prev]');
      var next = dialog.querySelector('[data-ks-lightbox-next]');
      if (prev) prev.addEventListener('click', function () { show(current - 1); });
      if (next) next.addEventListener('click', function () { show(current + 1); });
      dialog.addEventListener('keydown', function (e) {
        if (!thumbs.length) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
      });
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog || e.target.classList.contains('ks-lightbox__inner') || e.target.classList.contains('ks-lightbox__figure')) dialog.close();
      });
      dialog.addEventListener('close', function () {
        if (opener && typeof opener.focus === 'function') opener.focus();
      });
    }

    return {
      showMedia: function (mediaId) {
        if (!mediaId) return;
        for (var n = 0; n < thumbs.length; n++) {
          if (thumbs[n].getAttribute('data-media-id') === String(mediaId)) { show(n); return; }
        }
      }
    };
  }

  /* ---------- Varianter ---------- */
  function initVariants(root, gallery) {
    var select = root.querySelector('[data-ks-variant-select]');
    var json = root.querySelector('[data-ks-variants]');
    if (!select || !json) return;
    var variants;
    try { variants = JSON.parse(json.textContent); } catch (e) { return; }
    var byId = {};
    variants.forEach(function (v) { byId[String(v.id)] = v; });

    // Utan JavaScript är slutsålda varianter inaktiva i listan. Här blir de valbara igen (med pris över 0 kr),
    // så att lagerraden och den inaktiva knappen "Slut i lager" kan visas. Varianter utan pris förblir inaktiva.
    Array.prototype.forEach.call(select.options, function (o) {
      var ov = byId[o.value];
      if (o.disabled && ov && ov.price > 0) o.disabled = false;
    });

    var priceRow = root.querySelector('[data-ks-price-row]');
    var price = root.querySelector('[data-ks-price]');
    var taxNote = root.querySelector('[data-ks-tax-note]');
    var unitPrice = root.querySelector('[data-ks-unit-price]');
    var skuLine = root.querySelector('[data-ks-sku]');
    var skuValue = root.querySelector('[data-ks-sku-value]');
    var stockRow = root.querySelector('[data-ks-stock-row]');
    var stock = root.querySelector('[data-ks-stock]');
    var buyRows = root.querySelectorAll('[data-ks-buy-row]');
    var form = root.querySelector('form.ks-product__form');
    var button = form ? form.querySelector('.ks-product__buy-button') : null;
    var live = root.querySelector('[data-ks-live]');
    var review = !!root.querySelector('.ks-product__review-note');
    var buyText = root.getAttribute('data-buy-label') || 'Köp';

    function update() {
      var v = byId[select.value];
      if (!v) return;
      var hasPrice = v.price > 0;

      if (price && !review) {
        price.innerHTML = v.priceHtml || '';
        if (priceRow) priceRow.hidden = !hasPrice;
      } else if (price && review) {
        price.innerHTML = v.priceHtml || '<span class="ks-product__price-missing">Inget pris angivet ännu</span>';
      }
      if (taxNote) taxNote.hidden = !hasPrice;
      if (unitPrice) {
        unitPrice.innerHTML = hasPrice ? v.unitPriceHtml || '' : '';
        unitPrice.hidden = !(hasPrice && v.unitPriceHtml);
      }

      if (skuLine && skuValue) {
        skuValue.textContent = v.sku || '';
        skuLine.hidden = !v.sku;
      }

      if (stockRow && stock) {
        stockRow.hidden = !v.stock;
        stock.textContent = v.stock === 'in' ? 'I lager' : v.stock === 'out' ? 'Slut i lager' : '';
        stock.classList.toggle('ks-stock--in', v.stock === 'in');
        stock.classList.toggle('ks-stock--out', v.stock !== 'in');
      }

      if (form) {
        for (var i = 0; i < buyRows.length; i++) buyRows[i].hidden = !hasPrice;
        if (button) {
          var label = button.querySelector('.ks-button__label');
          button.disabled = !v.available;
          if (v.available) {
            button.removeAttribute('aria-disabled');
            button.classList.remove('ks-button--disabled');
            button.classList.add('ks-button--green');
            label.textContent = buyText;
          } else {
            button.setAttribute('aria-disabled', 'true');
            button.classList.add('ks-button--disabled');
            button.classList.remove('ks-button--green');
            label.textContent = 'Slut i lager';
          }
        }
      }

      if (gallery && v.mediaId) gallery.showMedia(v.mediaId);

      try {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', v.id);
        window.history.replaceState(window.history.state, '', url.toString());
      } catch (e) { /* ignoreras */ }

      if (live) {
        var opt = select.options[select.selectedIndex];
        var spoken = price ? price.querySelector('.ks-visually-hidden') : null;
        var msg = (opt ? opt.textContent.trim() : '') + (hasPrice && spoken ? '. ' + spoken.textContent.trim() : '');
        if (stock && v.stock) msg += '. ' + stock.textContent;
        live.textContent = msg;
      }
    }

    select.addEventListener('change', update);
  }

  /* ---------- Antal ---------- */
  function initQty(root) {
    var boxes = root.querySelectorAll('[data-ks-qty]');
    Array.prototype.forEach.call(boxes, function (box) {
      var input = box.querySelector('input');
      var minus = box.querySelector('[data-ks-qty-minus]');
      var plus = box.querySelector('[data-ks-qty-plus]');
      if (!input || !minus || !plus) return;
      minus.hidden = false;
      plus.hidden = false;
      if (input.disabled) return;
      function val() { var n = parseInt(input.value, 10); return isNaN(n) || n < 1 ? 1 : n; }
      function sync() { minus.disabled = val() <= 1; }
      minus.addEventListener('click', function () { input.value = Math.max(1, val() - 1); sync(); });
      plus.addEventListener('click', function () { input.value = val() + 1; sync(); });
      input.addEventListener('change', function () { input.value = val(); sync(); });
      sync();
    });
  }

  /* ---------- Flikar och dragspel ---------- */
  var CHEVRON = '<svg class="ks-tabs__chevron" viewBox="0 0 14 9" aria-hidden="true" focusable="false"><path d="M1 1.5l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  function initTabs(root) {
    var box = root.querySelector('[data-ks-tabs]');
    if (!box) return;
    var list = box.querySelector('[data-ks-tablist]');
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[data-ks-tab]'));
    var panels = Array.prototype.slice.call(box.querySelectorAll('[data-ks-panel]'));
    if (!list || !tabs.length || tabs.length !== panels.length) return;
    var selected = 0;
    var mode = '';

    function select(i, focus) {
      selected = i;
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
        panels[n].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }

    function toTabs() {
      mode = 'tabs';
      box.classList.add('ks-tabs--tabs');
      box.classList.remove('ks-tabs--accordion');
      list.hidden = false;
      panels.forEach(function (p, n) {
        var h = p.querySelector('[data-ks-heading]');
        var body = p.querySelector('[data-ks-body]');
        h.textContent = h.getAttribute('data-label');
        body.hidden = false;
        p.setAttribute('role', 'tabpanel');
        p.setAttribute('aria-labelledby', tabs[n].id);
        p.setAttribute('tabindex', '0');
      });
      select(selected, false);
    }

    function toAccordion() {
      mode = 'accordion';
      box.classList.add('ks-tabs--accordion');
      box.classList.remove('ks-tabs--tabs');
      list.hidden = true;
      panels.forEach(function (p, n) {
        var h = p.querySelector('[data-ks-heading]');
        var body = p.querySelector('[data-ks-body]');
        p.hidden = false;
        p.removeAttribute('role');
        p.removeAttribute('tabindex');
        p.setAttribute('aria-labelledby', h.id);
        var open = n === selected;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ks-tabs__toggle';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.setAttribute('aria-controls', body.id);
        btn.innerHTML = '<span></span>' + CHEVRON;
        btn.firstChild.textContent = h.getAttribute('data-label');
        btn.addEventListener('click', function () {
          var isOpen = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
          body.hidden = isOpen;
          if (!isOpen) selected = n;
        });
        h.textContent = '';
        h.appendChild(btn);
        body.hidden = !open;
      });
    }

    tabs.forEach(function (t, n) {
      t.addEventListener('click', function () { select(n, false); });
      t.addEventListener('keydown', function (e) {
        var k = e.key;
        var to = null;
        if (k === 'ArrowRight' || k === 'Right') to = (n + 1) % tabs.length;
        else if (k === 'ArrowLeft' || k === 'Left') to = (n - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') to = 0;
        else if (k === 'End') to = tabs.length - 1;
        if (to !== null) { e.preventDefault(); select(to, true); }
      });
    });

    // Länken "Läs fullständig beskrivning" (och andra länkar till en panel): välj fliken eller öppna dragspelet.
    var showLinks = root.querySelectorAll('a[data-ks-show-panel]');
    Array.prototype.forEach.call(showLinks, function (a) {
      a.addEventListener('click', function (e) {
        var id = (a.getAttribute('href') || '').replace(/^#/, '');
        var n = -1;
        panels.forEach(function (p, i) { if (p.id === id) n = i; });
        if (n < 0) return;
        e.preventDefault();
        if (mode === 'tabs') {
          select(n, false);
          box.scrollIntoView({ block: 'start' });
          tabs[n].focus({ preventScroll: true });
        } else {
          var btn = panels[n].querySelector('.ks-tabs__toggle');
          if (btn && btn.getAttribute('aria-expanded') !== 'true') btn.click();
          panels[n].scrollIntoView({ block: 'start' });
          if (btn) btn.focus({ preventScroll: true });
        }
      });
    });

    var mq = window.matchMedia ? window.matchMedia(MOBILE) : null;
    function apply() {
      var want = mq && mq.matches ? 'accordion' : 'tabs';
      if (want === mode) return;
      if (want === 'accordion') toAccordion(); else toTabs();
    }
    apply();
    if (mq) {
      if (mq.addEventListener) mq.addEventListener('change', apply);
      else if (mq.addListener) mq.addListener(apply);
    }
  }

  function init(root) {
    if (!root || root.hasAttribute('data-ks-ready')) return;
    root.setAttribute('data-ks-ready', '');
    var gallery = initGallery(root);
    initVariants(root, gallery);
    initQty(root);
    initTabs(root);
  }

  function initAll(scope) {
    var roots = (scope || document).querySelectorAll('[data-ks-product]');
    for (var i = 0; i < roots.length; i++) init(roots[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
})();
