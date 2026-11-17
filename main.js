/* ===== Mizer Limited - Core ===== */

const THEMES = [
  { id: 'dark', name: 'Koyu' },
  { id: 'light', name: 'Açık' },
  { id: 'neon', name: 'Mor / Neon' },
  { id: 'corporate', name: 'Mavi / Kurumsal' },
  { id: 'nature', name: 'Yeşil / Doğa' },
  { id: 'aggressive', name: 'Kırmızı / Agresif' },
  { id: 'midnight', name: 'Gece Mavisi' },
  { id: 'energetic', name: 'Turuncu / Enerjik' },
  { id: 'minimal', name: 'Gri / Minimal' }
];

const LANGS = [
  { id: 'tr', name: 'Türkçe' },
  { id: 'en', name: 'English' },
  { id: 'de', name: 'Deutsch' },
  { id: 'fr', name: 'Français' },
  { id: 'es', name: 'Español' },
  { id: 'pt', name: 'Português' },
  { id: 'ru', name: 'Русский' }
];

// ===== Ek çeviriler =====
const EXTRA_I18N = {
  tr: { featured_title: 'Öne çıkan projeler', browse_projects: 'Projelere göz at' },
  en: { featured_title: 'Featured projects', browse_projects: 'Browse projects' },
  de: { featured_title: 'Ausgewählte Projekte', browse_projects: 'Projekte ansehen' },
  fr: { featured_title: 'Projets à la une', browse_projects: 'Voir les projets' },
  es: { featured_title: 'Proyectos destacados', browse_projects: 'Ver proyectos' },
  pt: { featured_title: 'Projetos em destaque', browse_projects: 'Ver projetos' },
  ru: { featured_title: 'Избранные проекты', browse_projects: 'Смотреть проекты' }
};
if (typeof translations !== 'undefined') {
  Object.keys(EXTRA_I18N).forEach(l => Object.assign(translations[l] = translations[l] || {}, EXTRA_I18N[l]));
}

// ===== İndirme yardımcıları =====
// Site içindeki dosyalar (örn. indirmeler/dosya.zip) yönlendirme olmadan doğrudan iner.
function hasDownload(url) { return !!url && url !== '#'; }

function downloadAttrs(url) {
  if (!hasDownload(url)) return 'href="#" onclick="alert(\'İndirme linki henüz eklenmemiş\');return false;"';
  let local = false;
  try { local = new URL(url, location.href).origin === location.origin; } catch (e) {}
  return local ? `href="${url}" download` : `href="${url}" target="_blank" rel="noopener"`;
}

function downloadButton(project, extraClass = '') {
  return `<a ${downloadAttrs(project.downloadUrl)} class="btn btn-primary btn-download ${extraClass}" data-i18n="download">${t('download')}</a>`;
}

// ===== Data Management =====
// Her ziyaretçi sitenin güncel default-data.json dosyasını okur.
// Böylece admin panelinden yapılan değişiklik herkese yansır.
window.__SITE_DATA__ = null;

function getData() {
  return window.__SITE_DATA__;
}

function saveData(data) {
  window.__SITE_DATA__ = data;
  // Admin panelinde publishData() tanımlıdır ve değişikliği GitHub'a yollar.
  if (typeof publishData === 'function') publishData(data);
}

async function loadDefaultData() {
  try {
    const res = await fetch('default-data.json?v=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      window.__DEFAULT_DATA__ = data;
      window.__SITE_DATA__ = data;
      return data;
    }
  } catch (e) {
    console.warn('Could not load default data file');
  }
  return null;
}

function getLocalized(obj, lang) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj['tr'] || obj['en'] || Object.values(obj)[0] || '';
}

// ===== Theme =====
function setTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('mizer_theme', themeId);
  const select = document.getElementById('themeSelect');
  if (select) select.value = themeId;
}

function initTheme() {
  const saved = localStorage.getItem('mizer_theme') || 'dark';
  setTheme(saved);
}

// ===== Language =====
function initLanguage() {
  const saved = localStorage.getItem('mizer_lang') || 'tr';
  const select = document.getElementById('langSelect');
  if (select) select.value = saved;
  if (typeof applyTranslations === 'function') applyTranslations();
}

// ===== Header / Navigation =====
function renderHeader(activePage = '') {
  const header = document.getElementById('site-header');
  if (!header) return;

  header.innerHTML = `
    <div class="container">
      <nav class="nav">
        <a href="index.html" class="logo">Mizer<span>Limited</span></a>
        <ul class="nav-links">
          <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}" data-i18n="nav_home">Ana Sayfa</a></li>
          <li><a href="projects.html" class="${activePage === 'projects' ? 'active' : ''}" data-i18n="nav_projects">Projeler</a></li>
          <li><a href="about.html" class="${activePage === 'about' ? 'active' : ''}" data-i18n="nav_about">Hakkında</a></li>
          <li><a href="contact.html" class="${activePage === 'contact' ? 'active' : ''}" data-i18n="nav_contact">İletişim</a></li>
          <li><a href="nova.html" class="${activePage === 'nova' ? 'active' : ''}" data-i18n="nav_nova">Nova</a></li>
        </ul>
        <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
        <div class="nav-actions">
          <select id="themeSelect" class="theme-select" title="Tema">
            ${THEMES.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
          </select>
          <select id="langSelect" class="lang-select" title="Dil">
            ${LANGS.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
          </select>
        </div>
      </nav>
    </div>
  `;

  document.getElementById('themeSelect').addEventListener('change', (e) => setTheme(e.target.value));
  document.getElementById('langSelect').addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });

  const toggle = header.querySelector('.nav-toggle');
  const links = header.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  initTheme();
  initLanguage();
}

