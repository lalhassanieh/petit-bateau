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
            const siblings = parent.querySelectorAll(':scope > li');
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

        const hasSubmenu = menuItem.querySelector(':scope > div');
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
    initVerticalMenuNavigator();
});

// Desktop vertical menu navigator (unified handler for all levels)
function initVerticalMenuNavigator() {
  const menu = document.querySelector(".verticalmenu-desktop");
  if (!menu) return;

  const header = menu.querySelector(".title-menu-dropdown");
  const titleEl = header?.querySelector(".toggle-vertical span");
  const backBtn = header?.querySelector(".header-back");
  const closeBtn = header?.querySelector(".close-menu-header");

  const rootTitle = (menu.getAttribute("data-title") || "Menu").trim();

  // stack of opened panels
  const stack = [{ title: rootTitle, li: null, panel: null }];

  function setHeader(title) {
    if (titleEl) titleEl.textContent = title || rootTitle;
    menu.classList.toggle("is-sub-open", stack.length > 1);
  }

  function getPanel(li) {
    if (!li) return null;
    
    // First try direct children (most common)
    let panel = li.querySelector(":scope > .submenu-vertical-desktop, :scope > .sub-children-menu, :scope > .submenu, :scope > ul.sub-children-menu");
    
    // If not found, search at any depth inside the LI (theme may nest panels)
    if (!panel) {
      panel = li.querySelector(".submenu-vertical-desktop, .submenu, ul.sub-children-menu, .sub-children-menu");
    }
    
    return panel;
  }

  // More robust helper specifically for finding child panels (3rd level)
  // Handles cases where level-2 items don't have direct UL children
  function getChildPanel(li) {
    if (!li) return null;

    // 1) Direct UL child
    let panel = li.querySelector(":scope > ul");
    if (panel) return panel;

    // 2) Common class variants inside li
    panel = li.querySelector("ul.sub-children-menu, ul.subchildmenu, ul.submenu, .submenu");
    if (panel) return panel;

    // 3) Sometimes the submenu is the NEXT sibling (very common in themes)
    if (li.nextElementSibling && li.nextElementSibling.tagName === 'UL') {
      return li.nextElementSibling;
    }

    // 4) Or inside an immediate wrapper DIV next to the link
    const wrap = li.querySelector(":scope > div");
    if (wrap) {
      panel = wrap.querySelector("ul");
      if (panel) return panel;
    }

    // 5) Fallback: any UL anywhere inside the LI
    panel = li.querySelector("ul");
    return panel;
  }

  // Helper to activate a panel with all necessary classes and styles
  function activatePanel(li, panel) {
    if (!li || !panel) return;

    // 1) Mark LI open
    li.classList.add("is-open");

    // 2) Force panel visible for CSS rules
    panel.classList.add("visible", "vm-active");

    // 3) Remove the desktop-hidden class that is currently blocking it
    panel.classList.remove("invisible-1025");

    // Extra safety (some themes toggle opacity/visibility/display/transform)
    // Force transform to translateX(0) to override any matrix transforms
    panel.style.display = "block";
    panel.style.visibility = "visible";
    panel.style.opacity = "1";
    panel.style.transform = "translateX(0)";
    // Force transform via setProperty for higher specificity
    panel.style.setProperty("transform", "translateX(0)", "important");
    panel.style.left = "0";
    panel.style.top = "0";
    panel.style.zIndex = "99999";
    panel.style.pointerEvents = "auto";

    // Debug: Log computed styles to identify CSS issues
    const cs = window.getComputedStyle(panel);
    console.log('[activatePanel] Computed styles:', {
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity,
      transform: cs.transform,
      position: cs.position,
      left: cs.left,
      top: cs.top,
      right: cs.right,
      bottom: cs.bottom,
      zIndex: cs.zIndex,
      width: cs.width,
      height: cs.height,
      overflow: cs.overflow
    });

    // Debug: Check parent container
    const parentContainer = panel.closest('.submenu-vertical-desktop');
    if (parentContainer) {
      const parentRect = parentContainer.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      console.log('[activatePanel] Layout check:', {
        parentRect: { width: parentRect.width, height: parentRect.height, top: parentRect.top, left: parentRect.left },
        panelRect: { width: panelRect.width, height: panelRect.height, top: panelRect.top, left: panelRect.left },
        isVisible: panelRect.width > 0 && panelRect.height > 0
      });
    }
  }

  function openPanel(li, title) {
    // Try the standard getPanel first
    let panel = getPanel(li);
    
    // If not found, try the more robust getChildPanel (for 3rd level panels)
    if (!panel) {
      panel = getChildPanel(li);
    }
    
    if (!panel) {
      console.warn('[initVerticalMenuNavigator] No panel found for LI:', li, 'Classes:', li.className);
      console.warn('[initVerticalMenuNavigator] LI HTML:', li.outerHTML.substring(0, 300));
      return;
    }
    
    console.log('[initVerticalMenuNavigator] Opening panel:', {
      title,
      panelTag: panel.tagName,
      panelClass: panel.className,
      liClass: li.className,
      beforeActivate: {
        liHasIsOpen: li.classList.contains('is-open'),
        panelHasVisible: panel.classList.contains('visible'),
        panelHasVmActive: panel.classList.contains('vm-active'),
        panelHasInvisible: panel.classList.contains('invisible-1025')
      }
    });

    // Close siblings at same level (so only one open)
    const ul = li.parentElement;
    if (ul) {
      ul.querySelectorAll(":scope > li").forEach(sib => {
        if (sib === li) return;
        const sibPanel = getPanel(sib);
        sib.classList.remove("is-open");
        if (sibPanel) {
          sibPanel.classList.remove("visible", "vm-active");
          sibPanel.classList.add("invisible-1025");
          // Reset inline styles
          sibPanel.style.visibility = "";
          sibPanel.style.opacity = "";
          sibPanel.style.pointerEvents = "";
        }
      });
    }

    // Activate this panel with all necessary classes
    activatePanel(li, panel);

    console.log('[initVerticalMenuNavigator] After activate:', {
      liHasIsOpen: li.classList.contains('is-open'),
      panelHasVisible: panel.classList.contains('visible'),
      panelHasVmActive: panel.classList.contains('vm-active'),
      panelHasInvisible: panel.classList.contains('invisible-1025')
    });

    stack.push({ title, li, panel });
    setHeader(title);
  }

  function goBack() {
    if (stack.length <= 1) return;
    const current = stack.pop();

    if (current.li) {
      current.li.classList.remove("is-open");
    }
    
    if (current.panel) {
      current.panel.classList.remove("visible", "vm-active");
      current.panel.classList.add("invisible-1025");
      // Reset inline styles
      current.panel.style.visibility = "";
      current.panel.style.opacity = "";
      current.panel.style.pointerEvents = "";
    }

    setHeader(stack[stack.length - 1].title);
  }

  function closeAll() {
    menu.querySelectorAll("li").forEach(li => {
      li.classList.remove("is-open");
      const p = getPanel(li);
      if (p) {
        p.classList.remove("visible", "vm-active");
        p.classList.add("invisible-1025");
        // Reset inline styles
        p.style.visibility = "";
        p.style.opacity = "";
        p.style.pointerEvents = "";
      }
    });
    stack.length = 1;
    setHeader(rootTitle);
  }

  // OPEN (any level) when clicking arrow
  menu.addEventListener("click", (e) => {
    if (window.innerWidth < 1025) return;
    if (!menu.classList.contains("open-vertical")) return;

    const toggle = e.target.closest("open-children-toggle");
    if (!toggle) return;

    const li = toggle.closest("li");
    if (!li) return;

    const label =
      li.querySelector(":scope > menu-item > a span")?.textContent?.trim() ||
      li.querySelector(":scope > menu-item > a")?.textContent?.trim() ||
      rootTitle;

    e.preventDefault();
    e.stopPropagation();
    openPanel(li, label.replace(/\s+/g, " "));
  });

  backBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    goBack();
  });

  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeAll();
  });

  setHeader(rootTitle);
}


