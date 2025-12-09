document.querySelectorAll('.tooltip-content').forEach(el => {
  const text = el.textContent.trim();
  if (text.startsWith('gid://shopify/TaxonomyValue/')) {
    const parent = el.closest('.swatch-option');
    const color = parent?.querySelector('[data-color]')?.getAttribute('data-color');
    if (color) el.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  }
});


function initFixedTopbarHeader() {
    const topbar = document.querySelector("#topbar");
    const header = document.querySelector(".header");

    function updateHeights() {
        const topbarHeight = topbar.offsetHeight;
        const headerHeight = header.offsetHeight;

        document.body.style.setProperty("--topbar-height", topbarHeight + "px");
        document.body.style.setProperty("--header-height", headerHeight + "px");
    }

    updateHeights();

    window.addEventListener("resize", updateHeights);
}


function initDesktopMenuToggle() {
  console.log('[Menu] initDesktopMenuToggle: starting');

  const menuToggle      = document.querySelector('.menu-toggle');
  const headerNav       = document.querySelector('.header-bottom__navigation.relative.color-default');
  const nativeNavToggle = document.querySelector('[data-action="toggle-nav"]');
  const mobileNav       = document.querySelector('nav.navigation.mobile');

  const DESKTOP_MIN_WIDTH   = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;

  console.log('[Menu] menuToggle =', menuToggle);
  console.log('[Menu] headerNav =', headerNav);
  console.log('[Menu] nativeNavToggle =', nativeNavToggle);
  console.log('[Menu] mobileNav =', mobileNav);

  if (!menuToggle) {
    console.warn('[Menu] .menu-toggle NOT FOUND. Exit.');
    return;
  }

  function handleScrollOrResize() {
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const scrollY   = window.scrollY || window.pageYOffset;

    if (!isDesktop) {
      menuToggle.classList.remove('scroll-active');
      if (headerNav) headerNav.classList.remove('hide-on-scroll');
      return;
    }

    if (scrollY > SHOW_AFTER_SCROLL_Y) {
      if (headerNav) headerNav.classList.add('hide-on-scroll');
      menuToggle.classList.add('scroll-active');
    } else {
      if (headerNav) headerNav.classList.remove('hide-on-scroll');
      menuToggle.classList.remove('scroll-active');
    }
  }

  window.addEventListener('scroll', handleScrollOrResize);
  window.addEventListener('resize', handleScrollOrResize);
  handleScrollOrResize();
  console.log('[Menu] Scroll/resize listeners attached');

  // CLICK HANDLER
  menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    console.log('[Menu] .menu-toggle CLICKED, isDesktop =', isDesktop);

    if (!isDesktop) {
      // 📱 MOBILE → use native toggle
      if (nativeNavToggle) {
        console.log('[Menu] Mobile: using nativeNavToggle.click()');
        nativeNavToggle.click();
      } else {
        console.warn('[Menu] Mobile: nativeNavToggle NOT FOUND');
      }
      return;
    }

    // 🖥 DESKTOP → manual sidebar logic
    if (!mobileNav) {
      console.warn('[Menu] Desktop: mobileNav NOT FOUND');
      return;
    }

    const willOpen = !mobileNav.classList.contains('is-open-desktop');
    console.log('[Menu] Desktop: toggling sidebar, willOpen =', willOpen);

    mobileNav.classList.toggle('is-open-desktop', willOpen);
    document.documentElement.classList.toggle('menu-open-desktop', willOpen);
  });
}

// Init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    console.log('[Menu] DOMContentLoaded fired');
    initDesktopMenuToggle();
  });
} else {
  console.log('[Menu] DOM already ready, calling initDesktopMenuToggle()');
  initDesktopMenuToggle();
}


document.addEventListener("DOMContentLoaded", () => {
    initFixedTopbarHeader();
});
