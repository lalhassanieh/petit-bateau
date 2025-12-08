document.querySelectorAll('.tooltip-content').forEach(el => {
  const text = el.textContent.trim();
  if (text.startsWith('gid://shopify/TaxonomyValue/')) {
    const parent = el.closest('.swatch-option');
    const color = parent?.querySelector('[data-color]')?.getAttribute('data-color');
    if (color) el.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  }
});


document.addEventListener("DOMContentLoaded", () => {

  console.log("Topbar/Header fixed mode loaded");

  const topbar = document.querySelector("#topbar");
  const header = document.querySelector(".header");

  if (!topbar || !header) {
    console.warn("Topbar or header missing");
    return;
  }

  const topbarHeight = topbar.offsetHeight;
  const headerHeight = header.offsetHeight;

  document.body.style.setProperty("--topbar-height", topbarHeight + "px");
  document.body.style.setProperty("--header-height", headerHeight + "px");

  window.addEventListener("resize", () => {
    document.body.style.setProperty("--topbar-height", topbar.offsetHeight + "px");
    document.body.style.setProperty("--header-height", header.offsetHeight + "px");
  });

});


function initHeaderBottomShowOnlyOnTop() {
    const nav = document.querySelector('.header-bottom__navigation');

    if (!nav) {
        console.warn('No .header-bottom__navigation element found');
        return;
    }

    function updateHeaderNavVisibility() {
        const scrollY = window.scrollY || window.pageYOffset;

        if (window.innerWidth >= 1025) {
            if (scrollY === 0) {
                nav.classList.remove('hide-on-scroll');
            } else {
                nav.classList.add('hide-on-scroll');
            }
        } else {
            nav.classList.remove('hide-on-scroll');
        }
    }

    updateHeaderNavVisibility();

    window.addEventListener('scroll', updateHeaderNavVisibility, { passive: true });

    window.addEventListener('resize', updateHeaderNavVisibility);
}

document.addEventListener('DOMContentLoaded', initHeaderBottomShowOnlyOnTop);
