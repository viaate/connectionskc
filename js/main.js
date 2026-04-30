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

    // Impact chart (only if toggled on)
    if (data.show_log) {
      fetch('/data/changelog.json?v=' + Date.now())
        .then(r => r.json())
        .then(cl => {
          // Only Impact Total entries, sorted oldest → newest, plus current value as final point
          const points = (cl.log || [])
            .filter(e => e.field === 'Impact Total')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          const allPoints = [...points, { date: new Date().toISOString(), to: data.total }];

          document.getElementById('changelogSection').style.display = 'block';

          const labels = allPoints.map(e =>
            new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          );
          const values = allPoints.map(e => Number(e.to));

          new Chart(document.getElementById('impactChart'), {
            type: 'line',
            data: {
              labels,
              datasets: [{
                label: 'Total Donated',
                data: values,
                borderColor: '#22b14c',
                backgroundColor: 'rgba(34,177,76,0.10)',
                borderWidth: 3,
                pointBackgroundColor: '#22b14c',
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.35
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: { label: ctx => '$' + Number(ctx.parsed.y).toLocaleString() }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: v => '$' + Number(v).toLocaleString(),
                    font: { family: 'Nunito', weight: '700' },
                    color: '#6b8a73'
                  },
                  grid: { color: 'rgba(34,177,76,0.08)' }
                },
                x: {
                  ticks: {
                    font: { family: 'Nunito', weight: '600' },
                    color: '#6b8a73',
                    maxRotation: 30
                  },
                  grid: { display: false }
                }
              }
            }
          });
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
