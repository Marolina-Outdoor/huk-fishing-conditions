document.addEventListener('DOMContentLoaded', () => {
  const customCollectionTabsList = document.querySelectorAll('.custom-collection-tabs');

  customCollectionTabsList.forEach(customCollectionTabs => {
    const target = customCollectionTabs.dataset.target;
    const buttons = Array.from(customCollectionTabs.querySelectorAll('button'));

    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const handle = button.dataset.collection;

        buttons.forEach(el => el.classList.remove('active'));
        button.classList.add('active');

        // if (handle) {
        //   toggleCollection(customCollectionTabs, handle, target);
        // }

        const featuredImgs = customCollectionTabs.querySelectorAll('.desktop-view .block-featured-image');
        const cardColumns = customCollectionTabs.querySelectorAll('.desktop-view .card-container');

        featuredImgs.forEach((container) => {
          container.classList.remove('active');
          if (container.dataset.collection === handle) {
            container.classList.add('active');
          }
        });

        cardColumns.forEach((column) => {
          column.classList.remove('active');
          if (column.dataset.collection === handle) {
            column.classList.add('active');
          }
        });

        event.preventDefault();
      });
    });

    if (typeof Shopify !== 'undefined' && Shopify.designMode) {
      customCollectionTabs.addEventListener('shopify:block:select', (event) => {
        const index = buttons.indexOf(event.target);
        if (index !== -1) {
          buttons[index].dispatchEvent(new Event('click'));
        }
      });
    }

    // function toggleCollection(customCollectionTabs, handle, target) {
    //   const slider = document.getElementById(target);
    //   const products = slider.querySelectorAll(`.columns:not([data-collection*="${handle}"])`);
    //   const activeProducts = slider.querySelectorAll(`[data-collection*="${handle}"]`);
    //   const flkty = Flickity.data(slider);

    //   products.forEach(el => {
    //     el.classList.remove('carousel__slide');
    //     slider.append(el);
    //   });

    //   activeProducts.forEach(el => {
    //     if (el.dataset.collection === handle) {
    //       el.classList.add('carousel__slide');
    //     } else {
    //       el.classList.remove('carousel__slide');
    //       slider.append(el);
    //     }
    //   });

    //   flkty.insert(activeProducts);
    //   flkty.reloadCells();
    //   flkty.select(0, 0, 1);
    // }
  });
});