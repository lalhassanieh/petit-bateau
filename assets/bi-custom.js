document.querySelectorAll('.tooltip-content').forEach(el => {
  const text = el.textContent.trim();
  if (text.startsWith('gid://shopify/TaxonomyValue/')) {
    const parent = el.closest('.swatch-option');
    const color = parent?.querySelector('[data-color]')?.getAttribute('data-color');
    if (color) el.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('header.header');
  var desktopToggle = document.getElementById('desktopMenuToggle');
  // mobile nav (the second <nav> with class "mobile")
  var mobileNavDesktop = document.querySelector('nav.navigation.mobile');

  if (!header || !desktopToggle || !mobileNavDesktop) {
    // console.warn('Desktop nav elements not found');
    return;
  }

  var SCROLL_THRESHOLD = 150; // px – adjust if you want it earlier/later

  function updateHeaderOnScroll() {
    var isDesktop = window.innerWidth >= 1024;
    var scrolledEnough = window.scrollY > SCROLL_THRESHOLD;

    if (isDesktop && scrolledEnough) {
      header.classList.add('header--scrolled');
      desktopToggle.classList.add('scroll-active');
    } else {
      header.classList.remove('header--scrolled');
      desktopToggle.classList.remove('scroll-active');

      // If user goes back to top, make sure overlay is closed
      mobileNavDesktop.classList.remove('desktop-open');
      document.documentElement.classList.remove('nav-overlay-open');
      document.body.classList.remove('nav-overlay-open');
    }
  }

  // When clicking the blue "Menu" pill on desktop
  desktopToggle.addEventListener('click', function (e) {
    var isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return; // on mobile it should behave as usual

    e.preventDefault();

    var isOpen = mobileNavDesktop.classList.toggle('desktop-open');

    if (isOpen) {
      document.documentElement.classList.add('nav-overlay-open');
      document.body.classList.add('nav-overlay-open');
    } else {
      document.documentElement.classList.remove('nav-overlay-open');
      document.body.classList.remove('nav-overlay-open');
    }
  });

  window.addEventListener('scroll', updateHeaderOnScroll);
  window.addEventListener('resize', updateHeaderOnScroll);

  // initial state
  updateHeaderOnScroll();
});
