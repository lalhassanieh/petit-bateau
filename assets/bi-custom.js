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

function initDesktopMenu() {
  const menuToggle  = document.querySelector('.menu-toggle');
  const headerNav   = document.querySelector('.header-bottom__navigation.relative.color-default');
  const desktopMenu = document.querySelector('.verticalmenu-desktop');
  const overlay     = document.querySelector('.vertical-menu-overlay-desktop');
  const closeBtns   = document.querySelectorAll('.verticalmenu-desktop .close-menu');

  const DESKTOP_MIN_WIDTH   = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;

  if (!menuToggle || !desktopMenu || !overlay) {
    console.warn("⚠️ Desktop menu elements missing.");
    return;
  }

  console.log("🔥 initDesktopMenu() started");

  let previousBodyOverflow = "";

  function handleScrollOrResize() {
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const scrollY   = window.scrollY || window.pageYOffset;

    if (!isDesktop) {
      menuToggle.classList.remove('scroll-active');
      headerNav?.classList.remove('hide-on-scroll');
      desktopMenu.classList.remove('open-vertical');
      overlay.classList.remove('visible');
      document.body.style.overflow = previousBodyOverflow;
      document.body.classList.remove('vertical-menu-open');
      return;
    }

    if (desktopMenu.classList.contains('open-vertical')) return;

    if (scrollY > SHOW_AFTER_SCROLL_Y) {
      headerNav?.classList.add('hide-on-scroll');
      menuToggle.classList.add('scroll-active');
    } else {
      headerNav?.classList.remove('hide-on-scroll');
      menuToggle.classList.remove('scroll-active');
    }
  }

  function openMenu() {
    if (desktopMenu.classList.contains('open-vertical')) return;

    console.log("📂 Opening vertical menu…");
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';    
    document.body.classList.add('vertical-menu-open');

    desktopMenu.classList.add('open-vertical');
    overlay.classList.add('visible');
  }

  function closeMenu() {
    if (!desktopMenu.classList.contains('open-vertical')) return;

    console.log("❌ Closing vertical menu…");
    desktopMenu.classList.remove('open-vertical');
    overlay.classList.remove('visible');

    document.body.style.overflow = previousBodyOverflow; 
    document.body.classList.remove('vertical-menu-open');

    handleScrollOrResize();
  }


  menuToggle.addEventListener('click', () => {
    const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    if (!isDesktop) return;
    if (!desktopMenu.classList.contains('open-vertical')) {
      openMenu();
    }
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
    });
  });

  window.addEventListener('scroll', handleScrollOrResize);
  window.addEventListener('resize', handleScrollOrResize);

  handleScrollOrResize();

  console.log("✅ Desktop menu initialized");
}



document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenu();
    initVerticalMenu();
});
