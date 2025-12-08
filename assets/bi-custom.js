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

  const menuToggle   = document.querySelector('.menu-toggle');
  const verticalMenu = document.querySelector('.verticalmenu-mobile'); 
  const overlay      = document.querySelector('.vertical-menu-overlay');
  const headerNav    = document.querySelector('.header-bottom__navigation');

  console.log('[initDesktopMenuToggle] menuToggle:', menuToggle);
  console.log('[initDesktopMenuToggle] verticalMenu:', verticalMenu);
  console.log('[initDesktopMenuToggle] overlay:', overlay);
  console.log('[initDesktopMenuToggle] headerNav:', headerNav);

  if (!menuToggle) {
    console.warn('[initDesktopMenuToggle] .menu-toggle NOT found → abort');
    return;
  }

  const DESKTOP_MIN_WIDTH   = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;

  function openMenu() {
    console.log('[menu] openMenu() called');

    if (!verticalMenu) {
      console.warn('[menu] openMenu() → verticalMenu is null (no vertical menu on this page)');
      return;
    }

    verticalMenu.classList.add('is-open');
    verticalMenu.classList.remove('hidden');
    verticalMenu.classList.remove('block-1025');

    if (overlay) {
      overlay.classList.add('is-active');
      overlay.classList.remove('hidden');
    }

    document.documentElement.classList.add('no-scroll-menu');
  }

  function closeMenu() {
    console.log('[menu] closeMenu() called');

    if (!verticalMenu) {
      console.warn('[menu] closeMenu() → verticalMenu is null (no vertical menu on this page)');
      return;
    }

    verticalMenu.classList.remove('is-open');
    verticalMenu.classList.add('hidden');

    if (overlay) {
      overlay.classList.remove('is-active');
      overlay.classList.add('hidden');
    }

    document.documentElement.classList.remove('no-scroll-menu');
  }

  function toggleMenu() {
    if (!verticalMenu) {
      console.warn('[menu] toggleMenu() → verticalMenu is null (no vertical menu on this page)');
      return;
    }

    const isOpen = verticalMenu.classList.contains('is-open');
    console.log('[menu] toggleMenu() called, isOpen before:', isOpen);

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
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
      menuToggle.classList.remove('scroll-active');
      headerNav && headerNav.classList.remove('hide-on-scroll');

      if (verticalMenu) {
        closeMenu();
      }

      return;
    }

    if (scrollY > SHOW_AFTER_SCROLL_Y) {
      console.log('[menu] scroll > threshold → hide nav, show button');
      headerNav && headerNav.classList.add('hide-on-scroll');
      menuToggle.classList.add('scroll-active');
    } else {
      console.log('[menu] scroll at top → show nav, hide button');
      headerNav && headerNav.classList.remove('hide-on-scroll');
      menuToggle.classList.remove('scroll-active');

      if (verticalMenu) {
        closeMenu();
      }
    }
  }

  menuToggle.addEventListener('click', function (e) {
    console.log('[menuToggle] CLICK detected');
    e.preventDefault();
    toggleMenu();
  });

  if (overlay) {
    overlay.addEventListener('click', function () {
      console.log('[overlay] CLICK detected → closeMenu()');
      closeMenu();
    });
  }

  window.addEventListener('scroll', handleScrollOrResize);
  window.addEventListener('resize', handleScrollOrResize);
  console.log('[initDesktopMenuToggle] initial handleScrollOrResize() call');
  handleScrollOrResize();
}





document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
});
