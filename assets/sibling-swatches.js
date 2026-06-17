window.addEventListener('DOMContentLoaded', loadProductSwatches())

function loadProductSwatches() {

  // Load Frenzy Bundle on Quick View
  if (document.getElementById('Product-Drawer-Content')) {
    const frenzyProductId = document.querySelector('input[name="product-id"]')?.value.trim();
    const frenzyVariantId = document.querySelector('input[name="id"]')?.value.trim();
    product_id_Frenzy = frenzyProductId
    variant_id_Frenzy = frenzyVariantId
    if (product_id_Frenzy && variant_id_Frenzy) {
      frenzy_sku = `${product_id_Frenzy}_${variant_id_Frenzy}`
    }
    
    frenzyScriptReload()
    if (document.querySelector('.frenzy_bundle_id')) {
      $frenzy_bundle_event()
    }
  }

  const colorFieldset = document.querySelector('fieldset[data-colorswatches="true"]')
  const sizeFieldset = document.querySelector('fieldset[data-handle="size"]');
  const dominationFieldset = document.querySelector('fieldset[data-handle="denominations"]')
  let sizeSwatches = sizeFieldset ? sizeFieldset.querySelectorAll('input[type="radio"]') : null;
  let isSolidColor = false
  let isPrintColor = false

  if(dominationFieldset) {
    dominationFieldset.addEventListener('change', (e) => {
      if (e.target.tagName === 'INPUT') {
        const productHandle = e.target.dataset.productHandle
  
  
        // Fetch the product data
        fetch(`/products/${productHandle}.js`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json(); // Return the response as JSON
        })
        .then(productData => {

          const value = e.target.value
          dispatchCustomEvent("product:variant-changed", {
            productData: productData
          })
  
          updateProductMedia(productData)
          updateProductInfoDominations(productData, value)
          updateProductAddToCartForm(productData, value)  
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
      }
    })
  }

  if(sizeSwatches && sizeSwatches.length > 0) {
  // Get DOMContentLoaded selected Size Swatch Value and Index - Store it Locally
  sizeSwatches.forEach((sizeSwatch, index) => {
    if (sizeSwatch.checked) {
      localStorage.setItem('sizeSwatchValue', sizeSwatch.value)
      localStorage.setItem('sizeSwatchIndex', index)
    }
  })
  }
  

  if(colorFieldset) {
    colorFieldset.addEventListener('change', (e) => {
      if (e.target.tagName === 'INPUT') {
        const productHandle = e.target.dataset.productHandle
        const storedSizeValue = localStorage.getItem('sizeSwatchValue')
        const storedSizeIndex = localStorage.getItem('sizeSwatchIndex')
  
        // Check which type of color swatch was selected
        if (e.target.parentNode.classList.contains('solid_swatches')) {
          isSolidColor = true
        } else {
          isSolidColor = false
        }
        if (e.target.parentNode.classList.contains('print_swatches')) {
          isPrintColor = true
        } else {
          isPrintColor = false
        }
  
  
        // Fetch the product data
        fetch(`/products/${productHandle}.js`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json(); // Return the response as JSON
        })
        .then(productData => {
  
          dispatchCustomEvent("product:variant-changed", {
            productData: productData
          })
  
          updateProductMedia(productData)
          updateProductInfo(productData, storedSizeValue, storedSizeIndex, isSolidColor, isPrintColor)
          updateProductAddToCartForm(productData, storedSizeValue)
  
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
      }
    })
  }
 

  if(sizeFieldset) { 
    sizeFieldset.addEventListener('change', (e) => {
      if (e.target.tagName === 'INPUT') {
        const productHandle = e.target.dataset.productHandle
        const sizeIndex = e.target.dataset.index
        const value = e.target.value

        // Handle ATC error messages
        const errorForm = document.querySelector('.product-form__error-message-wrapper')
        if (!errorForm.getAttribute('hidden')) {
          errorForm.setAttribute('hidden', '')
        }

        localStorage.setItem('sizeSwatchValue', value)
        localStorage.setItem('sizeSwatchIndex', sizeIndex)
        
        // Fetch the product data
        fetch(`/products/${productHandle}.js`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json(); // Return the response as JSON
        })
        .then(productData => {

          dispatchCustomEvent("product:variant-changed", {
            productData: productData
          })

          updateProductInfo(productData, value, sizeIndex, isSolidColor, isPrintColor)
          updateProductAddToCartForm(productData, value)

        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
      }
    })
  }

  // Begin Functions -------------------------------------------------------------

  function buildCompletePriceMarkup(productData, matchingVariant, sectionId) {
    const originalPrice = matchingVariant.price;
    let price = matchingVariant.price;
    let compareAtPrice = matchingVariant.compare_at_price;
    const available = matchingVariant.available;
    let discountedClass = '';
    let xforyPrice = null;
    let finalPrice = price;
    let saleOnlinePercent = null;
    
    const saleOnlineTag = productData.tags.find(tag => tag.includes('sale-online-') && !tag.includes('pos'));
    if (saleOnlineTag) {
      saleOnlinePercent = parseInt(saleOnlineTag.replace('sale-online-', ''));
    }

    const hasXforyTag = productData.tags.some(tag => tag.includes('online-sale-xfory-') || tag.includes('sale-xfory-'));
    let hasXforyDiscount = false;
    
    if (hasXforyTag) {
      for (const tag of productData.tags) {
        if (tag.includes('sale-xfory-') && !tag.includes('pos-sale-xfory-')) {
          const cleanTag = tag.replace('online-sale-xfory-', '').replace('sale-xfory-', '');
          const tokens = cleanTag.split('-');
          const tagQty = parseInt(tokens[0]);
          const newPrice = parseInt(tokens[tokens.length - 1]);
          
          if (tagQty === 1) {
            compareAtPrice = originalPrice;
            xforyPrice = newPrice;
            price = newPrice;
            hasXforyDiscount = true;
            break;
          }
        }
      }
    }
    
    if (saleOnlinePercent) {
      if (!hasXforyDiscount) {
        compareAtPrice = price;
      }
      
      const priceOff = price * (saleOnlinePercent / 100);
      finalPrice = price - priceOff;
    } else {
      finalPrice = price;
    }
    const compareAtPriceFormatted = compareAtPrice ? window.formatMoney(compareAtPrice, window.theme.settings.money_with_currency_format) : null;
    const xforyPriceFormatted = xforyPrice ? window.formatMoney(xforyPrice, window.theme.settings.money_with_currency_format) : null;
    const finalPriceFormatted = window.formatMoney(finalPrice, window.theme.settings.money_with_currency_format);
    const hasNestedDiscounts = hasXforyDiscount && saleOnlinePercent;
    const showComparePrice = hasXforyDiscount || saleOnlinePercent || (compareAtPrice && compareAtPrice !== finalPrice);
    let priceContentHTML = '';
    
    if (showComparePrice && compareAtPriceFormatted) {
      const strikethrough = hasXforyDiscount || saleOnlinePercent ? 'style="text-decoration: line-through;"' : '';
      const tag = hasXforyDiscount || saleOnlinePercent ? 'ins' : 'del';
      priceContentHTML += `
        <${tag}>
          <span class="amount" ${strikethrough} style="display: block; margin-left: 10px;">${compareAtPriceFormatted}</span>
        </${tag}>
      `;
    }
    
    if (!hasNestedDiscounts) {
      let displayPriceHTML = '';

      if (saleOnlinePercent) {
        displayPriceHTML = `<ins><span class="amount sale-price" style="display: block; margin-left: 10px;">${finalPriceFormatted}</span></ins>`;
      } else if (hasXforyDiscount) {
        displayPriceHTML = `<ins><span class="amount" style="display: block; margin-left: 10px;">${xforyPriceFormatted}</span></ins>`;
      } else {
        displayPriceHTML = `<ins><span class="amount" style="display: block;">${finalPriceFormatted}</span></ins>`;
      }

      priceContentHTML += displayPriceHTML;
    }
    
    if (hasXforyDiscount) {
      productData.tags.forEach(tag => {
        if (tag.includes('sale-xfory-') && !tag.includes('pos-sale-xfory-')) {
          const cleanTag = tag.replace('online-sale-xfory-', '').replace('sale-xfory-', '');
          const tokens = cleanTag.split('-');
          const xforyValue = parseInt(tokens[tokens.length - 1]);
          const formattedXfory = window.formatMoney(xforyValue, window.theme.settings.money_with_currency_format);
          const displayStyle = saleOnlinePercent 
            ? 'display: block; margin-left: 10px; text-decoration: line-through;' 
            : 'display: none';
          
          priceContentHTML += `
            <ins>
              <span class="amount sale-price xfory-price" style="${displayStyle}">${formattedXfory}</span>
            </ins>
          `;
        }
      });
    }
    
    let unitPriceHTML = '';
    if (matchingVariant.unit_price_measurement) {
      const unitPrice = window.formatMoney(matchingVariant.unit_price, window.theme.settings.money_with_currency_format);
      const referenceValue = matchingVariant.unit_price_measurement.reference_value !== 1 ? matchingVariant.unit_price_measurement.reference_value : '';
      const referenceUnit = matchingVariant.unit_price_measurement.reference_unit;
      
      unitPriceHTML = `
        <small class="unit-price">
          <span>${unitPrice}</span>
          <span class="unit-price-separator">/</span>
          <span>${referenceValue}${referenceUnit}</span>
        </small>
      `;
    } else {
      unitPriceHTML = `
        <small class="unit-price hidden">
          <span></span>
          <span class="unit-price-separator">/</span>
          <span> </span>
        </small>
      `;
    }
    
    let badgesHTML = '';
    const saleBadgeType = window.theme.settings?.sale_badge_type || 'save_percentage';
    
    if (saleOnlinePercent) {
      if (saleBadgeType === 'save_amount') {
        const basePrice = hasXforyDiscount ? xforyPrice : originalPrice;
        const savedAmount = basePrice - finalPrice;
        const savedAmountFormatted = window.formatMoney(savedAmount, window.theme.settings.money_with_currency_format);
        badgesHTML += `<span class="badge onsale">Save ${savedAmountFormatted}</span>`;
      } else if (saleBadgeType === 'save_percentage') {
        badgesHTML += `<span class="badge onsale">Save ${saleOnlinePercent}%</span>`;
      } else {
        badgesHTML += `<span class="badge onsale">On Sale</span>`;
      }
    }
    
    const badgeComparePrice = hasXforyDiscount ? originalPrice : compareAtPrice;
    const badgePrice = hasXforyDiscount ? xforyPrice : price;
    
    if (badgeComparePrice && badgePrice < badgeComparePrice) {
      const savedAmount = badgeComparePrice - badgePrice;
      const savedPercentage = Math.round((savedAmount * 100.0) / badgeComparePrice);
      
      if (saleBadgeType === 'save_amount') {
        const savedAmountFormatted = window.formatMoney(savedAmount, window.theme.settings.money_with_currency_format);
        badgesHTML += `<span class="badge onsale">Save ${savedAmountFormatted}</span>`;
      } else if (saleBadgeType === 'save_percentage') {
        badgesHTML += `<span class="badge onsale">Save ${savedPercentage}%</span>`;
      } else {
        badgesHTML += `<span class="badge onsale">On Sale</span>`;
      }
    }
    
    if (!available) {
      badgesHTML += `<span class="badge out-of-stock">Sold out</span>`;
    }
    
    const hasPreorder = productData.metafields && productData.metafields.theme && productData.metafields.theme.preorder;
    if (hasPreorder && productData.available) {
      badgesHTML += `<span class="badge pre-order">Pre-order</span>`;
    }
    
    const priceMarkup = `
      <div class="no-js-hidden" id="price-${sectionId}">
        <span class="price">
          ${priceContentHTML}
          ${unitPriceHTML}
          <span class="badges">${badgesHTML}</span>
        </span>
      </div>
    `;
    
    return priceMarkup;
  }

  function updateProductMedia(productData) {
    const mediaSlider = document.getElementById('Product-Slider')
    const sectionId = mediaSlider.getAttribute('data-section-id')

    // Set Active Media
    const flkty = Flickity.data(mediaSlider)
    const firstMediaId = productData.media[0].id
    const newSlides = createNewSlides(productData, sectionId)
      
    if (flkty) {
      mediaSlider.selectCell(firstMediaId);
      // Update Thumbnails
      flkty.remove(flkty.getCellElements());
      flkty.append(newSlides);
      flkty.select( 0, false, true );
      updateThumbnails(productData, sectionId)
      addZoomToImages()
    }

  }

  function updateProductInfoDominations(productData, value) {
    const matchingVariant = productData.variants.find(variant => variant.option1 === value)

    // Update product title
    const title = document.querySelector('.product-title')
    title.innerText = productData.title

    const priceContainer = document.querySelector('.product-price-container')
    const sectionId = document.getElementById('Product-Slider').getAttribute('data-section-id')
    const priceMarkup = buildCompletePriceMarkup(productData, matchingVariant, sectionId)
    priceContainer.innerHTML = priceMarkup


    // Handle inventory level
    const inventoryContainer = document.getElementById(`inventory-${sectionId}`)
    if (matchingVariant.inventory_quantity > 0 && matchingVariant.inventory_quantity <= 5) {
      let scale = matchingVariant.inventory_quantity * 5
      if (scale === 5) {
        scale = `0${scale}`
      }
      const inventoryMarkup = `
        <div class="product-inventory-notice product-inventory-notice--low">
          <div class="product-inventory-notice--text">
            <div class="product-inventory-notice--pulse"></div>
            ${matchingVariant.inventory_quantity} in stock
          </div>
          <div class="product-inventory-notice--bar" style="--inventory-scale:0.${scale}">
            <span></span>
          </div>
        </div>
      `
      if (inventoryContainer) {
        inventoryContainer.innerHTML = ''
        inventoryContainer.innerHTML = inventoryMarkup
      }

    } else {
      if (inventoryContainer) {
        inventoryContainer.innerHTML = ''
      }

    }

    // Update Product Features Accordions (Fit, Materials, etc.)
    updateProductAccordions(productData)
  }

  function updateProductInfo(productData, storedSizeValue, storedSizeIndex, isSolidColor, isPrintColor) {
    const matchingVariant = productData.variants.find(variant => variant.option2 === storedSizeValue)

    // Update product title
    const title = document.querySelector('.product-title')
    title.innerText = productData.title

    // Update product price with complete logic from product-price.liquid
    const priceContainer = document.querySelector('.product-price-container')
    const sectionId = document.getElementById('Product-Slider').getAttribute('data-section-id')
    
    // Build complete price markup with all logic from product-price.liquid
    const priceMarkup = buildCompletePriceMarkup(productData, matchingVariant, sectionId)
    priceContainer.innerHTML = priceMarkup
    const inventoryContainer = document.getElementById(`inventory-${sectionId}`)
    if (matchingVariant.inventory_quantity > 0 && matchingVariant.inventory_quantity <= 5) {
      let scale = matchingVariant.inventory_quantity * 5
      if (scale === 5) {
        scale = `0${scale}`
      }
      const inventoryMarkup = `
        <div class="product-inventory-notice product-inventory-notice--low">
          <div class="product-inventory-notice--text">
            <div class="product-inventory-notice--pulse"></div>
            ${matchingVariant.inventory_quantity} in stock
          </div>
          <div class="product-inventory-notice--bar" style="--inventory-scale:0.${scale}">
            <span></span>
          </div>
        </div>
      `
      inventoryContainer.innerHTML = ''
      inventoryContainer.innerHTML = inventoryMarkup
    } else {
      inventoryContainer.innerHTML = ''
    }


    // Create new size swatches
    createNewSizeSwatches(productData, storedSizeIndex)

    // Update ATC Button
    const ATCButton = document.getElementById('AddToCart')

    if (ATCButton && !matchingVariant.available) {
      ATCButton.setAttribute('disabled', 'disabled')
      ATCButton.querySelector('span.single-add-to-cart-button--text').innerText = window.theme.variantStrings.soldOut
    } else if (ATCButton) {
      ATCButton.removeAttribute('disabled')
      ATCButton.querySelector('span.single-add-to-cart-button--text').innerText = window.theme.variantStrings.addToCart
    }

    // Update Option Labels
    const solidContainer = document.querySelector('.solid_swatches')
    const solidOptionLabel = solidContainer?.querySelector('span.form__label__value')
    const printContainer = document.querySelector('.print_swatches')
    const printOptionLabel = printContainer?.querySelector('span.form__label__value')

    if (isSolidColor) {
      if (solidOptionLabel) {
        solidOptionLabel.innerText = ` : ${matchingVariant.option1}`
      }
      if (printOptionLabel) {
        printOptionLabel.innerText = ''
      }
    } else if (isPrintColor) {
      if (solidOptionLabel) {
        solidOptionLabel.innerText = ''
      }
      if (printOptionLabel) {
        printOptionLabel.innerText = ` : ${matchingVariant.option1}`
      }
    }

    // Update FRENZY Bundles
    product_id_Frenzy = productData.id
    variant_id_Frenzy = matchingVariant.id
    if (product_id_Frenzy && variant_id_Frenzy) {
      frenzy_sku = `${product_id_Frenzy}_${variant_id_Frenzy}`
    }
    
    frenzyScriptReload()
    if (document.querySelector('.frenzy_bundle_id')) {
      $frenzy_bundle_event()
    }

    // Update Product Description
    const descriptionContainerDesktop = document.querySelector('.collapsible-content-desktop[data-product-template="true"] .section-description-wrapper')
    const descriptionContainerMobile = document.querySelector('.collapsible-content-mobile[data-product-template="true"] .section-description-wrapper')

    if (descriptionContainerDesktop) {
      descriptionContainerDesktop.innerHTML = ''
      descriptionContainerDesktop.innerHTML = productData.description
    }
    if (descriptionContainerMobile) {
      descriptionContainerMobile.innerHTML = ''
      descriptionContainerMobile.innerHTML = productData.description
    }

    // Update Product Features Accordions (Fit, Materials, etc.)
    updateProductAccordions(productData)
  }

  function updateProductAddToCartForm(productData, value) {
    let matchingVariant = productData.variants.find(variant => variant.option2 === value);
    if (!matchingVariant)  {
      matchingVariant = productData.variants.find(variant => variant.option1 === value);
    }
    const variantId = matchingVariant.id
    const productSlider = document.getElementById('Product-Slider')
    const sectionId = productSlider.getAttribute('data-section-id')
    const form = document.getElementById(`product-form-${sectionId}`)

    // Update Variant ID for Add to Cart
    form.querySelector('input[name="id"]').value = variantId

    // Update URL with Variant ID Parameter
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('variant')) {
      currentUrl.searchParams.set('variant', variantId);
    } else {
      currentUrl.searchParams.append('variant', variantId);
    }

    const currentParams = currentUrl.search; // Preserve any existing query parameters
    const currentPath = currentUrl.pathname; // Get the current path

    // Check if the current path includes '/products/'
    let newPath;
    if (currentPath.includes('/products/')) {
      newPath = currentPath.replace(/\/products\/[^/]+/, `/products/${productData.handle}`);
    }
    const newUrl = `${newPath}${currentParams}`;
    window.history.replaceState({}, '', newUrl);

  }

  function createNewSlides(productData, sectionId) {
    return productData.media.map((media, index) => {
      const slideDiv = document.createElement('div');
      slideDiv.id = `Slide-${sectionId}-${media.id}`;
      slideDiv.className = 'product-images__slide is-active';
      slideDiv.setAttribute('data-media-id', `${sectionId}-${media.id}`);

      const mediaDiv = document.createElement('div');
      mediaDiv.className = 'product-single__media product-single__media-image aspect-ratio aspect-ratio--adapt';
      mediaDiv.id = `Media-Thumbnails-${sectionId}-${media.id}`;
      mediaDiv.style.setProperty('--padding-bottom', '129.62962962962962%');

      const zoomLink = document.createElement('a')
      zoomLink.href = media.src
      zoomLink.className = 'product-single__media-zoom'
      zoomLink.setAttribute('data-msrc', media.src + '&width=20')
      zoomLink.setAttribute('data-h', media.height)
      zoomLink.setAttribute('data-w', media.width)
      zoomLink.setAttribute('target', '_blank')
      zoomLink.setAttribute('tab-index', '-1')
      zoomLink.title = 'Zoom'
      zoomLink.setAttribute('data-index', index)

      zoomLink.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.125 3.75H16.25V6.875" stroke="var(--color-body)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M11.875 8.125L16.25 3.75" stroke="var(--color-body)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M6.875 16.25H3.75V13.125" stroke="var(--color-body)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M8.125 11.875L3.75 16.25" stroke="var(--color-body)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M16.25 13.125V16.25H13.125" stroke="var(--color-body)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M11.875 11.875L16.25 16.25" stroke="var(--color-body)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M3.75 6.875V3.75H6.875" stroke="var(--color-body)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M8.125 8.125L3.75 3.75" stroke="var(--color-body)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      `

      const img = document.createElement('img');
      img.className = 'lazyautosizes';
      img.width = media.width;
      img.height = media.height;
      img.setAttribute('data-sizes', 'auto');
      img.src = media.src;
      img.setAttribute('data-srcset', `${media.src} 345w,${media.src} 610w,${media.src} 1220w`);
      img.setAttribute('fetchpriority', 'auto');
      img.alt = media.alt;
      img.sizes = '610px';
      img.srcset = `${media.src} 345w,${media.src} 610w,${media.src} 1220w`

      const noscript = document.createElement('noscript');
      const noscriptImg = document.createElement('img');
      noscriptImg.width = media.width;
      noscriptImg.height = media.height;
      noscriptImg.sizes = 'auto';
      noscriptImg.src = media.src;
      noscriptImg.srcset = `${media.src} 345w,${media.src} 610w,${media.src} 1220w`;
      noscriptImg.alt = media.alt;
      noscriptImg.setAttribute('fetchpriority', 'auto');
      noscriptImg.setAttribute('loading', 'lazy');

      noscript.appendChild(noscriptImg);

      mediaDiv.appendChild(zoomLink);
      mediaDiv.appendChild(img);
      mediaDiv.appendChild(noscript);

      slideDiv.appendChild(mediaDiv);
      return slideDiv;
    });
  }

  function addZoomToImages() {
    // Add Zoom
    const links = document.querySelectorAll('.product-single__media-zoom');
    const pswpElement = document.querySelectorAll('.pswp')[0];
    const pswpOptions = {
      maxSpreadZoom: 2,
      loop: false,
      allowPanToNext: false,
      closeOnScroll: false,
      showHideOpacity: false,
      arrowKeys: true,
      history: false,
      captionEl: false,
      fullscreenEl: false,
      zoomEl: false,
      shareEl: false,
      counterEl: true,
      arrowEl: true,
      preloaderEl: true
    };

    links.forEach((link => {
      link.addEventListener('click', (e) => zoomClick(e, link));
    }));

    function buildItems() {
      const slider = document.getElementById('Product-Slider')
      const activeImages = Array.from(slider.querySelectorAll('.product-images__slide.is-active .product-single__media-image'));
  
      return activeImages.map((item) => {
        let index = [].indexOf.call(item.parentNode.parentNode.children, item.parentNode);
  
        let activelink = item.querySelector('.product-single__media-zoom');
  
        activelink.dataset.index = index;
        return {
          src: activelink.getAttribute('href'),
          msrc: activelink.dataset.msrc,
          w: activelink.dataset.w,
          h: activelink.dataset.h
        };
      });
    }

    function zoomClick(e, link) {
      const items = buildItems()
      pswpOptions.index = parseInt(link.dataset.index, 10);
      if (typeof PhotoSwipe !== 'undefined') {
        let pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, pswpOptions);
        pswp.listen('firstUpdate', function () {
          pswp.listen('parseVerticalMargin', function (item) {
            item.vGap = {
              top: 50,
              bottom: 50
            };
          });
        });
        pswp.init();
      }
      e.preventDefault();
    }
  }

  function createNewThumbnail(media, sectionId) {
    const thumbDiv = document.createElement('div');
    thumbDiv.id = `Thumb-${sectionId}-${media.id}`;
    thumbDiv.className = 'product-thumbnail is-active product-images__slide-item--variant';

    const img = document.createElement('img');
    img.className = 'lazyautosizes';
    img.width = media.width;
    img.height = media.height;
    img.setAttribute('data-sizes', 'auto');
    img.src = media.src;
    img.setAttribute('data-srcset', `${media.src} 160w`);
    img.setAttribute('fetchpriority', 'auto');
    img.alt = media.alt;
    img.sizes = '80px';
    img.srcset = `${media.src} 160w`;

    const noscript = document.createElement('noscript');
    const noscriptImg = document.createElement('img');
    noscriptImg.width = media.width;
    noscriptImg.height = media.height;
    noscriptImg.sizes = 'auto';
    noscriptImg.src = media.src;
    noscriptImg.srcset = `${media.src} 160w`;
    noscriptImg.alt = media.alt;
    noscriptImg.setAttribute('fetchpriority', 'auto');
    noscriptImg.setAttribute('loading', 'lazy');

    noscript.appendChild(noscriptImg);
    thumbDiv.appendChild(img);
    thumbDiv.appendChild(noscript);

    return thumbDiv;
  }

  function updateThumbnails(productData, sectionId) {
    const thumbnailContainer = document.getElementById('Product-Thumbnails')
    thumbnailContainer.innerHTML = ''

    productData.media.forEach((media) => {
      const thumbnail = createNewThumbnail(media, sectionId);
      thumbnailContainer.appendChild(thumbnail);
    });

    attachThumbnailEvents(thumbnailContainer);
  }

  function attachThumbnailEvents(thumbnailContainer) {
    const thumbnails = thumbnailContainer.querySelectorAll('.product-thumbnail')
    const productSlider = document.getElementById('Product-Slider')
    productSlider.reInit();
    if (thumbnails.length > 0) {
      const firstThumbnail = thumbnails[0];
      firstThumbnail.classList.add('is-initial-selected');
    }
  }

  function createNewSizeSwatches(productData, storedSizeIndex) {
    const productSlider = document.getElementById('Product-Slider')
    const sectionId = productSlider.getAttribute('data-section-id')
    const fieldset = document.querySelector('fieldset[data-handle="size"]')
    const name = productData.options[1].name
    const position = productData.options[1].position
    const values = productData.options[1].values
    const productHandle = productData.handle
    const formLabel = fieldset.querySelector('.form__label')
    // Save the complete form label HTML (includes size chart modal if present)
    const formLabelHTML = formLabel ? formLabel.outerHTML : '<div class="form__label"> Size </div>'

    // Clear old sizes
    fieldset.innerHTML = formLabelHTML

    // Create inputs
    let selectedSize = null;
    values.forEach((value, index) => {
      const matchingVariant = productData.variants.find(variant => variant.option2 === value); // Find matching variant by option value

      // Create the size swatch input element
      const sizeSwatch = document.createElement('input');
      sizeSwatch.type = 'radio';
      sizeSwatch.id = `${sectionId}-${position}-${index}`;
      sizeSwatch.name = name;
      sizeSwatch.value = value;
      sizeSwatch.form = `product-form-${sectionId}`;
      sizeSwatch.setAttribute('data-product-handle', productHandle);
      sizeSwatch.setAttribute('data-index', index);
      if (parseInt(storedSizeIndex) === index) {
        sizeSwatch.setAttribute('checked', '')
        selectedSize = value
      }

      // Create label for input
      const sizeLabel = document.createElement('label')
      sizeLabel.setAttribute('for', `${sectionId}-${position}-${index}`)
      if (!matchingVariant.available) {
        sizeLabel.className = 'disabled-label'
      }
      
      // Create label span
      const labelSpan = document.createElement('span')
      labelSpan.innerText = value

      // Append elements
      fieldset.append(sizeSwatch)
      sizeLabel.append(labelSpan)
      fieldset.append(sizeLabel)
    })

    // Update the size label text while preserving any child elements (like modal links)
    const updatedFormLabel = fieldset.querySelector('.form__label')
    if (updatedFormLabel) {
      // Check if there's a .form__label__value span (like in color swatches)
      const labelValueSpan = updatedFormLabel.querySelector('.form__label__value');
      if (labelValueSpan) {
        labelValueSpan.innerText = ` ${selectedSize}`;
      } else {
        // Otherwise, update just the text node while preserving child elements
        const textNode = Array.from(updatedFormLabel.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
          textNode.textContent = `Size: ${selectedSize}`;
        } else {
          // If no text node exists, prepend one
          updatedFormLabel.prepend(`Size: ${selectedSize}`)
        }
      }
    }
  }

  function updateProductAccordions(productData) {
    // Find the section ID dynamically from the page
    const fitAccordion = document.querySelector('[id^="Accordion-collapsible_tab_PbMWpK-"]');

    // Gift cards and other products without accordions - nothing to update
    if (!fitAccordion) return;

    // Extract section ID from the accordion ID (format: Accordion-{blockId}-{sectionId})
    const accordionId = fitAccordion.id;
    const sectionId = accordionId.split('-').slice(2).join('-'); // Get everything after the second dash

    const productHandle = productData.handle;

    // Use Section Rendering API to fetch updated accordion content
    // Note: ?sections= (plural) returns JSON with section HTML
    fetch(`/products/${productHandle}?sections=${sectionId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch section: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {

        // The response is JSON with section HTML as a property
        let sectionHTML = data[sectionId];

        // If exact match not found, try to find the first key (sometimes API returns different format)
        if (!sectionHTML && Object.keys(data).length > 0) {
          const firstKey = Object.keys(data)[0];
          sectionHTML = data[firstKey];
        }

        if (!sectionHTML) {
          return;
        }

        // Create a temporary container to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionHTML;


        // Update Materials & Care accordion (collapsible_tab_b9gtFz)
        const materialsBlockId = 'collapsible_tab_b9gtFz';
        const materialsAccordionId = `Accordion-${materialsBlockId}-${sectionId}`;
        const newMaterialsContent = tempDiv.querySelector(`#${materialsAccordionId}`);
        const currentMaterialsContent = document.querySelector(`#${materialsAccordionId}`);

        if (newMaterialsContent && currentMaterialsContent) {
          currentMaterialsContent.innerHTML = newMaterialsContent.innerHTML;
        }

        // Update Size Chart accordion (collapsible_tab_bnbw4G)
        const sizeChartBlockId = 'collapsible_tab_bnbw4G';
        const sizeChartAccordionId = `Accordion-${sizeChartBlockId}-${sectionId}`;
        const newSizeChartContent = tempDiv.querySelector(`#${sizeChartAccordionId}`);
        const currentSizeChartContent = document.querySelector(`#${sizeChartAccordionId}`);

        if (newSizeChartContent && currentSizeChartContent) {
          currentSizeChartContent.innerHTML = newSizeChartContent.innerHTML;
        }

        // Update Fit accordion (collapsible_tab_PbMWpK)
        const fitBlockId = 'collapsible_tab_PbMWpK';
        const fitAccordionId = `Accordion-${fitBlockId}-${sectionId}`;
        const newFitContent = tempDiv.querySelector(`#${fitAccordionId}`);
        const currentFitContent = document.querySelector(`#${fitAccordionId}`);

        if (newFitContent && currentFitContent) {
          currentFitContent.innerHTML = newFitContent.innerHTML;
        } 

        // Handle Fit accordion visibility - hide if empty, show if has content
        const fitCollapsibleRow = document.querySelector(`#Details-${fitBlockId}-${sectionId}`)?.closest('collapsible-row');
        const newFitCollapsibleRow = tempDiv.querySelector(`#Details-${fitBlockId}-${sectionId}`)?.closest('collapsible-row');
        const metafieldContent = newFitCollapsibleRow?.querySelector('.collapsible__content');

        if (fitCollapsibleRow) {
          if (metafieldContent?.innerText.trim() !== '') {
            // New product has fit content - show it
            fitCollapsibleRow.style.display = 'block';
          } else {
            // New product doesn't have fit content - hide it
            fitCollapsibleRow.style.display = 'none';
          }
        }
      })
      .catch(error => {
        console.error('Error updating product accordions:', error);
      });
  }
}