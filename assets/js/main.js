// AOS init
AOS.init({ duration: 900, once: true });

// Render dynamic gallery
const galleryImages = [
  { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", alt: "Foto de Retrato", categoria: "retratos", label: "Retratos", delay: 0 },
  { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80", alt: "Foto de Casamento", categoria: "casamentos", label: "Casamentos", delay: 100 },
  { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", alt: "Foto de Paisagem", categoria: "paisagens", label: "Paisagens", delay: 200 },
  { src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", alt: "Foto de Ensaio", categoria: "ensaios", label: "Ensaios", delay: 300 },
  { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80", alt: "Foto de Evento", categoria: "eventos", label: "Eventos", delay: 400 },
  { src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80", alt: "Foto de Produto", categoria: "retratos", label: "Produtos", delay: 500 }
];

const galleryContainer = document.querySelector('.gallery-container');
function renderGallery(images) {
  if (!galleryContainer) return;
  galleryContainer.innerHTML = '';
  images.forEach(img => {
    const div = document.createElement('div');
    div.className = 'gallery-item cursor-pointer';
    div.setAttribute('data-category', img.categoria);
    div.setAttribute('data-aos', 'fade-up');
    if (img.delay) div.setAttribute('data-aos-delay', img.delay);
    div.innerHTML = `
      <img src="${img.src}" alt="${img.alt}" class="gallery-image" loading="lazy">
      <div class="gallery-overlay">
        <p class="text-white font-semibold">${img.label}</p>
      </div>
    `;
    galleryContainer.appendChild(div);
  });
}
renderGallery(galleryImages);

// Lucide icons
if (window.lucide && typeof window.lucide.createIcons === 'function') {
  window.lucide.createIcons();
}

// Mobile menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenuCloseButton = document.getElementById('mobile-menu-close-button');
const mobileMenu = document.getElementById('mobile-menu');
const openMenu = () => { if (mobileMenu) { mobileMenu.classList.remove('hidden'); mobileMenuButton?.setAttribute('aria-expanded','true'); }};
const closeMenu = () => { if (mobileMenu) { mobileMenu.classList.add('hidden'); mobileMenuButton?.setAttribute('aria-expanded','false'); }};
mobileMenuButton?.addEventListener('click', openMenu);
mobileMenuCloseButton?.addEventListener('click', closeMenu);
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Header behavior on scroll + scrollspy
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
const setActiveLink = () => {
  let current = sections[0];
  const fromTop = window.scrollY + 120; // offset for header height
  sections.forEach(sec => { if (sec.offsetTop <= fromTop) current = sec; });
  navLinks.forEach(link => link.classList.remove('active'));
  const active = Array.from(navLinks).find(l => l.getAttribute('href') === `#${current.id}`);
  active?.classList.add('active');
};
window.addEventListener('scroll', () => {
  if (!header) return;
  if (window.scrollY > 10) { header.classList.add('is-scrolled'); }
  else { header.classList.remove('is-scrolled'); }
  setActiveLink();
});
window.addEventListener('load', setActiveLink);

// Modal gallery
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.getElementById('modalClose');
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target && target.classList && target.classList.contains('gallery-image')) {
    if (modal && modalImg) { modal.style.display = 'flex'; modalImg.src = target.src; }
  }
});
const closeModal = () => { if (modal) modal.style.display = 'none'; };
closeBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

// Back to top
const backToTopButton = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (!backToTopButton) return;
  if (window.scrollY > 300) {
    backToTopButton.classList.remove('opacity-0', 'invisible');
    backToTopButton.classList.add('opacity-100', 'visible');
  } else {
    backToTopButton.classList.add('opacity-0', 'invisible');
    backToTopButton.classList.remove('opacity-100', 'visible');
  }
});
backToTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Contact form validation (optional)
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
const submitText = document.getElementById('submitText');
const loadingSpinner = document.getElementById('loadingSpinner');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const showError = (input, errorElement, message) => { input?.classList.add('border-red-500'); if (errorElement) { errorElement.textContent = message; errorElement.classList.remove('hidden'); } };
const hideError = (input, errorElement) => { input?.classList.remove('border-red-500'); errorElement?.classList.add('hidden'); };
const validateField = (input, errorElement, validationFn, errorMessage) => {
  if (!input) return true;
  if (!validationFn(input.value)) { showError(input, errorElement, errorMessage); return false; }
  hideError(input, errorElement); return true;
};
const validateForm = () => {
  let isValid = true;
  isValid = validateField(nameInput, nameError, (v)=> v && v.length >= 3, 'Por favor, insira um nome válido (mínimo 3 caracteres).') && isValid;
  isValid = validateField(emailInput, emailError, validateEmail, 'Por favor, insira um email válido.') && isValid;
  isValid = validateField(messageInput, messageError, (v)=> v && v.length >= 10, 'Por favor, insira uma mensagem (mínimo 10 caracteres).') && isValid;
  return isValid;
};
if (contactForm) contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  if (submitButton) submitButton.disabled = true;
  if (submitText) submitText.textContent = 'Enviando...';
  loadingSpinner?.classList.remove('hidden');
  formSuccess?.classList.add('hidden');
  formError?.classList.add('hidden');
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    formSuccess?.classList.remove('hidden');
    contactForm.reset();
  } catch {
    formError?.classList.remove('hidden');
  } finally {
    if (submitButton) submitButton.disabled = false;
    if (submitText) submitText.textContent = 'Enviar Mensagem';
    loadingSpinner?.classList.add('hidden');
  }
});

// Filters for gallery
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = () => document.querySelectorAll('.gallery-item');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => { 
      btn.classList.remove('active'); 
      btn.style.backgroundColor = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    });
    
    button.classList.add('active');
    button.style.backgroundColor = 'var(--accent)';
    button.style.color = '#FFFFFF';
    button.style.borderColor = 'var(--accent)';
    
    const filter = button.getAttribute('data-filter');
    galleryItems().forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = 'block';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });
  });
});

// Scroll progress bar
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.height = progress + '%';
});

// Theme Toggle Functionality
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.currentTheme);
    
    // Bind events
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    if (themeToggleMobile) {
      themeToggleMobile.addEventListener('click', () => this.toggleTheme());
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(mediaQuery.matches ? 'dark' : 'light');
        }
      });
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button states
    this.updateToggleButtons();
    
    // Trigger custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: theme }
    }));
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateToggleButtons() {
    const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
    toggleButtons.forEach(button => {
      if (this.currentTheme === 'light') {
        button.setAttribute('aria-label', 'Mudar para modo escuro');
        button.title = 'Mudar para modo escuro';
      } else {
        button.setAttribute('aria-label', 'Mudar para modo claro');
        button.title = 'Mudar para modo claro';
      }
    });
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();