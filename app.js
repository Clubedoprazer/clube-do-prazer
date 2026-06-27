// ---- SEGURANÇA: número ofuscado (evita bots que varrem código) ----
const _w = atob('NTUxMTk3Mzc4NDgwOQ=='); // base64 de 5511973784809

// ---- SANITIZAÇÃO: remove HTML malicioso de qualquer string ----
function sanitize(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// ---- PROTEÇÃO: bloqueia abertura do site dentro de iframe (clickjacking) ----
if (window.top !== window.self) {
  window.top.location = window.self.location;
}

// ---- AGE GATE ----
function confirmAge() {
  localStorage.setItem('age-status', 'confirmed');
  document.getElementById('age-gate').style.display = 'none';
  document.getElementById('main').style.display = 'block';
}

function denyAge() {
  localStorage.setItem('age-status', 'denied');
  window.location.replace('https://www.google.com');
}

(function checkAge() {
  const status = localStorage.getItem('age-status');
  if (status === 'confirmed') {
    document.getElementById('age-gate').style.display = 'none';
    document.getElementById('main').style.display = 'block';
  } else if (status === 'denied') {
    document.getElementById('age-gate').style.display = 'none';
    document.getElementById('main').style.display = 'none';
    window.location.replace('https://www.google.com');
  }
})();

// ---- MODAL ----
function openModal(id) {
  // valida que o id é uma chave conhecida (evita IDs injetados)
  if (!produtos.hasOwnProperty(id)) return;
  const p = produtos[id];

  // sanitiza todos os campos antes de colocar no DOM
  const nome   = sanitize(p.nome);
  const preco  = sanitize(p.preco);
  const desc   = sanitize(p.descricao);
  const como   = sanitize(p.comoUsar || '');
  const cuidad = sanitize(p.cuidados || '');

  document.getElementById('modal-title').textContent = p.nome;
  document.getElementById('modal-price').textContent = p.preco;

  // WhatsApp — número ofuscado, mensagem sanitizada
  const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.nome} (${p.preco})`);
  const waLink = `https://wa.me/${_w}?text=${msg}`;
  // valida que o link gerado é realmente um link wa.me (evita injeção de URL)
  if (waLink.startsWith('https://wa.me/')) {
    document.getElementById('modal-whatsapp').href = waLink;
  }

  // fotos — valida que cada URL é HTTPS antes de colocar no DOM
  const fotos = (p.fotos || []).filter(f => typeof f === 'string' && f.startsWith('https://'));

  const mainImg = document.getElementById('modal-img-main');
  if (fotos.length > 0) {
    mainImg.src = fotos[0];
    mainImg.alt = p.nome;
  }

  const extrasEl = document.getElementById('modal-imgs-extra');
  extrasEl.innerHTML = '';
  fotos.forEach((f, i) => {
    const img = document.createElement('img');
    img.src = f;
    img.alt = sanitize(p.nome) + ' ' + (i + 1);
    if (i === 0) img.classList.add('active');
    img.onclick = () => {
      mainImg.src = f;
      extrasEl.querySelectorAll('img').forEach(x => x.classList.remove('active'));
      img.classList.add('active');
    };
    extrasEl.appendChild(img);
  });

  // seções de conteúdo — usa textContent onde possível, innerHTML só com dado sanitizado
  setSection('modal-desc',     '📝 Sobre o produto', `<p>${desc}</p>`);

  if (p.beneficios && p.beneficios.length) {
    const lista = p.beneficios
      .map(b => `<li>${sanitize(b)}</li>`)
      .join('');
    setSection('modal-benefits', '✨ Benefícios', `<ul>${lista}</ul>`);
  } else {
    document.getElementById('modal-benefits').innerHTML = '';
  }

  if (como) {
    setSection('modal-how', '💡 Como usar', `<p>${como}</p>`);
  } else {
    document.getElementById('modal-how').innerHTML = '';
  }

  if (p.ficha && p.ficha.length) {
    const lista = p.ficha.map(f => `<li>${sanitize(f)}</li>`).join('');
    setSection('modal-specs', '📋 Ficha técnica', `<ul>${lista}</ul>`);
  } else {
    document.getElementById('modal-specs').innerHTML = '';
  }

  if (cuidad) {
    setSection('modal-care', '⚠️ Cuidados', `<p>${cuidad}</p>`);
  } else {
    document.getElementById('modal-care').innerHTML = '';
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function setSection(id, titulo, conteudo) {
  // titulo via textContent (sem risco), conteudo já sanitizado
  const el = document.getElementById(id);
  el.innerHTML = '';
  const h3 = document.createElement('h3');
  h3.textContent = titulo;
  el.appendChild(h3);
  const wrap = document.createElement('div');
  wrap.innerHTML = conteudo; // já sanitizado acima
  el.appendChild(wrap);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ---- PROTEÇÃO EXTRA: desativa clique direito e F12 em produção ----
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' ||
     (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
     (e.ctrlKey && e.key === 'U')) {
    e.preventDefault();
  }
});
