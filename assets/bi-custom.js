document.querySelectorAll('.tooltip-content').forEach(el => {
  const text = el.textContent.trim();
  if (text.startsWith('gid://shopify/TaxonomyValue/')) {
    const parent = el.closest('.swatch-option');
    const color = parent?.querySelector('[data-color]')?.getAttribute('data-color');
    if (color) el.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  }
});

function initDesktopScrollToggle() {
  const desktopToggle = document.querySelector('.pb-desktop-menu-toggle');
  if (!desktopToggle) return;

  function updateToggleVisibility() {
    const isDesktop = window.innerWidth >= 1025;
    const scrolled = window.scrollY > 80; 

    if (isDesktop && scrolled) {
      desktopToggle.classList.add('pb-desktop-menu-toggle--visible');
    } else {
      desktopToggle.classList.remove('pb-desktop-menu-toggle--visible');
    }
  }

  updateToggleVisibility();
  window.addEventListener('scroll', updateToggleVisibility);
  window.addEventListener('resize', updateToggleVisibility);
}

document.addEventListener('DOMContentLoaded', initDesktopScrollToggle);
