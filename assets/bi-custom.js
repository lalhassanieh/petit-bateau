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
  const nativeNavToggle = document.querySelector(
    '[data-action="toggle-nav"], [data-action="open-nav"], [data-action="open-menu"]'
  );

  const DESKTOP_MIN_WIDTH   = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;

  console.log('[Menu] menuToggle =', menuToggle);
  console.log('[Menu] headerNav =', headerNav);
  console.log('[Menu] nativeNavToggle =', nativeNavToggle);

  if (!menuToggle) {
    console.warn('[Menu] .menu-toggle NOT FOUND. Click handler will never fire.');
    return;
  }

  // 👉 scroll/resize logic
  function handleScrollOrResize() {
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const scrollY   = window.scrollY || window.pageYOffset;

    // Debug
    // console.log('[Menu] handleScrollOrResize, isDesktop=', isDesktop, 'scrollY=', scrollY);

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

  // 👉 CLICK HANDLER
  menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('[Menu] .menu-toggle CLICKED');

    // 1) Try theme native toggle first
    if (nativeNavToggle) {
      console.log('[Menu] Using nativeNavToggle.click()');
      nativeNavToggle.click();
      return;
    }

    // 2) Fallback: manually open the mobile nav
    const mobileNav = document.querySelector('nav.navigation.mobile');
    console.log('[Menu] mobileNav =', mobileNav);

    if (!mobileNav) {
      console.warn('[Menu] nav.navigation.mobile NOT FOUND – cannot open menu.');
      return;
    }

    const nowOpen = !mobileNav.classList.contains('is-open');
    mobileNav.classList.toggle('is-open');
    document.documentElement.classList.toggle('menu-open', nowOpen);

    console.log('[Menu] mobileNav.is-open =', nowOpen);
  });
}

// Init after DOM is ready
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
