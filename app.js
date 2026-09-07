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
      if (window.__updateCharts) window.__updateCharts();
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

// ============================================================
// Charts
// ============================================================
(function () {
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  let radarChart, costChart;

  function buildRadar() {
    const ctx = document.getElementById('radarChart');
    if (!ctx || !window.Chart) return;
    const textColor = cssVar('--color-text-muted');
    const gridColor = cssVar('--color-divider');
    const primary = cssVar('--color-primary');
    const primaryFill = cssVar('--color-primary-highlight');
    const isMobile = window.innerWidth <= 640;

    if (radarChart) radarChart.destroy();
    radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: isMobile
          ? [
              ['Business', 'Analysis'],
              ['Full-Stack', 'Engineering'],
              ['Security', '& IAM'],
              ['Applied ML /', 'Data Science'],
              ['Cloud &', 'Infrastructure'],
              ['Agile &', 'Delivery'],
            ]
          : [
              'Business Analysis',
              'Full-Stack Engineering',
              'Security & IAM',
              'Applied ML / Data Science',
              'Cloud & Infrastructure',
              'Agile & Delivery Process',
            ],
        datasets: [
          {
            label: 'Self-rated level',
            data: [4, 3, 4, 2, 2.5, 1],
            backgroundColor: primaryFill,
            borderColor: primary,
            borderWidth: 2,
            pointBackgroundColor: primary,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => {
                const levels = ['', 'Basic', 'Basic-Moderate', 'Moderate', 'Advanced-Moderate', 'Advanced'];
                return ' Level ' + item.formattedValue + ' / 4';
              },
            },
          },
        },
        scales: {
          r: {
            min: 0,
            max: 4,
            ticks: { display: false, stepSize: 1 },
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            pointLabels: {
              color: textColor,
              font: { size: isMobile ? 10 : 11.5, family: "'Satoshi','Inter',sans-serif" },
              padding: isMobile ? 4 : 8,
            },
          },
        },
      },
    });
  }

  function buildCost() {
    const ctx = document.getElementById('costChart');
    if (!ctx || !window.Chart) return;
    const textColor = cssVar('--color-text-muted');
    const gridColor = cssVar('--color-divider');
    const teal = cssVar('--color-teal');
    const primary = cssVar('--color-primary');
    const amber = cssVar('--color-amber');
    const faint = cssVar('--color-text-faint');

    if (costChart) costChart.destroy();
    costChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['AWS S3', 'Cloudflare R2', 'Wasabi', 'Backblaze B2'],
        datasets: [
          {
            label: '$ / GB / month',
            data: [0.023, 0.015, 0.0069, 0.006],
            backgroundColor: [faint, primary, teal, amber],
            borderRadius: 6,
            maxBarThickness: 46,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (item) => ' $' + item.formattedValue + ' / GB / month' } },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, callback: (v) => '$' + v },
          },
          y: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 12.5, weight: '600' } },
          },
        },
      },
    });
  }

  window.__updateCharts = function () {
    buildRadar();
    buildCost();
  };

  document.addEventListener('DOMContentLoaded', () => {
    buildRadar();
    buildCost();
  });

  let lastIsMobile = window.innerWidth <= 640;
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const nowMobile = window.innerWidth <= 640;
      if (nowMobile !== lastIsMobile) {
        lastIsMobile = nowMobile;
        buildRadar();
      }
    }, 200);
  });
})();
