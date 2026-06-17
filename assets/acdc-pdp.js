document.addEventListener("DOMContentLoaded", function() {
  // Move Shoppay Messaging
  let shoppay = document.querySelector('form.installment');
  let atc = document.querySelector('.product-add-to-cart-container');

  atc.appendChild(shoppay);
});