document.querySelectorAll('.tooltip-content').forEach(el => {
  const text = el.textContent.trim();
  if (text.startsWith('gid://shopify/TaxonomyValue/')) {
    const parent = el.closest('.swatch-option');
    const color = parent?.querySelector('[data-color]')?.getAttribute('data-color');
    if (color) el.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  }
});

function initDesktopScrollToggle() {
  const toggles = document.querySelectorAll('.pb-desktop-menu-toggle');
  if (!toggles.length) return;

  const SCROLL_THRESHOLD = 80; // px

  function updateToggleVisibility() {
    const isDesktop = window.innerWidth >= 1025;
    const scrolled = window.scrollY > SCROLL_THRESHOLD;

    toggles.forEach((toggle) => {
      if (isDesktop && scrolled) {
        toggle.classList.add('pb-desktop-menu-toggle--visible');
      } else {
        toggle.classList.remove('pb-desktop-menu-toggle--visible');
      }
    });
  }

  // Run once on load
  updateToggleVisibility();

  // Update on scroll and resize
  window.addEventListener('scroll', updateToggleVisibility);
  window.addEventListener('resize', updateToggleVisibility);
}

// Init when DOM is ready
document.addEventListener('DOMContentLoaded', initDesktopScrollToggle);

// For Shopify Theme Editor preview (when you reload only the header section)
document.addEventListener('shopify:section:load', function (event) {
  if (event.target.querySelector('.pb-desktop-menu-toggle')) {
    initDesktopScrollToggle();
  }
});
