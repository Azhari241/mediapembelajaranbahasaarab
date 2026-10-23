/* ARABIYA EDU — halaman pembelajaran */
(function () {
  const AE = window.AE;
  const { html, ic, route } = AE;

  const statusBadge = (st) => st === 'selesai' ? html`<span class="badge">${ic('check')} Selesai</span>` : st === 'sedang' ? html`<span class="badge gold">${ic('loader')} Sedang dipelajari</span>` : html`<span class="badge gray">Belum dipelajari</span>`;
  const sourceNote = (kind) => AE.contentSource[kind] === 'bundled'
    ? html`<p class="tiny muted mt-s">${ic('info', 'inline')} Menampilkan konten contoh bawaan. Guru dapat menggantinya dengan konten dari database melalui Panel Guru.</p>` : '';

  /* ---------------- BERANDA ---------------- */
  route('/', 'Beranda', async () => {
    const [lessons, vocab, convs] = await Promise.all([AE.data.lessons(), AE.data.vocab(), AE.data.conversations()]);
    const st = AE.store.get();
    const tema = lessons.filter((l) => l.category === 'tema');
    const qawaid = lessons.filter((l) => l.category === 'qawaid');
    const next = lessons.find((l) => st.lessons[l.slug] === 'sedang') || lessons.find((l) => !st.lessons[l.slug]) || lessons[0];
    const rec = [next, ...AE.sample(lessons.filter((l) => l !== next && st.lessons[l.slug] !== 'selesai'), 2)].filter(Boolean);
    const challenge = AE.SPEAKING[new Date().getDate() % AE.SPEAKING.length];
    const word = vocab[(new Date().getDate() * 7) % vocab.length];

    const features = [
      ['/peta', 'map', 'Peta Pembelajaran', 'Materi kelas X–XII per keterampilan.'],
      ['/materi', 'book-open', 'Materi Bahasa Arab', `${tema.length} tema & ${qawaid.length} tata bahasa.`],
      ['/kosakata', 'image', 'Kosakata Bergambar', `${vocab.length} kosakata dengan kartu hafalan.`],
      ['/audio', 'headphones', 'Laboratorium Audio', 'Dengar kosakata dan kalimat.'],
      ['/percakapan', 'messages-square', 'Percakapan', `${convs.length} dialog bertema.`],
      ['/latihan', 'list-checks', 'Latihan Soal', 'Dinilai otomatis oleh server.'],
      ['/permainan', 'gamepad-2', 'Permainan', '6 permainan bahasa Arab.'],
      ['/berbicara', 'mic', 'Tantangan Berbicara', 'Latihan bicara & rubrik mandiri.'],
      ['/kamus', 'book-a', 'Kamus Mini', 'Cari kata Arab atau Indonesia.'],
    ];

    return {
      html: html`
      <section class="hero" data-screen-label="Beranda">
        <div>
          <div class="hero-inst">SMA GUPPI Samata · Gowa</div>
          <h1>ARABIYA EDU</h1>
          <div class="slogan">Belajar Bahasa Arab dengan Mudah, Menyenangkan, dan Bermakna.</div>
          <p>Laboratorium Bahasa Arab Digital untuk belajar mandiri: materi tematik, kosakata bergambar, audio, percakapan, permainan, dan latihan yang dinilai otomatis — tanpa perlu membuat akun.</p>
          <div class="btn-row mt">
            <a class="btn btn-gold" href="#/peta">${ic('play')} Mulai Belajar</a>
            <a class="btn" href="#/latihan">${ic('list-checks')} Latihan Soal</a>
            <a class="btn" href="#/peringkat">${ic('trophy')} Lihat Peringkat</a>
          </div>
        </div>
        <div class="hero-ar">
          <div class="ar" lang="ar" dir="rtl">مُخْتَبَرُ اللُّغَةِ الْعَرَبِيَّةِ</div>
          <div class="caption">Laboratorium Bahasa Arab</div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Kategori pembelajaran</h2></div>
        <div class="grid grid-3">${features.map(([href, icon, t, d]) => html`<a class="card-flat card-link feature" href="#${href}"><span class="icon-tile">${ic(icon)}</span><div><h3>${t}</h3><p>${d}</p></div></a>`)}</div>
      </section>

      <section class="section grid grid-2">
        <div class="card">
          <div class="eyebrow">Rekomendasi materi</div>
          <div class="stack-sm">${rec.map((l) => html`<a class="card-flat card-link row" href="#/materi/${l.slug}" style="padding:12px 14px;flex-wrap:nowrap">
            <span class="icon-tile ${l.category === 'qawaid' ? 'gold' : ''}">${ic(AE.SKILLS[l.skill].icon)}</span>
            <div style="flex:1;min-width:0"><b>${l.title}</b> <span class="ar-inline" lang="ar" dir="rtl">${l.title_ar}</span><div class="tiny muted">${AE.GRADES[l.grade_level]} · ${AE.SKILLS[l.skill].label}</div></div>
            ${statusBadge(st.lessons[l.slug])}</a>`)}</div>
        </div>
        <div class="card">
          <div class="eyebrow">Tantangan bahasa Arab hari ini</div>
          <h3>${challenge.title}</h3>
          <div class="ar ar-lg" lang="ar" dir="rtl" style="text-align:right">${challenge.prompt_ar}</div>
          <p class="small muted">${challenge.prompt}</p>
          <div class="btn-row"><a class="btn btn-primary" href="#/berbicara">${ic('mic')} Coba tantangan</a></div>
          ${word ? html`<hr style="border:0;border-top:1px solid var(--line);margin:18px 0">
          <div class="row between" style="flex-wrap:nowrap"><div><div class="eyebrow" style="margin:0">Kosakata hari ini</div><b>${word.meaning}</b></div>
            <div class="row" style="flex-wrap:nowrap"><span class="ar ar-lg" lang="ar" dir="rtl">${word.arabic}</span>${AE.audioBtn(word.arabic, { slow: false, url: word.audio_url })}</div></div>` : ''}
        </div>
      </section>

      <section class="section grid grid-2">
        <div class="card">
          <div class="section-head" style="margin-bottom:8px"><h2 style="font-size:1.1rem">Ringkasan isi</h2></div>
          <div class="grid grid-4" style="gap:10px">
            ${[[tema.length, 'Materi tematik'], [qawaid.length, 'Materi tata bahasa'], [vocab.length, 'Kosakata'], [convs.length, 'Percakapan'], [6, 'Permainan'], [AE.SPEAKING.length, 'Tantangan bicara']].map(([n, l]) => html`<div><div class="stat-num">${n}</div><div class="tiny muted">${l}</div></div>`)}
          </div>
          ${sourceNote('lessons')}
        </div>
        <div class="card">
          <div class="section-head" style="margin-bottom:8px"><h2 style="font-size:1.1rem">Peringkat terbaru</h2><a class="btn btn-sm" href="#/peringkat">Lihat semua</a></div>
          <div id="home-lb">${AE.loadingView('Memuat peringkat…')}</div>
        </div>
      </section>

      <section class="section card">
        <h2 style="font-size:1.1rem">Cara menggunakan ARABIYA EDU</h2>
        <ol class="steps mt-s">
          <li><div><b>Pilih materi</b> dari Peta Pembelajaran sesuai kelasmu, lalu tandai status belajarmu.</div></li>
          <li><div><b>Pelajari kosakata dan dengarkan audio.</b> Gunakan kartu hafalan dan tombol putar perlahan.</div></li>
          <li><div><b>Berlatih</b> dengan latihan materi dan permainan. Progres tersimpan di perangkat ini.</div></li>
          <li><div><b>Kerjakan Latihan Soal / Ujian</b> dengan nama tampilan & kelas. Nilai dihitung server dan — jika kamu setuju — tampil di papan peringkat.</div></li>
        </ol>
      </section>`,
      mount: async () => {
        const box = AE.$('#home-lb');
        if (!AE.dbReady()) { box.innerHTML = html`<p class="small muted">Papan peringkat akan tampil setelah pengelola menghubungkan database.</p>`.s; return; }
        try {
          const rows = (await AE.data.leaderboard({ limit: 5 })) || [];
          box.innerHTML = rows.length ? html`<div class="stack-sm">${rows.map((r) => html`<div class="row" style="flex-wrap:nowrap"><span class="rank ${r.rank <= 3 ? 'r' + r.rank : ''}">${r.rank}</span><div style="flex:1;min-width:0"><b>${r.display_name}</b><div class="tiny muted">${r.class_name} · ${r.quiz_title}</div></div><b>${AE.fmtNum(r.percent, 1)}</b></div>`)}</div>`.s
            : html`<p class="small muted">Belum ada hasil latihan.</p>`.s;
        } catch (e) { box.innerHTML = html`<p class="small muted">${AE.errMsg(e)}</p>`.s; }
      },
    };
  }, { nav: '' });

  /* ---------------- PETA PEMBELAJARAN ---------------- */
  route('/peta', 'Peta Pembelajaran', async () => {
    const lessons = await AE.data.lessons();
    const st = AE.store.get();
    const grade = +(sessionStorage.getItem('peta.grade') || 10);
    const render = (g) => {
      const ls = lessons.filter((l) => l.grade_level === g);
      return html`${Object.entries(AE.SKILLS).map(([k, s]) => {
        const items = ls.filter((l) => l.skill === k);
        return html`<div class="card-flat"><div class="row mb" style="flex-wrap:nowrap"><span class="icon-tile">${ic(s.icon)}</span><div><b>${s.label}</b><div class="ar-inline" lang="ar" dir="rtl">${s.ar}</div></div><span class="badge gray" style="margin-inline-start:auto">${items.length}</span></div>
          <div class="map-col">${items.length ? items.map((l) => { const v = st.lessons[l.slug] || 'belum'; return html`<a class="card-flat card-link map-item" href="#/materi/${l.slug}"><span class="dot ${v === 'selesai' ? 'done' : v === 'sedang' ? 'prog' : ''}" aria-hidden="true"></span><div style="min-width:0"><b class="small">${l.title}</b> <span class="ar-inline" lang="ar" dir="rtl">${l.title_ar}</span></div><span class="st tiny muted">${AE.STATUS[v]}</span></a>`; }) : html`<p class="tiny muted">Belum ada materi untuk keterampilan ini di kelas ini.</p>`}</div></div>`;
      })}`;
    };
    const done = lessons.filter((l) => st.lessons[l.slug] === 'selesai').length;
    return {
      html: html`<div class="page-head"><div class="eyebrow">Kelas X · XI · XII</div><h1>Peta Pembelajaran</h1>
        <p>Materi dikelompokkan berdasarkan kelas dan keterampilan. Status progres hanya menunjukkan catatan belajarmu di perangkat ini — bukan nilai resmi. Urutan dan isi materi dapat disesuaikan guru dengan buku ajar, ATP, dan CP sekolah.</p></div>
        <div class="row between mb"><div class="chips" role="group" aria-label="Pilih kelas">${[10, 11, 12].map((g) => html`<button class="chip" data-g="${g}" aria-pressed="${g === grade}">${AE.GRADES[g]}</button>`)}</div>
        <span class="small muted">${done} dari ${lessons.length} materi selesai</span></div>
        <div class="row small muted mb" style="gap:16px"><span class="row" style="gap:6px"><span class="dot"></span>Belum dipelajari</span><span class="row" style="gap:6px"><span class="dot prog"></span>Sedang dipelajari</span><span class="row" style="gap:6px"><span class="dot done"></span>Selesai</span></div>
        <div class="grid grid-3" id="map-grid">${render(grade)}</div>`,
      mount(root) {
        root.querySelectorAll('[data-g]').forEach((b) => (b.onclick = () => {
          sessionStorage.setItem('peta.grade', b.dataset.g);
          root.querySelectorAll('[data-g]').forEach((x) => x.setAttribute('aria-pressed', x === b));
          AE.$('#map-grid').innerHTML = render(+b.dataset.g).s;
        }));
      },
    };
  });

  /* ---------------- DAFTAR MATERI ---------------- */
  const lessonCard = (l, st) => html`<a class="card-flat card-link stack-sm" href="#/materi/${l.slug}">
      <div class="row between" style="flex-wrap:nowrap"><span class="icon-tile ${l.category === 'qawaid' ? 'gold' : ''}">${ic(AE.SKILLS[l.skill].icon)}</span>${statusBadge(st.lessons[l.slug])}</div>
      <div class="ar ar-lg" lang="ar" dir="rtl" style="text-align:right;line-height:1.7">${l.title_ar}</div>
      <div><b>${l.title}</b><div class="tiny muted">${AE.GRADES[l.grade_level]} · ${AE.SKILLS[l.skill].label} · ${AE.DIFF[l.difficulty]}</div></div></a>`;

  route('/materi', 'Materi Bahasa Arab', async () => {
    const lessons = await AE.data.lessons();
    const st = AE.store.get();
    const state = { cat: sessionStorage.getItem('materi.cat') || 'tema', grade: 0 };
    const list = () => lessons.filter((l) => l.category === state.cat && (!state.grade || l.grade_level === state.grade));
    const grid = () => { const ls = list(); return ls.length ? html`<div class="grid grid-3">${ls.map((l) => lessonCard(l, st))}</div>` : AE.emptyView('book-open', 'Belum ada materi', 'Tidak ada materi untuk filter ini.'); };
    return {
      html: html`<div class="page-head"><h1>Materi Bahasa Arab</h1><p>Materi tematik untuk keterampilan berbahasa dan Laboratorium Tata Bahasa (qawaid). Setiap materi memuat tujuan, kosakata, penjelasan, contoh berharakat, latihan interaktif, rangkuman, dan refleksi.</p></div>
        <div class="tabs" role="tablist"><button class="tab" role="tab" data-cat="tema" aria-selected="${state.cat === 'tema'}">${ic('book-open')} Materi tematik</button><button class="tab" role="tab" data-cat="qawaid" aria-selected="${state.cat === 'qawaid'}">${ic('spell-check')} Laboratorium Tata Bahasa</button></div>
        <div class="chips mb" role="group" aria-label="Filter kelas">${[[0, 'Semua kelas'], [10, 'Kelas X'], [11, 'Kelas XI'], [12, 'Kelas XII']].map(([g, l]) => html`<button class="chip" data-grade="${g}" aria-pressed="${g === 0}">${l}</button>`)}</div>
        <div id="lesson-grid">${grid()}</div>${sourceNote('lessons')}`,
      mount(root) {
        const upd = () => (AE.$('#lesson-grid').innerHTML = grid().s);
        root.querySelectorAll('[data-cat]').forEach((b) => (b.onclick = () => { state.cat = b.dataset.cat; sessionStorage.setItem('materi.cat', state.cat); root.querySelectorAll('[data-cat]').forEach((x) => x.setAttribute('aria-selected', x === b)); upd(); }));
        root.querySelectorAll('[data-grade]').forEach((b) => (b.onclick = () => { state.grade = +b.dataset.grade; root.querySelectorAll('[data-grade]').forEach((x) => x.setAttribute('aria-pressed', x === b)); upd(); }));
      },
    };
  });

  /* ---------------- DETAIL MATERI ---------------- */
  route('/materi/:slug', 'Materi', async ({ slug }) => {
    const lessons = await AE.data.lessons();
    const idx = lessons.findIndex((l) => l.slug === slug);
    const l = lessons[idx];
    if (!l) return AE.emptyView('book-open', 'Materi tidak ditemukan', 'Materi ini mungkin telah diarsipkan atau dipindahkan.', html`<a class="btn btn-primary" href="#/materi">Ke daftar materi</a>`);
    const sameCat = lessons.filter((x) => x.category === l.category);
    const ci = sameCat.indexOf(l);
    const prev = sameCat[ci - 1], next = sameCat[ci + 1];
    const vocab = (await AE.data.vocab()).filter((v) => l.vocab_category && v.category === l.vocab_category);
    const status = AE.store.lessonStatus(slug);
    if (status === 'belum') AE.store.setLesson(slug, 'sedang');
    const exercises = (l.exercises || []).map((e, i) => AE.fromExercise(e, i, slug)).filter(Boolean);
    let n = 0;
    const block = (title, content) => html`<section class="lesson-block"><h2><span class="n">${++n}</span>${title}</h2>${content}</section>`;
    const ex = (e) => html`<div class="example"><div class="ar" lang="ar" dir="rtl">${e[0]}</div><div class="tr">${e[1]}</div><div class="actions">${AE.audioBtn(e[0])}</div></div>`;
    document.title = l.title + ' · ARABIYA EDU';
    AE.$('.topbar-title').textContent = l.title;

    return {
      html: html`<article data-screen-label="Materi ${l.title}">
        <a class="btn btn-sm btn-ghost" href="#/materi">${ic('arrow-left')} Semua materi</a>
        <div class="lesson-head mt-s">
          <div style="min-width:0;flex:1 1 360px"><div class="eyebrow">${l.category === 'qawaid' ? 'Laboratorium Tata Bahasa' : 'Materi tematik'} · ${AE.GRADES[l.grade_level]}</div>
            <h1>${l.title}</h1><div class="ar ar-xl" lang="ar" dir="rtl" style="text-align:left;direction:rtl;display:inline-block">${l.title_ar}</div>
            <div class="row mt-s"><span class="badge">${ic(AE.SKILLS[l.skill].icon)} ${AE.SKILLS[l.skill].label}</span><span class="badge gray">Tingkat: ${AE.DIFF[l.difficulty]}</span></div></div>
          <div class="card-flat" style="flex:0 1 300px"><div class="label mb" style="margin-bottom:8px">Status belajarku</div>
            <div class="status-select" role="group" aria-label="Status belajar">${Object.entries(AE.STATUS).map(([k, v]) => html`<button class="chip" data-st="${k}" aria-pressed="${(status === 'belum' ? 'sedang' : status) === k}">${v}</button>`)}</div>
            <p class="tiny muted mt-s" style="margin-bottom:0">Disimpan di perangkat ini saja.</p></div>
        </div>

        ${block('Tujuan pembelajaran', html`<ul>${(l.objectives || []).map((o) => html`<li>${o}</li>`)}</ul>`)}
        ${block('Pengantar', html`<p>${l.intro}</p>`)}
        ${vocab.length ? block('Kosakata', html`<div class="grid grid-4">${vocab.slice(0, 12).map((v) => html`<div class="card-flat stack-sm" style="padding:12px;text-align:center"><div class="ar ar-lg" lang="ar" dir="rtl">${v.arabic}</div><div class="small"><b>${v.meaning}</b></div><div class="row" style="justify-content:center">${AE.audioBtn(v.arabic, { url: v.audio_url })}</div></div>`)}</div>
          ${vocab.length > 12 ? html`<a class="btn btn-sm mt-s" href="#/kosakata?cat=${l.vocab_category}">Lihat ${vocab.length} kosakata ${ic('arrow-right')}</a>` : ''}`) : ''}
        ${block('Penjelasan', html`<div class="stack-sm">${(l.explanation || []).map((p) => html`<p style="margin:0">${AE.mixText(p)}</p>`)}</div>
          ${l.table ? html`<table class="gtable mt-s"><thead><tr>${l.table.head.map((h) => html`<th>${h}</th>`)}</tr></thead><tbody>${l.table.rows.map((r) => html`<tr>${r.map((c) => html`<td>${AE.txt(c)}</td>`)}</tr>`)}</tbody></table>` : ''}`)}
        ${l.passage ? block('Bacaan', html`<div class="passage"><div class="row between mb" style="margin-bottom:8px"><span class="label">Teks bacaan</span>${AE.audioBtn(l.passage.ar)}</div><div class="ar" lang="ar" dir="rtl">${l.passage.ar}</div>
          <details class="mt-s"><summary class="small" style="cursor:pointer;font-weight:600">Tampilkan terjemahan</summary><p class="small mt-s">${l.passage.id}</p></details></div>`) : ''}
        ${block('Contoh kalimat & terjemahan', html`<div class="stack-sm">${(l.examples || []).map(ex)}</div>`)}
        ${(l.daily || []).length ? block('Dalam kehidupan sehari-hari', html`<div class="stack-sm">${l.daily.map(ex)}</div>`) : ''}
        ${block('Latihan interaktif', html`<div class="card q-card" id="lesson-practice"></div>`)}
        ${block('Rangkuman', html`<ul>${(l.summary || []).map((s) => html`<li>${AE.mixText(s)}</li>`)}</ul>`)}
        ${block('Refleksi', html`<ul>${(l.reflection || []).map((s) => html`<li>${s}</li>`)}</ul>
          <div class="btn-row"><button class="btn btn-primary" data-finish>${ic('circle-check')} Tandai materi selesai</button></div>`)}

        <nav class="pager" aria-label="Navigasi materi">
          ${prev ? html`<a class="card-flat card-link" href="#/materi/${prev.slug}"><div class="tiny muted">${ic('arrow-left')} Materi sebelumnya</div><b>${prev.title}</b></a>` : html`<span></span>`}
          ${next ? html`<a class="card-flat card-link" href="#/materi/${next.slug}" style="text-align:right"><div class="tiny muted">Materi berikutnya ${ic('arrow-right')}</div><b>${next.title}</b></a>` : html`<span></span>`}
        </nav></article>`,
      mount(root) {
        AE.localPractice(exercises, { title: 'Latihan: ' + l.title, historyLabel: 'Latihan materi: ' + l.title }).mount(AE.$('#lesson-practice'));
        const setSt = (k) => { AE.store.setLesson(slug, k); root.querySelectorAll('[data-st]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.st === k)); };
        root.querySelectorAll('[data-st]').forEach((b) => (b.onclick = () => setSt(b.dataset.st)));
        root.querySelector('[data-finish]').onclick = () => { setSt('selesai'); AE.toast('Materi ditandai selesai. Mantap!'); };
      },
    };
  }, { nav: 'materi' });

  /* Teks campuran: bagian Arab dibungkus agar arah tulisan benar */
  AE.mixText = (s) => {
    const parts = String(s).split(/([\u0600-\u06FF][\u0600-\u06FF\u064B-\u0652\u0670\s\u060C\u061F\u0640ـ…\.]*[\u0600-\u06FF\u064B-\u0652\u0670ـ؟]|[\u0600-\u06FF])/);
    return AE.raw(parts.map((p, i) => (i % 2 ? `<span class="ar-inline" lang="ar" dir="rtl">${AE.esc(p)}</span>` : AE.esc(p))).join(''));
  };

  /* ---------------- KOSAKATA BERGAMBAR ---------------- */
  AE.vocabImg = (v) => v.image_url ? html`<div class="vimg"><img src="${v.image_url}" alt="${v.meaning}" loading="lazy"></div>`
    : AE.hasIcon(v.icon) ? html`<div class="vimg" role="img" aria-label="Ilustrasi: ${v.meaning}">${ic(v.icon)}</div>`
    : html`<div class="vimg placeholder" role="img" aria-label="Gambar belum tersedia">Gambar belum tersedia</div>`;

  route('/kosakata', 'Kosakata Bergambar', async () => {
    const vocab = await AE.data.vocab();
    const qs = new URLSearchParams(location.hash.split('?')[1] || '');
    const state = { q: '', cat: qs.get('cat') || '', grade: 0, mode: 'katalog', fi: 0 };
    const learned = () => AE.store.get().vocab;
    const filtered = () => {
      const q = AE.normText(state.q);
      return vocab.filter((v) => (!state.cat || v.category === state.cat) && (!state.grade || v.grade_level === state.grade) && (!q || AE.normText(v.arabic).includes(q) || v.meaning.toLowerCase().includes(q) || (v.latin || '').toLowerCase().includes(q)));
    };
    const catalog = () => {
      const list = filtered(); const L = learned();
      if (!list.length) return AE.emptyView('search-x', 'Kosakata tidak ditemukan', 'Coba kata kunci atau filter lain.');
      return html`<p class="small muted">${list.length} kosakata · ${list.filter((v) => L[v.id]).length} sudah dipelajari</p>
        <div class="grid grid-4">${list.slice(0, 120).map((v) => html`<div class="card-flat vcard">${AE.vocabImg(v)}
          <div class="ar" lang="ar" dir="rtl">${v.arabic}</div><div class="meaning">${v.meaning}</div>
          <div class="row" style="justify-content:center;gap:6px">${AE.audioBtn(v.arabic, { url: v.audio_url })}
            <button class="btn btn-sm ${L[v.id] ? 'btn-primary' : ''}" data-learn="${v.id}" aria-pressed="${!!L[v.id]}">${ic(L[v.id] ? 'check' : 'bookmark')} ${L[v.id] ? 'Dipelajari' : 'Tandai'}</button></div>
          ${v.example_ar ? html`<div class="ex"><div class="ar" lang="ar" dir="rtl">${v.example_ar}</div><div>${v.example_id}</div></div>` : ''}</div>`)}</div>`;
    };
    const flash = () => {
      const list = filtered();
      if (!list.length) return AE.emptyView('layers', 'Tidak ada kartu', 'Ubah filter untuk menampilkan kartu.');
      state.fi = ((state.fi % list.length) + list.length) % list.length;
      const v = list[state.fi];
      return html`<div class="flashcard" id="fc"><div class="flash-inner" tabindex="0" role="button" aria-label="Balik kartu">
          <div class="flash-face">${AE.vocabImg(v)}<div class="ar ar-xl" lang="ar" dir="rtl">${v.arabic}</div><div class="tiny muted">Ketuk untuk melihat arti</div></div>
          <div class="flash-face back"><div class="small muted latin">${v.latin}</div><h2>${v.meaning}</h2><div class="ar" lang="ar" dir="rtl">${v.example_ar}</div><div class="small muted">${v.example_id}</div></div></div></div>
        <div class="row mt" style="justify-content:center"><button class="btn" data-fc="-1">${ic('chevron-left')} Sebelumnya</button><span class="small muted">${state.fi + 1} / ${list.length}</span><button class="btn" data-fc="1">Berikutnya ${ic('chevron-right')}</button></div>
        <div class="row mt-s" style="justify-content:center">${AE.audioBtn(v.arabic, { url: v.audio_url })}<button class="btn btn-sm" data-learn="${v.id}">${ic('check')} Sudah hafal</button><button class="btn btn-sm" data-fc="shuffle">${ic('shuffle')} Acak</button></div>`;
    };
    const quizModes = [['arti', 'Pilih arti yang tepat'], ['cocok', 'Cocokkan kata & arti'], ['gambar', 'Cocokkan kata & gambar'], ['susun', 'Susun huruf menjadi kata']];
    const quiz = (m) => html`<div class="chips mb">${quizModes.map(([k, l]) => html`<button class="chip" data-qm="${k}" aria-pressed="${m === k}">${l}</button>`)}</div><div class="card q-card" id="vq"></div>`;
    const body = () => (state.mode === 'katalog' ? catalog() : state.mode === 'kartu' ? flash() : quiz(state.qm || 'arti'));

    return {
      html: html`<div class="page-head"><h1>Kosakata Bergambar</h1><p>Kosakata berharakat dengan arti, contoh kalimat, dan audio. Ilustrasi menggunakan ikon sederhana; kosakata tanpa ilustrasi yang sesuai ditandai “Gambar belum tersedia” agar tidak menyesatkan.</p></div>
        <div class="tabs" role="tablist">${[['katalog', 'layout-grid', 'Katalog'], ['kartu', 'layers', 'Kartu hafalan'], ['kuis', 'list-checks', 'Kuis kosakata']].map(([k, i, l]) => html`<button class="tab" role="tab" data-mode="${k}" aria-selected="${k === state.mode}">${ic(i)} ${l}</button>`)}</div>
        <div class="row mb" style="align-items:stretch">
          <div class="search" style="flex:1 1 260px"><label class="sr-only" for="vq-s">Cari kosakata</label>${ic('search')}<input id="vq-s" class="input" placeholder="Cari kata Arab atau arti…" autocomplete="off"></div>
          <select class="input" id="vq-cat" style="flex:0 1 220px" aria-label="Filter kategori"><option value="">Semua kategori</option>${AE.VOCAB_CATEGORIES.map((c) => html`<option value="${c.id}" ${state.cat === c.id ? 'selected' : ''}>${c.label}</option>`)}</select>
          <select class="input" id="vq-grade" style="flex:0 1 160px" aria-label="Filter kelas"><option value="0">Semua kelas</option>${[10, 11, 12].map((g) => html`<option value="${g}">${AE.GRADES[g]}</option>`)}</select>
        </div>
        <div id="vbody">${body()}</div>${sourceNote('vocab')}`,
      mount(root) {
        const vb = AE.$('#vbody');
        const upd = () => { vb.innerHTML = body().s; if (state.mode === 'kuis') AE.mountVocabQuiz(AE.$('#vq'), filtered().length >= 4 ? filtered() : vocab, state.qm || 'arti'); };
        root.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => { state.mode = b.dataset.mode; root.querySelectorAll('[data-mode]').forEach((x) => x.setAttribute('aria-selected', x === b)); upd(); }));
        AE.$('#vq-s').oninput = AE.debounce((e) => { state.q = e.target.value; if (state.mode !== 'kuis') upd(); }, 180);
        AE.$('#vq-cat').onchange = (e) => { state.cat = e.target.value; state.fi = 0; upd(); };
        AE.$('#vq-grade').onchange = (e) => { state.grade = +e.target.value; state.fi = 0; upd(); };
        vb.addEventListener('click', (e) => {
          const lb = e.target.closest('[data-learn]');
          if (lb) { const id = lb.dataset.learn; AE.store.set((s) => { if (s.vocab[id] && state.mode === 'katalog') delete s.vocab[id]; else s.vocab[id] = 1; }); if (state.mode === 'kartu') { state.fi++; } upd(); return; }
          const fc = e.target.closest('[data-fc]');
          if (fc) { if (fc.dataset.fc === 'shuffle') state.fi = Math.floor(Math.random() * filtered().length); else state.fi += +fc.dataset.fc; upd(); return; }
          if (e.target.closest('.flash-inner')) AE.$('#fc').classList.toggle('flipped');
          const qm = e.target.closest('[data-qm]');
          if (qm) { state.qm = qm.dataset.qm; upd(); }
        });
        vb.addEventListener('keydown', (e) => { if (e.target.matches('.flash-inner') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); AE.$('#fc').classList.toggle('flipped'); } });
        if (state.mode === 'kuis') upd();
      },
    };
  }, { nav: 'kosakata' });

  /* Kuis kosakata (lokal) */
  AE.mountVocabQuiz = (el, pool, mode) => {
    const N = Math.min(8, pool.length);
    const picks = AE.sample(pool, N);
    let qs = [];
    if (mode === 'arti') qs = picks.map((v, i) => { const opts = AE.shuffle([v, ...AE.sample(pool.filter((x) => x.meaning !== v.meaning), 3)]); return { id: 'va' + i, type: 'choose_meaning', text: 'Apa arti kata ini?', ar: v.arabic, options: opts.map((o, j) => ({ id: 'abcd'[j], text: o.meaning })), key: { correct: 'abcd'[opts.indexOf(v)] } }; });
    if (mode === 'gambar') {
      const withImg = pool.filter((v) => v.image_url || AE.hasIcon(v.icon));
      qs = AE.sample(withImg, Math.min(8, withImg.length)).map((v, i) => { const opts = AE.shuffle([v, ...AE.sample(withImg.filter((x) => x.id !== v.id), 3)]); return { id: 'vg' + i, type: 'mcq', text: 'Kata Arab mana yang sesuai dengan gambar?', ar: '', picture: v, options: opts.map((o, j) => ({ id: 'abcd'[j], text: o.arabic })), key: { correct: 'abcd'[opts.indexOf(v)] }, explanation: `${v.arabic} = ${v.meaning}` }; });
    }
    if (mode === 'cocok') { const groups = []; for (let i = 0; i + 4 <= picks.length; i += 4) groups.push(picks.slice(i, i + 4)); if (!groups.length) groups.push(picks); qs = groups.map((g, i) => ({ id: 'vm' + i, type: 'matching', text: 'Jodohkan kata Arab dengan artinya.', options: { left: g.map((v, j) => ({ id: 'l' + j, text: v.arabic })), right: AE.shuffle(g.map((v, j) => ({ id: 'r' + j, text: v.meaning }))) }, key: { pairs: Object.fromEntries(g.map((v, j) => ['l' + j, 'r' + j])) } })); }
    if (mode === 'susun') {
      const single = pool.filter((v) => !/[\s-]/.test(v.arabic.trim()) && [...v.arabic.replace(/[\u064B-\u0652\u0670]/g, '')].length >= 3 && [...v.arabic.replace(/[\u064B-\u0652\u0670]/g, '')].length <= 7);
      qs = AE.sample(single, Math.min(6, single.length)).map((v, i) => { const letters = [...v.arabic.replace(/[\u064B-\u0652\u0670]/g, '')]; return { id: 'vs' + i, type: 'arrange', text: `Susun huruf menjadi kata yang berarti “${v.meaning}”.`, options: { tokens: AE.shuffleUntilDifferent(letters) }, key: { order: letters }, explanation: `Jawaban: ${v.arabic}` }; });
    }
    if (!qs.length) { el.innerHTML = AE.emptyView('list-checks', 'Kosakata belum cukup', 'Perlu minimal 4 kosakata untuk kuis ini.').s; return; }
    const labels = { arti: 'Pilih arti', cocok: 'Cocokkan kata & arti', gambar: 'Cocokkan kata & gambar', susun: 'Susun kata' };
    AE.localPractice(qs, { title: 'Kuis kosakata: ' + labels[mode], historyLabel: 'Kuis kosakata: ' + labels[mode], kind: 'kuis-kosakata' }).mount(el);
  };
})();
