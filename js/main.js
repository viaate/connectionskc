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

// Contact form — submits to Formspree, delivers to ogonsher@gmail.com
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form    = this;
  const success = document.getElementById('formSuccess');
  const btn     = form.querySelector('.submit-btn');

  btn.disabled    = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch(form.action, {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      success.textContent = 'Thanks for reaching out! We\'ll get back to you soon.';
    } else {
      success.textContent = 'Something went wrong. Please email ogonsher@gmail.com directly.';
    }
  } catch {
    success.textContent = 'Something went wrong. Please email ogonsher@gmail.com directly.';
  }

  success.classList.add('visible');
  form.reset();
  btn.disabled    = false;
  btn.textContent = 'Send Message';
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
