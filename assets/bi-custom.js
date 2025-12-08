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
  const menuToggle      = document.querySelector('.menu-toggle'); // your button
  const headerNav       = document.querySelector('.header-bottom__navigation.relative.color-default');
  const nativeNavToggle = document.querySelector('[data-action="toggle-nav"]'); // theme's original burger

  const DESKTOP_MIN_WIDTH   = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;

  // If button or original toggle is missing, do nothing
  if (!menuToggle || !nativeNavToggle) return;

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

  // 👉 CLICK LOGIC FOR YOUR BUTTON
  menuToggle.addEventListener('click', function () {
    const html     = document.documentElement;
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;

    if (!isDesktop) return; // safety, your button is desktop-only anyway

    const willOpen = !html.classList.contains('nav-open'); // drawer state *before* click

    // Use theme's own logic to open/close the off-canvas nav
    nativeNavToggle.click();

    // If we are opening the drawer now, switch to vertical menu
    if (willOpen) {
      // Mark that we are using vertical menu mode
      html.classList.add('nav-verticalmenu');

      // Click the "vertical menu" tab inside the drawer
      const verticalTab = document.querySelector(
        '.menu-mobile-title [data-menu="verticalmenu-list"]'
      );
      if (verticalTab) {
        verticalTab.click();
      }
    }
  });
}



document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
});
