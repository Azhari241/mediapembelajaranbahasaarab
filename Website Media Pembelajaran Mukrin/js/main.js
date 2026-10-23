/* ARABIYA EDU — navigasi & inisialisasi */
(function () {
  const AE = window.AE;
  const { html, ic } = AE;
  const NAV = [
    ['Belajar', [['/', '', 'house', 'Beranda'], ['/peta', 'peta', 'map', 'Peta Pembelajaran'], ['/materi', 'materi', 'book-open', 'Materi Bahasa Arab'], ['/kosakata', 'kosakata', 'image', 'Kosakata Bergambar'], ['/audio', 'audio', 'headphones', 'Laboratorium Audio'], ['/percakapan', 'percakapan', 'messages-square', 'Percakapan'], ['/kamus', 'kamus', 'book-a', 'Kamus Mini']]],
    ['Berlatih', [['/latihan', 'latihan', 'list-checks', 'Latihan Soal'], ['/permainan', 'permainan', 'gamepad-2', 'Permainan Bahasa Arab'], ['/berbicara', 'berbicara', 'mic', 'Tantangan Berbicara'], ['/ujian', 'ujian', 'file-check-2', 'Ujian Akhir']]],
    ['Hasil', [['/peringkat', 'peringkat', 'trophy', 'Papan Peringkat'], ['/progres', 'progres', 'chart-line', 'Progres Belajar']]],
    ['Lainnya', [['/tentang', 'tentang', 'info', 'Tentang ARABIYA EDU'], ['/guru', 'guru', 'lock-keyhole', 'Panel Guru'], ['/guru/supabase', 'guru-sb', 'database', 'Pengaturan Supabase']]],
  ];
  AE.$('#nav').innerHTML = NAV.map(([g, items]) => html`<div class="nav-group">${g}</div>${items.map(([h, k, i, l]) => html`<a class="nav-link" href="#${h}" data-nav="${k}">${ic(i)}<span>${l}</span></a>`)}`.s).join('');
  AE.$('#bottom-nav').innerHTML = html`${[['/', '', 'house', 'Beranda'], ['/materi', 'materi', 'book-open', 'Materi'], ['/latihan', 'latihan', 'list-checks', 'Latihan'], ['/peringkat', 'peringkat', 'trophy', 'Peringkat']].map(([h, k, i, l]) => html`<a href="#${h}" data-nav="${k}">${ic(i)}<span>${l}</span></a>`)}<button type="button" id="more-btn">${ic('menu')}<span>Menu</span></button>`.s;
  AE.$('#menu-btn').innerHTML = ic('menu').s;
  const openDrawer = () => document.body.classList.add('drawer-open');
  AE.$('#menu-btn').onclick = openDrawer;
  AE.$('#more-btn').onclick = openDrawer;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('drawer-open'); });

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const a = b.dataset.action;
    if (a === 'reload') { AE.invalidate(); AE.render(); }
    if (a === 'abandon') AE.abandonRun(b.dataset.qid);
    if (a === 'close-drawer') document.body.classList.remove('drawer-open');
  });
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-noform]')) e.preventDefault(); });
  window.addEventListener('hashchange', AE.render);
  window.addEventListener('online', () => AE.toast('Koneksi internet tersambung kembali.'));
  window.addEventListener('offline', () => AE.toast('Koneksi internet terputus. Materi tetap bisa dibuka; pengiriman nilai menunggu koneksi.', 'err', 6000));

  AE.render();
  AE.checkHealth().then(AE.updateConnPill);
})();
