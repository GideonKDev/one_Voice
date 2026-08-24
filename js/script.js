const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
  const mobileQuery = window.matchMedia('(max-width: 992px)');

  const setMenuState = (isOpen) => {
    const isMobile = mobileQuery.matches;
    const open = isMobile && isOpen;

    navLinks.classList.toggle('open', open);
    navLinks.setAttribute('aria-hidden', String(isMobile && !open));
    navLinks.inert = isMobile && !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  };

  const closeMenu = () => {
    setMenuState(false);
    if (mobileQuery.matches) menuBtn.focus();
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);

    if (!isOpen) navLinks.querySelector('a')?.focus();
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileQuery.matches) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (
      mobileQuery.matches &&
      menuBtn.getAttribute('aria-expanded') === 'true' &&
      !menuBtn.contains(event.target) &&
      !navLinks.contains(event.target)
    ) closeMenu();
  });

  mobileQuery.addEventListener('change', () => setMenuState(false));
  setMenuState(false);
}

const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealEls.forEach((element) => element.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  revealEls.forEach((element) => element.classList.add('reveal-pending'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

  revealEls.forEach((element) => revealObserver.observe(element));
} else {
  revealEls.forEach((element) => element.classList.add('is-visible'));
}

const slider = document.querySelector('[data-slider]');

if (slider) {
  const slides = [...slider.querySelectorAll('.agm-slide')];
  const dots = [...slider.querySelectorAll('.agm-dot')];
  const currentLabel = slider.querySelector('[data-slide-current]');
  let currentIndex = 0;
  let autoplay;

  const showSlide = (nextIndex) => {
    currentIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === currentIndex));
    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
    if (currentLabel) currentLabel.textContent = String(currentIndex + 1).padStart(2, '0');
  };

  const stopAutoplay = () => window.clearInterval(autoplay);
  const startAutoplay = () => {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplay = window.setInterval(() => showSlide(currentIndex + 1), 5500);
  };

  slider.querySelector('.agm-prev')?.addEventListener('click', () => { showSlide(currentIndex - 1); startAutoplay(); });
  slider.querySelector('.agm-next')?.addEventListener('click', () => { showSlide(currentIndex + 1); startAutoplay(); });
  dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); startAutoplay(); }));
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', (event) => {
    if (!slider.contains(event.relatedTarget)) startAutoplay();
  });

  startAutoplay();
}
