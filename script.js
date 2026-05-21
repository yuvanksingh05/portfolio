/* ══════════════════════════════════════════════════════════════════════════
   YUVANK SINGH PORTFOLIO — script.js
   Handles: Loader · Cursor · Particles · Typing · Scroll Reveal · Skill Bars
   ══════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── LOADER ─────────────────────────────────────────────────────────────── */
(function initLoader() {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // Trigger hero reveal after load
      document.querySelectorAll('#hero .reveal-up, #hero .reveal-fade').forEach(el => {
        el.classList.add('visible');
      });
    }, 2200);
  });
})();

/* ─── CUSTOM CURSOR ─────────────────────────────────────────────────────── */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let animFrame;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    animFrame = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects on interactive elements
  const hoverTargets = 'a, button, .glass, input, textarea, .project-card, .tool-chip';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovered');
  });
})();

/* ─── PARTICLE CANVAS ───────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = Math.min(90, Math.floor(window.innerWidth / 14));
  const CONNECTION_DIST = 130;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
      // Randomly teal or purple
      this.color = Math.random() > 0.5 ? '125,249,255' : '79,70,229';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;

      // Subtle mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        this.x += dx / dist * 1.5;
        this.y += dy / dist * 1.5;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(125,249,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  init();
  animate();
})();

/* ─── NAVBAR SCROLL ─────────────────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--accent)' : '';
    });
  }, { passive: true });
})();

/* ─── TYPING ANIMATION ──────────────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'AI & Data Science Student',
    'Future AI Engineer',
    'Machine Learning Enthusiast',
    'Python Developer',
    'Building Tomorrow\'s AI'
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;
  const TYPING_SPEED = 80, DELETING_SPEED = 40, PAUSE = 2000;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? DELETING_SPEED : TYPING_SPEED);
  }

  setTimeout(type, 2400);
})();

/* ─── SCROLL REVEAL ─────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-fade'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    // Don't observe hero elements (they're handled post-load)
    if (!el.closest('#hero')) observer.observe(el);
  });
})();

/* ─── SKILL BAR ANIMATION ───────────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill, .tl-progress-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.dataset.width || '0';
        // Small delay for stagger feel
        setTimeout(() => { target.style.width = width + '%'; }, 200);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ─── CIRCULAR SKILL PROGRESS ───────────────────────────────────────────── */
(function initCircleProgress() {
  // Inject SVG gradient def
  const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgDefs.setAttribute('width', '0');
  svgDefs.setAttribute('height', '0');
  svgDefs.style.position = 'absolute';
  svgDefs.innerHTML = `
    <defs>
      <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#7df9ff"/>
        <stop offset="100%" style="stop-color:#4f46e5"/>
      </linearGradient>
    </defs>
  `;
  document.body.prepend(svgDefs);

  const circles = document.querySelectorAll('.circle-prog');
  const CIRCUMFERENCE = 2 * Math.PI * 24; // r=24

  circles.forEach(c => {
    c.style.strokeDasharray = `0 ${CIRCUMFERENCE}`;
    c.setAttribute('stroke', 'url(#circleGrad)');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circle = entry.target;
        const pct = parseFloat(circle.dataset.pct) / 100;
        const dashLen = pct * CIRCUMFERENCE;
        setTimeout(() => {
          circle.style.transition = 'stroke-dasharray 1.5s cubic-bezier(0.16,1,0.3,1)';
          circle.style.strokeDasharray = `${dashLen} ${CIRCUMFERENCE - dashLen}`;
        }, 250);
        observer.unobserve(circle);
      }
    });
  }, { threshold: 0.3 });

  circles.forEach(c => observer.observe(c));
})();

/* ─── CONTACT FORM ──────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';

    // Simulate async send
    setTimeout(() => {
      form.reset();
      success.classList.add('show');
      btn.querySelector('span').textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1500);
  });
})();

/* ─── SMOOTH ANCHOR SCROLL ──────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
})();

/* ─── FLOATING CHIPS PARALLAX ───────────────────────────────────────────── */
(function initParallaxChips() {
  const chips = document.querySelectorAll('.floating-chip');
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    chips.forEach((chip, i) => {
      const factor = (i + 1) * 0.4;
      chip.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });
})();

/* ─── ACTIVE SECTION HIGHLIGHT ──────────────────────────────────────────── */
(function initActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        // Nothing extra needed beyond nav highlighting above
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ─── TILT EFFECT ON PROJECT CARDS ─────────────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── GLITCH TEXT ON HERO NAME (subtle) ────────────────────────────────── */
(function initGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  setInterval(() => {
    if (Math.random() > 0.95) {
      name.style.filter = 'blur(1px)';
      setTimeout(() => { name.style.filter = ''; }, 60);
    }
  }, 3000);
})();

/* ─── CONSOLE GREETING ──────────────────────────────────────────────────── */
console.log('%c\n██╗   ██╗ ██╗   ██╗██╗   ██╗ █████╗ ███╗  ██╗██╗  ██╗\n╚██╗ ██╔╝ ██║   ██║██║   ██║██╔══██╗████╗ ██║██║ ██╔╝\n ╚████╔╝  ██║   ██║██║   ██║███████║██╔██╗██║█████╔╝ \n  ╚██╔╝   ██║   ██║╚██╗ ██╔╝██╔══██║██║╚████║██╔═██╗ \n   ██║    ╚██████╔╝ ╚████╔╝ ██║  ██║██║ ╚███║██║  ██╗\n   ╚═╝     ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚══╝╚═╝  ╚═╝\n', 
  'color: #7df9ff; font-family: monospace;');
console.log('%c AI & Data Science Student | Future AI Engineer', 'color: #a78bfa; font-size: 14px;');
console.log('%c Portfolio by Yuvank Singh © 2026', 'color: #64748b; font-size: 12px;');
