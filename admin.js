/* ===== Admin Panel Logic ===== */

function isLoggedIn() {
  return sessionStorage.getItem('mizer_admin') === 'true';
}

function login(email, password) {
  const data = getData();
  if (!data || !data.admin) return false;
  if (email === data.admin.email && password === data.admin.password) {
    sessionStorage.setItem('mizer_admin', 'true');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem('mizer_admin');
  window.location.href = 'admin.html';
}

function showSection(id) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
  const section = document.getElementById('section-' + id);
  const link = document.querySelector(`[data-section="${id}"]`);
  if (section) section.classList.add('active');
  if (link) link.classList.add('active');
}

function showAlert(msg, type = 'success') {
  const el = document.getElementById('admin-alert');
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3500);
}

// ===== Dashboard =====
function renderDashboard() {
  const data = getData();
  if (!data) return;
  document.getElementById('stat-projects').textContent = (data.projects || []).length;
  document.getElementById('stat-categories').textContent = (data.categories || []).length;
  document.getElementById('stat-ads').textContent = (data.ads || []).filter(a => a.active).length;
}

// ===== Projects =====
function renderAdminProjects() {
  const data = getData();
  const tbody = document.getElementById('projects-table-body');
  if (!tbody || !data) return;

  const lang = 'tr';
  tbody.innerHTML = (data.projects || []).map(p => `
    <tr>
      <td>${getLocalized(p.title, lang)}</td>
      <td>${getCategoryName(p.categoryId, lang)}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editProject('${p.id}')">Düzenle</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProject('${p.id}')">Sil</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="3">Henüz proje yok</td></tr>';
}

function openProjectForm(project = null) {
  const data = getData();
  const form = document.getElementById('project-form');
  form.style.display = 'block';
  document.getElementById('project-form-title').textContent = project ? 'Projeyi Düzenle' : 'Yeni Proje';

  // Fill categories
  const catSelect = document.getElementById('proj-category');
  catSelect.innerHTML = (data.categories || []).map(c => 
    `<option value="${c.id}">${getLocalized(c.name, 'tr')}</option>`
  ).join('');

  if (project) {
    document.getElementById('proj-id').value = project.id;
    document.getElementById('proj-title-tr').value = project.title?.tr || '';
    document.getElementById('proj-title-en').value = project.title?.en || '';
    document.getElementById('proj-desc-tr').value = project.description?.tr || '';
    document.getElementById('proj-desc-en').value = project.description?.en || '';
    document.getElementById('proj-category').value = project.categoryId || '';
    document.getElementById('proj-image').value = project.image || '';
    document.getElementById('proj-video').value = project.videoUrl || '';
    document.getElementById('proj-download').value = project.downloadUrl || '';
  } else {
    form.reset();
    document.getElementById('proj-id').value = '';
  }
}

function saveProject(e) {
  e.preventDefault();
  const data = getData();
  const id = document.getElementById('proj-id').value || 'proj' + Date.now();

  const project = {
    id,
    title: {
      tr: document.getElementById('proj-title-tr').value,
      en: document.getElementById('proj-title-en').value || document.getElementById('proj-title-tr').value,
      de: document.getElementById('proj-title-en').value || document.getElementById('proj-title-tr').value,
      fr: document.getElementById('proj-title-en').value || document.getElementById('proj-title-tr').value,
      es: document.getElementById('proj-title-en').value || document.getElementById('proj-title-tr').value,
      pt: document.getElementById('proj-title-en').value || document.getElementById('proj-title-tr').value,
      ru: document.getElementById('proj-title-en').value || document.getElementById('proj-title-tr').value
    },
    description: {
      tr: document.getElementById('proj-desc-tr').value,
      en: document.getElementById('proj-desc-en').value || document.getElementById('proj-desc-tr').value,
      de: document.getElementById('proj-desc-en').value || document.getElementById('proj-desc-tr').value,
      fr: document.getElementById('proj-desc-en').value || document.getElementById('proj-desc-tr').value,
      es: document.getElementById('proj-desc-en').value || document.getElementById('proj-desc-tr').value,
      pt: document.getElementById('proj-desc-en').value || document.getElementById('proj-desc-tr').value,
      ru: document.getElementById('proj-desc-en').value || document.getElementById('proj-desc-tr').value
    },
    categoryId: document.getElementById('proj-category').value,
    image: document.getElementById('proj-image').value,
    videoUrl: document.getElementById('proj-video').value,
    downloadUrl: document.getElementById('proj-download').value,
    featured: false
  };

  const idx = data.projects.findIndex(p => p.id === id);
  if (idx >= 0) {
    data.projects[idx] = project;
  } else {
    data.projects.push(project);
  }
  saveData(data);
  document.getElementById('project-form').style.display = 'none';
  renderAdminProjects();
  showAlert('Proje kaydedildi!');
}

function editProject(id) {
  const data = getData();
  const project = data.projects.find(p => p.id === id);
  if (project) openProjectForm(project);
}

function deleteProject(id) {
  if (!confirm('Bu projeyi silmek istediğine emin misin?')) return;
  const data = getData();
  data.projects = data.projects.filter(p => p.id !== id);
  saveData(data);
  renderAdminProjects();
  showAlert('Proje silindi.');
}

// ===== Categories =====
function renderAdminCategories() {
  const data = getData();
  const tbody = document.getElementById('categories-table-body');
  if (!tbody || !data) return;

  tbody.innerHTML = (data.categories || []).map(c => `
    <tr>
      <td>${getLocalized(c.name, 'tr')}</td>
      <td>${getLocalized(c.name, 'en')}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editCategory('${c.id}')">Düzenle</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory('${c.id}')">Sil</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="3">Henüz kategori yok</td></tr>';
}

function openCategoryForm(cat = null) {
  const form = document.getElementById('category-form');
  form.style.display = 'block';
  document.getElementById('cat-form-title').textContent = cat ? 'Kategoriyi Düzenle' : 'Yeni Kategori';

  if (cat) {
    document.getElementById('cat-id').value = cat.id;
    document.getElementById('cat-name-tr').value = cat.name?.tr || '';
    document.getElementById('cat-name-en').value = cat.name?.en || '';
  } else {
    form.reset();
    document.getElementById('cat-id').value = '';
  }
}

function saveCategory(e) {
  e.preventDefault();
  const data = getData();
  const id = document.getElementById('cat-id').value || 'cat' + Date.now();
  const nameTr = document.getElementById('cat-name-tr').value;
  const nameEn = document.getElementById('cat-name-en').value || nameTr;

  const category = {
    id,
    name: {
      tr: nameTr,
      en: nameEn,
      de: nameEn,
      fr: nameEn,
      es: nameEn,
      pt: nameEn,
      ru: nameEn
    }
  };

  const idx = data.categories.findIndex(c => c.id === id);
  if (idx >= 0) {
    data.categories[idx] = category;
  } else {
    data.categories.push(category);
  }
  saveData(data);
  document.getElementById('category-form').style.display = 'none';
  renderAdminCategories();
  showAlert('Kategori kaydedildi!');
}

function editCategory(id) {
  const data = getData();
  const cat = data.categories.find(c => c.id === id);
  if (cat) openCategoryForm(cat);
}

function deleteCategory(id) {
  if (!confirm('Bu kategoriyi silmek istediğine emin misin?')) return;
  const data = getData();
  data.categories = data.categories.filter(c => c.id !== id);
  saveData(data);
  renderAdminCategories();
  showAlert('Kategori silindi.');
}

// ===== Ads =====
function renderAdminAds() {
  const data = getData();
  const tbody = document.getElementById('ads-table-body');
  if (!tbody || !data) return;

  const posNames = { top: 'Üst', bottom: 'Alt', left: 'Sol', right: 'Sağ' };

  tbody.innerHTML = (data.ads || []).map(a => `
    <tr>
      <td>${posNames[a.position] || a.position}</td>
      <td>${a.active ? '✅ Aktif' : '❌ Pasif'}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editAd('${a.id}')">Düzenle</button>
        <button class="btn btn-sm btn-danger" onclick="toggleAd('${a.id}')">${a.active ? 'Pasif Yap' : 'Aktif Yap'}</button>
      </td>
    </tr>
  `).join('');
}

function openAdForm(ad = null) {
  const form = document.getElementById('ad-form');
  form.style.display = 'block';

  if (ad) {
    document.getElementById('ad-id').value = ad.id;
    document.getElementById('ad-image').value = ad.image || '';
    document.getElementById('ad-link').value = ad.link || '';
    document.getElementById('ad-position').value = ad.position || 'top';
    document.getElementById('ad-active').checked = ad.active;
  } else {
    form.reset();
    document.getElementById('ad-id').value = '';
  }
}

function saveAd(e) {
  e.preventDefault();
  const data = getData();
  const id = document.getElementById('ad-id').value || 'ad' + Date.now();

  // Max 4 ads
  if (!document.getElementById('ad-id').value && data.ads.length >= 4) {
    showAlert('En fazla 4 reklam ekleyebilirsin!', 'error');
    return;
  }

  const ad = {
    id,
    image: document.getElementById('ad-image').value,
    link: document.getElementById('ad-link').value,
    position: document.getElementById('ad-position').value,
    active: document.getElementById('ad-active').checked
  };

  const idx = data.ads.findIndex(a => a.id === id);
  if (idx >= 0) {
    data.ads[idx] = ad;
  } else {
    data.ads.push(ad);
  }
  saveData(data);
  document.getElementById('ad-form').style.display = 'none';
  renderAdminAds();
  showAlert('Reklam kaydedildi!');
}

function editAd(id) {
  const data = getData();
  const ad = data.ads.find(a => a.id === id);
  if (ad) openAdForm(ad);
}

function toggleAd(id) {
  const data = getData();
  const ad = data.ads.find(a => a.id === id);
  if (ad) {
    ad.active = !ad.active;
    saveData(data);
    renderAdminAds();
    showAlert(ad.active ? 'Reklam aktif edildi.' : 'Reklam pasif edildi.');
  }
}

// ===== Settings =====
function loadSettings() {
  const data = getData();
  if (!data) return;
  document.getElementById('setting-sitename').value = data.settings?.siteName || 'MizerLimited';
  document.getElementById('setting-email').value = data.settings?.contactEmail || '';
  document.getElementById('setting-theme').value = data.settings?.defaultTheme || 'dark';
  document.getElementById('setting-lang').value = data.settings?.defaultLang || 'tr';
}

function saveSettings(e) {
  e.preventDefault();
  const data = getData();
  data.settings.siteName = document.getElementById('setting-sitename').value;
  data.settings.contactEmail = document.getElementById('setting-email').value;
  data.settings.defaultTheme = document.getElementById('setting-theme').value;
  data.settings.defaultLang = document.getElementById('setting-lang').value;
  saveData(data);
  showAlert('Ayarlar kaydedildi!');
}

function changePassword(e) {
  e.preventDefault();
  const data = getData();
  const current = document.getElementById('pass-current').value;
  const newPass = document.getElementById('pass-new').value;
  const confirm = document.getElementById('pass-confirm').value;

  if (current !== data.admin.password) {
    showAlert('Mevcut şifre yanlış!', 'error');
    return;
  }
  if (newPass.length < 6) {
    showAlert('Yeni şifre en az 6 karakter olmalı!', 'error');
    return;
  }
  if (newPass !== confirm) {
    showAlert('Yeni şifreler eşleşmiyor!', 'error');
    return;
  }

  data.admin.password = newPass;
  saveData(data);
  document.getElementById('password-form').reset();
  showAlert('Şifre başarıyla değiştirildi!');
}

// ===== Export / Import =====
function exportData() {
  const data = getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mizer-limited-data.json';
  a.click();
  URL.revokeObjectURL(url);
  showAlert('Veriler indirildi!');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      saveData(data);
      showAlert('Veriler yüklendi! Sayfa yenileniyor...');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      showAlert('Geçersiz dosya!', 'error');
    }
  };
  reader.readAsText(file);
}

// ===== Init Admin =====
async function initAdmin() {
  await loadDefaultData();
  if (!getData()) {
    const def = window.__DEFAULT_DATA__;
    if (def) saveData(def);
  }

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      if (login(email, pass)) {
        location.reload();
      } else {
        showAlert('E-posta veya şifre hatalı!', 'error');
      }
    });
  }

  if (!isLoggedIn()) return;

  // Show admin panel
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'grid';

  // Nav
  document.querySelectorAll('.admin-nav a[data-section]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(a.getAttribute('data-section'));
    });
  });

  // Forms
  document.getElementById('project-form')?.addEventListener('submit', saveProject);
  document.getElementById('category-form')?.addEventListener('submit', saveCategory);
  document.getElementById('ad-form')?.addEventListener('submit', saveAd);
  document.getElementById('settings-form')?.addEventListener('submit', saveSettings);
  document.getElementById('password-form')?.addEventListener('submit', changePassword);

  // Initial render
  showSection('dashboard');
  renderDashboard();
  renderAdminProjects();
  renderAdminCategories();
  renderAdminAds();
  loadSettings();
}