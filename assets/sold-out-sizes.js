// document.addEventListener('product:variant-change', function(event) {
//   // console.log('event detail:', event.detail.variants)
//   const variantList = event.detail.variants
// })

// document.addEventListener('product:variant-loaded', function(event) {
//   console.log('event detail:', event.detail.variants)
//   const variantList = event.detail.variants
// })

// Function to update labels based on variant availability
function updateLabelsBasedOnAvailability(variantList) {
  const sizeInputs = document.querySelectorAll('input[name="Size"]');

  sizeInputs.forEach(function(input) {
    const label = document.querySelector(`label[for="${input.id}"]`);

    // Find the matching variant for this input value
    const matchingVariant = variantList.find(variant => variant.option2 === input.value);

    if (matchingVariant) {
      // Check if the variant is not available
      if (!matchingVariant.available) {
        label.classList.add('disabled-label');
      } else {
        label.classList.remove('disabled-label');
      }
    }
  });
}

// Event listener for when the page loads
document.addEventListener('product:variant-loaded', function(event) {
  const variantList = event.detail.variants
  updateLabelsBasedOnAvailability(variantList);
});

// Event listener for when the variant changes
document.addEventListener('product:variant-change', function(event) {
  const variantList = event.detail.variants
  updateLabelsBasedOnAvailability(variantList);
});
