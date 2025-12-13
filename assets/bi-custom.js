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
        
        // Remove menu open state
        desktopMenu.classList.remove("open-vertical");
        
        // Completely hide overlay
        overlay.classList.remove("visible");
        
        // Restore body scroll immediately
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.documentElement.style.overflow = "";
        
        // Force a reflow to ensure styles are applied
        void desktopMenu.offsetHeight;
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

    // Close menu on close button click (both header close and submenu close)
    desktopMenu.addEventListener("click", (e) => {
        // Check if click is on close-menu element or its children (SVG, use, etc.)
        const closeBtn = e.target.closest("close-menu");
        if (closeBtn && desktopMenu.classList.contains("open-vertical")) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            return;
        }
    });

    // Close menu on overlay click
    overlay.addEventListener("click", (e) => {
        if (desktopMenu.classList.contains("open-vertical")) {
            e.preventDefault();
            e.stopPropagation();
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
            // Fix: Use nextElementSibling instead of invalid querySelector
            const next = nestedMenuItem.nextElementSibling;
            const hasNestedSubmenu = next && next.classList.contains('sub-children-menu');
            const clickedNestedToggle = e.target.closest('open-children-toggle');
            
            // Only chevron opens nested submenu
            if (hasNestedSubmenu && clickedNestedToggle) {
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
            
            // Allow normal navigation on nested links
            if (e.target.closest('.menu-link a')) {
                // do nothing → browser navigates normally
                return;
            }
        }

        // Handle top-level menu items
        const menuItem = e.target.closest('.verticalmenu-html > ul > li');
        if (!menuItem) return;

        const hasSubmenu = menuItem.querySelector('> div');
        if (!hasSubmenu) return;

        // Check if click is on open-children-toggle (chevron)
        const clickedToggle = e.target.closest('open-children-toggle');
        const clickedLink = e.target.closest('menu-item a');

        // ONLY chevron opens submenu
        if (clickedToggle) {
            e.preventDefault();
            e.stopPropagation();
            
            if (menuItem.classList.contains('is-open')) {
                closeSubmenu(menuItem);
            } else {
                openSubmenu(menuItem);
            }
            return;
        }

        // Allow normal navigation on <a> links
        if (clickedLink) {
            // do nothing → browser navigates normally
            return;
        }
    });

    // Safety net: Sync overlay/body state if open-vertical class is removed by any script
    const syncState = () => {
        const isOpen = desktopMenu.classList.contains('open-vertical');
        overlay.classList.toggle('visible', isOpen);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.documentElement.style.overflow = "";
        }
    };

    // Watch for class changes on desktopMenu
    new MutationObserver(syncState).observe(desktopMenu, { 
        attributes: true, 
        attributeFilter: ['class'] 
    });
    
    // Initial sync
    syncState();
}

document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
    initVerticalMenu();
    initVerticalMenuHeaderController();
});

// Desktop vertical menu header controller (mobile-like behavior)
function initVerticalMenuHeaderController() {
  const menu = document.querySelector(".verticalmenu-desktop");
  if (!menu) return;

  const header    = menu.querySelector(".title-menu-dropdown");
  const titleSpan = header?.querySelector(".toggle-vertical span");
  const closeBtn  = header?.querySelector(".close-menu-header");

  const rootTitle = (menu.getAttribute("data-title") || "Menu").trim();

  // We'll store the *actual opened panel* so Back truly returns where you were.
  const stack = [{ title: rootTitle, li: null, menuItem: null, panel: null }];

  function setHeader(title) {
    if (titleSpan) titleSpan.textContent = title || rootTitle;
    menu.classList.toggle("is-sub-open", stack.length > 1);
  }

  // Helpers to match different theme behaviors
  function openState(entry) {
    entry.li?.classList.add("is-open");
    entry.menuItem?.classList.add("is-open");
    entry.panel?.classList.add("visible");
    entry.panel?.classList.remove("invisible-1025"); // your markup has this
  }

  function closeState(entry) {
    entry.li?.classList.remove("is-open");
    entry.menuItem?.classList.remove("is-open");
    entry.panel?.classList.remove("visible");
    // keep it hidden on desktop (matches your theme class)
    entry.panel?.classList.add("invisible-1025");
  }

  function getPanel(li) {
    // In your markup the submenu is: <li> ... <div class="submenu ...">...</div></li>
    return li?.querySelector(":scope > .submenu");
  }

  function closeSiblings(li) {
    const ul = li?.parentElement;
    if (!ul) return;

    ul.querySelectorAll(":scope > li").forEach(sib => {
      if (sib === li) return;
      const sibMenuItem = sib.querySelector(":scope > menu-item");
      const sibPanel = getPanel(sib);
      closeState({ li: sib, menuItem: sibMenuItem, panel: sibPanel });
    });
  }

  function openLevel(li, title) {
    const menuItem = li.querySelector(":scope > menu-item");
    const panel = getPanel(li);
    if (!panel) return; // no submenu

    closeSiblings(li); // mobile behavior: only one open per level
    openState({ li, menuItem, panel });

    stack.push({ title, li, menuItem, panel });
    setHeader(title);
  }

  function goBack() {
    if (stack.length <= 1) return;

    const current = stack.pop();
    closeState(current);

    const prev = stack[stack.length - 1];
    setHeader(prev.title);
  }

  // Click chevron => open submenu (and push)
  menu.addEventListener("click", (e) => {
    const toggle = e.target.closest("open-children-toggle");
    if (!toggle) return;

    const li = toggle.closest("li");
    const label = li?.querySelector(":scope > menu-item > a span")?.textContent?.trim() || rootTitle;

    openLevel(li, label);

    e.preventDefault();
    e.stopPropagation();
  });

  // Back button (you need this element in your header)
  header?.querySelector(".header-back")?.addEventListener("click", (e) => {
    e.preventDefault();
    goBack();
  });

  // Close => reset everything
  closeBtn?.addEventListener("click", () => {
    // close all opened panels
    menu.querySelectorAll("li").forEach(li => {
      const mi = li.querySelector(":scope > menu-item");
      const p  = getPanel(li);
      closeState({ li, menuItem: mi, panel: p });
    });

    stack.length = 1;
    setHeader(rootTitle);

    // also close sidebar overlay if your theme uses it
    menu.classList.remove("open-vertical");
    document.querySelector(".vertical-menu-overlay-desktop")?.classList.remove("visible");
  });

  setHeader(rootTitle);
}

