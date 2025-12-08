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
  const verticalMenu = document.querySelector('.verticalmenu-mobile'); 
  const overlay = document.querySelector('.vertical-menu-overlay');  
  const headerNav = document.querySelector('.header-bottom__navigation');

  if (!menuToggle) {
    console.warn('[menu-toggle] Button not found');
    return;
  }

  const DESKTOP_MIN_WIDTH = 1025;
  const SHOW_AFTER_SCROLL_Y = 120; 

  function openMenu() {
    if (!verticalMenu) return;

    verticalMenu.classList.add('is-open');
    verticalMenu.classList.remove('hidden-1025'); 
    overlay && overlay.classList.add('is-active');

    document.documentElement.classList.add('no-scroll-menu');
  }

  function closeMenu() {
    if (!verticalMenu) return;

    verticalMenu.classList.remove('is-open');
    overlay && overlay.classList.remove('is-active');
    document.documentElement.classList.remove('no-scroll-menu');
  }

  function toggleMenu() {
    if (!verticalMenu) return;
    const isOpen = verticalMenu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function handleScrollOrResize() {
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const scrollY = window.scrollY || window.pageYOffset;

    if (!isDesktop) {
      menuToggle.classList.remove('scroll-active');
      headerNav && headerNav.classList.remove('hide-on-scroll');
      closeMenu();
      return;
    }

    if (scrollY > SHOW_AFTER_SCROLL_Y) {
      headerNav && headerNav.classList.add('hide-on-scroll');
      menuToggle.classList.add('scroll-active');
    } else {
      headerNav && headerNav.classList.remove('hide-on-scroll');
      menuToggle.classList.remove('scroll-active');
      closeMenu();
    }
  }

  menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
  });

  if (overlay) {
    overlay.addEventListener('click', function () {
      closeMenu();
    });
  }

  window.addEventListener('scroll', handleScrollOrResize);
  window.addEventListener('resize', handleScrollOrResize);
  handleScrollOrResize();
}




document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
});
