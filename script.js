/**
 * AI Powered Predictive Maintenance of DC Motor
 * Interactive animations & UI behavior
 */

(function () {
  'use strict';

  /* ---- DOM References ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const heroGlow = document.getElementById('hero-glow');
  const heroSection = document.getElementById('home');
  const canvas = document.getElementById('particles-canvas');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  const sections = [
    'home', 'team', 'description', 'highlights', 'users',
    'workflow', 'software', 'models', 'features', 'results',
    'comparison', 'challenges', 'future', 'gallery'
  ];

  const navSectionMap = {
    home: 'home',
    team: 'team',
    description: 'description',
    highlights: 'highlights',
    users: 'users',
    workflow: 'workflow',
    results: 'results',
    gallery: 'gallery',
    future: 'future'
  };

  /* ---- Navbar Scroll Effect ---- */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ---- Mobile Navigation ---- */
  function toggleMobileNav() {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileNav() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileNav);

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileNav();
    });
  });

  /* ---- Active Nav Link ---- */
  function updateActiveNav() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    let current = 'home';

    sections.forEach(function (id) {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= scrollPos) {
        current = id;
      }
    });

    const navTarget = navSectionMap[current] || current;

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('active', href === navTarget);
    });
  }

  /* ---- Scroll Reveal ---- */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const modelCards = document.querySelectorAll('.model-card');
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });

    modelCards.forEach(function (card) {
      observer.observe(card);
    });

    timelineItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---- Counter Animation ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ---- Particle System ---- */
  function initParticles() {
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor(window.innerWidth / 12), 80);
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p, i) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          p.x -= dx * 0.008;
          p.y -= dy * 0.008;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, ' + p.opacity + ')';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const distance = Math.sqrt(ddx * ddx + ddy * ddy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(139, 92, 246, ' + (0.08 * (1 - distance / 100)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', function () {
      resize();
      createParticles();
    });

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    return function cleanup() {
      cancelAnimationFrame(animationId);
    };
  }

  /* ---- Hero Mouse Glow ---- */
  function initHeroGlow() {
    if (!heroGlow || !heroSection) return;

    heroSection.addEventListener('mousemove', function (e) {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroGlow.style.left = x + 'px';
      heroGlow.style.top = y + 'px';
      heroGlow.style.opacity = '1';
    });

    heroSection.addEventListener('mouseleave', function () {
      heroGlow.style.opacity = '0';
    });
  }

  /* ---- Parallax ---- */
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-image-wrapper, .split-visual .image-frame, .results-visual .image-frame');

    window.addEventListener('scroll', function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      parallaxElements.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight - rect.top) * 0.015;
          el.style.transform = 'translateY(' + (offset * -1) + 'px)';
        }
      });
    }, { passive: true });
  }

  /* ---- Lightbox ---- */
  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightboxModal() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      lightboxImg.src = '';
    }, 300);
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      const caption = item.dataset.caption || img.alt;
      openLightbox(img.src, caption);
    });
  });

  lightboxClose.addEventListener('click', closeLightboxModal);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightboxModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightboxModal();
    }
  });

  /* ---- Smooth Scroll Enhancement ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---- Init ---- */
  function init() {
    handleNavbarScroll();
    updateActiveNav();
    initScrollReveal();
    initCounters();
    initParticles();
    initHeroGlow();
    initParallax();

    window.addEventListener('scroll', function () {
      handleNavbarScroll();
      updateActiveNav();
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
