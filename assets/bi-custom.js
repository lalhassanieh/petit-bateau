document.querySelectorAll('.tooltip-content').forEach(el => {
  const text = el.textContent.trim();
  if (text.startsWith('gid://shopify/TaxonomyValue/')) {
    const parent = el.closest('.swatch-option');
    const color = parent?.querySelector('[data-color]')?.getAttribute('data-color');
    if (color) el.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  }
});

function initDesktopScrollToggle() {
  console.log('[initDesktopScrollToggle] called');

  const toggles = document.querySelectorAll('.pb-desktop-menu-toggle');
  console.log('[initDesktopScrollToggle] found toggles:', toggles.length);

  if (!toggles.length) {
    console.warn('[initDesktopScrollToggle] No .pb-desktop-menu-toggle elements found');
    return;
  }

  const SCROLL_THRESHOLD = 80; // px
  let hasActivated = false;    // once true, we never hide again on this page load

  function updateToggleVisibility() {
    const isDesktop = window.innerWidth >= 1025;
    const scrolled = window.scrollY > SCROLL_THRESHOLD;

    console.log(
      '[updateToggleVisibility]',
      'scrollY=', window.scrollY,
      '| isDesktop=', isDesktop,
      '| scrolledEnough=', scrolled,
      '| hasActivated=', hasActivated
    );

    // On mobile: always hide (we only want this on desktop)
    if (!isDesktop) {
      toggles.forEach((toggle, index) => {
        if (toggle.classList.contains('pb-desktop-menu-toggle--visible')) {
          console.log(`[updateToggleVisibility] HIDE on mobile toggle #${index}`);
        }
        toggle.classList.remove('pb-desktop-menu-toggle--visible');
      });
      return;
    }

    // Desktop:
    // - Before threshold: keep hidden
    // - Once past threshold: show & remember (hasActivated = true)
    // - After that: never hide again even if scroll back up
    if (!hasActivated && scrolled) {
      toggles.forEach((toggle, index) => {
        console.log(`[updateToggleVisibility] FIRST TIME SHOW toggle #${index}`);
        toggle.classList.add('pb-desktop-menu-toggle--visible');
      });
      hasActivated = true;
    }

    // If hasActivated is already true, do nothing (keep it visible)
  }

  // Run once on load
  updateToggleVisibility();

  // Update on scroll and resize
  window.addEventListener('scroll', updateToggleVisibility);
  window.addEventListener('resize', updateToggleVisibility);

  console.log('[initDesktopScrollToggle] listeners attached');
}

// Init when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  console.log('[DOMContentLoaded] firing initDesktopScrollToggle');
  initDesktopScrollToggle();
});

// For Shopify Theme Editor preview (when reloading header section)
document.addEventListener('shopify:section:load', function (event) {
  if (event.target.querySelector('.pb-desktop-menu-toggle')) {
    console.log('[shopify:section:load] header section reloaded, re-init toggle');
    initDesktopScrollToggle();
  }
});
