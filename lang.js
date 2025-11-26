// Language detection and preference management
(function() {
  'use strict';
  
  // Функция для определения предпочтительного языка
  function getPreferredLanguage() {
    // Проверяем, есть ли сохранённый выбор пользователя
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang) {
      return savedLang; // 'ru' или 'de'
    }
    
    // Если нет сохранённого выбора, проверяем язык браузера
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('ru')) {
      return 'ru';
    }
    
    // По умолчанию — немецкий
    return 'de';
  }
  
  // Функция для перенаправления на нужную языковую версию
  function redirectToPreferredLanguage() {
    const currentPage = window.location.pathname;
    const currentFilename = currentPage.split('/').pop() || 'index.html';
    
    // Определяем текущий язык страницы
    const isRussian = !currentFilename.includes('-de.html') && 
                      (currentFilename.endsWith('.html') || currentFilename === '');
    
    // Если это первый визит (нет сохранённого языка)
    if (!localStorage.getItem('userLanguage')) {
      const preferredLang = getPreferredLanguage();
      
      // Если предпочтительный язык не совпадает с текущей страницей
      if (preferredLang === 'ru' && !isRussian) {
        // Перенаправляем на русскую версию
        const russianPage = currentFilename.replace('-de.html', '.html');
        window.location.href = russianPage;
        return;
      } else if (preferredLang === 'de' && isRussian) {
        // Перенаправляем на немецкую версию
        let germanPage = currentFilename;
        if (germanPage === '' || germanPage === 'index.html') {
          germanPage = 'index-de.html';
        } else {
          germanPage = currentFilename.replace('.html', '-de.html');
        }
        window.location.href = germanPage;
        return;
      }
    }
  }
  
  // Сохранение выбора языка при клике на переключатель
  function setupLanguageSwitchListeners() {
    const langLinks = document.querySelectorAll('.lang-switch a');
    langLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href) {
          // Определяем выбранный язык по имени файла
          if (href.includes('-de.html') || href === 'index-de.html') {
            localStorage.setItem('userLanguage', 'de');
          } else {
            localStorage.setItem('userLanguage', 'ru');
          }
        }
      });
    });
  }
  
  // Запускаем при загрузке страницы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      redirectToPreferredLanguage();
      setupLanguageSwitchListeners();
    });
  } else {
    redirectToPreferredLanguage();
    setupLanguageSwitchListeners();
  }
})();
