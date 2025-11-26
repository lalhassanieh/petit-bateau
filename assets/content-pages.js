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

function setupAccordion(accordionClass) {
  document.querySelectorAll('.accordion').forEach(function(button) {
  button.addEventListener('click', function() {
    this.classList.toggle('is-open');
    
    var content = this.nextElementSibling;
    if (this.classList.contains('is-open')) {
      content.style.maxHeight = content.scrollHeight + 'px'; 
    } else {
      content.style.maxHeight = '0'; 
    }
  });
});

}

function initCategoryCarousel(container) {
    if (!container || window.innerWidth < 768) return;

    const prevBtn = container.parentElement.querySelector(".cd-swiper-button-prev");
    const nextBtn = container.parentElement.querySelector(".cd-swiper-button-next");

    if (!prevBtn || !nextBtn) return;

    const slides = container.querySelectorAll(".swiper-slide");
    if (!slides.length) return;

    if (slides.length < 5) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        return;
    }

    let SCROLL_STEP;

    function calculateStep() {
        if (slides.length >= 2) {
            const r1 = slides[0].getBoundingClientRect();
            const r2 = slides[1].getBoundingClientRect();
            SCROLL_STEP = r2.left - r1.left;  
        } else {
            SCROLL_STEP = slides[0].getBoundingClientRect().width;
        }

        if (!SCROLL_STEP || SCROLL_STEP <= 0) {
            SCROLL_STEP = container.clientWidth * 0.8;
        }
    }

    calculateStep();

    function updateArrows() {
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (maxScroll <= 0) {
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
            return;
        }

        prevBtn.style.display = "flex";
        nextBtn.style.display = "flex";

        if (container.scrollLeft <= 2) {
            prevBtn.classList.add("cd-swiper-button-disabled");
        } else {
            prevBtn.classList.remove("cd-swiper-button-disabled");
        }

        if (container.scrollLeft >= maxScroll - 2) {
            nextBtn.classList.add("cd-swiper-button-disabled");
        } else {
            nextBtn.classList.remove("cd-swiper-button-disabled");
        }
    }

    prevBtn.addEventListener("click", () => {
        container.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
        container.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });
    });

    container.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", () => {
        calculateStep();
        updateArrows();
    });

    updateArrows();
}



document.addEventListener("DOMContentLoaded", function () {
  initSwiperSlider();
  initReadMore();
  setupAccordion('.accordion');

  document.querySelectorAll(".carousel-section .carousel-container").forEach(function (el) {
      initCategoryCarousel(el);
  });
});

