// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Impact total — reads from Google Sheet (cell F1 = grand total)
// Sheet must be shared as "Anyone with the link can view"
// Replace SHEET_ID below with your actual Google Sheets ID
const SHEET_ID = 'YOUR_SHEET_ID';
fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&range=F1`)
  .then(r => r.text())
  .then(text => {
    const json = JSON.parse(text.substring(47, text.length - 2));
    const total = json.table.rows[0].c[0].v;
    if (!total) return;
    // Count-up animation
    const el = document.getElementById('impactTotal');
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = '$' + Math.round(eased * total).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })
  .catch(() => {
    document.getElementById('impactTotal').textContent = 'Growing!';
  });

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.about-grid, .mission-card, .gallery-item, .contact-form, .about-photo, .about-text'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