// Level-2 submenu panel handler (sliding panel behavior)
// This handles nested sub-children-menu panels (level-2) separately from level-0 panels
(() => {
  const menu = document.querySelector('.verticalmenu-desktop');
  if (!menu) return;

  const headerTitleEl = menu.querySelector('.title-menu-dropdown .toggle-vertical span');
  const headerBackBtn = menu.querySelector('.title-menu-dropdown .header-back');
  const rootTitle = menu.getAttribute('data-title') || (headerTitleEl ? headerTitleEl.textContent.trim() : 'Menu');

  // Separate stack for level-2 panels (sub-children-menu)
  const level2Stack = [];

  function setHeader(title, showBack) {
    if (headerTitleEl) headerTitleEl.textContent = title || rootTitle;
    if (showBack !== undefined) {
      if (showBack) menu.classList.add('is-sub-open');
      else menu.classList.remove('is-sub-open');
    }
  }

  function openLevel2Panel(panelEl, title) {
    if (!panelEl) return;

    // activate this panel
    panelEl.classList.add('vm-active');

    // push it to stack
    level2Stack.push({ panel: panelEl, title: title || rootTitle });

    setHeader(title, true);
  }

  function closeTopLevel2Panel() {
    const top = level2Stack.pop();
    if (!top) return false; // no level-2 panel to close

    top.panel.classList.remove('vm-active');

    // update header to previous panel title (or let level-0 handler manage it)
    const prev = level2Stack[level2Stack.length - 1];
    if (prev) {
      setHeader(prev.title, true);
    } else {
      // No more level-2 panels, let level-0 handler manage the header
      // The existing initVerticalMenuHeaderController will handle it
      return false;
    }
    return true;
  }

  // Click handler for sub-collection toggles (level-1 -> opens level-2 panel)
  menu.addEventListener('click', (e) => {
    const toggle = e.target.closest('open-children-toggle');
    if (!toggle) return;

    // we only want this sliding behavior on desktop
    if (window.innerWidth < 1025) return;

    // find the level-1 LI (the one containing sub-children-menu)
    const level1Li = toggle.closest('li.menu-link.level-1');
    if (!level1Li) return; // ignore other toggles - let existing handler take over

    const panel = level1Li.querySelector(':scope > .sub-children-menu');
    if (!panel) return;

    // title = the clicked link text
    const a = level1Li.querySelector(':scope > menu-item > a');
    const title = a ? a.textContent.trim().replace(/\s+/g, ' ') : rootTitle;

    e.preventDefault();
    e.stopPropagation();

    openLevel2Panel(panel, title);
  });

  // Extend back button to handle level-2 panels first, then fall back to level-0 handler
  if (headerBackBtn) {
    headerBackBtn.addEventListener('click', (e) => {
      // Try to close level-2 panel first
      if (level2Stack.length > 0 && closeTopLevel2Panel()) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // If no level-2 panel, let the existing level-0 handler take over
    }, true); // Use capture phase to run before existing handler
  }

  // Reset level-2 panels when menu closes
  const closeBtn = menu.querySelector('.title-menu-dropdown .close-menu-header');
  if (closeBtn) {
    const originalCloseHandler = closeBtn.onclick;
    closeBtn.addEventListener('click', () => {
      // Close all level-2 panels
      while (level2Stack.length) {
        const top = level2Stack.pop();
        top.panel.classList.remove('vm-active');
      }
    });
  }
})();
