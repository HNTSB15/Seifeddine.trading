// Supabase client
const { createClient } = supabase;
const db = createClient(
  'https://cumutgiboprzqolvcbnm.supabase.co',
  'sb_publishable_EJXxq-IIhdlY5A9yqVasVg_QonDOf_Q'
);

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') document.body.classList.add('light-mode');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile nav toggle
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
}

// Typed role animation
const roles = [
  'Forex Trading Expert',
  'Cryptocurrency Manager',
  'Risk Management Specialist',
  'Profitable Trader',
];
let roleIndex = 0, charIndex = 0, deleting = false;
const el = document.getElementById('typed-role');
function type() {
  const current = roles[roleIndex];
  if (!deleting) {
    el.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    el.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 40 : 80);
}
type();

// Scroll reveal — reusable, safe to call after dynamic renders
function applyReveal(selector) {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(selector).forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'translateY(0)';
    });
    return;
  }
  document.querySelectorAll(selector).forEach(el => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    io.observe(el);
  });
}
applyReveal('.skill-group, .about__grid, .contact__grid');

// ── DATABASE LOADERS ──────────────────────────────────────────────────────────

// About stats
async function loadStats() {
  const { data } = await db.from('trading_stats').select('label, value');
  if (!data?.length) return;
  document.querySelectorAll('.stat').forEach(statEl => {
    const labelEl = statEl.querySelector('.stat__label');
    const numEl   = statEl.querySelector('.stat__num');
    const row = data.find(d => d.label === labelEl?.textContent.trim());
    if (row) numEl.textContent = row.value;
  });
}

// Highlights section
async function loadHighlights() {
  const { data } = await db.from('highlights').select('*').order('sort_order');
  if (!data?.length) return;
  const grid = document.querySelector('.highlights__grid');
  if (!grid) return;
  grid.innerHTML = data.map(h => `
    <article class="highlight-card">
      <div class="highlight-card__icon">${h.icon}</div>
      <h3>${h.title}</h3>
      <p>${h.description}</p>
    </article>`).join('');
  applyReveal('.highlight-card');
}

// Projects / Trading Performance section
async function loadProjects() {
  const { data } = await db.from('projects').select('*').order('sort_order');
  if (!data?.length) return;
  const grid = document.querySelector('.projects__grid');
  if (!grid) return;
  grid.innerHTML = data.map(p => {
    const tags = Array.isArray(p.tags) ? p.tags : [];
    return `
    <article class="project-card">
      <div class="project-card__header">
        <div class="project-card__icon">${p.icon}</div>
        <div class="project-card__links">
          <a href="#" target="_blank" rel="noopener" aria-label="Details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
      <h3 class="project-card__title">${p.title}</h3>
      <p class="project-card__desc">${p.description}</p>
      <div class="project-card__tags">${tags.map(t => `<span class="tag tag--sm">${t}</span>`).join('')}</div>
    </article>`;
  }).join('');
  applyReveal('.project-card');
}

// Experience / Timeline section
async function loadExperience() {
  const { data } = await db.from('experience').select('*').order('sort_order');
  if (!data?.length) return;
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  timeline.innerHTML = data.map(exp => {
    const bullets = Array.isArray(exp.bullets) ? exp.bullets : [];
    const tags    = Array.isArray(exp.tags)    ? exp.tags    : [];
    return `
    <div class="timeline__item">
      <div class="timeline__dot"></div>
      <div class="timeline__card">
        <div class="timeline__header">
          <div>
            <h3 class="timeline__role">${exp.role}</h3>
            <p class="timeline__company">${exp.company}</p>
          </div>
          <span class="timeline__period">${exp.period}</span>
        </div>
        <ul class="timeline__bullets">${bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        ${tags.length ? `<div class="skill-tags" style="margin-top:12px">${tags.map(t => `<span class="tag tag--sm">${t}</span>`).join('')}</div>` : ''}
      </div>
    </div>`;
  }).join('');
  applyReveal('.timeline__card');
}

// Client testimonials section
async function loadClients() {
  const { data } = await db.from('clients').select('*').order('sort_order');
  if (!data?.length) return;
  const grid = document.querySelector('.testimonials__grid');
  if (!grid) return;
  grid.innerHTML = data.map(c => `
    <article class="testimonial-card">
      <div class="testimonial-card__stars">★★★★★</div>
      <p class="testimonial-card__quote">${c.testimonial}</p>
      <div class="testimonial-card__client">
        <div class="testimonial-card__avatar">${c.avatar_initials}</div>
        <div class="testimonial-card__info">
          <p class="testimonial-card__name">${c.name}</p>
          <p class="testimonial-card__country">${c.country}</p>
        </div>
        <span class="testimonial-card__return">${c.return_pct}</span>
      </div>
    </article>`).join('');
  applyReveal('.testimonial-card');
}

// Visitor counter — only counts unique visitors (once per browser)
async function trackVisitor() {
  if (!localStorage.getItem('visited')) {
    await db.from('visitors').insert({});
    localStorage.setItem('visited', '1');
  }
  const { count } = await db.from('visitors').select('*', { count: 'exact', head: true });
  const el = document.getElementById('visitorCount');
  if (el && count !== null) el.textContent = count.toLocaleString();
}
trackVisitor();

// Boot all loaders
loadStats();
loadHighlights();
loadProjects();
loadExperience();
loadClients();

// ── REVIEW FORM ───────────────────────────────────────────────────────────────
document.getElementById('reviewForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn     = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('reviewSuccess');
  const name       = document.getElementById('r-name').value.trim();
  const country    = document.getElementById('r-country').value.trim();
  const return_pct = document.getElementById('r-return').value.trim();
  const message    = document.getElementById('r-message').value.trim();

  btn.textContent = 'Submitting...';
  btn.disabled = true;

  const { error } = await db.from('reviews').insert({ name, country, return_pct, message });

  btn.textContent = 'Submit Review';
  btn.disabled = false;

  if (error) {
    success.textContent = 'Something went wrong. Please try again.';
    success.style.color = '#ef4444';
  } else {
    success.textContent = 'Thank you! Your review has been submitted for approval.';
    success.style.color = '';
  }
  success.classList.add('show');
  e.target.reset();
  setTimeout(() => success.classList.remove('show'), 5000);
});

// ── CONTACT FORM ──────────────────────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn     = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  const name    = e.target.name.value.trim();
  const email   = e.target.email.value.trim();
  const message = e.target.message.value.trim();

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const [dbResult, emailResult] = await Promise.allSettled([
    db.from('contacts').insert({ name, email, message }),
    emailjs.send('service_442hyjy', 'template_31wiijb', {
      from_name: name,
      from_email: email,
      message: message
    })
  ]);

  btn.textContent = 'Send Inquiry';
  btn.disabled = false;

  const failed = dbResult.value?.error && emailResult.status === 'rejected';
  if (failed) {
    success.textContent = 'Something went wrong. Please try again.';
    success.style.color = '#ef4444';
  } else {
    success.textContent = "Thank you! I'll get back to you within 24 hours.";
    success.style.color = '';
  }
  success.classList.add('show');
  e.target.reset();
  setTimeout(() => success.classList.remove('show'), 4000);
});
