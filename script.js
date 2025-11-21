document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle improved accessibility
  const navToggle = document.getElementById('navToggle');
  const nav = document.querySelector('.main-nav');
  if (navToggle && nav) {
    navToggle.setAttribute('aria-controls', 'main-navigation');
    nav.setAttribute('id', 'main-navigation');
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen.toString());
    });
  }

  // Close nav with ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Click outside to close (mobile)
  document.addEventListener('click', e => {
    if (nav && nav.classList.contains('open')) {
      const within = nav.contains(e.target) || (navToggle && navToggle.contains(e.target));
      if (!within) {
        nav.classList.remove('open');
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Smooth scroll anchor fallback
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Contact form handling
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (form && statusEl) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) {
        statusEl.textContent = 'Заполните все поля / Bitte alle Felder ausfüllen.';
        statusEl.style.color = '#c0392b';
        return;
      }
      form.reset();
      statusEl.textContent = 'Сообщение отправлено / Nachricht gesendet.';
      statusEl.style.color = 'var(--color-text)';
      setTimeout(() => { statusEl.textContent = ''; }, 4000);
    });
  }

  // Header shrink (optional subtle effect)
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (!header) return;
    if (current > 64 && current > lastScroll) {
      header.style.backdropFilter = 'blur(16px)';
      header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
    } else if (current < 32) {
      header.style.backdropFilter = 'blur(12px)';
      header.style.boxShadow = 'none';
    }
    lastScroll = current;
  });
});
