// =============================================
// ALMOND GROWTH — blog.js
// Blog filtering + article modal system
// =============================================

// --- Article Modal ---
function showArticle(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Scroll modal to top
  overlay.scrollTo(0, 0);
}

function closeArticle(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on backdrop click
document.querySelectorAll('.article-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.article-overlay.open').forEach(o => {
      o.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

// --- Blog Category Filter ---
const tagBtns = document.querySelectorAll('.tag-btn');
const blogCards = document.querySelectorAll('.blog-card');
const featuredCard = document.querySelector('.featured-card');

tagBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    tagBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    // Filter blog cards
    blogCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    // Filter featured card
    if (featuredCard) {
      const featuredCat = featuredCard.dataset.category;
      if (filter === 'all' || featuredCat === filter) {
        featuredCard.closest('.blog-featured').style.display = '';
      } else {
        featuredCard.closest('.blog-featured').style.display = 'none';
      }
    }
  });
});

// --- Reveal animation for blog cards ---
const blogRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      blogRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => blogRevealObserver.observe(el));