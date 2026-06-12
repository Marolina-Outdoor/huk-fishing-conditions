/**
 *  @class
 *  @function PredictiveSearch
 */
class PredictiveSearch {
  constructor() {
    this.container = document.getElementById('Search-Drawer');
    this.form = this.container.querySelector('form.searchform');
    this.button = document.querySelectorAll('.thb-quick-search');
    this.input = this.container.querySelector('input[type="search"]');
    this.defaultTab = this.container.querySelector('.side-panel-content--initial');
    this.predictiveSearchResults = this.container.querySelector('.side-panel-content--has-tabs');

    this.setupEventListeners();
  }

  // ADA FIX P1-3: focus trap — cycles Tab/Shift+Tab within search drawer
  _trapFocus(e) {
    const focusable = Array.from(this.container.querySelectorAll(
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

  // ADA FIX P1-3: open drawer with aria-hidden on main + focus trap
  openDrawer(triggerEl) {
    this._openedBy = triggerEl || null;
    const main = document.querySelector('main, #MainContent, [role="main"]');
    if (main) main.setAttribute('aria-hidden', 'true');
    this._boundTrapFocus = this._trapFocus.bind(this);
    this.container.addEventListener('keydown', this._boundTrapFocus);
  }

  // ADA FIX P1-3: close drawer — remove aria-hidden + return focus + detach trap
  closeDrawer() {
    const main = document.querySelector('main, #MainContent, [role="main"]');
    if (main) main.removeAttribute('aria-hidden');
    if (this._boundTrapFocus) {
      this.container.removeEventListener('keydown', this._boundTrapFocus);
      this._boundTrapFocus = null;
    }
    if (this._openedBy) {
      this._openedBy.focus();
      this._openedBy = null;
    }
  }

  setupEventListeners() {
    this.form.addEventListener('submit', this.onFormSubmit.bind(this));

    this.input.addEventListener('input', debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));

    this.button.forEach((item, i) => {
      item.addEventListener('click', (event) => {
        var _this = this;
        event.preventDefault();
        document.getElementsByTagName("body")[0].classList.toggle('open-cc');
        this.container.classList.toggle('active');
        if (this.container.classList.contains('active')) {
          // ADA FIX P1-3: open — save trigger, hide main, attach trap
          this.openDrawer(event.currentTarget);
          setTimeout(function () {
            _this.input.focus({ preventScroll: true });
          }, 100);
          dispatchCustomEvent('search:open');
        } else {
          // ADA FIX P1-3: close — restore main, return focus
          this.closeDrawer();
        }

        return false;
      });
    });

    // ADA FIX P1-3: close button restores focus
    const closeBtn = this.container.querySelector('side-panel-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    const searchTerm = this.getQuery();

    if (!searchTerm.length) {
      this.predictiveSearchResults.classList.remove('active');
      return;
    }
    this.predictiveSearchResults.classList.add('active');
    this.getSearchResults(searchTerm);
  }

  onFormSubmit(event) {
    // ADA FIX P1-4: announce error via role="alert" span if search field is empty
    const errorSpan = document.getElementById('search-input-error');
    if (!this.getQuery().length) {
      event.preventDefault();
      this.input.setAttribute('aria-invalid', 'true');
      if (errorSpan) errorSpan.textContent = 'Please enter a search term.';
      this.input.focus();
      return;
    }
    this.input.setAttribute('aria-invalid', 'false');
    if (errorSpan) errorSpan.textContent = '';
  }

  onFocus() {
    const searchTerm = this.getQuery();

    if (!searchTerm.length) {
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(" ", "-").toLowerCase();

    this.predictiveSearchResults.classList.add('loading');

    fetch(`${theme.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&${encodeURIComponent('resources[type]')}=product,article,query&${encodeURIComponent('resources[limit]')}=10&section_id=predictive-search`)
      .then((response) => {
        this.predictiveSearchResults.classList.remove('loading');
        if (!response.ok) {
          var error = new Error(response.status);
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;

        this.renderSearchResults(resultsMarkup);
      })
      .catch((error) => {
        throw error;
      });
  }

  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;

    let _this = this,
      submitButton = this.container.querySelector('#search-results-submit');


    submitButton.addEventListener('click', () => {
      _this.form.submit();
    });
  }

  close() {
    this.container.classList.remove('active');
  }
}
window.addEventListener('load', () => {
  if (typeof PredictiveSearch !== 'undefined') {
    new PredictiveSearch();
  }
});