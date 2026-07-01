var WA = atob('NTUxMTk3Mzc4NDgwOQ==');

function san(s) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(String(s||'')));
  return d.innerHTML;
}

function showMain() {
  document.getElementById('age-gate').style.display = 'none';
  document.getElementById('main').style.display = 'block';
}

function bindCards() {
  document.querySelectorAll('[data-id]').forEach(function(card) {
    card.style.cursor = 'pointer';
    card.onclick = function() {
      openModal(this.getAttribute('data-id'));
    };
  });
}

// Checa age gate
document.addEventListener('DOMContentLoaded', function() {
  var aged = false;
  try { aged = localStorage.getItem('cdp_age') === '1'; } catch(e) {}

  if (aged) {
    showMain();
    bindCards();
  }

  // Botões
  var btnY = document.getElementById('btn-yes');
  var btnN = document.getElementById('btn-no');

  if (btnY) btnY.onclick = function() {
    try { localStorage.setItem('cdp_age','1'); } catch(e) {}
    showMain();
    bindCards();
  };

  if (btnN) btnN.onclick = function() {
    try { localStorage.setItem('cdp_age','0'); } catch(e) {}
    window.location.replace('https://www.google.com');
  };

  // Fechar modal
  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('modal-overlay').onclick = function(e) {
    if (e.target === this) closeModal();
  };
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });
});

function estoqueHtml(qtd) {
  if (qtd === undefined || qtd === null) return '';
  if (qtd === 0) return '<div class="modal-estoque zero">⚫ Sem estoque no momento</div>';
  if (qtd === 1) return '<div class="modal-estoque vermelho">🔴 Última unidade!</div>';
  if (qtd <= 3) return '<div class="modal-estoque amarelo">🟡 Restam ' + qtd + ' unidades</div>';
  return '<div class="modal-estoque verde">🟢 ' + qtd + ' em estoque</div>';
}

function openModal(id) {
  if (!window.produtos || !produtos[id]) return;
  var p = produtos[id];

  document.getElementById('modal-title').textContent = p.nome;
  document.getElementById('modal-price').textContent = p.preco;

  var msg = encodeURIComponent('Olá! Tenho interesse: ' + p.nome + ' — ' + p.preco);
  document.getElementById('modal-wa').href = 'https://wa.me/' + WA + '?text=' + msg;

  var fotos = (p.fotos||[]).filter(function(f){ return typeof f==='string' && f.startsWith('https://'); });
  var main = document.getElementById('modal-main-img');
  main.src = fotos.length ? fotos[0] : '';
  main.alt = p.nome;

  var thumbs = document.getElementById('modal-thumbs');
  thumbs.innerHTML = '';
  fotos.forEach(function(f, i) {
    var img = document.createElement('img');
    img.src = f; img.alt = p.nome;
    if (i===0) img.classList.add('active');
    img.onclick = function() {
      main.src = f;
      thumbs.querySelectorAll('img').forEach(function(x){ x.classList.remove('active'); });
      img.classList.add('active');
    };
    thumbs.appendChild(img);
  });

  var estoqueBox = document.getElementById('modal-estoque-box');
  if (!estoqueBox) {
    estoqueBox = document.createElement('div');
    estoqueBox.id = 'modal-estoque-box';
    var pr = document.querySelector('.modal-price-row');
    if (pr) pr.insertAdjacentElement('afterend', estoqueBox);
  }
  estoqueBox.innerHTML = estoqueHtml(p.estoque);

  sec('modal-desc','📝 Sobre o produto', p.descricao ? '<p>'+san(p.descricao)+'</p>' : '');
  sec('modal-ben','✨ Benefícios', p.beneficios&&p.beneficios.length
    ? '<ul>'+p.beneficios.map(function(b){ return '<li>'+san(b)+'</li>'; }).join('')+'</ul>' : '');
  sec('modal-how','💡 Como usar', p.comoUsar ? '<p>'+san(p.comoUsar)+'</p>' : '');
  sec('modal-specs','📋 Ficha técnica', p.ficha&&p.ficha.length
    ? '<ul>'+p.ficha.map(function(f){ return '<li>'+san(f)+'</li>'; }).join('')+'</ul>' : '');
  sec('modal-care','⚠️ Cuidados', p.cuidados ? '<p>'+san(p.cuidados)+'</p>' : '');

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function sec(id, titulo, html) {
  var el = document.getElementById(id);
  if (!html) { el.innerHTML=''; return; }
  el.innerHTML = '<div class="msec"><h3>'+titulo+'</h3>'+html+'</div>';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
