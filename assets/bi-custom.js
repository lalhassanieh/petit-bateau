document.querySelectorAll('.tooltip-content').forEach(el => {
  const text = el.textContent.trim();
  if (text.startsWith('gid://shopify/TaxonomyValue/')) {
    const parent = el.closest('.swatch-option');
    const color = parent?.querySelector('[data-color]')?.getAttribute('data-color');
    if (color) el.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  }
});


document.addEventListener("DOMContentLoaded", () => {

  console.log("Topbar + Header scroll logic loaded");

  const topbar = document.querySelector("#topbar");
  const header = document.querySelector(".header");

  if (!topbar || !header) {
    console.warn("Topbar or header not found.");
    return;
  }

  // Set static heights at load
  const topbarHeight = topbar.offsetHeight;
  const headerHeight = header.offsetHeight;

  document.body.style.setProperty("--topbar-height", topbarHeight + "px");
  document.body.style.setProperty("--header-height", headerHeight + "px");

  // Scroll logic: show/hide topbar
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.scrollY;

    if (current > lastScroll && current > 30) {
      // scrolling DOWN → hide topbar
      topbar.classList.add("hidden");
      header.style.top = "0px";
    } else {
      // scrolling UP → show topbar
      topbar.classList.remove("hidden");
      header.style.top = `var(--topbar-height)`;
    }

    lastScroll = current;
  });

});
