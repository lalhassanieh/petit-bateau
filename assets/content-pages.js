function initSwiperSlider() {
  var sliderEl = document.querySelector(".swiper-pleinpoint");

  var swiper = new Swiper(".swiper-pleinpoint", {
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
      1024: { slidesPerView: 1 },
    },
  });

}


function initReadMore() {
  var text = document.getElementById("rmjs-1");
  var btn = document.querySelector(".read-more");

  if (!text || !btn) return;

  if (window.innerWidth > 1023) return;

  var fullHeight = text.scrollHeight;

  var collapsedHeight = fullHeight * 0.5;

  text.style.maxHeight = collapsedHeight + "px";
  text.style.overflow = "hidden";
  btn.style.display = "block";

  var expanded = false;

  btn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!expanded) {
      text.style.maxHeight = fullHeight + "px";
      btn.textContent = "lire moins";
    } else {
      text.style.maxHeight = collapsedHeight + "px";
      btn.textContent = "lire plus";
    }

    expanded = !expanded;
  });
}


document.addEventListener("DOMContentLoaded", function () {
  initSwiperSlider();
  initReadMore();
});
