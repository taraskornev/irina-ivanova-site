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

  // ========================================
  // SCROLL REVEAL ANIMATION
  // ========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (revealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // После анимации можно отключить наблюдение для оптимизации
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      revealElements.forEach(el => revealObserver.observe(el));
    }

    // Stagger анимация для карточек в сетке
    const cardGrids = document.querySelectorAll('.card-grid');
    cardGrids.forEach(grid => {
      const cards = grid.querySelectorAll('.card');
      cards.forEach((card, index) => {
        if (card.classList.contains('card-link')) {
          card.style.animationDelay = `${0.05 + index * 0.05}s`;
        }
      });
    });

    // Stagger для списков методов
    const methodLists = document.querySelectorAll('.method-list');
    methodLists.forEach(list => {
      const items = list.querySelectorAll('li');
      items.forEach((item, index) => {
        if (item.style.animationDelay === '') {
          item.style.animationDelay = `${0.05 + index * 0.03}s`;
        }
      });
    });
    // Анимация для карточек семинаров 2x2
    const featureCards = document.querySelectorAll('.seminar-feature-card');
    if (featureCards.length > 0) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            cardObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      featureCards.forEach(card => cardObserver.observe(card));
    }
  } else {
    // Если reduced motion включен, сразу показываем все элементы
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => el.classList.add('is-visible'));
    
    const featureCards = document.querySelectorAll('.seminar-feature-card');
    featureCards.forEach(card => card.classList.add('is-visible'));
  }

  // ========================================
  // METHOD TOOLTIPS
  // ========================================
  const tooltip = document.querySelector('.method-tooltip');
  const methodItems = document.querySelectorAll('.method-label[data-description]');
  
  if (tooltip && methodItems.length > 0) {
    let currentItem = null;
    let isTouch = false;
    
    // Определение touch-устройства
    const isTouchDevice = () => {
      return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    };
    
    // Показать тултип
    const showTooltip = (item, x, y, isClick = false) => {
      const description = item.getAttribute('data-description');
      if (!description) return;
      
      tooltip.textContent = description;
      tooltip.classList.add('visible');
      tooltip.setAttribute('aria-hidden', 'false');
      currentItem = item;
      
      if (isClick) {
        // Мобильный режим: позиционировать ниже элемента
        const rect = item.getBoundingClientRect();
        let left = rect.left + (rect.width / 2);
        let top = rect.bottom + 8;
        
        // Проверка выхода за правую границу
        if (left + 140 > window.innerWidth) {
          left = window.innerWidth - 150;
        } else if (left - 140 < 0) {
          left = 150;
        }
        
        // Проверка выхода за нижнюю границу
        if (top + 100 > window.innerHeight) {
          top = rect.top - 100;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.transform = 'translateX(-50%)';
      } else {
        // Desktop режим: следовать за курсором
        positionTooltip(x, y);
      }
    };
    
    // Позиционирование рядом с курсором
    const positionTooltip = (x, y) => {
      let left = x + 12;
      let top = y + 12;
      
      // Проверка выхода за правую границу
      if (left + 280 > window.innerWidth) {
        left = x - 292;
      }
      
      // Проверка выхода за нижнюю границу
      if (top + 100 > window.innerHeight) {
        top = y - 112;
      }
      
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.style.transform = 'none';
    };
    
    // Скрыть тултип
    const hideTooltip = () => {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
      currentItem = null;
    };
    
    methodItems.forEach(item => {
      // Добавляем tabindex для доступности с клавиатуры
      item.setAttribute('tabindex', '0');
      
      // Desktop: hover
      if (!isTouchDevice()) {
        item.addEventListener('mouseenter', (e) => {
          showTooltip(item, e.clientX, e.clientY);
        });
        
        item.addEventListener('mousemove', (e) => {
          if (currentItem === item) {
            positionTooltip(e.clientX, e.clientY);
          }
        });
        
        item.addEventListener('mouseleave', hideTooltip);
      }
      
      // Mobile: tap/click - показывать тултип сразу при первом тапе
      item.addEventListener('click', (e) => {
        if (isTouchDevice()) {
          e.preventDefault();
          if (currentItem === item) {
            hideTooltip();
          } else {
            hideTooltip();
            showTooltip(item, e.clientX, e.clientY, true);
          }
        }
      });
      
      // Keyboard: focus - показывать тултип сразу при фокусе
      item.addEventListener('focus', (e) => {
        if (!isTouchDevice()) {
          const rect = item.getBoundingClientRect();
          showTooltip(item, rect.left + rect.width / 2, rect.bottom, true);
        }
      });
      
      item.addEventListener('blur', hideTooltip);
    });
    
    // Закрытие при клике вне элемента (мобильный)
    document.addEventListener('click', (e) => {
      if (isTouchDevice() && currentItem && !e.target.closest('.method-label')) {
        hideTooltip();
      }
    });
  }
  
  // ========================================
  // COOKIE CONSENT MODAL
  // ========================================
  const cookieModal = document.getElementById('cookieModal');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');
  
  if (cookieModal && cookieAccept && cookieDecline) {
    // Проверяем, есть ли уже выбор в localStorage
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
      // Если выбора нет, показываем модалку
      setTimeout(() => {
        cookieModal.classList.add('show');
        cookieModal.setAttribute('aria-hidden', 'false');
      }, 500);
    }
    
    // Обработчик принятия cookies
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieModal.classList.remove('show');
      cookieModal.setAttribute('aria-hidden', 'true');
    });
    
    // Обработчик отклонения cookies
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieModal.classList.remove('show');
      cookieModal.setAttribute('aria-hidden', 'true');
    });
    
    // Закрытие по клику на overlay
    const overlay = cookieModal.querySelector('.cookie-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieModal.classList.remove('show');
        cookieModal.setAttribute('aria-hidden', 'true');
      });
    }
  }
});
