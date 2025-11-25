document.addEventListener("DOMContentLoaded", function () {

  if (typeof Swiper !== "undefined") {

    new Swiper(".swiper-pleinpoint", {
      loop: true,
      speed: 600,
      spaceBetween: 48,
      slidesPerView: 1,

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      breakpoints: {
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 1 }
      }
    });

  } else {
    console.warn("⚠️ Swiper library not loaded on this theme.");
  }

});
