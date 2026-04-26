// Supabase client
const SUPABASE_URL = 'https://cumutgiboprzqolvcbnm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_EJXxq-IIhdlY5A9yqVasVg_QonDOf_Q';
const EMAILJS_PUBLIC_KEY = 'RlQp_bILdnIDbvhv_';
const EMAILJS_SERVICE_ID = 'service_442hyjy';
const EMAILJS_TEMPLATE_ID = 'template_31wiijb';

const db = window.supabase?.createClient
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

if (window.emailjs?.init) {
  window.emailjs.init(EMAILJS_PUBLIC_KEY);
}

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function cleanMarketingText(value) {
  return String(value ?? '')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\$2M\+\s+Managed Assets/gi, '$2K+ Managed Capital')
    .replace(/\$2M\+/g, '$2K+')
    .replace(/Managed Assets/g, 'Managed Capital')
    .replace(/Proven Trading Results/g, 'Trading Results & Process')
    .replace(/12 Months Profit/g, '12 Months Tracked')
    .replace(/Reliable performance with a proven history of profitable months for investors\./gi, 'Monthly performance monitoring with clear reporting for account holders.')
    .replace(/Consistent growth through disciplined trading strategies across major markets\./gi, 'Reported historical performance with disciplined strategies across major markets.')
    .replace(/Experienced account management for high-value forex and crypto portfolios\./gi, 'Focused account management for growing forex and crypto portfolios.')
    .replace(/Manage \$2K\+ in Assets Under Management \(AUM\) across forex and cryptocurrency markets/gi, 'Manage $2K+ in client capital across forex and cryptocurrency markets')
    .replace(/Achieved 45% average annual returns with consistent performance across multiple strategies/gi, 'Track historical annual performance with disciplined risk management across multiple strategies')
    .replace(/Started with micro accounts and scaled to managing \$500k\+ personal and client capital/gi, 'Started with micro accounts and built experience managing personal and client capital')
    .replace(/Achieved 38% average annual returns through disciplined risk management/gi, 'Built a disciplined approach around risk management, journaling, and trade review');
}

function displayText(value) {
  return escapeHTML(cleanMarketingText(value));
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeProjectUrl(value) {
  if (!value) return '';

  try {
    const rawUrl = String(value).trim();
    if (!/^https?:\/\//i.test(rawUrl)) return '';
    const url = new URL(rawUrl);
    return ['http:', 'https:'].includes(url.protocol) ? escapeHTML(url.href) : '';
  } catch {
    return '';
  }
}

function showFeedback(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? '#ef4444' : '';
  element.classList.add('show');
}

function hideFeedbackLater(element, delay = 4500) {
  if (!element) return;
  setTimeout(() => element.classList.remove('show'), delay);
}

function setButtonLoading(button, isLoading, normalText, loadingText) {
  if (!button) return;
  button.textContent = isLoading ? loadingText : normalText;
  button.disabled = isLoading;
}

async function fetchRows(table, columns = '*', orderBy = 'sort_order') {
  if (!db) return [];

  try {
    let query = db.from(table).select(columns);
    if (orderBy) query = query.order(orderBy);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`Could not load ${table}:`, error);
    return [];
  }
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = storageGet('theme') || 'dark';
if (savedTheme === 'light') document.body.classList.add('light-mode');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    storageSet('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Mobile nav toggle
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

function closeMobileNav() {
  if (!toggle || !navLinks) return;
  navLinks.classList.remove('open');
  toggle.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileNav();
  });
}

// Typed role animation
const roles = [
  'Forex Trading Expert',
  'Cryptocurrency Manager',
  'Risk Management Specialist',
  'Trading Process Advisor',
];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;
const typedRoleEl = document.getElementById('typed-role');

function typeRole() {
  if (!typedRoleEl) return;

  const current = roles[roleIndex];
  if (!deleting) {
    typedRoleEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    typedRoleEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeRole, deleting ? 40 : 80);
}
typeRole();

// Scroll reveal
function applyReveal(selector) {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(selector).forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
    return;
  }

  document.querySelectorAll(selector).forEach(element => {
    if (element.dataset.revealed) return;
    element.dataset.revealed = '1';
    element.style.opacity = '0';
    element.style.transform = 'translateY(24px)';
    element.style.transition = 'opacity .5s ease, transform .5s ease';

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    observer.observe(element);
  });
}
applyReveal('.skill-group, .about__grid, .contact__grid');

