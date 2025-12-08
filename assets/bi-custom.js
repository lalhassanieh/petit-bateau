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
  console.log('[initDesktopMenuToggle] START');

  const menuToggle      = document.querySelector('.menu-toggle');
  const headerNav       = document.querySelector('.header-bottom__navigation.relative.color-default');
  const nativeNavToggle = document.querySelector('[data-action="toggle-nav"]');
  const verticalMenu    = document.querySelector('.js-vertical-menu-desktop');

  console.log('[refs] menuToggle:', menuToggle);
  console.log('[refs] headerNav:', headerNav);
  console.log('[refs] nativeNavToggle:', nativeNavToggle);
  console.log('[refs] verticalMenu:', verticalMenu);

  const DESKTOP_MIN_WIDTH   = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;

  if (!menuToggle) {
    console.warn('[initDesktopMenuToggle] ❌ menuToggle NOT FOUND');
    return;
  }

  function isDesktop() {
    const value = window.innerWidth >= DESKTOP_MIN_WIDTH;
    console.log('[isDesktop] →', value, 'width=', window.innerWidth);
    return value;
  }

  function handleScrollOrResize() {
    const desktop = isDesktop();
    const scrollY = window.scrollY || window.pageYOffset;

    console.log('[handleScrollOrResize]', { desktop, scrollY });

    if (!desktop) {
      menuToggle.classList.remove('scroll-active');
      headerNav && headerNav.classList.remove('hide-on-scroll');
      console.log('[handleScrollOrResize] → MOBILE mode');
      return;
    }

    if (scrollY > SHOW_AFTER_SCROLL_Y) {
      headerNav && headerNav.classList.add('hide-on-scroll');
      menuToggle.classList.add('scroll-active');
      console.log('[handleScrollOrResize] → DESKTOP: show button, hide nav');
    } else {
      headerNav && headerNav.classList.remove('hide-on-scroll');
      menuToggle.classList.remove('scroll-active');
      console.log('[handleScrollOrResize] → DESKTOP: restore nav');
    }
  }

  
  function toggleVerticalMenuDesktop() {
    console.log('[toggleVerticalMenuDesktop] CALLED');

    if (!verticalMenu) {
      console.warn('[toggleVerticalMenuDesktop] ❌ verticalMenu NOT FOUND');
      return;
    }

    verticalMenu.classList.toggle('open-vertical');

    console.log(
      '[toggleVerticalMenuDesktop] open-vertical =',
      verticalMenu.classList.contains('open-vertical')
    );
  }

  menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('[menuToggle] CLICK!');

    if (isDesktop()) {
      console.log('[menuToggle] Desktop click → toggling vertical menu');
      toggleVerticalMenuDesktop();
    } else {
      console.log('[menuToggle] Mobile click → triggering nativeNavToggle');
      if (nativeNavToggle) nativeNavToggle.click();
    }
  });

  window.addEventListener('scroll', handleScrollOrResize);
  window.addEventListener('resize', handleScrollOrResize);

  console.log('[initDesktopMenuToggle] FIRST RUN handleScrollOrResize()');
  handleScrollOrResize();
}


document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
});
