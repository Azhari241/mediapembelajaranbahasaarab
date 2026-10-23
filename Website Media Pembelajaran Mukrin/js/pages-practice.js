/* ARABIYA EDU — Audio, Percakapan, Kamus, Tantangan Berbicara, Progres, Tentang, Privasi */
(function () {
  const AE = window.AE;
  const { html, ic, route } = AE;

  /* ---------------- LABORATORIUM AUDIO ---------------- */
  route('/audio', 'Laboratorium Audio', async () => {
    const [vocab, lessons] = await Promise.all([AE.data.vocab(), AE.data.lessons()]);
    const sentences = lessons.flatMap((l) => (l.examples || []).map((e) => ({ ar: e[0], id: e[1], from: l.title })));
    const st = AE.speech.status();
    const statusBox = st === 'ok' ? AE.notice('', 'circle-check', html`<p><b>Suara Bahasa Arab tersedia</b> (${AE.speech.voice.name}). Suara otomatis dihasilkan perangkat dan <b>tidak selalu seakurat penutur asli</b> — tetap perhatikan teks berharakat dan contoh dari guru.</p>`)
      : st === 'unsupported' ? AE.notice('warn', 'volume-x', html`<p><b>Browser ini tidak mendukung suara otomatis.</b> Gunakan teks Arab dan terjemahan sebagai alternatif, atau buka di Google Chrome.</p>`)
      : AE.notice('warn', 'volume-x', html`<p><b>Suara Bahasa Arab belum ditemukan di perangkat ini.</b> Coba Chrome di Android/laptop, atau tambahkan paket suara Arab di pengaturan Text-to-Speech perangkat. Teks dan terjemahan tetap dapat digunakan.</p>`);
    const state = { tab: 'kata', cat: '', hideTr: false, hideAr: false, q: '' };
    const list = () => {
      if (state.tab === 'kata') return vocab.filter((v) => !state.cat || v.category === state.cat).map((v) => ({ ar: v.arabic, id: v.meaning, url: v.audio_url, sub: v.latin }));
      return sentences;
    };
    const body = () => html`<div class="stack-sm ${state.hideTr ? 'hide-tr' : ''}">${list().slice(0, 150).map((x) => html`<div class="example">
      <div class="ar" lang="ar" dir="rtl" style="${state.hideAr ? 'filter:blur(7px)' : ''}">${x.ar}</div><div class="tr">${x.id}${x.from ? html` <span class="tiny">· ${x.from}</span>` : ''}</div>
      <div class="actions row" style="flex-wrap:nowrap;gap:6px"><button class="btn btn-sm btn-icon" data-say="${x.ar}" data-url="${x.url || ''}" data-rate="0.9" aria-label="Putar">${ic('play')}</button><button class="btn btn-sm btn-icon" data-say="${x.ar}" data-url="${x.url || ''}" data-rate="0.9" aria-label="Ulangi">${ic('repeat')}</button><button class="btn btn-sm btn-icon" data-say="${x.ar}" data-url="${x.url || ''}" data-rate="0.6" aria-label="Putar perlahan">${ic('snail')}</button></div></div>`)}</div>`;
    return {
      html: html`<div class="page-head"><h1>Laboratorium Audio</h1><p>Dengarkan kosakata dan kalimat, ulangi, putar perlahan, lalu tirukan. Sembunyikan teks Arab untuk melatih menyimak, atau sembunyikan terjemahan untuk menguji pemahaman.</p></div>
        <div class="mb">${statusBox}</div>
        <div class="tabs" role="tablist"><button class="tab" role="tab" data-tab="kata" aria-selected="true">${ic('whole-word')} Kosakata</button><button class="tab" role="tab" data-tab="kalimat" aria-selected="false">${ic('text')} Kalimat</button></div>
        <div class="row mb"><select class="input" id="au-cat" style="max-width:240px" aria-label="Kategori"><option value="">Semua kategori</option>${AE.VOCAB_CATEGORIES.map((c) => html`<option value="${c.id}">${c.label}</option>`)}</select>
          <label class="check"><input type="checkbox" id="au-tr"> Sembunyikan terjemahan</label><label class="check"><input type="checkbox" id="au-ar"> Samarkan teks Arab</label>
          <button class="btn btn-sm" id="au-stop">${ic('square')} Hentikan</button></div>
        <div id="au-body">${body()}</div>`,
      mount(root) {
        const upd = () => (AE.$('#au-body').innerHTML = body().s);
        root.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => { state.tab = b.dataset.tab; root.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-selected', x === b)); AE.$('#au-cat').disabled = state.tab !== 'kata'; upd(); }));
        AE.$('#au-cat').onchange = (e) => { state.cat = e.target.value; upd(); };
        AE.$('#au-tr').onchange = (e) => { state.hideTr = e.target.checked; upd(); };
        AE.$('#au-ar').onchange = (e) => { state.hideAr = e.target.checked; upd(); };
        AE.$('#au-stop').onclick = () => AE.speech.stop();
      },
    };
  });

  /* ---------------- PERCAKAPAN ---------------- */
  route('/percakapan', 'Percakapan', async () => {
    const convs = await AE.data.conversations();
    return html`<div class="page-head"><h1>Percakapan</h1><p>Dialog bertema dengan teks Arab berharakat, terjemahan, audio, dan tiga jenis latihan: melengkapi dialog, menyusun dialog, dan memilih respons yang tepat.</p></div>
      ${convs.length ? html`<div class="grid grid-3">${convs.map((c) => html`<a class="card-flat card-link stack-sm" href="#/percakapan/${c.slug}"><span class="icon-tile">${ic('messages-square')}</span><div class="ar ar-lg" lang="ar" dir="rtl" style="text-align:right">${c.title_ar}</div><b>${c.title}</b><span class="tiny muted">${AE.GRADES[c.grade_level]} · ${(c.lines || []).length} baris</span></a>`)}</div>` : AE.emptyView('messages-square', 'Belum ada percakapan', 'Guru belum menambahkan percakapan.')}`;
  });

  route('/percakapan/:slug', 'Percakapan', async ({ slug }) => {
    const convs = await AE.data.conversations();
    const c = convs.find((x) => x.slug === slug);
    if (!c) return AE.emptyView('messages-square', 'Percakapan tidak ditemukan', '', html`<a class="btn" href="#/percakapan">Kembali</a>`);
    const lines = c.lines || [];
    const speakers = [...new Set(lines.map((l) => l.speaker))];
    AE.$('.topbar-title').textContent = c.title;
    const others = convs.filter((x) => x !== c);
    // Latihan
    const qs = [];
    const fillable = lines.map((l, i) => ({ l, i })).filter(({ l }) => l.ar.split(/\s+/).length >= 2);
    AE.sample(fillable, Math.min(2, fillable.length)).forEach(({ l, i }, k) => {
      const words = l.ar.split(/\s+/);
      const wi = words.reduce((best, w, j) => (w.replace(/[^\u0600-\u06FF]/g, '').length > words[best].replace(/[^\u0600-\u06FF]/g, '').length ? j : best), 0);
      const ans = words[wi].replace(/[.،؟!,?]/g, '');
      const shown = words.map((w, j) => (j === wi ? '_____' : w)).join(' ');
      qs.push({ id: 'cf' + k, type: 'fill_blank', text: `Lengkapi ucapan ${l.speaker} (baris ${i + 1}): “${l.id}”`, ar: shown, key: { accepted: [ans] }, explanation: `Kalimat lengkap: ${l.ar}` });
    });
    if (lines.length >= 3) {
      const seg = lines.slice(0, Math.min(4, lines.length)).map((l) => l.ar);
      qs.push({ id: 'ca', type: 'mcq', text: 'Manakah ucapan yang menjadi pembuka dialog ini?', options: AE.shuffle(seg.slice()).map((t, j) => ({ id: 'abcd'[j], text: t })), key: null, explanation: 'Dialog dibuka dengan: ' + seg[0] });
      const last = qs[qs.length - 1]; last.key = { correct: last.options.find((o) => o.text === seg[0]).id };
    }
    const pool = convs.flatMap((x) => x.lines || []).map((l) => l.ar);
    lines.slice(0, -1).map((l, i) => ({ l, i })).filter((_, i) => i % 2 === 0).slice(0, 2).forEach(({ l, i }, k) => {
      const right = lines[i + 1].ar;
      const distract = AE.sample(pool.filter((p) => p !== right && p !== l.ar), 3);
      const opts = AE.shuffle([right, ...distract]);
      qs.push({ id: 'cr' + k, type: 'dialog', text: `${l.speaker} berkata: — respons yang paling tepat adalah …`, ar: l.ar, options: opts.map((t, j) => ({ id: 'abcd'[j], text: t })), key: { correct: 'abcd'[opts.indexOf(right)] }, explanation: `Respons dalam dialog: ${right} (${lines[i + 1].id})` });
    });
    const arrangeLines = lines.slice(0, Math.min(4, lines.length)).map((l) => l.ar);
    const hasDup = new Set(arrangeLines).size !== arrangeLines.length;

    return {
      html: html`<a class="btn btn-sm btn-ghost" href="#/percakapan">${ic('arrow-left')} Semua percakapan</a>
        <div class="row between mt-s"><div><div class="eyebrow">${AE.GRADES[c.grade_level]}</div><h1>${c.title}</h1><div class="ar ar-lg" lang="ar" dir="rtl" style="display:inline-block">${c.title_ar}</div></div>
          <div class="btn-row"><button class="btn btn-primary" id="cv-all">${ic('play')} Putar semua</button><label class="check"><input type="checkbox" id="cv-tr"> Sembunyikan terjemahan</label></div></div>
        <div class="dialog mt" id="cv-dialog">${lines.map((l, i) => html`<div class="bubble ${speakers.indexOf(l.speaker) % 2 ? 'right' : ''}" data-line="${i}"><div class="row between" style="flex-wrap:nowrap"><span class="who" lang="ar">${l.speaker}</span>${AE.audioBtn(l.ar, { slow: true, url: l.audio_url || '' })}</div>
          <div class="ar" lang="ar" dir="rtl">${l.ar}</div><div class="tr">${l.id}</div></div>`)}</div>
        <section class="lesson-block"><h2><span class="n">${ic('list-checks')}</span>Latihan percakapan</h2>
          <div class="tabs" role="tablist"><button class="tab" data-ct="a" aria-selected="true">Lengkapi & pilih respons</button>${!hasDup && arrangeLines.length >= 3 ? html`<button class="tab" data-ct="b" aria-selected="false">Susun dialog</button>` : ''}</div>
          <div class="card q-card" id="cv-ex"></div></section>
        ${others.length ? html`<div class="section"><h3>Percakapan lainnya</h3><div class="chips">${others.map((o) => html`<a class="chip" style="display:inline-flex;align-items:center;text-decoration:none;color:inherit" href="#/percakapan/${o.slug}">${o.title}</a>`)}</div></div>` : ''}`,
      mount(root) {
        AE.$('#cv-tr').onchange = (e) => AE.$('#cv-dialog').classList.toggle('hide-tr', e.target.checked);
        let playing = false;
        AE.$('#cv-all').onclick = () => {
          if (AE.speech.status() !== 'ok') { AE.speech.play(lines[0].ar); return; }
          playing = true; let i = 0;
          const nextLine = () => { if (!playing || i >= lines.length) return; AE.$$('.bubble').forEach((b) => (b.style.outline = '')); const b = AE.$(`[data-line="${i}"]`); if (b) b.style.outline = '2px solid var(--gold-500)'; const u = new SpeechSynthesisUtterance(lines[i].ar); u.voice = AE.speech.voice; u.lang = AE.speech.voice.lang; u.rate = 0.85; u.onend = () => { i++; setTimeout(nextLine, 350); }; speechSynthesis.speak(u); };
          speechSynthesis.cancel(); nextLine();
        };
        AE.onLeave(() => { playing = false; });
        const showA = () => AE.localPractice(qs.map((q) => ({ ...q })), { title: 'Latihan: ' + c.title, historyLabel: 'Latihan percakapan: ' + c.title, kind: 'percakapan' }).mount(AE.$('#cv-ex'));
        const showB = () => AE.localPractice([{ id: 'cs', type: 'arrange', text: 'Urutkan baris dialog berikut sesuai percakapan (ketuk dari atas ke bawah).', options: { tokens: AE.shuffleUntilDifferent(arrangeLines) }, key: { order: arrangeLines }, explanation: 'Urutan benar mengikuti dialog di atas.' }], { title: 'Susun dialog', historyLabel: 'Susun dialog: ' + c.title, kind: 'percakapan' }).mount(AE.$('#cv-ex'));
        root.querySelectorAll('[data-ct]').forEach((b) => (b.onclick = () => { root.querySelectorAll('[data-ct]').forEach((x) => x.setAttribute('aria-selected', x === b)); b.dataset.ct === 'a' ? showA() : showB(); }));
        showA();
      },
    };
  }, { nav: 'percakapan' });

  /* ---------------- KAMUS MINI ---------------- */
  route('/kamus', 'Kamus Mini', async () => {
    const vocab = await AE.data.vocab();
    const idx = vocab.map((v) => ({ v, ar: AE.normText(v.arabic), id: v.meaning.toLowerCase(), lt: (v.latin || '').toLowerCase().replace(/[’'ʿ]/g, '') }));
    const state = { q: '', cat: '', dir: 'semua' };
    const results = () => {
      const q = state.q.trim().toLowerCase();
      const qa = AE.normText(state.q);
      const isAr = /[\u0600-\u06FF]/.test(q);
      return idx.filter((x) => (!state.cat || x.v.category === state.cat) && (!q || (isAr ? x.ar.includes(qa) : (state.dir !== 'ar' && x.id.includes(q)) || (state.dir !== 'id' && x.lt.includes(q))))).slice(0, 80).map((x) => x.v);
    };
    const body = () => { const r = results(); return r.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th style="text-align:right">Arab</th><th>Arti</th><th>Jenis</th><th>Contoh</th><th></th></tr></thead><tbody>${r.map((v) => html`<tr>
        <td style="text-align:right"><span class="ar-inline" lang="ar" dir="rtl" style="font-size:1.45em">${v.arabic}</span><div class="latin">${v.latin}</div></td>
        <td><b>${v.meaning}</b><div class="tiny muted">${(AE.VOCAB_CATEGORIES.find((c) => c.id === v.category) || {}).label || v.category}</div></td>
        <td class="small">${AE.WORD_TYPES[v.word_type] || v.word_type || '–'}</td>
        <td class="small" style="min-width:220px">${v.example_ar ? html`<div class="ar-inline" lang="ar" dir="rtl" style="display:block;text-align:right">${v.example_ar}</div><div class="muted">${v.example_id}</div>` : '–'}</td>
        <td>${AE.audioBtn(v.arabic, { slow: false, url: v.audio_url })}</td></tr>`)}</tbody></table></div><p class="tiny muted mt-s">Menampilkan ${r.length} entri${r.length === 80 ? ' (maksimal 80; persempit pencarian)' : ''}.</p>` : AE.emptyView('search-x', 'Kata tidak ditemukan', 'Coba ejaan lain, atau cari dalam bahasa Indonesia.'); };
    return {
      html: html`<div class="page-head"><h1>Kamus Mini Arab–Indonesia</h1><p>Cari kata dalam huruf Arab (harakat boleh tidak ditulis), arti dalam bahasa Indonesia, atau transliterasi Latin.</p></div>
        <div class="row mb" style="align-items:stretch"><div class="search" style="flex:1 1 280px"><label class="sr-only" for="km-q">Cari kata</label>${ic('search')}<input id="km-q" class="input" placeholder="contoh: مدرسة / sekolah / madrasah" autocomplete="off" dir="auto"></div>
          <select id="km-dir" class="input" style="flex:0 1 200px" aria-label="Arah pencarian"><option value="semua">Arab & Indonesia</option><option value="id">Arti Indonesia</option><option value="ar">Transliterasi Latin</option></select>
          <select id="km-cat" class="input" style="flex:0 1 220px" aria-label="Kategori"><option value="">Semua kategori</option>${AE.VOCAB_CATEGORIES.map((c) => html`<option value="${c.id}">${c.label}</option>`)}</select></div>
        <div id="km-body">${body()}</div>`,
      mount() {
        const upd = () => (AE.$('#km-body').innerHTML = body().s);
        AE.$('#km-q').oninput = AE.debounce((e) => { state.q = e.target.value; upd(); }, 150);
        AE.$('#km-cat').onchange = (e) => { state.cat = e.target.value; upd(); };
        AE.$('#km-dir').onchange = (e) => { state.dir = e.target.value; upd(); };
        AE.$('#km-q').focus();
      },
    };
  });

  /* ---------------- TANTANGAN BERBICARA ---------------- */
  route('/berbicara', 'Tantangan Berbicara', async () => {
    const S = AE.SPEAKING;
    const canRec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    let cur = S[0];
    const view = (s) => {
      const saved = (AE.store.get().speaking || {})[s.id] || {};
      return html`<div class="card stack">
        <div class="row between"><div><div class="eyebrow">${AE.GRADES[s.grade]} · ${s.seconds} detik</div><h2>${s.title}</h2></div><span class="timer" id="sp-timer">${ic('timer')} ${AE.fmtClock(s.seconds)}</span></div>
        <div class="ar ar-xl" lang="ar" dir="rtl" style="text-align:right">${s.prompt_ar}</div>
        <p>${s.prompt}</p>
        <div><div class="label mb" style="margin-bottom:6px">Panduan kosakata</div><div class="chips" lang="ar">${s.vocab.map((v) => html`<button class="chip ar-inline" data-say="${v}" style="font-size:1.15rem">${v}</button>`)}</div></div>
        <div><div class="label" style="margin-bottom:6px">Panduan pelafalan</div><ul class="small" style="margin:0">${s.tips.map((t) => html`<li>${AE.mixText(t)}</li>`)}</ul></div>
        <div class="btn-row"><button class="btn btn-primary" id="sp-start">${ic('play')} Mulai pengatur waktu</button><button class="btn" id="sp-reset">${ic('rotate-ccw')} Atur ulang</button><button class="btn" id="sp-model">${ic('eye')} Tampilkan contoh jawaban</button></div>
        <div id="sp-modelbox" hidden><div class="stack-sm">${s.model.map((m) => html`<div class="example"><div class="ar" lang="ar" dir="rtl">${m[0]}</div><div class="tr">${m[1]}</div><div class="actions">${AE.audioBtn(m[0])}</div></div>`)}</div></div>
        <div class="card-flat"><div class="label">Rekam suaramu (opsional)</div>
          ${canRec ? html`<p class="small muted">Rekaman <b>hanya disimpan sementara di perangkat ini</b> untuk kamu dengarkan sendiri, tidak diunggah ke server, dan terhapus saat halaman ditutup. Browser akan meminta izin mikrofon saat kamu menekan “Mulai rekam”.</p>
          <div class="btn-row"><button class="btn" id="rec-start">${ic('mic')} Mulai rekam</button><button class="btn" id="rec-stop" disabled>${ic('square')} Berhenti</button><button class="btn btn-danger" id="rec-del" disabled>${ic('trash-2')} Hapus rekaman</button></div><div id="rec-out" class="mt-s"></div>`
            : html`<p class="small muted">Perekaman suara tidak didukung di browser ini. Kamu tetap bisa berlatih dengan pengatur waktu.</p>`}</div>
        <div class="card-flat"><div class="label">Rubrik penilaian mandiri</div><p class="small muted">Nilai dirimu sendiri (1 = perlu latihan, 4 = sangat baik). Aplikasi ini <b>tidak menilai pelafalan secara otomatis</b>.</p>
          <div class="stack-sm">${AE.SPEAKING_RUBRIC.map((r) => html`<div class="row between"><span class="small">${r.label}</span><div class="chips" role="group" aria-label="${r.label}">${[1, 2, 3, 4].map((n) => html`<button class="chip" data-rub="${r.id}" data-v="${n}" aria-pressed="${saved[r.id] === n}">${n}</button>`)}</div></div>`)}</div>
          <p class="small mt-s" id="rub-sum"></p></div></div>`;
    };
    return {
      html: html`<div class="page-head"><h1>Tantangan Berbicara</h1><p>Jawab pertanyaan pemantik secara lisan dalam batas waktu. Gunakan panduan kosakata dan pelafalan, bandingkan dengan contoh jawaban, lalu nilai dirimu dengan rubrik.</p></div>
        <div class="grid" style="grid-template-columns:minmax(0,260px) minmax(0,1fr);align-items:start" id="sp-grid">
          <div class="stack-sm">${S.map((s, i) => html`<button class="card-flat card-link" style="text-align:left;cursor:pointer" data-sp="${i}"><b class="small">${s.title}</b><div class="tiny muted">${AE.GRADES[s.grade]}</div></button>`)}</div>
          <div id="sp-view">${view(cur)}</div></div>
        <style>@media (max-width:760px){#sp-grid{grid-template-columns:1fr!important}}</style>`,
      mount(root) {
        let timer = null, left = 0, rec = null, chunks = [], stream = null, url = null;
        const stopAll = () => { clearInterval(timer); timer = null; try { rec && rec.state !== 'inactive' && rec.stop(); } catch (e) {} if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; };
        AE.onLeave(() => { stopAll(); if (url) URL.revokeObjectURL(url); });
        const bind = () => {
          left = cur.seconds;
          const tEl = AE.$('#sp-timer');
          const draw = () => { tEl.innerHTML = html`${ic('timer')} ${AE.fmtClock(left)}`.s; tEl.classList.toggle('low', left <= 10); };
          AE.$('#sp-start').onclick = (e) => {
            if (timer) { clearInterval(timer); timer = null; e.currentTarget.innerHTML = html`${ic('play')} Lanjutkan`.s; return; }
            if (left <= 0) left = cur.seconds;
            e.currentTarget.innerHTML = html`${ic('pause')} Jeda`.s;
            timer = setInterval(() => { left--; draw(); if (left <= 0) { clearInterval(timer); timer = null; AE.$('#sp-start').innerHTML = html`${ic('play')} Mulai lagi`.s; AE.toast('Waktu habis! Bandingkan dengan contoh jawaban.', 'info'); } }, 1000);
          };
          AE.$('#sp-reset').onclick = () => { clearInterval(timer); timer = null; left = cur.seconds; draw(); AE.$('#sp-start').innerHTML = html`${ic('play')} Mulai pengatur waktu`.s; };
          AE.$('#sp-model').onclick = (e) => { const b = AE.$('#sp-modelbox'); b.hidden = !b.hidden; e.currentTarget.innerHTML = html`${ic(b.hidden ? 'eye' : 'eye-off')} ${b.hidden ? 'Tampilkan' : 'Sembunyikan'} contoh jawaban`.s; };
          const sum = () => { const sv = (AE.store.get().speaking || {})[cur.id] || {}; const vals = AE.SPEAKING_RUBRIC.map((r) => sv[r.id]).filter(Boolean); AE.$('#rub-sum').textContent = vals.length === AE.SPEAKING_RUBRIC.length ? `Skor mandiri: ${vals.reduce((a, b) => a + b, 0)} / ${AE.SPEAKING_RUBRIC.length * 4} (tersimpan di perangkat ini).` : 'Lengkapi semua aspek rubrik.'; };
          root.querySelectorAll('[data-rub]').forEach((b) => (b.onclick = () => { AE.store.set((s) => { s.speaking = s.speaking || {}; s.speaking[cur.id] = { ...(s.speaking[cur.id] || {}), [b.dataset.rub]: +b.dataset.v }; }); root.querySelectorAll(`[data-rub="${b.dataset.rub}"]`).forEach((x) => x.setAttribute('aria-pressed', x === b)); sum(); }));
          sum();
          if (!canRec) return;
          const out = AE.$('#rec-out');
          AE.$('#rec-start').onclick = async () => {
            try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
            catch (e) { AE.toast('Izin mikrofon ditolak atau mikrofon tidak tersedia.', 'err'); return; }
            chunks = []; rec = new MediaRecorder(stream);
            rec.ondataavailable = (ev) => ev.data.size && chunks.push(ev.data);
            rec.onstop = () => { if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })); out.innerHTML = html`<audio controls src="${url}" style="width:100%"></audio>`.s; AE.$('#rec-del').disabled = false; if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; };
            rec.start(); AE.$('#rec-start').disabled = true; AE.$('#rec-stop').disabled = false;
            out.innerHTML = html`<span class="badge red">${ic('circle')} Sedang merekam…</span>`.s;
          };
          AE.$('#rec-stop').onclick = () => { if (rec && rec.state !== 'inactive') rec.stop(); AE.$('#rec-start').disabled = false; AE.$('#rec-stop').disabled = true; };
          AE.$('#rec-del').onclick = () => { if (url) URL.revokeObjectURL(url); url = null; chunks = []; out.innerHTML = ''; AE.$('#rec-del').disabled = true; AE.toast('Rekaman dihapus.'); };
        };
        root.querySelectorAll('[data-sp]').forEach((b) => (b.onclick = () => { stopAll(); cur = S[+b.dataset.sp]; AE.$('#sp-view').innerHTML = view(cur).s; bind(); }));
        bind();
      },
    };
  });

  /* ---------------- PROGRES BELAJAR ---------------- */
  route('/progres', 'Progres Belajar', async () => {
    const [lessons, vocab] = await Promise.all([AE.data.lessons(), AE.data.vocab()]);
    const s = AE.store.get();
    const done = lessons.filter((l) => s.lessons[l.slug] === 'selesai');
    const doing = lessons.filter((l) => s.lessons[l.slug] === 'sedang');
    const rest = lessons.filter((l) => !s.lessons[l.slug]);
    const learnedV = vocab.filter((v) => s.vocab[v.id]).length;
    const recommend = doing[0] || rest[0];
    const hist = s.history || [];
    const li = (l) => html`<a class="card-flat card-link row" href="#/materi/${l.slug}" style="padding:10px 14px;flex-wrap:nowrap"><b class="small" style="flex:1">${l.title}</b><span class="ar-inline" lang="ar" dir="rtl">${l.title_ar}</span></a>`;
    return {
      html: html`<div class="page-head"><h1>Progres Belajar</h1><p>Progres ini tersimpan <b>hanya di browser perangkat ini</b> dan tidak otomatis tersinkron ke perangkat lain. Nilai resmi dan papan peringkat tetap bersumber dari database sekolah.</p></div>
        <div class="grid grid-4 mb">${[[done.length + ' / ' + lessons.length, 'Materi selesai'], [doing.length, 'Sedang dipelajari'], [learnedV + ' / ' + vocab.length, 'Kosakata ditandai'], [hist.length, 'Riwayat latihan']].map(([n, l]) => html`<div class="card-flat"><div class="stat-num">${n}</div><div class="small muted">${l}</div></div>`)}</div>
        ${recommend ? html`<div class="card row between mb"><div class="row" style="flex-wrap:nowrap"><span class="icon-tile gold">${ic('sparkles')}</span><div><div class="eyebrow" style="margin:0">Rekomendasi berikutnya</div><b>${recommend.title}</b> <span class="ar-inline" lang="ar" dir="rtl">${recommend.title_ar}</span></div></div><a class="btn btn-primary" href="#/materi/${recommend.slug}">Lanjutkan ${ic('arrow-right')}</a></div>` : AE.notice('', 'trophy', html`<p>Semua materi sudah selesai. Luar biasa!</p>`)}
        <div class="grid grid-3">
          <div class="stack-sm"><h3>Sedang dipelajari</h3>${doing.length ? doing.map(li) : html`<p class="small muted">Belum ada.</p>`}</div>
          <div class="stack-sm"><h3>Selesai</h3>${done.length ? done.map(li) : html`<p class="small muted">Belum ada materi yang ditandai selesai.</p>`}</div>
          <div class="stack-sm"><h3>Belum dipelajari</h3>${rest.slice(0, 8).map(li)}${rest.length > 8 ? html`<a class="small" href="#/peta">+${rest.length - 8} materi lain di Peta Pembelajaran</a>` : ''}</div></div>
        <div class="section"><div class="section-head"><h2>Riwayat latihan</h2>${hist.length ? html`<button class="btn btn-sm btn-danger" id="pg-reset">${ic('trash-2')} Hapus progres lokal</button>` : ''}</div>
          ${hist.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th>Waktu</th><th>Aktivitas</th><th class="num">Skor</th><th>Keterangan</th></tr></thead><tbody>${hist.map((h) => html`<tr><td class="small">${AE.fmtDate(h.at)}</td><td>${h.label}</td><td class="num"><b>${AE.fmtNum(h.score, 1)}</b></td><td class="small">${h.official ? html`<span class="badge">${ic('server')} Dinilai server</span>` : html`<span class="badge gray">Latihan mandiri</span>`}</td></tr>`)}</tbody></table></div>`
            : AE.emptyView('history', 'Belum ada hasil latihan', 'Kerjakan latihan materi, permainan, atau latihan soal untuk melihat riwayat di sini.')}</div>`,
      mount() {
        const b = AE.$('#pg-reset');
        if (b) b.onclick = async () => { if (await AE.confirm('Hapus progres lokal?', 'Status materi, kosakata yang ditandai, dan riwayat latihan di perangkat ini akan dihapus. Nilai yang sudah tersimpan di database tidak terpengaruh.', { okLabel: 'Hapus', danger: true })) { AE.store.reset(); AE.toast('Progres lokal dihapus.'); AE.render(); } };
      },
    };
  });

  /* ---------------- TENTANG & PRIVASI ---------------- */
  route('/tentang', 'Tentang ARABIYA EDU', async () => html`<div class="page-head"><div class="eyebrow">Tentang</div><h1>ARABIYA EDU — Laboratorium Bahasa Arab Digital</h1>
      <p>Media pembelajaran Bahasa Arab untuk siswa SMA GUPPI Samata, di bawah Yayasan Pendidikan Pesantren Modern Cendekia Puruhita GUPPI Samata, Gowa.</p></div>
    <div class="grid grid-2">
      <div class="card"><h3>Tujuan</h3><ul class="small">
        <li>Membantu siswa mempelajari Bahasa Arab secara mandiri.</li><li>Menyediakan materi yang mudah dipahami.</li><li>Melatih keterampilan menyimak, berbicara, membaca, dan menulis.</li>
        <li>Menyediakan kosakata bergambar dan materi tata bahasa.</li><li>Menyediakan latihan, permainan, kuis, dan ujian interaktif dengan penilaian otomatis.</li>
        <li>Menyimpan nilai secara online dan menampilkan papan peringkat real-time.</li><li>Memudahkan guru mengelola materi dan memantau hasil.</li></ul></div>
      <div class="card"><h3>Status & catatan penting</h3>
        ${AE.notice('warn', 'info', html`<p>ARABIYA EDU <b>bukan aplikasi resmi sekolah</b> sampai ada persetujuan resmi dari pihak sekolah/yayasan.</p>`)}
        <ul class="small mt-s"><li>Materi bawaan adalah contoh awal dan <b>belum diverifikasi sebagai kurikulum resmi</b>. Guru dapat menyesuaikannya dengan buku ajar, ATP, dan CP.</li>
          <li>Suara otomatis (text-to-speech) berasal dari perangkat dan tidak selalu seakurat penutur asli.</li>
          <li>Tanpa akun siswa, sistem tidak dapat menjamin satu orang hanya mengikuti ujian satu kali. Untuk ujian resmi, guru dapat memakai <b>kode peserta</b>.</li>
          <li>Ikon ilustrasi: Lucide (lisensi ISC). Font: Plus Jakarta Sans & Noto Naskh Arabic (SIL Open Font License).</li></ul></div></div>
    <div class="btn-row mt"><a class="btn" href="#/privasi">${ic('shield')} Kebijakan privasi</a></div>`);

  route('/privasi', 'Kebijakan Privasi', async () => html`<div class="page-head"><h1>Kebijakan Privasi</h1><p>Penjelasan singkat tentang data yang dikumpulkan ARABIYA EDU.</p></div>
    <div class="card stack" style="max-width:820px">
      <div><h3>Data yang dikumpulkan</h3><p class="small">Saat mengirim latihan soal/ujian: <b>nama tampilan</b> (boleh nama panggilan), <b>kelas</b>, kode sesi/kode peserta jika diwajibkan guru, jawaban, nilai, dan waktu pengerjaan. Kami <b>tidak meminta</b> NIK, alamat, nomor telepon, kata sandi pribadi, atau data keluarga.</p></div>
      <div><h3>Tujuan penggunaan</h3><p class="small">Menilai jawaban, menampilkan hasil kepada siswa, menyusun papan peringkat (jika disetujui), dan membantu guru memantau pembelajaran.</p></div>
      <div><h3>Informasi yang ditampilkan publik</h3><p class="small">Hanya jika kamu mencentang persetujuan: nama tampilan, kelas, nama latihan, nilai, durasi, dan waktu pengiriman di papan peringkat. Jawaban, kunci jawaban, dan data sesi tidak pernah ditampilkan publik.</p></div>
      <div><h3>Penyimpanan di perangkat</h3><p class="small">Progres belajar (status materi, kosakata ditandai, riwayat latihan mandiri) disimpan di penyimpanan lokal browser dan dapat dihapus kapan saja dari halaman Progres. Rekaman suara pada Tantangan Berbicara tidak diunggah dan hilang saat halaman ditutup. Tidak ada pelacakan iklan atau fingerprinting perangkat.</p></div>
      <div><h3>Akses data</h3><p class="small">Hasil lengkap hanya dapat diakses guru yang berwenang melalui Panel Guru yang dilindungi login. Data disimpan di layanan Supabase yang dikelola pengelola website.</p></div>
      <div><h3>Koreksi & penghapusan</h3><p class="small">Jika nama tampilan keliru atau kamu ingin hasilmu disembunyikan/dihapus dari papan peringkat, hubungi guru Bahasa Arab atau pengelola website di SMA GUPPI Samata.</p></div>
    </div>`, { nav: 'tentang' });
})();
