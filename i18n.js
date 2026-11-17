/* ===== Mizer Limited - Çeviriler ===== */
const translations = {
  tr: {
    nav_home: 'Ana Sayfa', nav_projects: 'Projeler', nav_about: 'Hakkında', nav_contact: 'İletişim', nav_nova: 'Nova',
    hero_subtitle: 'Projeler, araçlar ve daha fazlası',
    browse_projects: 'Projelere göz at', featured_title: 'Öne çıkan projeler',
    projects_title: 'Projeler', projects_desc: 'Tüm projelerimizi buradan inceleyebilir ve indirebilirsiniz.',
    search_placeholder: 'Proje ara...', all_categories: 'Tümü', no_projects: 'Proje bulunamadı.',
    download: 'İndir', view_project: 'Detaylar', back_to_projects: '← Projelere Dön', category: 'Kategori',
    footer_text: '© 2026 Mizer Limited. Tüm hakları saklıdır.'
  },
  en: {
    nav_home: 'Home', nav_projects: 'Projects', nav_about: 'About', nav_contact: 'Contact', nav_nova: 'Nova',
    hero_subtitle: 'Projects, tools and more',
    browse_projects: 'Browse projects', featured_title: 'Featured projects',
    projects_title: 'Projects', projects_desc: 'Browse and download all of our projects here.',
    search_placeholder: 'Search projects...', all_categories: 'All', no_projects: 'No projects found.',
    download: 'Download', view_project: 'Details', back_to_projects: '← Back to projects', category: 'Category',
    footer_text: '© 2026 Mizer Limited. All rights reserved.'
  },
  de: {
    nav_home: 'Startseite', nav_projects: 'Projekte', nav_about: 'Über uns', nav_contact: 'Kontakt', nav_nova: 'Nova',
    hero_subtitle: 'Projekte, Tools und mehr',
    browse_projects: 'Projekte ansehen', featured_title: 'Ausgewählte Projekte',
    projects_title: 'Projekte', projects_desc: 'Hier können Sie alle unsere Projekte ansehen und herunterladen.',
    search_placeholder: 'Projekte suchen...', all_categories: 'Alle', no_projects: 'Keine Projekte gefunden.',
    download: 'Herunterladen', view_project: 'Details', back_to_projects: '← Zurück zu den Projekten', category: 'Kategorie',
    footer_text: '© 2026 Mizer Limited. Alle Rechte vorbehalten.'
  },
  fr: {
    nav_home: 'Accueil', nav_projects: 'Projets', nav_about: 'À propos', nav_contact: 'Contact', nav_nova: 'Nova',
    hero_subtitle: 'Projets, outils et plus encore',
    browse_projects: 'Voir les projets', featured_title: 'Projets à la une',
    projects_title: 'Projets', projects_desc: 'Consultez et téléchargez tous nos projets ici.',
    search_placeholder: 'Rechercher un projet...', all_categories: 'Tous', no_projects: 'Aucun projet trouvé.',
    download: 'Télécharger', view_project: 'Détails', back_to_projects: '← Retour aux projets', category: 'Catégorie',
    footer_text: '© 2026 Mizer Limited. Tous droits réservés.'
  },
  es: {
    nav_home: 'Inicio', nav_projects: 'Proyectos', nav_about: 'Acerca de', nav_contact: 'Contacto', nav_nova: 'Nova',
    hero_subtitle: 'Proyectos, herramientas y más',
    browse_projects: 'Ver proyectos', featured_title: 'Proyectos destacados',
    projects_title: 'Proyectos', projects_desc: 'Explora y descarga todos nuestros proyectos aquí.',
    search_placeholder: 'Buscar proyectos...', all_categories: 'Todos', no_projects: 'No se encontraron proyectos.',
    download: 'Descargar', view_project: 'Detalles', back_to_projects: '← Volver a proyectos', category: 'Categoría',
    footer_text: '© 2026 Mizer Limited. Todos los derechos reservados.'
  },
  pt: {
    nav_home: 'Início', nav_projects: 'Projetos', nav_about: 'Sobre', nav_contact: 'Contato', nav_nova: 'Nova',
    hero_subtitle: 'Projetos, ferramentas e mais',
    browse_projects: 'Ver projetos', featured_title: 'Projetos em destaque',
    projects_title: 'Projetos', projects_desc: 'Veja e baixe todos os nossos projetos aqui.',
    search_placeholder: 'Pesquisar projetos...', all_categories: 'Todos', no_projects: 'Nenhum projeto encontrado.',
    download: 'Baixar', view_project: 'Detalhes', back_to_projects: '← Voltar aos projetos', category: 'Categoria',
    footer_text: '© 2026 Mizer Limited. Todos os direitos reservados.'
  },
  ru: {
    nav_home: 'Главная', nav_projects: 'Проекты', nav_about: 'О нас', nav_contact: 'Контакты', nav_nova: 'Nova',
    hero_subtitle: 'Проекты, инструменты и многое другое',
    browse_projects: 'Смотреть проекты', featured_title: 'Избранные проекты',
    projects_title: 'Проекты', projects_desc: 'Здесь вы можете просмотреть и скачать все наши проекты.',
    search_placeholder: 'Поиск проектов...', all_categories: 'Все', no_projects: 'Проекты не найдены.',
    download: 'Скачать', view_project: 'Подробнее', back_to_projects: '← Назад к проектам', category: 'Категория',
    footer_text: '© 2026 Mizer Limited. Все права защищены.'
  }
};

function getLang() {
  let l = 'tr';
  try { l = localStorage.getItem('mizer_lang') || 'tr'; } catch (e) {}
  return translations[l] ? l : 'tr';
}

function t(key) {
  const l = getLang();
  return (translations[l] && translations[l][key]) || translations.tr[key] || key;
}

function applyTranslations() {
  document.documentElement.lang = getLang();
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
}

function setLanguage(lang) {
  if (!translations[lang]) lang = 'tr';
  try { localStorage.setItem('mizer_lang', lang); } catch (e) {}
  const select = document.getElementById('langSelect');
  if (select) select.value = lang;
  applyTranslations();
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}
