const _w = atob('NTUxMTk3Mzc4NDgwOQ==');

function sanitize(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

if (window.top !== window.self) {
  window.top.location = window.self.location;
}

// ---- AGE GATE ----
function confirmAge() {
  try { localStorage.setItem('age-status', 'confirmed'); } catch(e) {}
  document.getElementById('age-gate').style.display = 'none';
  document.getElementById('main').style.display = 'block';
}

function denyAge() {
  try { localStorage.setItem('age-status', 'denied'); } catch(e) {}
  window.location.replace('https://www.google.com');
}

// Verifica ao carregar — com try/catch para não travar se localStorage bloqueado
(function checkAge() {
  try {
    const status = localStorage.getItem('age-status');
    if (status === 'confirmed') {
      document.getElementById('age-gate').style.display = 'none';
      document.getElementById('main').style.display = 'block';
      return;
    }
    if (status === 'denied') {
      window.location.replace('https://www.google.com');
      return;
    }
  } catch(e) {}
  // Se localStorage não disponível ou sem status: mostra age gate normalmente
  document.getElementById('age-gate').style.display = 'flex';
})();

// ---- MODAL ----
function openModal(id) {
  if (!produtos.hasOwnProperty(id)) return;
  const p = produtos[id];

  document.getElementById('modal-title').textContent = p.nome;
  document.getElementById('modal-price').textContent = p.preco;

  const msg = encodeURIComponent('Olá! Tenho interesse no produto: ' + p.nome + ' (' + p.preco + ')');
  const waLink = 'https://wa.me/' + _w + '?text=' + msg;
  if (waLink.startsWith('https://wa.me/')) {
    document.getElementById('modal-whatsapp').href = waLink;
  }

  const fotos = (p.fotos || []).filter(function(f) {
    return typeof f === 'string' && f.startsWith('https://');
  });

  const mainImg = document.getElementById('modal-img-main');
  if (fotos.length > 0) {
    mainImg.src = fotos[0];
    mainImg.alt = p.nome;
  }

  const extrasEl = document.getElementById('modal-imgs-extra');
  extrasEl.innerHTML = '';
  fotos.forEach(function(f, i) {
    const img = document.createElement('img');
    img.src = f;
    img.alt = p.nome + ' ' + (i + 1);
    if (i === 0) img.classList.add('active');
    img.onclick = function() {
      mainImg.src = f;
      extrasEl.querySelectorAll('img').forEach(function(x) { x.classList.remove('active'); });
      img.classList.add('active');
    };
    extrasEl.appendChild(img);
  });

  setSection('modal-desc', '📝 Sobre o produto', '<p>' + sanitize(p.descricao) + '</p>');

  if (p.beneficios && p.beneficios.length) {
    var lista = p.beneficios.map(function(b) { return '<li>' + sanitize(b) + '</li>'; }).join('');
    setSection('modal-benefits', '✨ Benefícios', '<ul>' + lista + '</ul>');
  } else {
    document.getElementById('modal-benefits').innerHTML = '';
  }

  if (p.comoUsar) {
    setSection('modal-how', '💡 Como usar', '<p>' + sanitize(p.comoUsar) + '</p>');
  } else {
    document.getElementById('modal-how').innerHTML = '';
  }

  if (p.ficha && p.ficha.length) {
    var fl = p.ficha.map(function(f) { return '<li>' + sanitize(f) + '</li>'; }).join('');
    setSection('modal-specs', '📋 Ficha técnica', '<ul>' + fl + '</ul>');
  } else {
    document.getElementById('modal-specs').innerHTML = '';
  }

  if (p.cuidados) {
    setSection('modal-care', '⚠️ Cuidados', '<p>' + sanitize(p.cuidados) + '</p>');
  } else {
    document.getElementById('modal-care').innerHTML = '';
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function setSection(id, titulo, conteudo) {
  const el = document.getElementById(id);
  el.innerHTML = '';
  const h3 = document.createElement('h3');
  h3.textContent = titulo;
  el.appendChild(h3);
  const wrap = document.createElement('div');
  wrap.innerHTML = conteudo;
  el.appendChild(wrap);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
document.addEventListener('keydown', function(e) {
  if (e.key === 'F12' ||
     (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
     (e.ctrlKey && e.key === 'U')) {
    e.preventDefault();
  }
});
