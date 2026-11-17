/* ===== Nova - Simple Rule-Based Assistant ===== */

function getNovaReply(userText) {
  const data = getData();
  const lang = getLang();
  const text = userText.toLowerCase().trim();

  if (!data || !data.novaResponses) {
    return lang === 'tr' ? 'Şu an yanıt veremiyorum.' : 'I cannot reply right now.';
  }

  const { greetings, replies } = data.novaResponses;

  // Greeting check
  if (greetings.some(g => text.includes(g) || text === g)) {
    return replies.greeting[lang] || replies.greeting.tr;
  }

  // Projects
  if (text.includes('proje') || text.includes('project') || text.includes('projekt') || text.includes('juego') || text.includes('jogo')) {
    return replies.projects[lang] || replies.projects.tr;
  }

  // Download
  if (text.includes('indir') || text.includes('download') || text.includes('herunterladen') || text.includes('télécharger') || text.includes('descargar') || text.includes('baixar') || text.includes('скачать')) {
    return replies.download[lang] || replies.download.tr;
  }

  // About
  if (text.includes('hakkında') || text.includes('about') || text.includes('über') || text.includes('propos') || text.includes('acerca') || text.includes('sobre') || text.includes('о нас') || text.includes('kimsiniz') || text.includes('nedir')) {
    return replies.about[lang] || replies.about.tr;
  }

  // Contact
  if (text.includes('iletişim') || text.includes('contact') || text.includes('kontakt') || text.includes('mail') || text.includes('email') || text.includes('e-posta')) {
    return replies.contact[lang] || replies.contact.tr;
  }

  // Who is Nova
  if (text.includes('nova') || text.includes('kimsin') || text.includes('who are you') || text.includes('asistan')) {
    return replies.nova[lang] || replies.nova.tr;
  }

  // Fallback
  return replies.fallback[lang] || replies.fallback.tr;
}

function initNova() {
  const messagesEl = document.getElementById('nova-messages');
  const inputEl = document.getElementById('nova-input');
  const sendBtn = document.getElementById('nova-send');

  if (!messagesEl || !inputEl || !sendBtn) return;

  // Initial greeting
  const lang = getLang();
  const data = getData();
  const greeting = (data && data.novaResponses && data.novaResponses.replies.greeting[lang]) 
    || 'Merhaba! Ben Nova. Size nasıl yardımcı olabilirim?';

  addMessage(greeting, 'bot');

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputEl.value = '';

    // Small delay to feel more natural
    setTimeout(() => {
      const reply = getNovaReply(text);
      addMessage(reply, 'bot');
    }, 400);
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}