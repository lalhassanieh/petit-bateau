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
  const menuToggle = document.querySelector('.menu-toggle.nav-toggle');
  const headerNav = document.querySelector('.header-bottom__navigation');

  if (!menuToggle) return;

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

  // The toggle functionality is handled by theme.js via nav-toggle class
  // We just handle the scroll behavior here

  window.addEventListener('scroll', handleScrollOrResize);
  window.addEventListener('resize', handleScrollOrResize);

  handleScrollOrResize();
  
  // Force desktop menu to show when nav-open is active
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const hasNavOpen = document.documentElement.classList.contains('nav-open');
        const hasOpenDrawer = document.documentElement.classList.contains('open-drawer');
        const desktopMenu = document.querySelector('.navigation.desktop-menu, nav.desktop-menu');
        
        if (desktopMenu && window.innerWidth >= DESKTOP_MIN_WIDTH) {
          if (hasNavOpen || hasOpenDrawer) {
            // Force the menu to show
            desktopMenu.style.transform = 'translateX(0)';
            desktopMenu.style.webkitTransform = 'translateX(0)';
            desktopMenu.style.opacity = '1';
            desktopMenu.style.visibility = 'visible';
          } else {
            // Hide the menu
            desktopMenu.style.transform = 'translateX(-101%)';
            desktopMenu.style.webkitTransform = 'translateX(-101%)';
          }
        }
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  // Also listen for clicks on the toggle button
  const toggleButton = document.querySelector('.menu-toggle.nav-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      setTimeout(() => {
        const desktopMenu = document.querySelector('.navigation.desktop-menu, nav.desktop-menu');
        const hasNavOpen = document.documentElement.classList.contains('nav-open');
        if (desktopMenu && window.innerWidth >= DESKTOP_MIN_WIDTH) {
          if (hasNavOpen) {
            desktopMenu.style.transform = 'translateX(0)';
            desktopMenu.style.webkitTransform = 'translateX(0)';
            desktopMenu.style.opacity = '1';
            desktopMenu.style.visibility = 'visible';
          } else {
            desktopMenu.style.transform = 'translateX(-101%)';
            desktopMenu.style.webkitTransform = 'translateX(-101%)';
          }
        }
      }, 10);
    });
  }
  
  // Ensure desktop menu close button works
  // The theme.js already handles close-menu, but we ensure it works on desktop
  document.addEventListener('click', (e) => {
    if (e.target.closest('close-menu')) {
      const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
      if (isDesktop) {
        // The theme.js CloseMenu class already handles this, but we ensure nav-open is removed
        // This is a backup to ensure desktop menu closes properly
        setTimeout(() => {
          if (document.documentElement.classList.contains('nav-open')) {
            document.documentElement.classList.remove('nav-open', 'open-drawer');
          }
        }, 100);
      }
    }
  });
  
  // Debug: Check if desktop menu exists on load
  setTimeout(() => {
    const desktopMenu = document.querySelector('.navigation.desktop-menu, nav.desktop-menu');
    console.log('Desktop menu on load:', desktopMenu);
    if (desktopMenu) {
      console.log('Desktop menu classes:', desktopMenu.className);
      console.log('Desktop menu computed display:', window.getComputedStyle(desktopMenu).display);
      console.log('Desktop menu computed transform:', window.getComputedStyle(desktopMenu).transform);
    }
  }, 1000);
}


document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
});
