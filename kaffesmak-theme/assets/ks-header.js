/*
 * KaffeSmak sidhuvud: nedfällbar huvudmeny som öppnas vid klick (hover kompletterar på dator),
 * stängs med andra klick, klick utanför eller Escape, och går att styra med tangentbord.
 * Mobilmenyn öppnas med menyknappen och kategorierna fälls ut med tryck.
 */
(() => {
  if (customElements.get('ks-header')) return;

  const HOVER_CLOSE_DELAY = 250;
  const desktopHover = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 990px)');

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
