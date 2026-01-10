// Получаем элементы
const menuToggle = document.getElementById('menuToggle'); 
const mainNav = document.querySelector('nav'); 

// Создаем оверлей для меню
const navOverlay = document.createElement('div'); 
navOverlay.className = 'nav-overlay'; 
document.body.appendChild(navOverlay); 

// Функция открытия/закрытия меню
function toggleMenu() { 
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true'; 
    
    // Переключаем состояния 
    menuToggle.classList.toggle('active'); 
    menuToggle.setAttribute('aria-expanded', !isExpanded); 
    mainNav.classList.toggle('mobile-menu-active'); 
    navOverlay.classList.toggle('active'); 
    
    // Блокируем скролл при открытом меню 
    document.body.style.overflow = mainNav.classList.contains('mobile-menu-active') ? 'hidden' : ''; 
} 

// Обработчики событий 
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}
navOverlay.addEventListener('click', toggleMenu); 

// Функция для проверки, активен ли мобильный режим
function isMobileMenuMode() {
    // Если кнопка не существует, значит мы на десктопе
    if (!menuToggle) return false;
    
    // Проверяем, видна ли гамбургер-кнопка (она скрыта на десктопе)
    const computedStyle = window.getComputedStyle(menuToggle);
    const isHamburgerVisible = computedStyle.display !== 'none' && 
                               computedStyle.visibility !== 'hidden' && 
                               computedStyle.opacity !== '0';
    
    // Или меню активно в мобильном режиме
    const isMobileMenuActive = mainNav.classList.contains('mobile-menu-active');
    
    return isHamburgerVisible || isMobileMenuActive;
}

// Закрытие меню при клике на ссылку
const navLinks = document.querySelectorAll('nav a'); 
navLinks.forEach(link => { 
    link.addEventListener('click', (e) => { 
        const href = link.getAttribute('href');
        
        // Только для якорных ссылок
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (!targetElement) return;
            
            // Используем новую функцию для определения режима
            const isMobile = isMobileMenuMode();
            
            if (isMobile) {
                // На мобильных: закрываем меню если открыто
                if (mainNav.classList.contains('mobile-menu-active')) {
                    toggleMenu();
                    
                    setTimeout(() => {
                        scrollToTarget(targetElement, true);
                    }, 100);
                } else {
                    scrollToTarget(targetElement, true);
                }
            } else {
                // На десктопе: просто скроллим БЕЗ отступов
                scrollToTarget(targetElement, false);
            }
        } 
        else if (isMobileMenuMode()) { 
            // Обычные ссылки на мобильных
            toggleMenu(); 
        }
    }); 
}); 

// Функция для точного скролла
function scrollToTarget(targetElement, isMobile) {
    // Получаем абсолютную позицию элемента
    const rect = targetElement.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + rect.top;
    
    let scrollPosition;
    
    if (isMobile) {
        // На мобильных: вычитаем высоту header
        const headerHeight = document.querySelector('header').offsetHeight;
        scrollPosition = absoluteTop - headerHeight;
    } else {
        // На десктопе: позиция элемента как есть, без вычитания header
        scrollPosition = absoluteTop;
    }
    
    window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
    });
}

// Закрытие меню при нажатии Escape
document.addEventListener('keydown', (e) => { 
    if (e.key === 'Escape' && mainNav.classList.contains('mobile-menu-active')) { 
        toggleMenu(); 
    } 
}); 

// Закрытие меню при изменении размера окна (если перешли на десктоп)
window.addEventListener('resize', () => { 
    const isMobileNow = isMobileMenuMode();
    
    // Если перешли на десктоп (гамбургер скрылся) и меню открыто
    if (!isMobileNow && mainNav.classList.contains('mobile-menu-active')) { 
        toggleMenu(); 
    } 
});

// === Код для кнопки "Наверх" ===

// Создаем и добавляем кнопку "Наверх" в DOM
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.id = 'scrollToTop';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.setAttribute('aria-label', 'Наверх');
scrollToTopBtn.innerHTML = '↑';
document.body.appendChild(scrollToTopBtn);

// Минимальная прокрутка для показа кнопки
const SCROLL_THRESHOLD = 300;

// Показывать/скрывать кнопку при прокрутке
function toggleScrollToTopButton() {
    if (window.pageYOffset > SCROLL_THRESHOLD) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

// Плавная прокрутка к началу страницы
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Инициализация кнопки "Наверх"
function initScrollToTop() {
    // Проверяем позицию при загрузке
    toggleScrollToTopButton();
    
    // Слушаем прокрутку страницы
    window.addEventListener('scroll', toggleScrollToTopButton);
    
    // Обработчик клика по кнопке
    scrollToTopBtn.addEventListener('click', scrollToTop);
    
    // Поддержка клавиатуры
    scrollToTopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    });
}

// Инициализируем когда DOM готов
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollToTop);
} else {
    initScrollToTop();
}