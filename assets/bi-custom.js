document.querySelectorAll('.tooltip-content').forEach(el => {
  const text = el.textContent.trim();
  if (text.startsWith('gid://shopify/TaxonomyValue/')) {
    const parent = el.closest('.swatch-option');
    const color = parent?.querySelector('[data-color]')?.getAttribute('data-color');
    if (color) el.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  }
});
console.log("bi-custom.js loaded successfully");

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");

    if (!menuToggle) {
        console.log("Menu toggle not found");
        return;
    }

    console.log("Menu toggle found");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 80) { 
            menuToggle.classList.add("active");
            console.log("Scroll > 80 → menu shown");
        } else {
            menuToggle.classList.remove("active");
            console.log("Scroll < 80 → menu hidden");
        }
    });
});
