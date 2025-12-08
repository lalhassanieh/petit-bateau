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

  if (!menuToggle || !verticalMenu) {
    console.warn('[verticalMenuToggle] menuToggle or verticalMenu not found');
    return;
  }

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
    // хотим, чтобы это работало ТОЛЬКО на десктопе;
    // на мобилке пусть всё остаётся как в теме
    if (!isDesktop()) {
      return; // мобилка – выходим, не мешаем nav-toggle
    }

    e.preventDefault();
    e.stopPropagation();

    if (verticalMenu.classList.contains('open-vertical')) {
      closeVertical();
    } else {
      openVertical();
    }
  }

  // клик по твоей кнопке – открываем/закрываем вертикальное меню на десктопе
  menuToggle.addEventListener('click', toggleVertical);

  // клик по оверлею – закрыть меню
  if (overlay) {
    overlay.addEventListener('click', function () {
      closeVertical();
    });
  }

  // если ушли в мобилку по resize – на всякий случай закроем
  window.addEventListener('resize', function () {
    if (!isDesktop()) {
      closeVertical();
    }
  });
});





document.addEventListener("DOMContentLoaded", () => {
    initFixedTopbarHeader();
});
