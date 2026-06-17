document.addEventListener("DOMContentLoaded", function() {
  let shopTheLookSections = document.querySelectorAll('.shop-the-look-fifty-fifty');

  shopTheLookSections.forEach(function(shopTheLookSection) {
    let slider = shopTheLookSection.querySelector('.shop-the-look-slider');
    let flkty = new Flickity(slider, {
      wrapAround: false,
      contain: true,
      cellAlign: 'left'
    });

    let pointers = shopTheLookSection.querySelectorAll('.thb-hotspot');

    pointers.forEach(function(pointer) {
      pointer.addEventListener('click', function(event) {
        let target = event.target;
        if (!target.classList.contains('thb-hotspot')) {
          target = target.closest('.thb-hotspot');
        }
        
        if (target) {
          let index = parseInt(target.getAttribute('data-index'));
          index = index - 1;
          if (!isNaN(index)) {
            flkty.select(index);
          }

          let parentDesktop = target.closest('.shop-the-look--desktop');
          let parentMobile = target.closest('.shop-the-look--mobile');

          if (parentMobile) {

            let productHandle = target.getAttribute('data-product-handle');
            let productButton = document.querySelector(`.shop-the-look-slider .product-card .product-card-quickview[data-product-handle="${productHandle}"]`);

            if (productButton) {
              productButton.click();
            }
          }
        }
      });
    });
  });
});