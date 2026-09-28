// ============================================================
// Theme toggle
// ============================================================
(function () {
  const root = document.documentElement;
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  let theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function setIcon(btn, t) {
    btn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
    btn.innerHTML =
      t === 'dark'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  toggles.forEach((btn) => setIcon(btn, theme));

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      toggles.forEach((b) => setIcon(b, theme));
    });
  });
})();

// ============================================================
// Mobile nav
// ============================================================
(function () {
  const nav = document.getElementById('mobile-nav');
  const openBtn = document.getElementById('nav-toggle');
  const closeBtn = document.getElementById('mobile-nav-close');
  if (!nav || !openBtn) return;
  openBtn.addEventListener('click', () => nav.classList.add('open'));
  closeBtn.addEventListener('click', () => nav.classList.remove('open'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
})();

// ============================================================
// Scroll reveal
// ============================================================
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  items.forEach((el) => io.observe(el));
})();
