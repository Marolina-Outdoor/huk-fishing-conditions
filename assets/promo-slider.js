if (!customElements.get('promo-slider')) {
    /**
     *  @class
     *  @function PromoSlider
     */
    class PromoSlider extends HTMLElement {
      constructor() {
        super();
  
        this.addEventListener('change', this.setupProductGallery);
      }
      connectedCallback() {
        this.setOptions();
        this.init();

        document.addEventListener('summaryClicked', this.handleSummaryClicked.bind(this));

      }
      setOptions() {
        this.options = {
            wrapAround: true,
            cellAlign: 'left',
            draggable: true,
            cellSelector: 'li'
        };
      }
      init() {
        this.flkty = new Flickity(this, this.options);
  
        this.selectedIndex = this.flkty.selectedIndex;
  
      }
      reInit(imageSetIndex) {
  
        this.flkty.destroy();
  
        this.setOptions();
  
        this.flkty = new Flickity(this, this.options);
  
        this.selectedIndex = this.flkty.selectedIndex;
      }
      handleSummaryClicked(event) {
        const { detailsElement } = event.detail.detail;
        
        if (detailsElement.contains(this)) {
          this.reInit();
        }
      }
    }
    customElements.define('promo-slider', PromoSlider);
  }