// Database loaders
async function loadStats() {
  const data = await fetchRows('trading_stats', 'label, value', null);
  if (!data.length) return;

  document.querySelectorAll('.stat').forEach(statEl => {
    const labelEl = statEl.querySelector('.stat__label');
    const numEl = statEl.querySelector('.stat__num');
    const row = data.find(item => item.label === labelEl?.textContent.trim());
    if (row && numEl) numEl.textContent = cleanMarketingText(row.value);
  });
}

async function loadHighlights() {
  const data = await fetchRows('highlights');
  if (!data.length) return;

  const grid = document.querySelector('.highlights__grid');
  if (!grid) return;

  grid.innerHTML = data.map(item => `
    <article class="highlight-card">
      <div class="highlight-card__icon">${displayText(item.icon)}</div>
      <h3>${displayText(item.title)}</h3>
      <p>${displayText(item.description)}</p>
    </article>`).join('');

  applyReveal('.highlight-card');
}

async function loadProjects() {
  const data = await fetchRows('projects');
  if (!data.length) return;

  const grid = document.querySelector('.projects__grid');
  if (!grid) return;

  grid.innerHTML = data.map(project => {
    const tags = safeArray(project.tags);
    const projectUrl = safeProjectUrl(project.url || project.link || project.details_url);
    const linkAttrs = projectUrl
      ? `href="${projectUrl}" target="_blank" rel="noopener"`
      : 'href="#contact"';

    return `
    <article class="project-card">
      <div class="project-card__header">
        <div class="project-card__icon">${displayText(project.icon)}</div>
        <div class="project-card__links">
          <a ${linkAttrs} aria-label="Ask for details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
      <h3 class="project-card__title">${displayText(project.title)}</h3>
      <p class="project-card__desc">${displayText(project.description)}</p>
      <div class="project-card__tags">${tags.map(tag => `<span class="tag tag--sm">${displayText(tag)}</span>`).join('')}</div>
    </article>`;
  }).join('');

  applyReveal('.project-card');
}

async function loadExperience() {
  const data = await fetchRows('experience');
  if (!data.length) return;

  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  timeline.innerHTML = data.map(exp => {
    const bullets = safeArray(exp.bullets);
    const tags = safeArray(exp.tags);
    const renderedTags = tags.length
      ? `<div class="skill-tags" style="margin-top:12px">${tags.map(tag => `<span class="tag tag--sm">${displayText(tag)}</span>`).join('')}</div>`
      : '';

    return `
    <div class="timeline__item">
      <div class="timeline__dot"></div>
      <div class="timeline__card">
        <div class="timeline__header">
          <div>
            <h3 class="timeline__role">${displayText(exp.role)}</h3>
            <p class="timeline__company">${displayText(exp.company)}</p>
          </div>
          <span class="timeline__period">${displayText(exp.period).replace(/&ndash;|&mdash;/g, '-')}</span>
        </div>
        <ul class="timeline__bullets">${bullets.map(bullet => `<li>${displayText(bullet)}</li>`).join('')}</ul>
        ${renderedTags}
      </div>
    </div>`;
  }).join('');

  applyReveal('.timeline__card');
}

async function loadClients() {
  const data = await fetchRows('clients');
  if (!data.length) return;

  const grid = document.querySelector('.testimonials__grid');
  if (!grid) return;

  grid.innerHTML = data.map(client => `
    <article class="testimonial-card">
      <div class="testimonial-card__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p class="testimonial-card__quote">${displayText(client.testimonial)}</p>
      <div class="testimonial-card__client">
        <div class="testimonial-card__avatar">${displayText(client.avatar_initials)}</div>
        <div class="testimonial-card__info">
          <p class="testimonial-card__name">${displayText(client.name)}</p>
          <p class="testimonial-card__country">${displayText(client.country)}</p>
        </div>
        <span class="testimonial-card__return">${displayText(client.return_pct)}</span>
      </div>
    </article>`).join('');

  applyReveal('.testimonial-card');
}

