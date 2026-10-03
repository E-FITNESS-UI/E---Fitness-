/* ---------- SCROLL REVEAL ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

/* ---------- ANIMATED COUNTERS ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1100;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}

/* ---------- WAITLIST FORM ---------- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initWaitlistForms() {
  document.querySelectorAll('form[data-waitlist]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const note = form.parentElement.querySelector('.form-note');
      const email = input.value.trim();

      if (!isValidEmail(email)) {
        note.textContent = 'Please enter a valid email address.';
        note.classList.remove('success');
        return;
      }

      note.textContent = 'Saving...';
      try {
        const key = 'waitlist:' + email.toLowerCase();
        const result = await window.storage.set(key, JSON.stringify({
          email: email,
          joinedAt: new Date().toISOString()
        }), true);

        if (result) {
          note.textContent = "You're on the list! We'll be in touch.";
          note.classList.add('success');
          input.value = '';
        } else {
          note.textContent = 'Something went wrong. Please try again.';
          note.classList.remove('success');
        }
      } catch (err) {
        note.textContent = 'Something went wrong. Please try again.';
        note.classList.remove('success');
      }
    });
  });
}

/* ---------- NAV ACTIVE STATE ---------- */
function initNavActive() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initWaitlistForms();
  initNavActive();
});
