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
  const menuToggle = document.querySelector('.menu-toggle');
  const headerNav = document.querySelector('.header-bottom__navigation');
  const verticalMenu = document.querySelector('.verticalmenu-desktop');
  const overlay = document.querySelector('.vertical-menu-overlay-desktop');

  if (!menuToggle || !verticalMenu) return;

  const DESKTOP_MIN_WIDTH = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;

  function handleScrollOrResize() {
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const scrollY = window.scrollY || window.pageYOffset;

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

  function openVerticalMenu() {
    verticalMenu.classList.add('open-vertical');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeVerticalMenu() {
    verticalMenu.classList.remove('open-vertical');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // Toggle menu on button click
  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (verticalMenu.classList.contains('open-vertical')) {
      closeVerticalMenu();
    } else {
      openVerticalMenu();
    }
  });

  // Close menu on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeVerticalMenu);
  }

  // Close menu on close button click
  document.addEventListener('click', (e) => {
    if (e.target.closest('.close-menu') && verticalMenu.classList.contains('open-vertical')) {
      closeVerticalMenu();
    }
  });

  window.addEventListener('scroll', handleScrollOrResize);
  window.addEventListener('resize', handleScrollOrResize);

  handleScrollOrResize();
}


document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
});
