// ========================================
// Portfolio — Azis Yulianto
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initNavigation();
  initScrollReveal();
  initCountUp();
  initSmoothScroll();
});

// ----------------------------------------
// Cursor Glow Effect
// ----------------------------------------
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  
  // Only on desktop
  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function animateGlow() {
      // Smooth lag behind cursor
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
  } else {
    glow.style.display = 'none';
  }
}

// ----------------------------------------
// Navigation
// ----------------------------------------
function initNavigation() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  
  // Scroll state
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = scrollY;
  }, { passive: true });
  
  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close on link click
    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
  
  // Active link highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// ----------------------------------------
// Scroll Reveal
// ----------------------------------------
function initScrollReveal() {
  const revealElements = [
    '.section-label',
    '.section-title',
    '.section-subtitle',
    '.about-text p',
    '.info-card',
    '.code-snippet',
    '.skill-category',
    '.reason-card',
    '.brc7-commitment',
    '.project-card',
    '.contact-title',
    '.contact-desc',
    '.contact-link',
    '.hero-badge',
    '.hero-title',
    '.hero-desc',
    '.hero-actions',
    '.hero-stats',
    '.hero-photo-wrapper',
  ];
  
  const elements = document.querySelectorAll(revealElements.join(', '));
  
  elements.forEach((el, index) => {
    el.classList.add('reveal');
    // Stagger within same section
    const sectionParent = el.closest('section') || el.closest('.hero');
    if (sectionParent) {
      const siblings = sectionParent.querySelectorAll('.reveal');
      const sibIndex = Array.from(siblings).indexOf(el);
      if (sibIndex <= 4) {
        el.classList.add(`reveal-delay-${sibIndex}`);
      }
    }
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
}

// ----------------------------------------
// Count Up Animation
// ----------------------------------------
function initCountUp() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  let hasAnimated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => animateCounter(counter));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    
    el.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ----------------------------------------
// Smooth Scroll
// ----------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });
}
