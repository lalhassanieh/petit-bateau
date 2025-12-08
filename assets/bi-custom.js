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
  const verticalMenu    = document.querySelector('.js-vertical-menu-desktop'); // ⬅ наш десктопный вертикальный

  const DESKTOP_MIN_WIDTH   = 1025;
  const SHOW_AFTER_SCROLL_Y = 120;

  if (!menuToggle) return;

  function isDesktop() {
    return window.innerWidth >= DESKTOP_MIN_WIDTH;
  }

  function handleScrollOrResize() {
    const desktop = isDesktop();
    const scrollY = window.scrollY || window.pageYOffset;

    if (!desktop) {
      // Мобильный / планшет → ведём себя как обычно
      menuToggle.classList.remove('scroll-active');
      if (headerNav) headerNav.classList.remove('hide-on-scroll');
      return;
    }

    // Десктоп → показываем кнопку после скролла, прячем нав
    if (scrollY > SHOW_AFTER_SCROLL_Y) {
      if (headerNav) headerNav.classList.add('hide-on-scroll');
      menuToggle.classList.add('scroll-active');
    } else {
      if (headerNav) headerNav.classList.remove('hide-on-scroll');
      menuToggle.classList.remove('scroll-active');
    }
  }

  function toggleVerticalMenuDesktop() {
    if (!verticalMenu) return;
    verticalMenu.classList.toggle('open-vertical');
    // overlay сам включается по CSS через :is(.open-vertical)
  }

  menuToggle.addEventListener('click', function (e) {
    e.preventDefault();

    if (isDesktop()) {
      // 💻 ДЕСКТОП: открываем/закрываем левое вертикальное меню
      toggleVerticalMenuDesktop();
    } else {
      // 📱 МОБИЛА: оставляем нативное поведение Shopify
      if (nativeNavToggle) {
        nativeNavToggle.click();
      }
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
