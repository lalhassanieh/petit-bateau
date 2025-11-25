document.addEventListener("DOMContentLoaded", function () {
 
  var sliderEl = document.querySelector(".swiper-pleinpoint");
  if (!sliderEl) {
    console.warn("Swiper: .swiper-pleinpoint not found on this page.");
    return;
  }

  if (typeof Swiper === "undefined") {
    console.error("Swiper is not loaded. Check swiper-bundle.min.js include in theme.liquid.");
    return;
  }

  var swiper = new Swiper(".swiper-pleinpoint", {
    loop: true,
    speed: 600,
    spaceBetween: 48,
    slidesPerView: 1,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    /*
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    */

    breakpoints: {
      768: { slidesPerView: 1 },
      1024: { slidesPerView: 1 },
    },
  });

  console.log("Swiper initialized:", swiper);
});

