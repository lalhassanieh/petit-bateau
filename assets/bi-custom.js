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

document.addEventListener('DOMContentLoaded', function () {
  const menuToggle   = document.querySelector('.menu-toggle');
  const verticalMenu = document.querySelector('.verticalmenu-mobile.vertical-menu');
  const overlay      = document.querySelector('.vertical-menu-overlay');

  const DESKTOP_MIN_WIDTH = 1025;

  function isDesktop() {
    return window.innerWidth >= DESKTOP_MIN_WIDTH;
  }

  function openVertical() {
    verticalMenu.classList.add('open-vertical');
  }

  function closeVertical() {
    verticalMenu.classList.remove('open-vertical');
  }

  function toggleVertical(e) {
    // работаем только на десктопе, на мобиле не трогаем стандартное меню
    if (!isDesktop()) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (verticalMenu.classList.contains('open-vertical')) {
      closeVertical();
    } else {
      openVertical();
    }
  }

  // <<< ВАЖНО: НИКАКИХ return ВЫШЕ НЕТ >>>
  if (menuToggle && verticalMenu) {
    // добавляем только обработчики — ничего не скрываем
    menuToggle.addEventListener('click', toggleVertical);

    if (overlay) {
      overlay.addEventListener('click', function () {
        closeVertical();
      });
    }

    window.addEventListener('resize', function () {
      if (!isDesktop()) {
        closeVertical();
      }
    });
  } else {
    console.warn('[verticalMenuToggle] menuToggle or verticalMenu not found');
  }
});




document.addEventListener("DOMContentLoaded", () => {
    initFixedTopbarHeader();
});
