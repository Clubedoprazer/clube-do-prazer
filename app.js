const WHATSAPP = '5511973784809';

// ---- AGE GATE ----
function confirmAge() {
  localStorage.setItem('age-status', 'confirmed');
  document.getElementById('age-gate').style.display = 'none';
  document.getElementById('main').style.display = 'block';
}

function denyAge() {
  localStorage.setItem('age-status', 'denied');
  window.location.href = 'https://www.google.com';
}

// Ao carregar a página, verifica o que foi salvo
(function checkAge() {
  const status = localStorage.getItem('age-status');
  if (status === 'confirmed') {
    document.getElementById('age-gate').style.display = 'none';
    document.getElementById('main').style.display = 'block';
  } else if (status === 'denied') {
    // já disse que não tem 18 — redireciona direto, sem mostrar nada
    document.getElementById('age-gate').style.display = 'none';
    document.getElementById('main').style.display = 'none';
    window.location.href = 'https://www.google.com';
  }
  // se não tem nada salvo, mostra o age gate normalmente
})();

// ---- MODAL ----
function openModal(id) {
  const p = produtos[id];
  if (!p) return;

  document.getElementById('modal-title').textContent = p.nome;
  document.getElementById('modal-price').textContent = p.preco;

  // WhatsApp com número fixo
  const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.nome} (${p.preco})`);
  document.getElementById('modal-whatsapp').href = `https://wa.me/${WHATSAPP}?text=${msg}`;

  // foto principal
  const mainImg = document.getElementById('modal-img-main');
  mainImg.src = p.fotos[0];
  mainImg.alt = p.nome;

  // fotos extras
  const extrasEl = document.getElementById('modal-imgs-extra');
  extrasEl.innerHTML = '';
  p.fotos.forEach((f, i) => {
    const img = document.createElement('img');
    img.src = f;
    img.alt = p.nome + ' ' + (i + 1);
    if (i === 0) img.classList.add('active');
    img.onclick = () => {
      mainImg.src = f;
      extrasEl.querySelectorAll('img').forEach(x => x.classList.remove('active'));
      img.classList.add('active');
    };
    extrasEl.appendChild(img);
  });

  // seções
  setSection('modal-desc', '📝 Sobre o produto', `<p>${p.descricao}</p>`);

  if (p.beneficios && p.beneficios.length) {
    setSection('modal-benefits', '✨ Benefícios', `<ul>${p.beneficios.map(b => `<li>${b}</li>`).join('')}</ul>`);
  } else {
    document.getElementById('modal-benefits').innerHTML = '';
  }

  if (p.comoUsar) {
    setSection('modal-how', '💡 Como usar', `<p>${p.comoUsar}</p>`);
  } else {
    document.getElementById('modal-how').innerHTML = '';
  }

  if (p.ficha && p.ficha.length) {
    setSection('modal-specs', '📋 Ficha técnica', `<ul>${p.ficha.map(f => `<li>${f}</li>`).join('')}</ul>`);
  } else {
    document.getElementById('modal-specs').innerHTML = '';
  }

  if (p.cuidados) {
    setSection('modal-care', '⚠️ Cuidados', `<p>${p.cuidados}</p>`);
  } else {
    document.getElementById('modal-care').innerHTML = '';
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function setSection(id, titulo, conteudo) {
  document.getElementById(id).innerHTML = `<h3>${titulo}</h3>${conteudo}`;
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