// ===== Ads =====
function renderAds() {
  const data = getData();
  if (!data || !data.ads) return;

  const activeAds = data.ads.filter(a => a.active);

  ['top', 'bottom', 'left', 'right'].forEach(pos => {
    const container = document.getElementById(`ad-${pos}`);
    if (!container) return;

    const ad = activeAds.find(a => a.position === pos);
    if (ad && ad.image) {
      container.innerHTML = `<a href="${ad.link || '#'}" target="_blank" rel="noopener"><img src="${ad.image}" alt="Reklam"></a>`;
      container.style.display = 'flex';
    } else {
      container.innerHTML = '';
      container.style.display = 'none';
    }
  });
}

// ===== Footer =====
function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <p data-i18n="footer_text">© 2026 Mizer Limited. Tüm hakları saklıdır.</p>
    </div>
  `;
  if (typeof applyTranslations === 'function') applyTranslations();
}

// ===== Init common =====
async function initCommon(activePage = '') {
  await loadDefaultData();
  renderHeader(activePage);
  renderFooter();
  renderAds();
}

// ===== Projects Page Helpers =====
function getCategoryName(catId, lang) {
  const data = getData();
  if (!data) return '';
  const cat = data.categories.find(c => c.id === catId);
  return cat ? getLocalized(cat.name, lang) : '';
}

function projectCardHtml(p, lang) {
  return `
    <article class="project-card">
      <a class="project-card-media" href="project.html?id=${p.id}" tabindex="-1" aria-hidden="true">
        <img class="project-card-img" loading="lazy" src="${p.image || 'https://placehold.co/600x340/1a1a2e/7c5cfc?text=Proje'}" alt="">
      </a>
      <div class="project-card-body">
        <div class="project-card-cat">${getCategoryName(p.categoryId, lang)}</div>
        <h3 class="project-card-title">${getLocalized(p.title, lang)}</h3>
        <p class="project-card-desc">${getLocalized(p.description, lang)}</p>
        <div class="project-card-actions">
          ${hasDownload(p.downloadUrl) ? downloadButton(p, 'btn-sm') : ''}
          <a href="project.html?id=${p.id}" class="btn btn-secondary btn-sm" data-i18n="view_project">${t('view_project')}</a>
        </div>
      </div>
    </article>`;
}

function renderFeatured() {
  const box = document.getElementById('featured-list');
  if (!box) return;
  const data = getData();
  if (!data || !data.projects || !data.projects.length) { box.innerHTML = ''; return; }
  const lang = getLang();
  let list = data.projects.filter(p => p.featured);
  if (!list.length) list = data.projects;
  list = list.slice(0, 3);
  box.innerHTML = `
    <h2 class="section-title" data-i18n="featured_title">${t('featured_title')}</h2>
    <div class="projects-grid">${list.map(p => projectCardHtml(p, lang)).join('')}</div>`;
}

function renderProjects(filterCatId = null) {
  const container = document.getElementById('projects-list');
  if (!container) return;

  const data = getData();
  const lang = getLang();
  if (!data || !data.projects || data.projects.length === 0) {
    container.innerHTML = `<div class="empty-state"><p data-i18n="no_projects">${t('no_projects')}</p></div>`;
    return;
  }

  let projects = data.projects;
  if (filterCatId) {
    projects = projects.filter(p => p.categoryId === filterCatId);
  }

  if (projects.length === 0) {
    container.innerHTML = `<div class="empty-state"><p data-i18n="no_projects">${t('no_projects')}</p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="projects-grid">
      ${projects.map(p => projectCardHtml(p, lang)).join('')}
    </div>
  `;
}

function renderCategories() {
  const container = document.getElementById('categories');
  if (!container) return;

  const data = getData();
  const lang = getLang();
  if (!data) return;

  let html = `<button class="cat-btn active" data-cat="">${t('all_categories')}</button>`;
  (data.categories || []).forEach(cat => {
    html += `<button class="cat-btn" data-cat="${cat.id}">${getLocalized(cat.name, lang)}</button>`;
  });
  container.innerHTML = html;

  container.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const catId = btn.getAttribute('data-cat') || null;
      renderProjects(catId || null);
    });
  });
}

// Listen for language change to re-render dynamic content
window.addEventListener('languageChanged', () => {
  if (document.getElementById('projects-list')) {
    renderCategories();
    renderProjects();
  }
  if (document.getElementById('featured-list')) renderFeatured();
  if (document.getElementById('project-detail')) {
    // project detail page will handle its own refresh if needed
  }
});