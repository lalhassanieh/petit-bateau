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
        const openSubmenus = desktopMenu.querySelectorAll('.is-open');
        openSubmenus.forEach(item => item.classList.remove('is-open'));
        
        desktopMenu.classList.remove("open-vertical");
        
        overlay.classList.remove("visible");
        
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.documentElement.style.overflow = "";
        
        void desktopMenu.offsetHeight;
    }

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

    desktopMenu.addEventListener("click", (e) => {
        const closeBtn = e.target.closest("close-menu");
        if (closeBtn && desktopMenu.classList.contains("open-vertical")) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            return;
        }
    });

    overlay.addEventListener("click", (e) => {
        if (desktopMenu.classList.contains("open-vertical")) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && desktopMenu.classList.contains("open-vertical")) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (!isDesktop() && desktopMenu.classList.contains("open-vertical")) {
            closeMenu();
        }
    });

    
    function openSubmenu(menuItem) {
        const parent = menuItem.parentElement;
        if (parent) {
            const siblings = parent.querySelectorAll('> li');
            siblings.forEach(item => {
                if (item !== menuItem) {
                    item.classList.remove('is-open');
                }
            });
        }
        
        menuItem.classList.add('is-open');
    }

    function closeSubmenu(menuItem) {
        const nestedOpen = menuItem.querySelectorAll('.is-open');
        nestedOpen.forEach(item => item.classList.remove('is-open'));
        menuItem.classList.remove('is-open');
    }

    function goBack() {
        const allOpen = desktopMenu.querySelectorAll('.is-open');
        if (allOpen.length === 0) return;
        
        const deepest = Array.from(allOpen).pop();
        closeSubmenu(deepest);
    }

    desktopMenu.addEventListener("click", (e) => {
        if (!isDesktop() || !desktopMenu.classList.contains("open-vertical")) return;

        const clickedBack = e.target.closest('back-menu');
        if (clickedBack) {
            // Let the level2Stack handler take care of back-menu clicks in sub-children-menu
            // Only use generic goBack() if not in a level-2 panel
            const subChildrenMenu = clickedBack.closest('.sub-children-menu');
            if (!subChildrenMenu || !subChildrenMenu.classList.contains('vm-active')) {
                e.preventDefault();
                e.stopPropagation();
                goBack();
                return;
            }
            // Otherwise, let the level2Stack handler process it
        }

        const nestedMenuItem = e.target.closest('.menu-link');
        if (nestedMenuItem) {
            const next = nestedMenuItem.nextElementSibling;
            const hasNestedSubmenu = next && next.classList.contains('sub-children-menu');
            const clickedNestedToggle = e.target.closest('open-children-toggle');
            
            if (hasNestedSubmenu && clickedNestedToggle) {
                e.preventDefault();
                e.stopPropagation();
                
                if (nestedMenuItem.classList.contains('is-open')) {
                    nestedMenuItem.classList.remove('is-open');
                } else {
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
            
            if (e.target.closest('.menu-link a')) {
                return;
            }
        }

        const menuItem = e.target.closest('.verticalmenu-html > ul > li');
        if (!menuItem) return;

        const hasSubmenu = menuItem.querySelector('> div');
        if (!hasSubmenu) return;

        const clickedToggle = e.target.closest('open-children-toggle');
        const clickedLink = e.target.closest('menu-item a');

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

        if (clickedLink) {
            return;
        }
    });

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

    new MutationObserver(syncState).observe(desktopMenu, { 
        attributes: true, 
        attributeFilter: ['class'] 
    });
    
    syncState();
}

function initVerticalMenuHeaderController() {
  const menu = document.querySelector(".verticalmenu-desktop");
  if (!menu) return;

  const header    = menu.querySelector(".title-menu-dropdown");
  const titleSpan = header?.querySelector(".toggle-vertical span");
  const closeBtn  = header?.querySelector(".close-menu-header");

  const rootTitle = (menu.getAttribute("data-title") || "Menu").trim();

  const stack = [{ title: rootTitle, li: null, menuItem: null, panel: null }];

  function setHeader(title) {
    if (titleSpan) titleSpan.textContent = title || rootTitle;
    menu.classList.toggle("is-sub-open", stack.length > 1);
  }

  function openState(entry) {
    entry.li?.classList.add("is-open");
    entry.menuItem?.classList.add("is-open");
    entry.panel?.classList.add("visible");
    entry.panel?.classList.remove("invisible-1025");
  }

  function closeState(entry) {
    entry.li?.classList.remove("is-open");
    entry.menuItem?.classList.remove("is-open");
    entry.panel?.classList.remove("visible");
    entry.panel?.classList.add("invisible-1025");
  }

  function getPanel(li) {
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
    if (!panel) return; 

    closeSiblings(li); 
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

  menu.addEventListener("click", (e) => {
    const toggle = e.target.closest("open-children-toggle");
    if (!toggle) return;

    const li = toggle.closest("li");
    const label = li?.querySelector(":scope > menu-item > a span")?.textContent?.trim() || rootTitle;

    openLevel(li, label);

    e.preventDefault();
    e.stopPropagation();
  });

  header?.querySelector(".header-back")?.addEventListener("click", (e) => {
    e.preventDefault();
    goBack();
  });

  closeBtn?.addEventListener("click", () => {
    menu.querySelectorAll("li").forEach(li => {
      const mi = li.querySelector(":scope > menu-item");
      const p  = getPanel(li);
      closeState({ li, menuItem: mi, panel: p });
    });

    stack.length = 1;
    setHeader(rootTitle);

    menu.classList.remove("open-vertical");
    document.querySelector(".vertical-menu-overlay-desktop")?.classList.remove("visible");
  });

  setHeader(rootTitle);
}

(() => {
  const menu = document.querySelector('.verticalmenu-desktop');
  if (!menu) return;

  const headerTitleEl = menu.querySelector('.title-menu-dropdown .toggle-vertical span');
  const headerBackBtn = menu.querySelector('.title-menu-dropdown .header-back');
  const rootTitle = menu.getAttribute('data-title') || (headerTitleEl ? headerTitleEl.textContent.trim() : 'Menu');

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

    panelEl.classList.add('vm-active');
    
    // Find the parent level-1 li and add class to expand it
    const level1Li = panelEl.closest('li.menu-link.level-1');
    if (level1Li) {
      level1Li.classList.add('is-open');
      
      // Calculate and set the top position so it expands from its current position
      const menuContainer = menu.querySelector('.verticalmenu-html');
      if (menuContainer) {
        const liRect = level1Li.getBoundingClientRect();
        const containerRect = menuContainer.getBoundingClientRect();
        const topOffset = liRect.top - containerRect.top;
        level1Li.style.top = topOffset + 'px';
      }
    }

    level2Stack.push({ panel: panelEl, title: title || rootTitle, li: level1Li });

    setHeader(title, true);
  }

  function closeTopLevel2Panel() {
    if (level2Stack.length === 0) return false;
    
    const top = level2Stack.pop();
    if (!top) return false; 

    top.panel.classList.remove('vm-active');
    
    // Remove the is-open class and reset styles from the level-1 li
    if (top.li) {
      top.li.classList.remove('is-open');
      top.li.style.top = '';
    }

    const prev = level2Stack[level2Stack.length - 1];
    if (prev) {
      setHeader(prev.title, true);
    } else {
      setHeader(rootTitle, false);
    }
    return true;
  }

  menu.addEventListener('click', (e) => {
    const toggle = e.target.closest('open-children-toggle');
    if (!toggle) return;

    if (window.innerWidth < 1025) return;

    const level1Li = toggle.closest('li.menu-link.level-1');
    if (!level1Li) return; 

    const panel = level1Li.querySelector(':scope > .sub-children-menu');
    if (!panel) return;

    const a = level1Li.querySelector(':scope > menu-item > a');
    const title = a ? a.textContent.trim().replace(/\s+/g, ' ') : rootTitle;

    e.preventDefault();
    e.stopPropagation();

    openLevel2Panel(panel, title);
  });

  // Handle back-menu clicks inside sub-children-menu
  menu.addEventListener('click', (e) => {
    const backMenu = e.target.closest('back-menu');
    if (!backMenu) return;

    if (window.innerWidth < 1025) return;

    // Check if we're in a level-2 panel (sub-children-menu)
    const subChildrenMenu = backMenu.closest('.sub-children-menu');
    if (subChildrenMenu && subChildrenMenu.classList.contains('vm-active')) {
      e.preventDefault();
      e.stopPropagation();
      
      // Close the current level-2 panel and return to previous
      if (closeTopLevel2Panel()) {
        return;
      }
    }
  }, true); // Use capture phase to handle before other handlers

  if (headerBackBtn) {
    headerBackBtn.addEventListener('click', (e) => {
      if (level2Stack.length > 0 && closeTopLevel2Panel()) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }, true); 
  }

  const closeBtn = menu.querySelector('.title-menu-dropdown .close-menu-header');
  if (closeBtn) {
    const originalCloseHandler = closeBtn.onclick;
    closeBtn.addEventListener('click', () => {
      while (level2Stack.length) {
        const top = level2Stack.pop();
        top.panel.classList.remove('vm-active');
        // Remove the is-open class and reset styles from the level-1 li
        if (top.li) {
          top.li.classList.remove('is-open');
          top.li.style.top = '';
        }
      }
      setHeader(rootTitle, false);
    });
  }
})();


document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
    initVerticalMenu();
    initVerticalMenuHeaderController();
});
