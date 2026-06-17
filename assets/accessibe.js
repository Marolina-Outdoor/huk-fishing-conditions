window.addEventListener('DOMContentLoaded', () => {
  const accessibeTrigger = document.querySelector('button[data-acsb-custom-trigger]');
  const accessibeHide = document.querySelector('link[href*="accessibe"]');

  if (sessionStorage.getItem("accessibeShow") === "true") {
      accessibeHide.remove()
  }

  accessibeTrigger?.addEventListener('click', () => {
      accessibeHide.remove();
      sessionStorage.setItem("accessibeShow", "true");
  });
});