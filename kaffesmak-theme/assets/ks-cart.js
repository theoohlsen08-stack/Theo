/* KaffeSmak – etapp 4: varukorgssidan (sections/ks-cart.liquid).
   Progressiv förbättring: utan JavaScript ändrar besökaren antalet i fältet och trycker "Uppdatera varukorg"
   (vanlig POST till /cart med updates[]). Med JavaScript:
   - minus/plus-knapparna visas och ändrar antalet,
   - formuläret skickas automatiskt en kort stund efter senaste ändringen (samma POST, sidan laddas om),
   - "Uppdatera varukorg" döljs, och Enter i antalsfältet uppdaterar direkt.
   Kassaknappen (name="checkout") påverkas inte: den skickar formuläret som vanligt. */
(function () {
  'use strict';

  var DELAY = 700;

  function init(form) {
    if (form.hasAttribute('data-ks-ready')) return;
    form.setAttribute('data-ks-ready', '');

    var timer = null;
    var submitting = false;
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
      setStatus('Uppdaterar varukorgen …');
      form.setAttribute('aria-busy', 'true');
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.submit();
      }
    }

    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(submitUpdate, DELAY);
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

    inputs.forEach(function (input) {
      var wrap = input.parentNode;
      Array.prototype.forEach.call(wrap.querySelectorAll('[data-ks-qty-step]'), function (button) {
        button.hidden = false;
        button.addEventListener('click', function () {
          var stepAttr = parseInt(input.step, 10) || 1;
          var dir = parseInt(button.getAttribute('data-ks-qty-step'), 10);
          var current = parseInt(input.value, 10) || 0;
          var next = clamp(input, current + dir * stepAttr);
          if (next === current) return;
          input.value = next;
          syncButtons(input);
          schedule();
        });
      });
      input.addEventListener('input', function () {
        syncButtons(input);
        if (input.value === '') return;
        schedule();
      });
      input.addEventListener('change', function () {
        var value = clamp(input, parseInt(input.value, 10));
        if (String(value) !== input.value) input.value = value;
        syncButtons(input);
        schedule();
      });
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          input.value = clamp(input, parseInt(input.value, 10));
          submitUpdate();
        }
      });
      syncButtons(input);
    });

    // Klick på kassaknappen medan en uppdatering väntar: skicka bara kassan (antalen följer med i samma POST).
    form.addEventListener('submit', function (event) {
      clearTimeout(timer);
      var submitter = event.submitter;
      if (submitter && submitter.name === 'checkout') {
        submitting = true;
      }
    });
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-ks-cart-form]'), init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  document.addEventListener('shopify:section:load', start);
})();
