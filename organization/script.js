document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  // Navbar scroll state
  const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  mobileBtn?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    mobileBtn.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    mobileBtn.innerHTML = open
      ? '<i class="fas fa-times" aria-hidden="true"></i>'
      : '<i class="fas fa-bars" aria-hidden="true"></i>';
  });

  if (mobileNav) {
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      mobileBtn?.setAttribute('aria-expanded', 'false');
      if (mobileBtn) mobileBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.dataset.section === id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // Scroll reveal
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Animated counters
  function animateNumber(elementId, target, duration = 1600) {
    const el = document.getElementById(elementId);
    if (!el || target == null) return;
    const final = Number(target) || 0;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * final).toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = final.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  // Firebase stats (shared with Fashion Store)
  if (typeof firebase !== 'undefined' && firebase.apps?.length) {
    const database = firebase.database();

    database.ref('siteStats/visits').on('value', (snap) => {
      animateNumber('visits', snap.val() || 0);
    });

    database.ref('products').once('value', (snap) => {
      animateNumber('products', snap.numChildren() || 0);
    });

    database.ref('siteStats/totalOrders').once('value', (snap) => {
      const val = snap.val();
      if (val != null) {
        animateNumber('orders', val);
      } else {
        database.ref('orders').once('value', (ordersSnap) => {
          animateNumber('orders', ordersSnap.numChildren() || 0);
        }).catch(() => animateNumber('orders', 0));
      }
    }).catch(() => animateNumber('orders', 0));
  }
});
