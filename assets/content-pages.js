function initSwiperSlider() {
  var sliderEl = document.querySelector(".swiper-pleinpoint");
  if (!sliderEl) return;

  if (typeof Swiper === "undefined") {
    console.error("Swiper is not loaded");
    return;
  }

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
  var btn  = document.querySelector(".pleinpoint-content-body .read-more");

  if (!text || !btn) {
    console.warn("ReadMore: text or button not found");
    return;
  }

  if (window.innerWidth > 1023) {
    btn.style.display = "none";
    text.style.maxHeight = "none";
    return;
  }

  var fullHeight = text.scrollHeight;

  if (fullHeight < 120) {
    btn.style.display = "none";
    return;
  }

  var collapsedHeight = fullHeight * 0.5;

  text.style.maxHeight = collapsedHeight + "px";
  text.style.overflow = "hidden";
  btn.style.display = "block";
  btn.textContent = "lire plus";

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


(function runPageScripts() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initSwiperSlider();
      initReadMore();
    });
  } else {
    // DOM уже готов
    initSwiperSlider();
    initReadMore();
  }
})();
