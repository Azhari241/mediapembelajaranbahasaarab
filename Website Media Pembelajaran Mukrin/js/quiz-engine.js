/* ARABIYA EDU — mesin soal: tampilan & interaksi semua jenis soal.
   Format jawaban sama dengan yang dinilai server (supabase/schema.sql → _grade_question):
   - mcq/choose_meaning/reading/listening/dialog : "a" (id opsi)
   - true_false : true/false
   - fill_blank : "teks"
   - arrange    : ["token", ...]
   - matching   : { l1: "r2", ... }
   - essay      : "teks" (dinilai guru) */
(function () {
  const AE = window.AE;
  const { html, ic, esc } = AE;
  const CHOICE = ['mcq', 'choose_meaning', 'reading', 'listening', 'dialog'];
  const hasArabic = (s) => /[\u0600-\u06FF]/.test(String(s || ''));
  const txt = (s) => (hasArabic(s) ? html`<span class="ar-inline" lang="ar" dir="rtl">${s}</span>` : html`<span>${s}</span>`);
  AE.txt = txt;

  AE.TYPE_LABEL = {
    mcq: 'Pilihan ganda', true_false: 'Benar / salah', matching: 'Menjodohkan', fill_blank: 'Isian',
    arrange: 'Menyusun kata', choose_meaning: 'Memilih arti', reading: 'Memahami teks', listening: 'Menyimak audio',
    dialog: 'Pertanyaan dialog', essay: 'Uraian (dinilai guru)',
  };

  /* Penilaian lokal — HANYA untuk latihan mandiri/permainan (tidak masuk peringkat). */
  AE.gradeLocal = (type, key, ans) => {
    if (type === 'essay') return null;
    if (ans == null) return false;
    if (CHOICE.includes(type)) return typeof ans === 'string' && ans === key.correct;
    if (type === 'true_false') return typeof ans === 'boolean' && ans === !!key.correct;
    if (type === 'fill_blank') { const a = AE.normText(ans); return !!a && (key.accepted || []).some((x) => AE.normText(x) === a); }
    if (type === 'arrange') return Array.isArray(ans) && JSON.stringify(ans) === JSON.stringify(key.order);
    if (type === 'matching') { const k = key.pairs || {}; const ks = Object.keys(k); return typeof ans === 'object' && Object.keys(ans).length === ks.length && ks.every((x) => ans[x] === k[x]); }
    return false;
  };
  AE.isAnswered = (q, a) => {
    if (a == null) return false;
    if (q.type === 'arrange') return Array.isArray(a) && a.length === ((q.options && q.options.tokens) || []).length;
    if (q.type === 'matching') return Object.keys(a).length === ((q.options && q.options.left) || []).length;
    if (typeof a === 'string') return a.trim() !== '';
    return true;
  };

  /* Ubah latihan materi (format ringkas) → format mesin. */
  AE.fromExercise = (ex, i, prefix = 'x') => {
    const id = prefix + '-' + i;
    if (ex.type === 'mcq') return { id, type: 'mcq', text: ex.q, ar: ex.ar, options: ex.options.map((t, j) => ({ id: 'abcde'[j], text: t })), key: { correct: 'abcde'[ex.answer] }, explanation: ex.explain };
    if (ex.type === 'tf') return { id, type: 'true_false', text: ex.q, ar: ex.ar, options: [], key: { correct: ex.answer }, explanation: ex.explain };
    if (ex.type === 'fill') return { id, type: 'fill_blank', text: ex.q, ar: ex.ar, options: [], key: { accepted: ex.answer }, explanation: ex.explain };
    if (ex.type === 'arrange') return { id, type: 'arrange', text: ex.q, ar: '', options: { tokens: AE.shuffleUntilDifferent(ex.tokens) }, key: { order: ex.tokens }, explanation: ex.explain };
    return null;
  };
  AE.shuffleUntilDifferent = (arr) => { if (arr.length < 2) return arr.slice(); let s; let n = 0; do { s = AE.shuffle(arr); n++; } while (n < 10 && s.join('|') === arr.join('|')); return s; };

  /* Tampilkan kunci jawaban yang mudah dibaca */
  AE.keyText = (q, key) => {
    if (!key) return '';
    if (CHOICE.includes(q.type)) { const o = (q.options || []).find((x) => x.id === key.correct); return o ? o.text : key.correct; }
    if (q.type === 'true_false') return key.correct ? 'Benar' : 'Salah';
    if (q.type === 'fill_blank') return (key.accepted || [])[0] || '';
    if (q.type === 'arrange') return (key.order || []).join(' ');
    if (q.type === 'matching') { const L = (q.options && q.options.left) || []; const R = (q.options && q.options.right) || []; return Object.entries(key.pairs || {}).map(([l, r]) => `${(L.find((x) => x.id === l) || {}).text} = ${(R.find((x) => x.id === r) || {}).text}`).join(' · '); }
    return '';
  };

  /**
   * Pasang satu soal ke elemen.
   * opts: { answer, onChange(answer), reveal: {correct:boolean|null, key} | null, number, total, showType }
   */
  AE.mountQuestion = (el, q, opts = {}) => {
    let answer = opts.answer !== undefined ? clone(opts.answer) : (q.type === 'matching' ? {} : q.type === 'arrange' ? [] : null);
    let activeLeft = null;
    const locked = () => !!opts.reveal;
    const set = (a) => { answer = a; if (opts.onChange) opts.onChange(clone(answer)); draw(); };

    function body() {
      const R = opts.reveal;
      const t = q.type;
      if (CHOICE.includes(t)) {
        return html`<div class="opts" role="group" aria-label="Pilihan jawaban">${(q.options || []).map((o, i) => {
          let cls = answer === o.id ? 'selected' : '';
          let mark = '';
          if (R && R.key) {
            if (o.id === R.key.correct) { cls = 'correct'; mark = html`<span class="mark">${ic('check')} Jawaban benar</span>`; }
            else if (answer === o.id) { cls = 'wrong'; mark = html`<span class="mark">${ic('x')} Pilihanmu</span>`; }
          }
          return html`<button type="button" class="opt ${cls}" data-opt="${o.id}" aria-pressed="${answer === o.id}" ${R ? 'disabled' : ''}><span class="key">${'ABCDE'[i]}</span>${txt(o.text)}${mark}</button>`;
        })}</div>`;
      }
      if (t === 'true_false') {
        return html`<div class="opts" style="grid-template-columns:1fr 1fr">${[[true, 'Benar', 'check'], [false, 'Salah', 'x']].map(([v, label, icon]) => {
          let cls = answer === v ? 'selected' : '';
          let mark = '';
          if (R && R.key) { if (!!R.key.correct === v) { cls = 'correct'; mark = html`<span class="mark">${ic('check')} Benar</span>`; } else if (answer === v) { cls = 'wrong'; mark = html`<span class="mark">${ic('x')}</span>`; } }
          return html`<button type="button" class="opt ${cls}" data-tf="${v}" aria-pressed="${answer === v}" ${R ? 'disabled' : ''}><span class="key">${ic(icon)}</span>${label}${mark}</button>`;
        })}</div>`;
      }
      if (t === 'fill_blank' || t === 'essay') {
        const id = 'fb-' + esc(q.id);
        const isEssay = t === 'essay';
        return html`<div class="field mt-s"><label for="${id}">${isEssay ? 'Jawaban uraian' : 'Jawabanmu'}</label>
          ${isEssay ? html`<textarea id="${id}" class="input" data-fill maxlength="2000" dir="auto" ${R ? 'disabled' : ''}>${answer || ''}</textarea>`
            : html`<input id="${id}" class="input ar" data-fill maxlength="200" dir="rtl" lang="ar" autocomplete="off" autocapitalize="off" spellcheck="false" value="${answer || ''}" ${R ? 'disabled' : ''}>`}
          <span class="hint">${isEssay ? 'Soal ini dinilai manual oleh guru.' : 'Ketik dengan huruf Arab. Harakat boleh tidak ditulis.'}</span></div>`;
      }
      if (t === 'arrange') {
        const tokens = (q.options && q.options.tokens) || [];
        const used = {};
        (answer || []).forEach((tk) => (used[tk] = (used[tk] || 0) + 1));
        const seen = {};
        return html`<p class="small muted mt-s">Ketuk kata secara berurutan dari kanan ke kiri. Ketuk kata di kotak jawaban untuk membatalkan.</p>
          <div class="answer-line tokens" aria-label="Susunan jawaban" lang="ar">${(answer || []).length ? answer.map((tk, i) => html`<button type="button" class="token" data-unpick="${i}" ${R ? 'disabled' : ''}>${tk}</button>`) : html`<span class="small muted" dir="ltr" style="padding:10px">Kotak jawaban masih kosong</span>`}</div>
          <div class="tokens mt-s" lang="ar">${tokens.map((tk, i) => { seen[tk] = (seen[tk] || 0) + 1; const dis = seen[tk] <= (used[tk] || 0); return html`<button type="button" class="token" data-pick="${i}" ${dis || R ? 'disabled' : ''}>${tk}</button>`; })}</div>`;
      }
      if (t === 'matching') {
        const L = (q.options && q.options.left) || [];
        const Rt = (q.options && q.options.right) || [];
        const pairNo = {}; Object.keys(answer || {}).forEach((l, i) => (pairNo[l] = i + 1));
        const rightNo = {}; Object.entries(answer || {}).forEach(([l, r]) => (rightNo[r] = pairNo[l]));
        return html`<p class="small muted mt-s">Pilih satu item di kiri, lalu pasangannya di kanan. Ketuk lagi untuk melepas pasangan.</p>
          <div class="match-grid"><div class="match-col">${L.map((o) => html`<button type="button" class="match-item ${activeLeft === o.id ? 'active' : ''} ${pairNo[o.id] ? 'paired' : ''}" data-left="${o.id}" ${R ? 'disabled' : ''}>${txt(o.text)}${pairNo[o.id] ? html`<span class="pair-no">${pairNo[o.id]}</span>` : ''}</button>`)}</div>
          <div class="match-col">${Rt.map((o) => html`<button type="button" class="match-item ${rightNo[o.id] ? 'paired' : ''}" data-right="${o.id}" ${R ? 'disabled' : ''}>${txt(o.text)}${rightNo[o.id] ? html`<span class="pair-no">${rightNo[o.id]}</span>` : ''}</button>`)}</div></div>`;
      }
      return html`<p class="muted">Jenis soal tidak dikenal.</p>`;
    }

    function draw() {
      const R = opts.reveal;
      el.innerHTML = html`<div class="q-head"><span class="badge gray">${opts.number ? `Soal ${opts.number}${opts.total ? ' dari ' + opts.total : ''}` : ''}${opts.showType !== false ? ' · ' + (AE.TYPE_LABEL[q.type] || '') : ''}</span>
          ${q.points != null && opts.showPoints ? html`<span class="badge gold">${AE.fmtNum(q.points, 2)} poin</span>` : ''}</div>
        <div class="q-text">${q.text}</div>
        ${q.passage ? html`<div class="passage mt-s"><div class="ar" lang="ar" dir="rtl" style="white-space:pre-line">${q.passage}</div></div>` : ''}
        ${q.audio_text ? html`<div class="row mt-s"><button type="button" class="btn btn-gold" data-say="${q.audio_text}" data-rate="0.85">${ic('volume-2')} Putar audio</button><button type="button" class="btn" data-say="${q.audio_text}" data-rate="0.6">${ic('snail')} Perlahan</button>
          <details class="small"><summary class="muted" style="cursor:pointer">Audio tidak terdengar?</summary><p class="mt-s">Jika perangkat tidak memiliki suara Bahasa Arab, mintalah guru membacakan, atau buka teks: <span class="ar-inline" lang="ar" dir="rtl">${q.audio_text}</span></p></details></div>` : ''}
        ${q.picture && AE.vocabImg ? html`<div style="max-width:260px;margin:12px auto 0">${AE.vocabImg(q.picture)}</div>` : ''}
        ${q.ar ? html`<div class="ar ar-lg q-ar" lang="ar" dir="rtl">${q.ar}</div>` : ''}
        ${body()}
        ${R ? (R.correct == null ? html`<div class="feedback ok">${ic('clock')}<div><b>Menunggu penilaian guru.</b>${q.explanation || R.explanation ? html` ${R.explanation || q.explanation}` : ''}</div></div>`
          : html`<div class="feedback ${R.correct ? 'ok' : 'no'}" role="status">${ic(R.correct ? 'circle-check' : 'circle-x')}<div><b>${R.correct ? 'Benar!' : 'Belum tepat.'}</b>
            ${!R.correct && R.key && q.type !== 'mcq' && !CHOICE.includes(q.type) && q.type !== 'true_false' ? html` Jawaban: ${txt(AE.keyText(q, R.key))}.` : ''}
            ${R.explanation || q.explanation ? html`<div>${R.explanation || q.explanation}</div>` : ''}</div></div>`) : ''}`.s;
    }

    el.addEventListener('click', (e) => {
      if (locked()) return;
      const b = e.target.closest('button');
      if (!b || !el.contains(b)) return;
      if (b.dataset.opt) set(b.dataset.opt);
      else if (b.dataset.tf) set(b.dataset.tf === 'true');
      else if (b.dataset.pick != null) { const tk = q.options.tokens[+b.dataset.pick]; set([...(answer || []), tk]); }
      else if (b.dataset.unpick != null) { const a = (answer || []).slice(); a.splice(+b.dataset.unpick, 1); set(a); }
      else if (b.dataset.left) {
        if (answer[b.dataset.left]) { const a = { ...answer }; delete a[b.dataset.left]; activeLeft = null; set(a); }
        else { activeLeft = activeLeft === b.dataset.left ? null : b.dataset.left; draw(); }
      } else if (b.dataset.right) {
        const r = b.dataset.right;
        const owner = Object.keys(answer).find((l) => answer[l] === r);
        if (!activeLeft) { if (owner) { const a = { ...answer }; delete a[owner]; set(a); } else AE.toast('Pilih dulu item di kolom kiri.', 'info', 2200); return; }
        const a = { ...answer };
        if (owner) delete a[owner];
        a[activeLeft] = r; activeLeft = null; set(a);
      }
    });
    el.addEventListener('input', (e) => {
      if (e.target.matches('[data-fill]')) { answer = e.target.value; if (opts.onChange) opts.onChange(answer); }
    });
    draw();
    return {
      getAnswer: () => clone(answer),
      reveal(r) { opts.reveal = r; draw(); },
      focus() { const f = el.querySelector('input,textarea,button'); if (f) f.focus(); },
    };
  };
  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

  /**
   * Latihan lokal satu-per-satu dengan umpan balik langsung.
   * Mengembalikan HTML + mount. Hasil hanya disimpan sebagai progres lokal.
   */
  AE.localPractice = (questions, { title = 'Latihan', onFinish, historyLabel, kind = 'latihan-materi' } = {}) => {
    const state = { i: 0, correct: 0, answers: {}, results: [] };
    let q = null, ctl = null, root = null;
    function step() {
      if (state.i >= questions.length) return finish();
      q = questions[state.i];
      root.innerHTML = html`<div class="row between mb"><span class="small muted">${title}</span><span class="badge">${state.correct} benar</span></div>
        <div class="progress mb"><span style="width:${(state.i / questions.length) * 100}%"></span></div>
        <div class="q-slot"></div>
        <div class="btn-row mt"><button type="button" class="btn btn-primary" data-check>${ic('check')} Periksa jawaban</button></div>`.s;
      ctl = AE.mountQuestion(root.querySelector('.q-slot'), q, { number: state.i + 1, total: questions.length, onChange: () => {} });
      root.querySelector('[data-check]').onclick = check;
    }
    function check() {
      const a = ctl.getAnswer();
      if (!AE.isAnswered(q, a)) { AE.toast('Jawab soal terlebih dahulu.', 'info', 2200); return; }
      const ok = AE.gradeLocal(q.type, q.key, a);
      if (ok) state.correct++;
      state.results.push({ q, a, ok });
      ctl.reveal({ correct: ok, key: q.key });
      const row = root.querySelector('.btn-row');
      row.innerHTML = html`<button type="button" class="btn btn-primary" data-next>${state.i + 1 < questions.length ? html`Soal berikutnya ${ic('arrow-right')}` : html`Lihat hasil ${ic('flag')}`}</button>`.s;
      row.querySelector('[data-next]').onclick = () => { state.i++; step(); };
      row.querySelector('[data-next]').focus();
    }
    function finish() {
      const pct = questions.length ? Math.round((state.correct / questions.length) * 100) : 0;
      if (historyLabel) AE.store.addHistory({ kind, label: historyLabel, score: pct, correct: state.correct, total: questions.length });
      root.innerHTML = html`<div class="stack" style="align-items:center;text-align:center">
        <div class="score-ring" style="--p:${pct}"><div><div><b>${pct}</b><span class="small muted">dari 100</span></div></div></div>
        <div><h3>${state.correct} dari ${questions.length} jawaban benar</h3><p class="small muted">Hasil latihan mandiri disimpan sebagai progres lokal di perangkat ini, bukan nilai resmi.</p></div>
        <div class="btn-row" style="justify-content:center"><button type="button" class="btn btn-primary" data-again>${ic('rotate-ccw')} Ulangi latihan</button></div></div>`.s;
      root.querySelector('[data-again]').onclick = () => { state.i = 0; state.correct = 0; state.results = []; questions.forEach((x) => x.type === 'arrange' && (x.options.tokens = AE.shuffleUntilDifferent(x.key.order))); step(); };
      if (onFinish) onFinish(pct, state);
    }
    return { mount(el) { root = el; if (!questions.length) { root.innerHTML = AE.emptyView('list-checks', 'Belum ada soal latihan', 'Guru belum menambahkan latihan untuk materi ini.').s; return; } step(); } };
  };
})();
