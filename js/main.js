/* ============================================
   ZAIKACAFÉ — MAIN JAVASCRIPT
   ============================================ */

'use strict';

// ---- Utility ----
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initMenuTabs();
  initChefTestimonials();
  initReservationForm();
  initNewsletterForm();
  initBackToTop();
  initPlayButton();
});

/* ============================================
   NAVBAR — scroll state + aria-current
   ============================================ */
function initNavbar() {
  const navbar = $('#navbar');
  const links  = $$('.nav-link');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link by section proximity
    const sections = $$('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });
    links.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  const backdrop  = $('#navBackdrop');
  const links     = $$('.nav-link');

  if (!hamburger || !navLinks) return;

  const toggle = (open) => {
    hamburger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('visible', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(open));
  };

  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.addEventListener('click', () => toggle(!navLinks.classList.contains('open')));

  // Close on link click
  links.forEach(link => link.addEventListener('click', () => toggle(false)));

  // Close on backdrop click
  if (backdrop) backdrop.addEventListener('click', () => toggle(false));

  // Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) toggle(false);
  });
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
  const elements = $$('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || (i * 80);
        setTimeout(() => entry.target.classList.add('aos-visible'), Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ============================================
   MENU TABS FILTER
   ============================================ */
function initMenuTabs() {
  const tabs  = $$('.tab-btn');
  const cards = $$('.menu-item-card');
  let transitioning = false;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (transitioning) return;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.tab;

      // Fade out all first, then swap visibility
      cards.forEach(card => card.classList.add('fade-out'));
      transitioning = true;

      setTimeout(() => {
        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.remove('fade-out');
          card.classList.toggle('hidden', !match);
        });
        transitioning = false;
      }, 280);
    });
  });
}

/* ============================================
   CHEF TESTIMONIALS CAROUSEL
   ============================================ */
function initChefTestimonials() {
  const prevBtn = $('#prevTestimonial');
  const nextBtn = $('#nextTestimonial');
  const card    = $('#chefTestimonial');

  const teamMembers = [
    {
      img:   'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=80&q=80',
      name:  'Rajan Sharma',
      role:  'Head Chef & Founder',
      quote: '"Indian cuisine is a love language — every spice tells a story, every dish carries a memory that lives in the heart."'
    },
    {
      img:   'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=80&q=80',
      name:  'Preethi Nair',
      role:  'Sous Chef',
      quote: '"Growing up watching my grandmother cook gave me my superpower — I bring that same love to every plate I prepare."'
    },
    {
      img:   'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80',
      name:  'Arjun Mehta',
      role:  'Chai & Sweets Master',
      quote: '"A perfect cup of masala chai can fix anything. That is the magic of Indian food — it heals the soul."'
    }
  ];

  let current = 0;
  let isAnimating = false;

  const render = (index, dir = 1) => {
    if (!card || isAnimating) return;
    isAnimating = true;

    const member = teamMembers[index];
    const outX   = dir > 0 ? '-24px' : '24px';
    const inX    = dir > 0 ? '24px'  : '-24px';

    card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
    card.style.opacity    = '0';
    card.style.transform  = `translateX(${outX})`;

    setTimeout(() => {
      card.querySelector('.testimonial-author img').src            = member.img;
      card.querySelector('.testimonial-author strong').textContent = member.name;
      card.querySelector('.testimonial-author span').textContent   = member.role;
      card.querySelector('p').textContent                          = member.quote;

      card.style.transform = `translateX(${inX})`;
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.32s ease, transform 0.32s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateX(0)';
        setTimeout(() => { isAnimating = false; }, 330);
      });
    }, 290);
  };

  if (prevBtn) prevBtn.addEventListener('click', () => {
    const prev = (current - 1 + teamMembers.length) % teamMembers.length;
    render(prev, -1);
    current = prev;
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    const next = (current + 1) % teamMembers.length;
    render(next, 1);
    current = next;
  });

  setInterval(() => {
    const next = (current + 1) % teamMembers.length;
    render(next, 1);
    current = next;
  }, 6000);
}

/* ============================================
   TESTIMONIALS SLIDER (real translateX carousel)
   ============================================ */
/* ============================================
   RESERVATION FORM
   ============================================ */
function initReservationForm() {
  const form      = $('#reservationForm');
  const dateInput = $('#reservationDate');

  // Set min = today, default = tomorrow
  if (dateInput) {
    const fmt      = d => d.toISOString().split('T')[0];
    const today    = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    dateInput.min   = fmt(today);
    dateInput.value = fmt(tomorrow);
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Processing\u2026';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'Book Now <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m7 17 10-10M7 7h10v10"/></svg>';
      form.reset();
      if (dateInput) {
        const tomorrow = new Date(Date.now() + 86400000);
        dateInput.value = tomorrow.toISOString().split('T')[0];
      }
      showToast('Table reserved successfully! We\'ll confirm by email shortly.');
    }, 1500);
  });
}

/* ============================================
   NEWSLETTER FORM
   ============================================ */
function initNewsletterForm() {
  const form = $('#newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn   = form.querySelector('button');
    const input = form.querySelector('input');
    btn.disabled    = true;
    btn.textContent = 'Subscribing\u2026';

    setTimeout(() => {
      btn.disabled    = false;
      btn.textContent = 'Subscribe';
      input.value     = '';
      showToast('Subscribed! Welcome to the OrganicDish family.');
    }, 1000);
  });
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================
   PLAY BUTTON (stub)
   ============================================ */
function initPlayButton() {
  const playBtn = document.querySelector('.play-btn');
  if (!playBtn) return;
  playBtn.addEventListener('click', () => showToast('Video tour coming soon!'));
}

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
function showToast(message, duration = 3500) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ============================================
   SMOOTH ANCHOR SCROLL (offset for sticky nav)
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href   = anchor.getAttribute('href');
    const target = document.querySelector(href);
    if (!target || href === '#') return;
    e.preventDefault();
    const navH = $('#navbar')?.offsetHeight || 70;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


