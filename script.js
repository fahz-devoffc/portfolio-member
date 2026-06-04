document.addEventListener('DOMContentLoaded', () => {
  
  /* ---------------------------------------------------------
     1. SCROLL STATE FOR HEADER
     --------------------------------------------------------- */
  const header = document.querySelector('.main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once on startup

  /* ---------------------------------------------------------
     2. MOBILE MENU TOGGLE
     --------------------------------------------------------- */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  mobileToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ---------------------------------------------------------
     3. SCROLL REVEAL ANIMATION (IntersectionObserver)
     --------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ---------------------------------------------------------
     4. INTERACTIVE CANVAS BACKGROUND (Particle Grid)
     --------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(65, Math.floor((width * height) / 22000));
  const connectionDistance = 120;
  const mouse = { x: null, y: null, radius: 150 };

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track Mouse Move
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Reset Mouse Out
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.baseColor = Math.random() > 0.5 ? '180, 100%, 50%' : '270, 95%, 68%'; // Cyan or Violet
    }

    update() {
      // Boundaries check
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Update positions
      this.x += this.vx;
      this.y += this.vy;

      // Mouse interaction (push away slightly)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.baseColor}, 0.5)`;
      ctx.fill();
    }
  }

  // Populate list
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Connection Engine
  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          const opacity = (1 - (dist / connectionDistance)) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(180, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  };

  // Animation Loop
  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  };

  animate();

  /* ---------------------------------------------------------
     5. CONTACT FORM INTERACTION
     --------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      // Simulate loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting...</span>`;
      
      setTimeout(() => {
        // Hide Form, Show Success Alert
        contactForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }
});
