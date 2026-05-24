// =============================================
// ALMOND GROWTH — main.js
// =============================================

// --- Navbar scroll effect ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 40);
});

// --- Mobile menu ---
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// --- Counter animation ---
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.stat-card__num');
let countersStarted = false;

// --- Intersection Observer for reveal animations ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter observer (fires once when hero stats enter view)
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero__stats');
if (statsSection) counterObserver.observe(statsSection);

// --- Formspree Form Submission ---
const form        = document.getElementById('auditForm');
const successBlock = document.getElementById('ctaSuccess');
const errorBlock   = document.getElementById('ctaError');
const submitBtn    = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ---- Client-side validation ----
    const name     = document.getElementById('fname').value.trim();
    const email    = document.getElementById('femail').value.trim();
    const industry = document.getElementById('findustry').value;

    if (!name || !email || !industry) {
      alert('Please fill in your full name, email address, and industry to continue.');
      return;
    }

    // Mirror email into the hidden _replyto field so Formspree
    // sets the reply-to address correctly in your inbox
    const replyField = document.getElementById('replytoField');
    if (replyField) replyField.value = email;

    // ---- Loading state ----
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending your request…';

    // ---- Send to Formspree ----
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // SUCCESS — show thank-you message
        form.hidden = true;
        if (errorBlock) errorBlock.hidden = true;
        successBlock.hidden = false;
        successBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.reset();
      } else {
        throw new Error('Formspree returned an error');
      }
    } catch (err) {
      // ERROR — show error message, re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book My Free Retention Audit →';
      if (errorBlock) {
        errorBlock.hidden = false;
        errorBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      console.error('Form submission error:', err);
    }
  });
}

// --- Smooth active nav link highlighting ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.fontWeight = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--almond)';
          link.style.fontWeight = '600';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));