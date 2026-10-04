/* KaffeSmak – enkel vågrät karusell: pilknappar rullar raden en "sida" i taget.
   Raden går också att svepa och rulla med tangentbordet. Pilarna döljs när allt får plats. */
(function () {
  if (customElements.get('ks-carousel')) return;

  class KsCarousel extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-ks-track]');
      this.prev = this.querySelector('[data-ks-prev]');
      this.next = this.querySelector('[data-ks-next]');
      if (!this.track) return;
      this.update = this.update.bind(this);
      this.prev?.addEventListener('click', () => this.scrollByPage(-1));
      this.next?.addEventListener('click', () => this.scrollByPage(1));
      this.track.addEventListener('scroll', this.update, { passive: true });
      if ('ResizeObserver' in window) {
        this.observer = new ResizeObserver(this.update);
        this.observer.observe(this.track);
      } else {
        window.addEventListener('resize', this.update);
      }
      this.update();
    }

    disconnectedCallback() {
      this.observer?.disconnect();
      window.removeEventListener('resize', this.update);
    }

    scrollByPage(direction) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.track.scrollBy({ left: direction * this.track.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' });
    }

    update() {
      const { scrollLeft, scrollWidth, clientWidth } = this.track;
      const overflowing = scrollWidth - clientWidth > 2;
      this.classList.toggle('ks-carousel--overflowing', overflowing);
      if (this.prev) {
        this.prev.hidden = !overflowing;
        this.prev.disabled = scrollLeft <= 2;
      }
      if (this.next) {
        this.next.hidden = !overflowing;
        this.next.disabled = scrollLeft + clientWidth >= scrollWidth - 2;
      }
    }
  }

  customElements.define('ks-carousel', KsCarousel);
})();
