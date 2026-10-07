/*
 * KaffeSmak sidhuvud: nedfällbar huvudmeny som öppnas vid klick (hover kompletterar på dator),
 * stängs med andra klick, klick utanför eller Escape, och går att styra med tangentbord.
 * Mobilmenyn öppnas med menyknappen och kategorierna fälls ut med tryck.
 * Etapp 4: sökförslag under sökfältet (Shopifys förslagssökning, sektionen ks-predictive-search).
 */
(() => {
  if (customElements.get('ks-header')) return;

  const HOVER_CLOSE_DELAY = 250;
  const desktopHover = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 990px)');

  const SUGGEST_DELAY = 250;
  const SUGGEST_MIN_CHARS = 2;
  const SUGGEST_LIMIT = 6;
  const SUGGEST_SECTION = 'ks-predictive-search';

  /*
   * Sökförslag: kombinationsruta (role=combobox) med en lista (role=listbox) under fältet.
   * Pil ned/upp väljer förslag, Enter öppnar det valda förslaget (utan valt förslag skickas formuläret som vanligt
   * till sökresultatsidan), Escape och klick utanför stänger listan.
   */
  class KsSuggest {
    constructor(form) {
      this.form = form;
      this.input = form.querySelector('.ks-search__input');
      this.panel = form.querySelector('[data-ks-suggest-panel]');
      this.list = this.panel && this.panel.querySelector('[role="listbox"]');
      this.empty = form.querySelector('[data-ks-suggest-empty]');
      this.status = form.querySelector('[data-ks-suggest-status]');
      this.url = form.dataset.ksSuggestUrl;
      if (!this.input || !this.list || !this.url) return;

      this.timer = null;
      this.controller = null;
      this.activeIndex = -1;
      this.lastTerm = '';

      this.input.setAttribute('role', 'combobox');
      this.input.setAttribute('aria-autocomplete', 'list');
      this.input.setAttribute('aria-expanded', 'false');
      this.input.setAttribute('aria-controls', this.list.id);

      this.input.addEventListener('input', () => this.schedule());
      this.input.addEventListener('keydown', (event) => this.onKeydown(event));
      this.input.addEventListener('focus', () => {
        if (this.options().length && this.term() === this.lastTerm) this.open();
      });
      this.form.addEventListener('focusout', (event) => {
        if (event.relatedTarget && !this.form.contains(event.relatedTarget)) this.close();
      });
      this.list.addEventListener('mousemove', (event) => {
        const option = event.target.closest('[role="option"]');
        if (option) this.setActive(this.options().indexOf(option), false);
      });
      this.onDocumentClick = (event) => {
        if (!this.form.contains(event.target)) this.close();
      };
      document.addEventListener('click', this.onDocumentClick);
      // Sidan kan visas från webbläsarens cache (bakåtknappen): stäng då en lista som var öppen.
      this.onPageShow = () => this.close();
      window.addEventListener('pageshow', this.onPageShow);
    }

    destroy() {
      if (this.onDocumentClick) document.removeEventListener('click', this.onDocumentClick);
      if (this.onPageShow) window.removeEventListener('pageshow', this.onPageShow);
      clearTimeout(this.timer);
      this.controller?.abort();
    }

    term() {
      return this.input.value.trim();
    }

    options() {
      return Array.from(this.list.querySelectorAll('[role="option"]'));
    }

    schedule() {
      clearTimeout(this.timer);
      const term = this.term();
      if (term.length < SUGGEST_MIN_CHARS) {
        this.controller?.abort();
        this.clear();
        return;
      }
      this.timer = setTimeout(() => this.fetch(term), SUGGEST_DELAY);
    }

    async fetch(term) {
      this.controller?.abort();
      const controller = new AbortController();
      this.controller = controller;
      const url = new URL(this.url, window.location.origin);
      url.searchParams.set('q', term);
      url.searchParams.set('resources[type]', 'product');
      url.searchParams.set('resources[limit]', String(SUGGEST_LIMIT));
      url.searchParams.set('section_id', SUGGEST_SECTION);
      try {
        const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'text/html' } });
        if (!response.ok) throw new Error(String(response.status));
        const html = await response.text();
        if (controller.signal.aborted || term !== this.term()) return;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        this.render(term, Array.from(doc.querySelectorAll('[data-ks-suggest-item]')));
      } catch (error) {
        if (error.name !== 'AbortError') this.clear();
      }
    }

    render(term, items) {
      this.lastTerm = term;
      this.activeIndex = -1;
      this.input.removeAttribute('aria-activedescendant');
      this.list.replaceChildren(
        ...items.map((item, index) => {
          const option = document.importNode(item, true);
          option.id = `${this.list.id}-${index + 1}`;
          option.setAttribute('aria-selected', 'false');
          return option;
        })
      );
      if (items.length) {
        this.empty.hidden = true;
        this.empty.textContent = '';
        this.list.hidden = false;
        this.status.textContent =
          items.length === 1
            ? '1 förslag. Välj med pil upp och pil ned.'
            : `${items.length} förslag. Välj med pil upp och pil ned.`;
      } else {
        this.list.hidden = true;
        this.empty.textContent = `Inga produkter hittades för ”${term}”.`;
        this.empty.hidden = false;
        this.status.textContent = 'Inga förslag.';
      }
      this.open();
    }

    open() {
      this.panel.hidden = false;
      this.input.setAttribute('aria-expanded', String(this.options().length > 0));
    }

    close() {
      if (!this.panel || this.panel.hidden) return;
      this.panel.hidden = true;
      this.input.setAttribute('aria-expanded', 'false');
      this.setActive(-1, false);
    }

    clear() {
      this.close();
      this.list.replaceChildren();
      this.empty.textContent = '';
      this.status.textContent = '';
      this.lastTerm = '';
    }

    setActive(index, scroll = true) {
      const options = this.options();
      options.forEach((option, i) => {
        const active = i === index;
        option.setAttribute('aria-selected', String(active));
        option.classList.toggle('ks-suggest__option--active', active);
      });
      this.activeIndex = index;
      if (index >= 0 && options[index]) {
        this.input.setAttribute('aria-activedescendant', options[index].id);
        if (scroll) options[index].scrollIntoView({ block: 'nearest' });
      } else {
        this.input.removeAttribute('aria-activedescendant');
      }
    }

    onKeydown(event) {
      if (event.isComposing) return;
      const options = this.options();
      const isOpen = !this.panel.hidden;
      switch (event.key) {
        case 'ArrowDown':
          if (!options.length) return;
          event.preventDefault();
          if (!isOpen) {
            this.open();
            this.setActive(0);
          } else {
            this.setActive((this.activeIndex + 1) % options.length);
          }
          break;
        case 'ArrowUp':
          if (!options.length) return;
          event.preventDefault();
          if (!isOpen) {
            this.open();
            this.setActive(options.length - 1);
          } else {
            this.setActive(this.activeIndex <= 0 ? options.length - 1 : this.activeIndex - 1);
          }
          break;
        case 'Enter': {
          const link = isOpen && options[this.activeIndex]?.querySelector('a[href]');
          if (link) {
            event.preventDefault();
            window.location.assign(link.href);
          }
          break;
        }
        case 'Escape':
          if (isOpen) {
            event.preventDefault();
            event.stopPropagation();
            this.close();
          }
          break;
        case 'Tab':
          this.close();
          break;
      }
    }
  }

  class KsHeader extends HTMLElement {
    connectedCallback() {
      this.toggles = Array.from(this.querySelectorAll('[data-ks-toggle]'));
      this.topLinks = Array.from(this.querySelectorAll('.ks-nav__top'));
      this.burger = this.querySelector('[data-ks-burger]');
      this.mobileNav = this.burger && document.getElementById(this.burger.getAttribute('aria-controls'));
      this.openToggle = null;
      this.openedByHover = false;
      this.closeTimer = null;

      this.onDocumentClick = this.onDocumentClick.bind(this);
      this.onDocumentKeydown = this.onDocumentKeydown.bind(this);
      document.addEventListener('click', this.onDocumentClick);
      document.addEventListener('keydown', this.onDocumentKeydown);

      const searchForm = this.querySelector('form[data-ks-suggest-url]');
      this.suggest = searchForm ? new KsSuggest(searchForm) : null;

      this.toggles.forEach((toggle) => {
        const item = toggle.parentElement;
        const panel = this.panelFor(toggle);

        toggle.addEventListener('click', (event) => {
          event.preventDefault();
          if (this.openToggle === toggle && this.openedByHover) {
            // Menyn öppnades av muspekaren: klicket "låser" den öppen i stället för att stänga.
            this.openedByHover = false;
            return;
          }
          if (this.openToggle === toggle) {
            this.close();
          } else {
            this.open(toggle, false);
          }
        });

        toggle.addEventListener('keydown', (event) => this.onToggleKeydown(event, toggle));
        panel.addEventListener('keydown', (event) => this.onPanelKeydown(event, toggle));

        item.addEventListener('mouseenter', () => {
          if (!desktopHover.matches) return;
          clearTimeout(this.closeTimer);
          if (this.openToggle !== toggle) {
            if (this.openToggle && !this.openedByHover) return; // en klickad meny ligger kvar tills användaren väljer
            this.open(toggle, true);
          }
        });
        item.addEventListener('mouseleave', () => {
          if (!desktopHover.matches || !this.openedByHover || this.openToggle !== toggle) return;
          this.closeTimer = setTimeout(() => this.close(), HOVER_CLOSE_DELAY);
        });

        item.addEventListener('focusout', (event) => {
          if (this.openToggle === toggle && !item.contains(event.relatedTarget) && event.relatedTarget) {
            this.close();
          }
        });
      });

      this.topLinks.forEach((link) => {
        if (!link.hasAttribute('data-ks-toggle')) {
          link.addEventListener('keydown', (event) => this.onToggleKeydown(event, link));
        }
      });

      if (this.burger && this.mobileNav) {
        this.burger.addEventListener('click', () => this.setMobileOpen(this.burger.getAttribute('aria-expanded') !== 'true'));
        this.mobileNav.querySelectorAll('[data-ks-accordion]').forEach((button) => {
          button.addEventListener('click', () => {
            const sub = document.getElementById(button.getAttribute('aria-controls'));
            const expand = button.getAttribute('aria-expanded') !== 'true';
            button.setAttribute('aria-expanded', String(expand));
            sub.hidden = !expand;
          });
        });
      }
    }

    disconnectedCallback() {
      document.removeEventListener('click', this.onDocumentClick);
      document.removeEventListener('keydown', this.onDocumentKeydown);
      this.suggest?.destroy();
    }

    panelFor(toggle) {
      return document.getElementById(toggle.getAttribute('aria-controls'));
    }

    open(toggle, byHover) {
      if (this.openToggle && this.openToggle !== toggle) this.close();
      clearTimeout(this.closeTimer);
      toggle.setAttribute('aria-expanded', 'true');
      this.panelFor(toggle).hidden = false;
      this.openToggle = toggle;
      this.openedByHover = byHover;
    }

    close({ focusToggle = false } = {}) {
      const toggle = this.openToggle;
      if (!toggle) return;
      clearTimeout(this.closeTimer);
      toggle.setAttribute('aria-expanded', 'false');
      this.panelFor(toggle).hidden = true;
      this.openToggle = null;
      this.openedByHover = false;
      if (focusToggle) toggle.focus();
    }

    links(toggle) {
      return Array.from(this.panelFor(toggle).querySelectorAll('a'));
    }

    onToggleKeydown(event, toggle) {
      const index = this.topLinks.indexOf(toggle);
      switch (event.key) {
        case 'ArrowDown':
          if (!toggle.hasAttribute('data-ks-toggle')) return;
          event.preventDefault();
          this.open(toggle, false);
          this.links(toggle)[0]?.focus();
          break;
        case 'ArrowUp':
          if (!toggle.hasAttribute('data-ks-toggle')) return;
          event.preventDefault();
          this.open(toggle, false);
          this.links(toggle).at(-1)?.focus();
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.topLinks[(index + 1) % this.topLinks.length].focus();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          this.topLinks[(index - 1 + this.topLinks.length) % this.topLinks.length].focus();
          break;
        case 'Home':
          event.preventDefault();
          this.topLinks[0].focus();
          break;
        case 'End':
          event.preventDefault();
          this.topLinks.at(-1).focus();
          break;
      }
    }

    onPanelKeydown(event, toggle) {
      const links = this.links(toggle);
      const index = links.indexOf(document.activeElement);
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          links[(index + 1) % links.length].focus();
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (index <= 0) {
            toggle.focus();
          } else {
            links[index - 1].focus();
          }
          break;
        case 'Home':
          event.preventDefault();
          links[0].focus();
          break;
        case 'End':
          event.preventDefault();
          links.at(-1).focus();
          break;
        case 'ArrowRight':
        case 'ArrowLeft': {
          event.preventDefault();
          const step = event.key === 'ArrowRight' ? 1 : -1;
          const i = this.topLinks.indexOf(toggle);
          const next = this.topLinks[(i + step + this.topLinks.length) % this.topLinks.length];
          this.close();
          next.focus();
          break;
        }
      }
    }

    onDocumentClick(event) {
      if (this.openToggle && !this.openToggle.parentElement.contains(event.target)) {
        this.close();
      }
      if (
        this.burger?.getAttribute('aria-expanded') === 'true' &&
        !this.mobileNav.contains(event.target) &&
        !this.burger.contains(event.target)
      ) {
        this.setMobileOpen(false);
      }
    }

    onDocumentKeydown(event) {
      if (event.key !== 'Escape') return;
      if (this.openToggle) {
        const focusInside = this.openToggle.parentElement.contains(document.activeElement);
        this.close({ focusToggle: focusInside });
      }
      if (this.burger?.getAttribute('aria-expanded') === 'true') {
        this.setMobileOpen(false);
        this.burger.focus();
      }
    }

    setMobileOpen(open) {
      this.burger.setAttribute('aria-expanded', String(open));
      this.burger.querySelector('.ks-visually-hidden').textContent = open ? 'Stäng meny' : 'Meny';
      this.mobileNav.hidden = !open;
    }
  }

  customElements.define('ks-header', KsHeader);
})();
