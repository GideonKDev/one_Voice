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
