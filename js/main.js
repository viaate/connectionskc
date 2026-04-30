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

// Impact data — reads impact.json; extras shown only if toggled on in admin
fetch('/impact.json?v=' + Date.now())
  .then(r => r.json())
  .then(data => {
    // Animated dollar total (always shown)
    const total = data.total;
    if (total) {
      const el = document.getElementById('impactTotal');
      const duration = 1800, start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = '$' + Math.round(e * total).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    // Computers count (only if toggled on)
    if (data.show_computers && data.computers) {
      document.getElementById('computerStat').style.display = 'flex';
      document.getElementById('statDivider').style.display = 'block';
      document.getElementById('computersCount').textContent = data.computers;
    }

    // Change log section (only if toggled on)
    if (data.show_log) {
      fetch('/data/changelog.json?v=' + Date.now())
        .then(r => r.json())
        .then(cl => {
          const entries = (cl.log || []).slice(0, 8);
          if (!entries.length) return;
          document.getElementById('changelogSection').style.display = 'block';
          document.getElementById('changelogHome').innerHTML = entries.map(e => {
            const date = new Date(e.date).toLocaleDateString('en-US',
              { month: 'long', day: 'numeric', year: 'numeric' });
            const from = fmtVal(e.from, e.field), to = fmtVal(e.to, e.field);
            return `<div style="display:flex;gap:16px;padding:12px 0;border-bottom:1px solid #e6f7ed;">
              <div style="width:8px;height:8px;border-radius:50%;background:#22b14c;margin-top:7px;flex-shrink:0;"></div>
              <div>
                <div style="font-size:0.8rem;color:#6b8a73;">${date}</div>
                <div style="font-weight:700;color:#1a2e1e;">${e.field}: ${from} &rarr; ${to}</div>
              </div>
            </div>`;
          }).join('');
        }).catch(() => {});
    }
  })
  .catch(() => {});

function fmtVal(val, field) {
  if (typeof val === 'boolean') return val ? 'On' : 'Off';
  if (field === 'Impact Total') return '$' + Number(val).toLocaleString();
  return String(val);
}

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
