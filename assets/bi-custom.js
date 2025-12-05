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

  // Set heights on load
  const topbarHeight = topbar.offsetHeight;
  const headerHeight = header.offsetHeight;

  document.body.style.setProperty("--topbar-height", topbarHeight + "px");
  document.body.style.setProperty("--header-height", headerHeight + "px");

  // Optional: fix heights again when resizing window
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

    // If scrolling down → hide navbar
    if (currentScroll > lastScroll && currentScroll > 50) {
      navBar.classList.add('hide-on-scroll');
    } 
    // If scrolling up → show navbar
    else {
      navBar.classList.remove('hide-on-scroll');
    }

    lastScroll = currentScroll;
  });
}

// initialize
hideNavOnScroll();
console.log("🔥 hideNavOnScroll() initialized");