// Visitor tracker
async function trackVisitor() {
  const visitorCountEl = document.getElementById('visitorCount');
  if (!db) {
    if (visitorCountEl) visitorCountEl.textContent = '--';
    return;
  }

  try {
    if (!storageGet('visited')) {
      const ua = navigator.userAgent;
      const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop';
      const browser = /Edg/.test(ua) ? 'Edge'
        : /Chrome/.test(ua) ? 'Chrome'
        : /Firefox/.test(ua) ? 'Firefox'
        : /Safari/.test(ua) ? 'Safari'
        : 'Other';

      const { error } = await db.from('visitors').insert({
        ip: 'not collected',
        country: 'not collected',
        city: 'not collected',
        region: 'not collected',
        device,
        browser,
        screen_size: `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`,
        language: navigator.language || 'unknown',
        referrer: document.referrer || 'direct'
      });

      if (!error) storageSet('visited', '1');
    }

    const { count, error } = await db.from('visitors').select('*', { count: 'exact', head: true });
    if (!error && visitorCountEl && count !== null) {
      visitorCountEl.textContent = count.toLocaleString();
    }
  } catch (error) {
    console.warn('Could not track visitor:', error);
    if (visitorCountEl) visitorCountEl.textContent = '--';
  }
}

// Boot dynamic sections without blocking the page.
Promise.allSettled([
  loadStats(),
  loadHighlights(),
  loadProjects(),
  loadExperience(),
  loadClients(),
  trackVisitor()
]);

// Review form
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', async event => {
    event.preventDefault();

    const button = event.target.querySelector('button[type="submit"]');
    const success = document.getElementById('reviewSuccess');
    const name = document.getElementById('r-name')?.value.trim();
    const country = document.getElementById('r-country')?.value.trim();
    const returnPct = document.getElementById('r-return')?.value.trim();
    const message = document.getElementById('r-message')?.value.trim();

    if (!db) {
      showFeedback(success, 'Review service is unavailable right now. Please try again later.', true);
      hideFeedbackLater(success);
      return;
    }

    setButtonLoading(button, true, 'Submit Review', 'Submitting...');

    try {
      const { error } = await db.from('reviews').insert({ name, country, return_pct: returnPct, message });
      if (error) throw error;

      showFeedback(success, 'Thank you! Your review has been submitted for approval.');
      event.target.reset();
    } catch (error) {
      console.warn('Could not submit review:', error);
      showFeedback(success, 'Something went wrong. Please try again.', true);
    } finally {
      setButtonLoading(button, false, 'Submit Review', 'Submitting...');
      hideFeedbackLater(success, 5000);
    }
  });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const button = event.target.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');
    const name = event.target.name.value.trim();
    const email = event.target.email.value.trim();
    const message = event.target.message.value.trim();
    const tasks = [];

    if (db) {
      tasks.push(
        db.from('contacts').insert({ name, email, message }).then(({ error }) => {
          if (error) throw error;
        })
      );
    }

    if (window.emailjs?.send) {
      tasks.push(window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        message
      }));
    }

    if (!tasks.length) {
      showFeedback(success, 'Contact service is unavailable right now. Please email me directly.', true);
      hideFeedbackLater(success);
      return;
    }

    setButtonLoading(button, true, 'Send Inquiry', 'Sending...');

    try {
      const results = await Promise.allSettled(tasks);
      const sent = results.some(result => result.status === 'fulfilled');
      if (!sent) throw new Error('All contact methods failed');

      showFeedback(success, "Thank you! I'll get back to you within 24 hours.");
      event.target.reset();
    } catch (error) {
      console.warn('Could not send contact form:', error);
      showFeedback(success, 'Something went wrong. Please try again.', true);
    } finally {
      setButtonLoading(button, false, 'Send Inquiry', 'Sending...');
      hideFeedbackLater(success, 4000);
    }
  });
}
