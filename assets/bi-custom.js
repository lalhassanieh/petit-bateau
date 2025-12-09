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
  const menuToggle      = document.querySelector('.menu-toggle');
  const headerNav       = document.querySelector('.header-bottom__navigation.relative.color-default');
  const nativeNavToggle = document.querySelector('[data-action="toggle-nav"]');

  const DESKTOP_MIN_WIDTH   = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;


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
}

document.addEventListener('DOMContentLoaded', function () {
  const desktopMenu = document.querySelector('.verticalmenu-desktop');
  const overlay = document.querySelector('.vertical-menu-overlay-desktop');
  const toggleBtn = document.querySelector('.scroll-menu-wrapper .menu-toggle');

  if (!desktopMenu || !toggleBtn) return;

  function openMenu() {
    desktopMenu.classList.add('open-vertical');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    desktopMenu.classList.remove('open-vertical');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (desktopMenu.classList.contains('open-vertical')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Click on burger
  toggleBtn.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
  });

  // Click on overlay to close
  if (overlay) {
    overlay.addEventListener('click', function () {
      closeMenu();
    });
  }

  // ESC key closes menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeMenu();
    }
  });
});




document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
});
