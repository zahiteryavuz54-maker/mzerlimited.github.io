// --- 1. ÇEVİRİ VERİTABANI (7 DİL) ---
const translations = {
    tr: { hero_title: "Mizer Limited Projeleri", hero_subtitle: "Güvenli, hızlı ve ücretsiz çözümler.", admin_panel: "Yönetim", contact_title: "İletişim", comments_title: "Yorumlar", download: "İndir" },
    en: { hero_title: "Mizer Limited Projects", hero_subtitle: "Secure, fast, and free solutions.", admin_panel: "Admin", contact_title: "Contact", comments_title: "Comments", download: "Download" },
    de: { hero_title: "Mizer Limited Projekte", hero_subtitle: "Sichere, schnelle und kostenlose Lösungen.", admin_panel: "Verwaltung", contact_title: "Kontakt", comments_title: "Kommentare", download: "Herunterladen" },
    fr: { hero_title: "Projets Mizer Limited", hero_subtitle: "Solutions sécurisées, rapides et gratuites.", admin_panel: "Administration", contact_title: "Contact", comments_title: "Commentaires", download: "Télécharger" },
    es: { hero_title: "Proyectos Mizer Limited", hero_subtitle: "Soluciones seguras, rápidas y gratuitas.", admin_panel: "Administración", contact_title: "Contacto", comments_title: "Comentarios", download: "Descargar" },
    pt: { hero_title: "Projetos Mizer Limited", hero_subtitle: "Soluções seguras, rápidas e gratuitas.", admin_panel: "Administração", contact_title: "Contato", comments_title: "Comentários", download: "Baixar" },
    ru: { hero_title: "Проекты Mizer Limited", hero_subtitle: "Безопасные, быстрые и бесплатные решения.", admin_panel: "Админ", contact_title: "Контакт", comments_title: "Комментарии", download: "Скачать" }
};

// --- 2. NOVA YAPAY ZEKA KURALLARI (Basit ve Bedava) ---
const novaRules = [
    { keywords: ["merhaba", "selam", "hello", "hi"], response: "Merhaba! Ben Nova. Sana nasıl yardımcı olabilirim?" },
    { keywords: ["proje", "project", "projeler"], response: "Projelerimiz ana sayfada listelenmektedir. İndirme linkleri kartların altındadır." },
    { keywords: ["indir", "download", "link"], response: "Herhangi bir üyelik gerektirmez. Proje kartlarındaki 'İndir' butonuna tıklaman yeterlidir." },
    { keywords: ["kim", "who", "mizer"], response: "Mizer Limited, tamamen ücretsiz ve açık kaynaklı projeler üreten bir girişimdir." },
    { keywords: ["tema", "theme", "renk"], response: "Sağ üst köşedeki menüden 9 farklı tema arasından seçim yapabilirsin." }
];

// --- 3. BAŞLANGIÇ AYARLARI ---
document.addEventListener('DOMContentLoaded', () => {
    // Tema Yükleme
    const savedTheme = localStorage.getItem('mizer-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-select').value = savedTheme;

    // Dil Yükleme
    const savedLang = localStorage.getItem('mizer-lang') || 'tr';
    applyLanguage(savedLang);
    document.getElementById('lang-select').value = savedLang;

    // Projeleri Yükle (Yönetim panelinden burası otomatik doldurulacak)
    loadProjects();
});

// --- 4. FONKSİYONLAR ---
document.getElementById('theme-select').addEventListener('change', (e) => {
    document.documentElement.setAttribute('data-theme', e.target.value);
    localStorage.setItem('mizer-theme', e.target.value);
});

document.getElementById('lang-select').addEventListener('change', (e) => {
    applyLanguage(e.target.value);
    localStorage.setItem('mizer-lang', e.target.value);
});

function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

function loadProjects() {
    // Burası normalde Decap CMS'den gelen verilerle dolacak. Şimdilik örnek:
    const projects = [
        { title: "Örnek Proje 1", desc: "Bu harika bir projedir. Hızlı ve güvenilirdir.", link: "#" },
        { title: "Örnek Proje 2", desc: "İkinci örnek proje açıklaması buradadır.", link: "#" }
    ];
    
    const container = document.getElementById('projects-container');
    container.innerHTML = projects.map(p => `
        <div class="project-card">
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <a href="${p.link}" class="download-btn" download>⬇ İndir</a>
        </div>
    `).join('');
}

// --- 5. NOVA CHAT MANTIĞI ---
const novaChat = document.getElementById('nova-chat');
document.getElementById('nova-toggle').addEventListener('click', () => novaChat.classList.remove('hidden'));
document.getElementById('nova-close').addEventListener('click', () => novaChat.classList.add('hidden'));

document.getElementById('nova-send').addEventListener('click', handleNova);
document.getElementById('nova-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleNova();
});

function handleNova() {
    const input = document.getElementById('nova-input');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;

    addNovaMessage(input.value, 'user');
    input.value = '';

    // Basit AI mantığı: Anahtar kelime eşleşmesi
    setTimeout(() => {
        let response = "Bunu tam anlayamadım. 'proje', 'indir' veya 'tema' gibi kelimeler sorabilirsin.";
        for (let rule of novaRules) {
            if (rule.keywords.some(k => msg.includes(k))) {
                response = rule.response;
                break;
            }
        }
        addNovaMessage(response, 'bot');
    }, 500);
}

function addNovaMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `nova-msg ${sender}`;
    div.textContent = text;
    document.getElementById('nova-messages').appendChild(div);
    document.getElementById('nova-messages').scrollTop = document.getElementById('nova-messages').scrollHeight;
}