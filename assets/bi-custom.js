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
    if (!topbar || !header) return;

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
        document.body.style.position = "";
        document.documentElement.style.overflow = "";
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


function initVerticalMenuSubmenus() {
  const menu = document.querySelector('.verticalmenu-desktop');
  if (!menu) return;

  const headerTitleEl = menu.querySelector('.title-menu-dropdown .toggle-vertical span');
  const headerBackBtn = menu.querySelector('.title-menu-dropdown .header-back');
  const closeBtn = menu.querySelector('.title-menu-dropdown .close-menu-header');
  const rootTitle = menu.getAttribute('data-title') || (headerTitleEl ? headerTitleEl.textContent.trim() : 'Menu');

  const level2Stack = [];

  function setHeader(title, showBack) {
    if (headerTitleEl) headerTitleEl.textContent = title || rootTitle;
    if (showBack !== undefined) {
      if (showBack) menu.classList.add('is-sub-open');
      else menu.classList.remove('is-sub-open');
    }
  }

  function getParentCollectionTitle(level1Li) {
    if (!level1Li) return rootTitle;
    
    const subchildmenu = level1Li.closest('.subchildmenu');
    if (!subchildmenu) return rootTitle;
    
    const parentSubmenu = subchildmenu.closest('.submenu, .submenu-vertical-desktop');
    if (!parentSubmenu) return rootTitle;
    
    const backMenu = parentSubmenu.querySelector('back-menu');
    if (backMenu) {
      const backMenuText = backMenu.textContent.trim();
      if (backMenuText) return backMenuText;
    }
    
    const parentLi = parentSubmenu.closest('li');
    if (parentLi) {
      const parentLink = parentLi.querySelector('menu-item > a, > menu-item > a');
      if (parentLink) {
        const parentTitle = parentLink.textContent.trim();
        if (parentTitle) return parentTitle;
      }
    }
    
    return rootTitle;
  }

  function openLevel2Panel(panelEl, title) {
    if (!panelEl) return;

    panelEl.classList.add('vm-active');
    
    const level1Li = panelEl.closest('li.menu-link.level-1');
    let parentCollectionTitle = rootTitle;
    
    if (level1Li) {
      level1Li.classList.add('is-open');
      
      const mi = level1Li.querySelector(':scope > menu-item');
      if (mi) mi.classList.add('is-open');
      
      parentCollectionTitle = getParentCollectionTitle(level1Li);
    }

    level2Stack.push({ 
      panel: panelEl, 
      title: title || rootTitle, 
      li: level1Li,
      parentCollectionTitle: parentCollectionTitle
    });

    setHeader(title, true);
  }

  function isInSubmenu() {
    const openLi = menu.querySelector('li.is-open');
    if (openLi) return true;
    
    return false;
  }

  function closeTopLevel2Panel() {
    if (level2Stack.length === 0) return false;
    
    const top = level2Stack.pop();
    if (!top) return false; 

    top.panel.classList.remove('vm-active');
    
    if (top.li) {
      top.li.classList.remove('is-open');
      
      const mi = top.li.querySelector(':scope > menu-item');
      if (mi) mi.classList.remove('is-open');
    }

    const prev = level2Stack[level2Stack.length - 1];
    if (prev) {
      setHeader(prev.title, true);
    } else {
      const parentTitle = top.parentCollectionTitle || rootTitle;
      const stillInSubmenu = parentTitle !== rootTitle || isInSubmenu();
      setHeader(parentTitle, stillInSubmenu);
    }
    return true;
  }

  menu.addEventListener('click', (e) => {
    const toggle = e.target.closest('open-children-toggle');
    if (!toggle) return;

    if (window.innerWidth < 1025) return;

    e.preventDefault();
    e.stopPropagation();

    const level1Li = toggle.closest('li.menu-link.level-1');
    if (level1Li) {
      const panel = level1Li.querySelector(':scope > .sub-children-menu');
      if (panel) {
        const a = level1Li.querySelector(':scope > menu-item > a');
        const title = a ? a.textContent.trim().replace(/\s+/g, ' ') : rootTitle;
        openLevel2Panel(panel, title);
        return;
      }
    }

    const menuItem = toggle.closest('.verticalmenu-html > ul > li');
    if (!menuItem) return;

    const hasSubmenu = menuItem.querySelector('> .submenu, > .submenu-vertical-desktop');
    if (!hasSubmenu) return;

    if (menuItem.classList.contains('is-open')) {
      menuItem.classList.remove('is-open');
      const mi = menuItem.querySelector(':scope > menu-item');
      if (mi) mi.classList.remove('is-open');
    } else {
      const parent = menuItem.parentElement;
      if (parent) {
        parent.querySelectorAll(':scope > li').forEach(sib => {
          if (sib !== menuItem) {
            sib.classList.remove('is-open');
            const sibMi = sib.querySelector(':scope > menu-item');
            if (sibMi) sibMi.classList.remove('is-open');
          }
        });
      }
      menuItem.classList.add('is-open');
      const mi = menuItem.querySelector(':scope > menu-item');
      if (mi) mi.classList.add('is-open');
    }
  });

  menu.addEventListener('click', (e) => {
    const backMenu = e.target.closest('back-menu');
    if (!backMenu) return;

    if (window.innerWidth < 1025) return;

    const subChildrenMenu = backMenu.closest('.sub-children-menu');
    if (subChildrenMenu && subChildrenMenu.classList.contains('vm-active')) {
      e.preventDefault();
      e.stopPropagation();
      
      if (closeTopLevel2Panel()) {
        return;
      }
    }
  }, true);

  if (headerBackBtn) {
    headerBackBtn.addEventListener('click', (e) => {
      if (level2Stack.length > 0 && closeTopLevel2Panel()) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }, true); 
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      while (level2Stack.length) {
        const top = level2Stack.pop();
        top.panel.classList.remove('vm-active');
        if (top.li) {
          top.li.classList.remove('is-open');
          const mi = top.li.querySelector(':scope > menu-item');
          if (mi) mi.classList.remove('is-open');
        }
      }
      
      menu.querySelectorAll('li.is-open').forEach(li => {
        li.classList.remove('is-open');
        const mi = li.querySelector(':scope > menu-item');
        if (mi) mi.classList.remove('is-open');
      });
      
      setHeader(rootTitle, false);
      
      menu.classList.remove('open-vertical');
      document.querySelector('.vertical-menu-overlay-desktop')?.classList.remove('visible');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.documentElement.style.overflow = '';
    });
  }

  setHeader(rootTitle, false);
}


document.addEventListener("DOMContentLoaded", () => {
    initDesktopMenuToggle();
    initFixedTopbarHeader();
    initVerticalMenu();
    initVerticalMenuSubmenus();
});
