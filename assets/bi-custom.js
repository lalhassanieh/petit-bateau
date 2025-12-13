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

    // Debug: Log which method was used to load the menu
    const methodUsed = desktopMenu?.getAttribute('data-menu-method');
    const menuFound = desktopMenu?.getAttribute('data-menu-found') === 'true';
    if (methodUsed) {
        console.log(`[Vertical Menu] Method used: ${methodUsed}, Menu found: ${menuFound}`);
    }

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
        // Close all submenus first
        const openSubmenus = desktopMenu.querySelectorAll('.is-open');
        openSubmenus.forEach(item => item.classList.remove('is-open'));
        
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

    // ============================================
    // Submenu navigation (click-based like mobile)
    // ============================================
    
    function openSubmenu(menuItem) {
        // Close all other submenus at the same level
        const parent = menuItem.parentElement;
        if (parent) {
            const siblings = parent.querySelectorAll('> li');
            siblings.forEach(item => {
                if (item !== menuItem) {
                    item.classList.remove('is-open');
                }
            });
        }
        
        // Open the clicked submenu
        menuItem.classList.add('is-open');
    }

    function closeSubmenu(menuItem) {
        // Close this submenu and all nested submenus
        const nestedOpen = menuItem.querySelectorAll('.is-open');
        nestedOpen.forEach(item => item.classList.remove('is-open'));
        menuItem.classList.remove('is-open');
    }

    function goBack() {
        // Find the deepest open submenu and close it
        const allOpen = desktopMenu.querySelectorAll('.is-open');
        if (allOpen.length === 0) return;
        
        // Get the last one (deepest)
        const deepest = Array.from(allOpen).pop();
        closeSubmenu(deepest);
    }

    // Handle clicks on menu items with children
    desktopMenu.addEventListener("click", (e) => {
        if (!isDesktop() || !desktopMenu.classList.contains("open-vertical")) return;

        // Handle back button clicks
        const clickedBack = e.target.closest('back-menu');
        if (clickedBack) {
            e.preventDefault();
            e.stopPropagation();
            goBack();
            return;
        }

        // Handle nested submenu items (sub-children-menu)
        const nestedMenuItem = e.target.closest('.menu-link');
        if (nestedMenuItem) {
            const hasNestedSubmenu = nestedMenuItem.querySelector('+ .sub-children-menu');
            const clickedNestedToggle = e.target.closest('open-children-toggle');
            const clickedNestedLink = e.target.closest('.menu-link a');
            
            if (hasNestedSubmenu) {
                if (clickedNestedToggle || (clickedNestedLink && !e.target.closest('open-children-toggle'))) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (nestedMenuItem.classList.contains('is-open')) {
                        nestedMenuItem.classList.remove('is-open');
                    } else {
                        // Close other nested items at same level
                        const parent = nestedMenuItem.parentElement;
                        if (parent) {
                            parent.querySelectorAll('.menu-link.is-open').forEach(item => {
                                if (item !== nestedMenuItem) {
                                    item.classList.remove('is-open');
                                }
                            });
                        }
                        nestedMenuItem.classList.add('is-open');
                    }
                    return;
                }
            }
        }

        // Handle top-level menu items
        const menuItem = e.target.closest('.verticalmenu-html > ul > li');
        if (!menuItem) return;

        const hasSubmenu = menuItem.querySelector('> div');
        if (!hasSubmenu) return;

        // Check if click is on open-children-toggle or menu-item
        const clickedToggle = e.target.closest('open-children-toggle');
        const clickedMenuItem = e.target.closest('menu-item');
        const clickedLink = e.target.closest('menu-item a');

        // Handle submenu toggle
        if (clickedToggle || (clickedMenuItem && !clickedLink)) {
            e.preventDefault();
            e.stopPropagation();
            
            if (menuItem.classList.contains('is-open')) {
                closeSubmenu(menuItem);
            } else {
                openSubmenu(menuItem);
            }
            return;
        }

        // If clicking the link and it has children, prevent navigation and open submenu
        if (clickedLink && hasSubmenu) {
            e.preventDefault();
            e.stopPropagation();
            openSubmenu(menuItem);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
    initVerticalMenu();
});
