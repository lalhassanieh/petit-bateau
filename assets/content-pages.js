function initSwiperSlider() {
  var sliderEl = document.querySelector(".swiper-pleinpoint");
  if (!sliderEl) return;
  if (typeof Swiper === "undefined") return;

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
      1024: { slidesPerView: 1 },
    },
  });
}

function initReadMore() {
  var text = document.getElementById("rmjs-1");
  var btn  = document.querySelector(".read-more");
  if (!text || !btn) return;

  function setupReadMore() {
    var isMobile = window.innerWidth <= 1023;

    text.style.maxHeight = "none";
    text.style.overflow  = "visible";
    btn.style.display    = "none";
    btn.textContent      = "lire plus";

    if (!isMobile) return;

    var fullHeight = text.scrollHeight;

    if (!fullHeight || fullHeight < 140) {
      return;
    }

    var collapsedHeight = 140; 
    text.style.maxHeight = collapsedHeight + "px";
    text.style.overflow  = "hidden";
    btn.style.display    = "block";

    var newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    btn = newBtn;

    var expanded = false;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      expanded = !expanded;

      if (expanded) {
        text.style.maxHeight = fullHeight + "px";
        btn.textContent = "lire moins";
      } else {
        text.style.maxHeight = collapsedHeight + "px";
        btn.textContent = "lire plus";
      }
    });
  }

  requestAnimationFrame(setupReadMore);

  window.addEventListener("resize", function () {
    setupReadMore();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initSwiperSlider();
  initReadMore();
});
