/* ═══════════════════════════════════════════════════════════
   KLYRO — script.js
   Vanilla JS interactions, animations, scroll effects.
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM ready ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initHamburger();
  initScrollReveal();
  initCounters();
  initFAQ();
  initServiceCardGlow();
  initSmoothScroll();
});

/* ════════════════════════════════════════════
   1. CUSTOM CURSOR
════════════════════════════════════════════ */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // hover state on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .service-card, .portfolio-card, .testi-card, .why-feature, .trust-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ════════════════════════════════════════════
   2. STICKY NAVBAR
════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;

  function onScroll() {
    const currentY = window.scrollY;
    if (currentY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = currentY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

/* ════════════════════════════════════════════
   3. HAMBURGER MENU
════════════════════════════════════════════ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Toggle menu');
  });

  // close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

/* ════════════════════════════════════════════
   4. SCROLL REVEAL
════════════════════════════════════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════
   5. ANIMATED COUNTERS
════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════
   6. FAQ ACCORDION
════════════════════════════════════════════ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // close all others
      items.forEach(other => {
        const otherBtn = other.querySelector('.faq-q');
        const otherAns = other.querySelector('.faq-a');
        if (otherBtn && otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAns.classList.remove('open');
        }
      });

      // toggle current
      const newState = !isOpen;
      btn.setAttribute('aria-expanded', String(newState));
      answer.classList.toggle('open', newState);
    });
  });
}

/* ════════════════════════════════════════════
   7. SERVICE CARD RADIAL GLOW (mouse tracking)
════════════════════════════════════════════ */
function initServiceCardGlow() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

/* ════════════════════════════════════════════
   8. SMOOTH SCROLL (for nav links)
════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════
   9. HERO ENTRANCE (staggered on load)
════════════════════════════════════════════ */
(function heroEntrance() {
  const badge    = document.querySelector('.hero-badge');
  const headline = document.querySelector('.hero-headline');
  const sub      = document.querySelector('.hero-sub');
  const actions  = document.querySelector('.hero-actions');
  const meta     = document.querySelector('.hero-meta');
  const visual   = document.querySelector('.hero-visual');

  const items = [badge, headline, sub, actions, meta];

  // Initially hide
  items.forEach(el => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
  });
  if (visual) {
    visual.style.opacity = '0';
    visual.style.transform = 'translateY(30px) scale(0.97)';
    visual.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
  }

  // Staggered reveal
  window.addEventListener('load', () => {
    items.forEach((el, i) => {
      if (!el) return;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 100);
    });
    if (visual) {
      setTimeout(() => {
        visual.style.opacity = '1';
        visual.style.transform = 'translateY(0) scale(1)';
      }, 600);
    }
  });
})();

/* ════════════════════════════════════════════
   10. PARALLAX — subtle hero glow drift
════════════════════════════════════════════ */
(function parallaxGlow() {
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');
  if (!glow1 || !glow2) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      glow1.style.transform = `translateY(${y * 0.15}px)`;
      glow2.style.transform = `translateY(${-y * 0.1}px)`;
      ticking = false;
    });
  }, { passive: true });
})();

/* ════════════════════════════════════════════
   11. ACTIVE NAV LINK on scroll
════════════════════════════════════════════ */
(function activeNavLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          const matches = link.getAttribute('href') === '#' + id;
          link.style.color = matches
            ? 'rgba(255,255,255,0.9)'
            : '';
          link.style.background = matches
            ? 'rgba(255,255,255,0.07)'
            : '';
        });
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ════════════════════════════════════════════
   12. PORTFOLIO CARD — subtle tilt on hover
════════════════════════════════════════════ */
(function cardTilt() {
  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const rotX  = -dy * 3;
      const rotY  =  dx * 3;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.1s linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.28s';
    });
  });
})();

/* ════════════════════════════════════════════
   13. FOOTER — current year
════════════════════════════════════════════ */
(function updateYear() {
  const footer = document.querySelector('.footer-bottom');
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = footer.innerHTML.replace('2025', year);
})();
