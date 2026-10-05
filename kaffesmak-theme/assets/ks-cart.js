/* KaffeSmak – etapp 4: varukorgssidan (sections/ks-cart.liquid).
   Progressiv förbättring: utan JavaScript ändrar besökaren antalet i fältet och trycker "Uppdatera varukorg"
   (vanlig POST till /cart med updates[]). Med JavaScript:
   - minus/plus-knapparna visas och ändrar antalet (lägst 1; en rad tas bort med "Ta bort"),
   - formuläret skickas automatiskt en kort stund efter senaste ändringen (samma POST, sidan laddas om),
     men aldrig med ett tomt fält eller antal 0: tomt fält eller 0 får tillbaka nuvarande antal när fokus lämnar fältet,
   - "Uppdatera varukorg" döljs, och Enter i antalsfältet uppdaterar direkt (0 + Enter tar uttryckligen bort raden),
   - efter omladdningen sätts fokus tillbaka på samma knapp eller fält (finns raden inte kvar: på rubriken)
     och "Varukorgen är uppdaterad." läses upp (role="status").
   Kassaknappen (name="checkout") påverkas inte: den skickar formuläret som vanligt. */
(function () {
  'use strict';

  var DELAY = 700;
  var RESTORE_KEY = 'ks-cart-restore';
  var RESTORE_MAX_AGE = 60000; // ms – ett äldre sparat läge (t.ex. en uppdatering som aldrig kom fram) används inte
  var MSG_UPDATED = 'Varukorgen är uppdaterad.';
  var MSG_REMOVED = 'Produkten är borttagen ur varukorgen.';
  var MSG_RESET = 'Antalet återställdes. Använd Ta bort för att ta bort produkten.';

  // Kom ihåg fokus och meddelandet till sidan som laddas efter uppdateringen.
  function save(el, message) {
    var state = { path: window.location.pathname, at: Date.now(), line: '', control: '', message: message };
    if (el && el.hasAttribute && el.hasAttribute('data-ks-cart-control')) {
      var row = el.closest('[data-ks-cart-key]');
      state.line = row ? row.getAttribute('data-ks-cart-key') : '';
      state.control = el.getAttribute('data-ks-cart-control');
    }
    try {
      sessionStorage.setItem(RESTORE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function forget() {
    try {
      sessionStorage.removeItem(RESTORE_KEY);
    } catch (e) {}
  }

  // Efter omladdningen: fokus tillbaka på samma knapp eller fält och meddelandet läses upp.
  function restore(root) {
    var saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(RESTORE_KEY) || 'null');
    } catch (e) {}
    forget();
    if (!saved || saved.path !== window.location.pathname || !(Date.now() - saved.at < RESTORE_MAX_AGE)) return;
    if (!/^[a-z]*$/.test(saved.control || '')) saved.control = '';

    var target = null;
    var rows = root.querySelectorAll('[data-ks-cart-key]');
    for (var i = 0; i < rows.length && saved.line; i++) {
      if (rows[i].getAttribute('data-ks-cart-key') !== saved.line) continue;
      target = saved.control ? rows[i].querySelector('[data-ks-cart-control="' + saved.control + '"]') : null;
      // Minus/plus kan vara inaktiv nu (t.ex. antal 1): fokus på antalsfältet i samma rad.
      if (!target || target.disabled || target.hidden) target = rows[i].querySelector('[data-ks-qty-input]');
    }
    if (!target) {
      // Raden finns inte kvar (borttagen) eller varukorgen är tom: fokus på rubriken.
      target = root.querySelector('.ks-cart__title');
      if (target) target.setAttribute('tabindex', '-1');
    }
    if (target) target.focus();

    var status = root.querySelector('[data-ks-cart-status]');
    if (status && saved.message) {
      window.setTimeout(function () {
        status.textContent = saved.message;
      }, 500);
    }
  }

  function init(form) {
    if (form.hasAttribute('data-ks-ready')) return;
    form.setAttribute('data-ks-ready', '');

    var timer = null;
    var submitting = false;
    var lastControl = null;
    var status = form.querySelector('[data-ks-cart-status]');
    var updateButton = form.querySelector('[data-ks-cart-update]');
    var inputs = Array.prototype.slice.call(form.querySelectorAll('[data-ks-qty-input]'));

    if (updateButton) updateButton.hidden = true;

    function setStatus(text) {
      if (status) status.textContent = text;
    }

    function submitUpdate() {
      if (submitting) return;
      submitting = true;
      clearTimeout(timer);
      var active = document.activeElement;
      save(active && form.contains(active) ? active : lastControl, MSG_UPDATED);
      setStatus('Uppdaterar varukorgen …');
      form.setAttribute('aria-busy', 'true');
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.submit();
      }
    }

    // Har något antal ändrats sedan sidan laddades (defaultValue = antalet i varukorgen)?
    function dirty() {
      return inputs.some(function (input) {
        return input.value !== input.defaultValue;
      });
    }

    // Skicka en kort stund efter senaste ändringen, men bara om något antal skiljer sig från varukorgen.
    function schedule() {
      clearTimeout(timer);
      if (dirty()) timer = setTimeout(submitUpdate, DELAY);
    }

    function clamp(input, value) {
      var min = parseInt(input.min, 10);
      var max = parseInt(input.max, 10);
      if (isNaN(value)) value = isNaN(min) ? 0 : min;
      if (!isNaN(min) && value < min) value = min;
      if (!isNaN(max) && value > max) value = max;
      return value;
    }

    function syncButtons(input) {
      var wrap = input.parentNode;
      var minus = wrap.querySelector('[data-ks-qty-step="-1"]');
      var plus = wrap.querySelector('[data-ks-qty-step="1"]');
      var value = parseInt(input.value, 10) || 0;
      var min = parseInt(input.min, 10);
      var max = parseInt(input.max, 10);
      if (minus) minus.disabled = !isNaN(min) && value <= min;
      if (plus) plus.disabled = !isNaN(max) && value >= max;
    }

    // Tomt fält eller 0: tillbaka till antalet i varukorgen (raden tas inte bort av misstag).
    // Väntande ändringar i andra rader skickas ändå.
    function resetValue(input) {
      input.value = input.defaultValue;
      syncButtons(input);
      schedule();
    }

    inputs.forEach(function (input) {
      var wrap = input.parentNode;
      // Lägsta antal med JavaScript: 1 (eller antalsregelns steg), så att pilarna och minus aldrig når 0.
      if ((parseInt(input.min, 10) || 0) < 1) input.min = String(Math.max(1, parseInt(input.step, 10) || 1));

      Array.prototype.forEach.call(wrap.querySelectorAll('[data-ks-qty-step]'), function (button) {
        button.hidden = false;
        button.addEventListener('click', function () {
          var stepAttr = parseInt(input.step, 10) || 1;
          var dir = parseInt(button.getAttribute('data-ks-qty-step'), 10);
          var current = parseInt(input.value, 10) || 0;
          var next = clamp(input, current + dir * stepAttr);
          if (next === current) return;
          input.value = next;
          lastControl = button;
          syncButtons(input);
          schedule();
        });
      });
      input.addEventListener('input', function () {
        clearTimeout(timer);
        syncButtons(input);
        lastControl = input;
        // Tomt fält eller under lägsta antal (t.ex. 0) skickas inte automatiskt.
        var value = parseInt(input.value, 10);
        if (input.value.trim() === '' || isNaN(value) || value < (parseInt(input.min, 10) || 1)) return;
        schedule();
      });
      input.addEventListener('change', function () {
        var value = parseInt(input.value, 10);
        if (input.value.trim() === '' || isNaN(value)) {
          resetValue(input);
          return;
        }
        if (value === 0) {
          resetValue(input);
          setStatus(MSG_RESET);
          return;
        }
        value = clamp(input, value);
        if (String(value) !== input.value) input.value = value;
        syncButtons(input);
        schedule();
      });
      input.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        if (input.value.trim() === '' || isNaN(parseInt(input.value, 10))) {
          resetValue(input);
          return;
        }
        var value = parseInt(input.value, 10);
        // 0 + Enter är ett uttryckligt val: raden tas bort (som 0 + "Uppdatera varukorg" utan JavaScript).
        input.value = value === 0 ? 0 : clamp(input, value);
        submitUpdate();
      });
      syncButtons(input);
    });

    // "Ta bort" laddar om varukorgen: fokus och uppläsning efteråt som vid en uppdatering.
    Array.prototype.forEach.call(form.querySelectorAll('[data-ks-cart-remove]'), function (link) {
      link.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        clearTimeout(timer);
        save(link, MSG_REMOVED);
      });
    });

    // Klick på kassaknappen medan en uppdatering väntar: skicka bara kassan (antalen följer med i samma POST).
    form.addEventListener('submit', function (event) {
      clearTimeout(timer);
      var submitter = event.submitter;
      if (submitter && submitter.name === 'checkout') {
        submitting = true;
        forget();
      }
    });

    // Tillbaka från webbläsarens cache (t.ex. bakåt från kassan): formuläret ska gå att använda igen.
    window.addEventListener('pageshow', function (event) {
      if (!event.persisted) return;
      submitting = false;
      clearTimeout(timer);
      form.removeAttribute('aria-busy');
      setStatus('');
      forget();
    });
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-ks-cart-form]'), init);
  }

  function boot() {
    start();
    Array.prototype.forEach.call(document.querySelectorAll('[data-ks-cart]'), restore);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', start);
})();
