document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lenis Smooth Scrolling
  const lenis = typeof Lenis === "function" ? new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  }) : null;

  function raf(time) {
    if (lenis) lenis.raf(time);
    requestAnimationFrame(raf);
  }
  if (lenis) requestAnimationFrame(raf);

  // 2. Preloader Curtain Reveal
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 800);
  });

  // 3. Custom Cursor Logic (Blend Mode handled in CSS)
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorRing) {
    window.addEventListener("mousemove", (event) => {
      cursorDot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      cursorRing.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    });

    document.querySelectorAll("a, button, .project-image, .huge-link").forEach((element) => {
      element.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
      element.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
    });
  }

  // 4. Parallax Effect on Project Images
  const projectImages = document.querySelectorAll('.project-image img');
  
  const updateParallax = () => {
    projectImages.forEach(img => {
      const parent = img.parentElement;
      const rect = parent.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // If the image container is in the viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Calculate a percentage based on scroll position
        const distance = windowHeight - rect.top;
        const percentage = distance / (windowHeight + rect.height);
        
        // Move image up to -15% of its container
        const move = percentage * -15; 
        img.style.transform = `translateY(${move}%)`;
      }
    });
  };

  if (lenis) {
    lenis.on("scroll", updateParallax);
  } else {
    window.addEventListener("scroll", updateParallax, { passive: true });
  }

  // 5. Elegant Scroll Reveals
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Optionally unobserve if you only want it to animate once
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

  // 6. Typing Effect (Retained from original)
  const typingText = document.getElementById("typingText");
  const phrases = [
    "Designing with calm confidence.",
    "Building brand stories.",
    "Turning ideas into systems."
  ];
  let phraseIndex = 0;
  let characterIndex = 0;
  let typingForward = true;

  const type = () => {
    if (!typingText) return;
    const currentPhrase = phrases[phraseIndex];
    if (typingForward) {
      typingText.textContent = currentPhrase.slice(0, characterIndex + 1);
      characterIndex++;
      if (characterIndex === currentPhrase.length) {
        typingForward = false;
        setTimeout(type, 2000);
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
    setTimeout(type, typingForward ? 60 : 30);
  };
  type();

  // Set Year
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});
