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
  console.log('[initDesktopMenuToggle] starting…');

  const menuToggle      = document.querySelector('.menu-toggle'); // your round button
  const headerNav       = document.querySelector('.header-bottom__navigation.relative.color-default');
  const nativeNavToggle = document.querySelector('[data-action="toggle-nav"]'); // theme hamburger

  console.log('[initDesktopMenuToggle] menuToggle:', menuToggle);
  console.log('[initDesktopMenuToggle] headerNav:', headerNav);
  console.log('[initDesktopMenuToggle] nativeNavToggle:', nativeNavToggle);

  if (!menuToggle) {
    console.warn('[initDesktopMenuToggle] .menu-toggle NOT found → abort');
    return;
  }

  const DESKTOP_MIN_WIDTH   = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;

  function openMenu() {
    console.log('[menu] openMenu() → trigger nativeNavToggle');
    if (nativeNavToggle) {
      nativeNavToggle.click(); // reuse theme logic to open nav <nav class="mobile navigation ...">
    } else {
      console.warn('[menu] openMenu() → nativeNavToggle not found');
    }
  }

  function toggleMenu() {
    // We don’t try to track open/close state ourselves.
    // Just delegate to theme each time – it will toggle correctly.
    openMenu();
  }

  function handleScrollOrResize() {
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const scrollY   = window.scrollY || window.pageYOffset;

    console.log('[menu] handleScrollOrResize()', {
      isDesktop,
      scrollY,
      width: window.innerWidth
    });

    if (!isDesktop) {
      // On mobile: DO NOT touch nav, leave everything to theme
      menuToggle.classList.remove('scroll-active');
      if (headerNav) headerNav.classList.remove('hide-on-scroll');
      return;
    }

    if (scrollY > SHOW_AFTER_SCROLL_Y) {
      console.log('[menu] scroll > threshold → hide nav, show button');
      if (headerNav) headerNav.classList.add('hide-on-scroll');
      menuToggle.classList.add('scroll-active');
    } else {
      console.log('[menu] scroll at top → show nav, hide button');
      if (headerNav) headerNav.classList.remove('hide-on-scroll');
      menuToggle.classList.remove('scroll-active');
    }
  }

  menuToggle.addEventListener('click', function (e) {
    console.log('[menuToggle] CLICK detected');
    e.preventDefault();
    toggleMenu();
  });

  window.addEventListener('scroll', handleScrollOrResize);
  window.addEventListener('resize', handleScrollOrResize);

  console.log('[initDesktopMenuToggle] initial handleScrollOrResize() call');
  handleScrollOrResize();
}





document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
});
