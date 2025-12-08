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


function hideNavOnScroll() {
  const navBar = document.querySelector('.header-bottom__navigation');
  if (!navBar) return;

  let lastScroll = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 50) {
      navBar.classList.add('hide-on-scroll');
    } 
    else {
      navBar.classList.remove('hide-on-scroll');
    }

    lastScroll = currentScroll;
  });
}

hideNavOnScroll();
console.log("Navigation collapse on scroll initialized");

function initDesktopVerticalMenu() {
    const navToggle = document.querySelector('[data-action="toggle-nav"]');
    const verticalMenu = document.querySelector('.verticalmenu-mobile');
    const verticalOverlay = document.querySelector('.vertical-menu-overlay');

    if (!navToggle || !verticalMenu) {
        console.warn("Vertical menu elements not found!");
        return;
    }

    function openVerticalMenu() {
        verticalMenu.classList.add('is-open');
        if (verticalOverlay) verticalOverlay.classList.add('is-open');
        document.documentElement.classList.add('vertical-menu-open');
    }

    function closeVerticalMenu() {
        verticalMenu.classList.remove('is-open');
        if (verticalOverlay) verticalOverlay.classList.remove('is-open');
        document.documentElement.classList.remove('vertical-menu-open');
    }

    function toggleVerticalMenuDesktop(e) {
       
        if (window.innerWidth >= 1025) {
            e.preventDefault();
            e.stopPropagation();

            if (verticalMenu.classList.contains('is-open')) {
                closeVerticalMenu();
            } else {
                openVerticalMenu();
            }
        }
    }

    navToggle.addEventListener('click', toggleVerticalMenuDesktop);

    if (verticalOverlay) {
        verticalOverlay.addEventListener('click', closeVerticalMenu);
    }

    verticalMenu.querySelectorAll('.close-menu').forEach(btn => {
        btn.addEventListener('click', closeVerticalMenu);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === "Escape" && verticalMenu.classList.contains('is-open')) {
            closeVerticalMenu();
        }
    });
}

document.addEventListener("DOMContentLoaded", initDesktopVerticalMenu);
