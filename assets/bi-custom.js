document.querySelectorAll('.tooltip-content').forEach(el => {
  const text = el.textContent.trim();
  if (text.startsWith('gid://shopify/TaxonomyValue/')) {
    const parent = el.closest('.swatch-option');
    const color = parent?.querySelector('[data-color]')?.getAttribute('data-color');
    if (color) el.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  }
});
console.log("bi-custom.js loaded successfully");

document.addEventListener('scroll', () => {
    const scrollMenu = document.querySelector('.scroll-menu-wrapper');

    if (scrollMenu) {
        if (window.scrollY > 100) {
            scrollMenu.classList.add('visible');
        } else {
            scrollMenu.classList.remove('visible');
        }
    }
});
