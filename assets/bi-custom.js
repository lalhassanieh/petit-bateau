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

function initVerticalMenu() {
    const toggleBtn = document.querySelector(".menu-toggle");
    const desktopMenu = document.querySelector(".verticalmenu-desktop");
    const overlay = document.querySelector(".vertical-menu-overlay-desktop");
    const DESKTOP_MIN_WIDTH = 1025;

    if (!desktopMenu || !overlay) return;

    function isDesktop() {
        return window.innerWidth >= DESKTOP_MIN_WIDTH;
    }

    function openMenu() {
        if (!isDesktop()) return;
        
        desktopMenu.classList.add("open-vertical");
        overlay.classList.add("visible");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        desktopMenu.classList.remove("open-vertical");
        overlay.classList.remove("visible");
        document.body.style.overflow = "";
    }

    // Open menu on toggle button click (desktop only)
    if (toggleBtn) {
        toggleBtn.addEventListener("click", (e) => {
            if (isDesktop()) {
                e.preventDefault();
                e.stopPropagation();
                
                if (desktopMenu.classList.contains("open-vertical")) {
                    closeMenu();
                } else {
                    openMenu();
                }
            }
        });
    }

    // Close menu on overlay click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeMenu();
        }
    });

    // Close menu on close button click
    document.addEventListener("click", (e) => {
        if (e.target.closest(".close-menu") && desktopMenu.classList.contains("open-vertical")) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && desktopMenu.classList.contains("open-vertical")) {
            closeMenu();
        }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
        if (!isDesktop() && desktopMenu.classList.contains("open-vertical")) {
            closeMenu();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
    initVerticalMenu();
});
