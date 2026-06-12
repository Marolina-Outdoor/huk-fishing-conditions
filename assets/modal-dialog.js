/**
 *  @class
 *  @function ModalDialog
 */
if (!customElements.get('modal-dialog')) {
  class ModalDialog extends HTMLElement {
    constructor() {
      super();

      this.age_verification = this.classList.contains('age-verification-modal');
      this.id = this.getAttribute('id');
      this.delay = parseInt(this.dataset.delay, 10) * 1000;
      this.popup = this.dataset.popup;
      this.section_id = this.dataset.sectionId;
      this.disabled = this.getAttribute('disabled') != undefined;
      this.button = this.querySelector('[id^="ModalClose-"]');

      this.button.addEventListener('click', this.hide.bind(this));

      if (!this.disabled) {
        this.addEventListener('keyup', (event) => {
          if (event.code.toUpperCase() === 'ESCAPE') {
            this.hide();
          }
        });
        this.addEventListener('click', (event) => {
          if (event.target.nodeName === 'MODAL-DIALOG') this.hide();
        });
      }
      if (this.delay && this.delay > 0) {
        if (!this.getCookie()) {
          setTimeout(() => {
            this.show();
            this.button.addEventListener('click', this.setCookie.bind(this));
          }, this.delay);
        }
      }
      if (this.age_verification) {
        if (!this.getCookie()) {
          this.show();
        }
        this.button.addEventListener('click', this.setCookie.bind(this));
      }
      if (Shopify.designMode) {
        this.moved = true;
        document.addEventListener('shopify:section:select', (event) => {
          if (event.detail.sectionId === this.section_id) {
            this.show();
          }
        });
        document.addEventListener('shopify:section:deselect', (event) => {
          if (event.detail.sectionId === this.section_id) {
            this.hide();
          }
        });
      }
    }

    connectedCallback() {
      if (this.moved) return;
      this.moved = true;
      document.body.appendChild(this);
    }

    // ADA FIX P1-1/P1-2: focus trap — cycles Tab/Shift+Tab within modal, Escape closes
    _trapFocus(e) {
      const focusable = Array.from(this.querySelector('[role="dialog"]').querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )).filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) { last.focus(); e.preventDefault(); }
        } else {
          if (document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
      }
    }

    show(opener) {
      this.openedBy = opener;
      document.body.classList.add('overflow-hidden');
      this.setAttribute('open', '');
      // ADA FIX P1-1/P1-2: hide background from screen readers while modal is open
      const mainContent = document.querySelector('main, #MainContent, [role="main"]');
      if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
      this._boundTrapFocus = this._trapFocus.bind(this);
      this.addEventListener('keydown', this._boundTrapFocus);
      setTimeout(() => {
        const dialog = this.querySelector('[role="dialog"]');
        const focusable = dialog ? dialog.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        ) : [];
        const firstFocusable = Array.from(focusable).find(el => el.offsetParent !== null);
        if (firstFocusable) firstFocusable.focus();
        else if (dialog) dialog.focus();
      }, 100);
    }

    hide() {
      document.body.classList.remove('overflow-hidden');
      this.removeAttribute('open');
      // ADA FIX P1-1/P1-2: restore background content to screen readers
      const mainContent = document.querySelector('main, #MainContent, [role="main"]');
      if (mainContent) mainContent.removeAttribute('aria-hidden');
      if (this._boundTrapFocus) {
        this.removeEventListener('keydown', this._boundTrapFocus);
        this._boundTrapFocus = null;
      }
      // ADA FIX P1-1/P1-2: return focus to the element that opened the modal
      if (this.openedBy) {
        this.openedBy.focus();
        this.openedBy = null;
      }
      this.querySelectorAll('.js-youtube').forEach((video) => {
        video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
      });
      this.querySelectorAll('.js-vimeo').forEach((video) => {
        video.contentWindow.postMessage('{"method":"pause"}', '*');
      });
      this.querySelectorAll('video').forEach((video) => video.pause());

      if (this.popup) {

      }
    }

    getCookie() {
      return window.localStorage.getItem(this.id);
    }
    setCookie() {
      window.localStorage.setItem(this.id, JSON.stringify(new Date()));
    }
  }
  customElements.define('modal-dialog', ModalDialog);
}
if (!customElements.get('modal-opener')) {
  class ModalOpener extends HTMLElement {
    constructor() {
      super();

      const button = this.querySelector('button');

      if (!button) return;
      button.addEventListener('click', () => {
        const modal = document.querySelector(this.getAttribute('data-modal'));
        if (modal) modal.show(button);
      });
    }
  }
  customElements.define('modal-opener', ModalOpener);
}