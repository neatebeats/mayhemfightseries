/* ============================================
   IRON FIST PROMOTIONS — MAIN JS
   ============================================ */

// === NAVIGATION ===
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav__mobile a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// === COUNTDOWN TIMER ===
function initCountdown(targetDateStr) {
  const targetDate = new Date(targetDateStr);

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');
    if (document.getElementById('cd-days')) {
      document.getElementById('cd-days').textContent = pad(days);
      document.getElementById('cd-hours').textContent = pad(hours);
      document.getElementById('cd-mins').textContent = pad(mins);
      document.getElementById('cd-secs').textContent = pad(secs);
    }
  }

  update();
  setInterval(update, 1000);
}

// Will be called with event date from CMS data or hardcoded default
const nextEventDate = document.getElementById('next-event-date-raw');
if (nextEventDate) {
  initCountdown(nextEventDate.dataset.date);
} else {
  // Default fallback date
  const d = new Date();
  d.setDate(d.getDate() + 45);
  initCountdown(d.toISOString());
}

// === SCROLL ANIMATIONS ===
const animatedEls = document.querySelectorAll('.animate-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animatedEls.forEach(el => observer.observe(el));

// === GALLERY LIGHTBOX ===
const lightbox = document.getElementById('lightbox');
let galleryImages = [];
let currentIndex = 0;

function openLightbox(images, index) {
  if (!lightbox) return;
  galleryImages = images;
  currentIndex = index;
  document.getElementById('lightbox-img').src = galleryImages[currentIndex];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
  document.getElementById('lightbox-img').src = galleryImages[currentIndex];
}

if (lightbox) {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => lightboxNav(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => lightboxNav(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });
}

// Init gallery click handlers
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const imgs = Array.from(items).map(el => el.querySelector('img')?.src).filter(Boolean);
  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(imgs, i));
  });
}
initGallery();

// === GALLERY FILTER ===
const filterBtns = document.querySelectorAll('.gallery-filter__btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      if (filter === 'all' || item.dataset.event === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// === CONTACT FORM TABS ===
const formTabs = document.querySelectorAll('.form-tab');
const formPanels = document.querySelectorAll('.form-panel');
formTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    formTabs.forEach(t => t.classList.remove('active'));
    formPanels.forEach(p => p.style.display = 'none');
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.target);
    if (target) target.style.display = 'block';
  });
});
if (formPanels.length > 0) formPanels[0].style.display = 'block';

// === NETLIFY FORMS — prevent default & show success ===
document.querySelectorAll('form[data-netlify]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      await fetch('/', { method: 'POST', body: data });
      form.innerHTML = `<div style="padding:40px;text-align:center;">
        <div style="font-family:var(--font-display);font-size:48px;color:var(--red);margin-bottom:16px;">SENT</div>
        <p style="font-family:var(--font-condensed);color:var(--grey);">Thanks! We'll be in touch soon.</p>
      </div>`;
    } catch {
      alert('Something went wrong. Please try again.');
    }
  });
});

// === ACTIVE NAV LINK ===
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.style.color = 'var(--red)';
  }
});
