(function() {
  var WA = atob('NTUxMTk3Mzc4NDgwOQ==');

  function san(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(String(s || '')));
    return d.innerHTML;
  }

  // AGE GATE
  function showMain() {
    document.getElementById('age-gate').style.display = 'none';
    document.getElementById('main').style.display = 'block';
  }

  try {
    var st = localStorage.getItem('cdp_age');
    if (st === '1') { showMain(); }
    else if (st === '0') { window.location.replace('https://www.google.com'); return; }
  } catch(e) {}

  document.addEventListener('DOMContentLoaded', function() {
    var yes = document.getElementById('btn-yes');
    var no  = document.getElementById('btn-no');
    var cls = document.getElementById('modal-close');
    var ovl = document.getElementById('modal-overlay');

    if (yes) yes.addEventListener('click', function() {
      try { localStorage.setItem('cdp_age','1'); } catch(e) {}
      showMain();
    });
    if (no) no.addEventListener('click', function() {
      try { localStorage.setItem('cdp_age','0'); } catch(e) {}
      window.location.replace('https://www.google.com');
    });

    // Cards e Kits — event delegation
    document.addEventListener('click', function(e) {
      var el = e.target.closest('[data-id]');
      if (el) { openModal(el.getAttribute('data-id')); return; }
      if (e.target === ovl || e.target.closest('#modal-close')) { closeModal(); }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });
  });

  // MODAL
  function openModal(id) {
    if (!window.produtos || !produtos[id]) return;
    var p = produtos[id];

    document.getElementById('modal-title').textContent = p.nome;
    document.getElementById('modal-price').textContent = p.preco;

    var msg = encodeURIComponent('Olá! Tenho interesse: ' + p.nome + ' — ' + p.preco);
    document.getElementById('modal-wa').href = 'https://wa.me/' + WA + '?text=' + msg;

    var fotos = (p.fotos || []).filter(function(f){ return f && f.startsWith('https://'); });
    var main = document.getElementById('modal-main-img');
    main.src = fotos[0] || '';
    main.alt = p.nome;

    var thumbs = document.getElementById('modal-thumbs');
    thumbs.innerHTML = '';
    fotos.forEach(function(f, i) {
      var img = document.createElement('img');
      img.src = f; img.alt = p.nome;
      if (i === 0) img.classList.add('active');
      img.addEventListener('click', function() {
        main.src = f;
        thumbs.querySelectorAll('img').forEach(function(x){ x.classList.remove('active'); });
        img.classList.add('active');
      });
      thumbs.appendChild(img);
    });

    sec('modal-desc', '📝 Sobre o produto', '<p>' + san(p.descricao) + '</p>');
    sec('modal-ben', '✨ Benefícios', p.beneficios && p.beneficios.length ? '<ul>' + p.beneficios.map(function(b){ return '<li>' + san(b) + '</li>'; }).join('') + '</ul>' : '');
    sec('modal-how', '💡 Como usar', p.comoUsar ? '<p>' + san(p.comoUsar) + '</p>' : '');
    sec('modal-specs', '📋 Ficha técnica', p.ficha && p.ficha.length ? '<ul>' + p.ficha.map(function(f){ return '<li>' + san(f) + '</li>'; }).join('') + '</ul>' : '');
    sec('modal-care', '⚠️ Cuidados', p.cuidados ? '<p>' + san(p.cuidados) + '</p>' : '');

    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function sec(id, titulo, html) {
    var el = document.getElementById(id);
    if (!html) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="msec"><h3>' + titulo + '</h3>' + html + '</div>';
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openModal = openModal;
  window.closeModal = closeModal;
})();
