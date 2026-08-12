document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const modeToggle = document.getElementById("modeToggle");
  const scrollTop = document.getElementById("scrollTop");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const mobileMenu = document.getElementById("mobileMenu");
  const navbar = document.getElementById("navbar");
  const topbar = document.querySelector(".topbar");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const typingText = document.getElementById("typingText");
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterStatus = document.getElementById("newsletterStatus");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  function initDarkMode() {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      document.body.classList.add("dark-mode");
      modeToggle.textContent = "☀";
    } else {
      modeToggle.textContent = "☾";
    }
  }

  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      const isDarkMode = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDarkMode);
      modeToggle.textContent = isDarkMode ? "☀" : "☾";
    });
  }

  initDarkMode();

  const phrases = [
    "Designing with calm confidence.",
    "Building brand stories that feel premium.",
    "Creating visuals that stay with people.",
    "Turning ideas into memorable systems.",
  ];

  let phraseIndex = 0;
  let characterIndex = 0;
  let typingForward = true;

  const type = () => {
    const currentPhrase = phrases[phraseIndex];
    if (typingForward) {
      typingText.textContent = currentPhrase.slice(0, characterIndex + 1);
      characterIndex++;
      if (characterIndex === currentPhrase.length) {
        typingForward = false;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typingText.textContent = currentPhrase.slice(0, characterIndex - 1);
      characterIndex--;
      if (characterIndex === 0) {
        typingForward = true;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(type, typingForward ? 90 : 45);
  };

  if (typingText) type();

  window.addEventListener("load", () => {
    preloader.classList.add("hidden");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 450);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

  const updateScrollEffects = () => {
    const scrollY = window.scrollY;
    scrollTop.classList.toggle("show", scrollY > 500);
    topbar.classList.toggle("scrolled", scrollY > 24);

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        const id = section.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  };

  window.addEventListener("scroll", updateScrollEffects, { passive: true });
  updateScrollEffects();

  scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  mobileMenu.addEventListener("click", () => {
    navbar.classList.toggle("open");
    mobileMenu.setAttribute("aria-expanded", navbar.classList.contains("open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        navbar.classList.remove("open");
        mobileMenu.setAttribute("aria-expanded", "false");
      }
    });
  });

  if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorRing) {
    window.addEventListener("mousemove", (event) => {
      cursorDot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      cursorRing.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    });

    document.querySelectorAll("a, button, .project-image, .project-card, input, textarea").forEach((element) => {
      element.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
      element.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
    });
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.textContent = "✓ Thanks! Your message is ready to send.";
      formStatus.style.color = "var(--accent-strong)";
      contactForm.reset();
      setTimeout(() => {
        formStatus.textContent = "";
      }, 4200);
    });
  }

  if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      newsletterStatus.textContent = "✓ Thanks for subscribing! Check your inbox soon.";
      newsletterForm.reset();
      setTimeout(() => {
        newsletterStatus.textContent = "";
      }, 4000);
    });
  }

  const projectSearch = document.getElementById("projectSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const noResults = document.getElementById("noResults");
  let currentFilter = "all";

  function filterProjects() {
    const searchTerm = projectSearch.value.toLowerCase();
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const tags = card.getAttribute("data-tags");
      const title = card.querySelector("h3").textContent.toLowerCase();
      const matchesCategory = currentFilter === "all" || category === currentFilter;
      const matchesSearch = title.includes(searchTerm) || tags.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((button) => button.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      filterProjects();
    });
  });

  if (projectSearch) {
    projectSearch.addEventListener("input", filterProjects);
  }

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentImageIndex = 0;
  let lightboxImages = [];

  window.openLightbox = function (img) {
    lightboxImages = Array.from(document.querySelectorAll(".project-image img:not([style*='display: none']), .project-gallery img:not([style*='display: none'])"))
      .filter((image) => image.offsetParent !== null);

    currentImageIndex = lightboxImages.indexOf(img);
    if (currentImageIndex === -1) currentImageIndex = 0;

    lightboxImage.src = lightboxImages[currentImageIndex].src;
    lightboxImage.alt = lightboxImages[currentImageIndex].alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  lightboxPrev.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length;
    lightboxImage.src = lightboxImages[currentImageIndex].src;
    lightboxImage.alt = lightboxImages[currentImageIndex].alt;
  });

  lightboxNext.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % lightboxImages.length;
    lightboxImage.src = lightboxImages[currentImageIndex].src;
    lightboxImage.alt = lightboxImages[currentImageIndex].alt;
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;
    if (event.key === "Escape") {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
    if (event.key === "ArrowLeft") lightboxPrev.click();
    if (event.key === "ArrowRight") lightboxNext.click();
  });

  window.toggleGallery = function (button) {
    try {
      const body = button.closest(".project-body");
      const gallery = body ? body.querySelector(".project-gallery") : null;
      if (!gallery) return false;

      const isOpen = gallery.classList.toggle("is-open");
      button.textContent = isOpen
        ? button.textContent.replace("View", "Hide")
        : button.textContent.replace("Hide", "View");

      return false;
    } catch (error) {
      console.error("Toggle error:", error);
      return false;
    }
  };

  window.toggleCaseStudy = function (button) {
    try {
      const body = button.closest(".project-body");
      const caseStudy = body ? body.querySelector(".case-study") : null;
      if (!caseStudy) return false;

      const isOpen = caseStudy.classList.toggle("is-open");
      button.textContent = isOpen
        ? button.textContent.replace("View", "Hide")
        : button.textContent.replace("Hide", "View");

      return false;
    } catch (error) {
      console.error("Case study toggle error:", error);
      return false;
    }
  };
});
