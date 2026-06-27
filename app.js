// ---- AGE GATE ----
function confirmAge() {
  document.getElementById('age-gate').style.display = 'none';
  document.getElementById('main').style.display = 'block';
  sessionStorage.setItem('age-confirmed', '1');
}
function denyAge() {
  window.location.href = 'https://www.google.com';
}
if (sessionStorage.getItem('age-confirmed')) {
  document.getElementById('age-gate').style.display = 'none';
  document.getElementById('main').style.display = 'block';
}

// ---- MODAL ----
function openModal(id) {
  const p = produtos[id];
  if (!p) return;

  // título e preço
  document.getElementById('modal-title').textContent = p.nome;
  document.getElementById('modal-price').textContent = p.preco;

  // whatsapp
  const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.nome} (${p.preco})`);
  document.getElementById('modal-whatsapp').href = `https://wa.me/?text=${msg}`;

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
    img.alt = p.nome + ' ' + (i+1);
    if (i === 0) img.classList.add('active');
    img.onclick = () => {
      mainImg.src = f;
      extrasEl.querySelectorAll('img').forEach(x => x.classList.remove('active'));
      img.classList.add('active');
    };
    extrasEl.appendChild(img);
  });

  // seções de conteúdo
  setSection('modal-desc', '📝 Sobre o produto', `<p>${p.descricao}</p>`);

  if (p.beneficios && p.beneficios.length) {
    const lista = p.beneficios.map(b => `<li>${b}</li>`).join('');
    setSection('modal-benefits', '✨ Benefícios', `<ul>${lista}</ul>`);
  } else {
    document.getElementById('modal-benefits').innerHTML = '';
  }

  if (p.comoUsar) {
    setSection('modal-how', '💡 Como usar', `<p>${p.comoUsar}</p>`);
  } else {
    document.getElementById('modal-how').innerHTML = '';
  }

  if (p.ficha && p.ficha.length) {
    const lista = p.ficha.map(f => `<li>${f}</li>`).join('');
    setSection('modal-specs', '📋 Ficha técnica', `<ul>${lista}</ul>`);
  } else {
    document.getElementById('modal-specs').innerHTML = '';
  }

  if (p.cuidados) {
    setSection('modal-care', '⚠️ Cuidados', `<p>${p.cuidados}</p>`);
  } else {
    document.getElementById('modal-care').innerHTML = '';
  }

  // abre modal
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

// fechar com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
