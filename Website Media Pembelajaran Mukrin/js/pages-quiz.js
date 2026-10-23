/* ARABIYA EDU — Latihan Soal & Ujian Akhir (dinilai di server) + Papan Peringkat real-time */
(function () {
  const AE = window.AE;
  const { html, ic, route } = AE;
  const RUN = 'arabiya.run.v1';      // sesi aktif (token sesi milik peserta + jawaban sementara)
  const IDENT = 'arabiya.ident.v1';  // preferensi nama & kelas terakhir

  const getRun = () => { try { return JSON.parse(localStorage.getItem(RUN) || 'null'); } catch (e) { return null; } };
  const setRun = (r) => { try { r ? localStorage.setItem(RUN, JSON.stringify(r)) : localStorage.removeItem(RUN); } catch (e) {} };

  const notConfigured = () => html`${AE.emptyView('database', 'Latihan online belum tersedia', 'Pengelola website belum menghubungkan database. Sementara itu, kamu tetap bisa berlatih lewat latihan di setiap materi dan permainan.', html`<div class="btn-row" style="justify-content:center"><a class="btn btn-primary" href="#/materi">Buka materi</a><a class="btn" href="#/permainan">Permainan</a></div>`)}`;

  const quizList = async (kind) => {
    if (!AE.dbReady()) return notConfigured();
    let qs;
    try { qs = (await AE.data.quizzes()) || []; } catch (e) { return AE.emptyView('wifi-off', 'Daftar latihan gagal dimuat', AE.errMsg(e), html`<button class="btn" data-action="reload">Coba lagi</button>`); }
    const list = qs.filter((q) => q.kind === kind);
    const run = getRun();
    const now = Date.now();
    const card = (q) => {
      const closed = q.closes_at && new Date(q.closes_at) < now, notOpen = q.opens_at && new Date(q.opens_at) > now;
      return html`<div class="card-flat stack-sm"><div class="row between" style="flex-wrap:nowrap"><span class="icon-tile ${kind === 'ujian' ? 'gold' : ''}">${ic(kind === 'ujian' ? 'file-check-2' : 'list-checks')}</span><span class="badge gray">${AE.GRADES[q.grade_level]}</span></div>
        <h3 style="margin:0">${q.title}</h3>${q.description ? html`<p class="small muted" style="margin:0">${q.description}</p>` : ''}
        <div class="row small muted" style="gap:14px"><span>${ic('list-ordered')} ${q.question_count} soal</span><span>${ic('timer')} ${q.duration_seconds ? Math.round(q.duration_seconds / 60) + ' menit' : 'Tanpa batas waktu'}</span><span>${ic('target')} KKM ${AE.fmtNum(q.passing_score)}</span></div>
        <div class="row" style="gap:6px">${q.require_session_code ? html`<span class="badge gold">${ic('key-round')} Kode sesi</span>` : ''}${q.require_participant_code ? html`<span class="badge gold">${ic('id-card')} Kode peserta</span>` : ''}${q.max_attempts ? html`<span class="badge gray">Maks. ${q.max_attempts}× percobaan</span>` : ''}${q.has_manual ? html`<span class="badge gray">Ada soal uraian</span>` : ''}</div>
        ${closed ? html`<span class="badge red">Ditutup</span>` : notOpen ? html`<span class="badge gray">Dibuka ${AE.fmtDate(q.opens_at)}</span>` : q.question_count ? html`<a class="btn btn-primary" href="#/kerjakan/${q.id}">${run && run.quiz.id === q.id ? html`${ic('play')} Lanjutkan pengerjaan` : html`${ic('play')} Mulai`}</a>` : html`<span class="badge gray">Belum ada soal</span>`}</div>`;
    };
    return html`${run && !list.some((q) => q.id === run.quiz.id) && run.quiz.kind === kind ? html`<div class="mb">${AE.notice('warn', 'history', html`<p>Ada pengerjaan yang belum dikirim: <b>${run.quiz.title}</b>. <a href="#/kerjakan/${run.quiz.id}">Buka kembali</a></p>`)}</div>` : ''}
      ${list.length ? html`<div class="grid grid-3">${list.map(card)}</div>` : AE.emptyView(kind === 'ujian' ? 'file-check-2' : 'list-checks', kind === 'ujian' ? 'Belum ada ujian yang diterbitkan' : 'Belum ada latihan yang diterbitkan', 'Guru akan menerbitkannya melalui Panel Guru.')}`;
  };

  route('/latihan', 'Latihan Soal', async () => html`<div class="page-head"><h1>Latihan Soal</h1><p>Latihan berbagai jenis soal: pilihan ganda, benar/salah, menjodohkan, isian, menyusun kata, memilih arti, memahami teks, menyimak audio, dan dialog. <b>Nilai dihitung di server</b>, bukan di browser.</p></div>${await quizList('latihan')}`);
  route('/ujian', 'Ujian Akhir', async () => html`<div class="page-head"><h1>Ujian Akhir</h1><p>Ujian berwaktu yang diatur guru. Pastikan koneksi internet stabil. Jawaban sementara tersimpan di perangkat sehingga tidak hilang jika halaman dimuat ulang.</p></div>
    <div class="mb">${AE.notice('warn', 'shield-alert', html`<p>Tanpa akun siswa, sistem <b>tidak dapat menjamin</b> satu orang hanya mengikuti ujian satu kali. Untuk ujian resmi, guru dapat mewajibkan <b>kode peserta</b> yang dibagikan per siswa.</p>`)}</div>${await quizList('ujian')}`);

  /* ---------------- RUNNER ---------------- */
  route('/kerjakan/:id', 'Mengerjakan', async ({ id }) => {
    if (!AE.dbReady()) return notConfigured();
    let run = getRun();
    if (run && run.quiz.id !== id) {
      return html`<div class="card stack" style="max-width:640px">${AE.notice('warn', 'history', html`<p>Kamu masih memiliki pengerjaan <b>${run.quiz.title}</b> yang belum dikirim.</p>`)}
        <div class="btn-row"><a class="btn btn-primary" href="#/kerjakan/${run.quiz.id}">Lanjutkan pengerjaan itu</a><button class="btn btn-danger" data-action="abandon" data-qid="${run.quiz.id}">Tinggalkan pengerjaan itu</button></div></div>`;
    }
    if (run) return { html: html`<div id="runner"></div>`, mount: () => runner(AE.$('#runner'), run) };

    const quizzes = (await AE.data.quizzes()) || [];
    const q = quizzes.find((x) => x.id === id);
    if (!q) return AE.emptyView('list-checks', 'Latihan tidak tersedia', 'Latihan ini tidak ditemukan, belum diterbitkan, atau sedang dinonaktifkan.', html`<a class="btn" href="#/latihan">Kembali</a>`);
    let classes = [];
    try { classes = await AE.data.classes(); } catch (e) {}
    const ident = (() => { try { return JSON.parse(localStorage.getItem(IDENT) || '{}'); } catch (e) { return {}; } })();
    AE.$('.topbar-title').textContent = q.title;
    return {
      html: html`<div class="card" style="max-width:680px"><div class="eyebrow">${q.kind === 'ujian' ? 'Ujian akhir' : 'Latihan soal'} · ${AE.GRADES[q.grade_level]}</div><h1>${q.title}</h1>
        <div class="row small muted mb" style="gap:14px"><span>${q.question_count} soal</span><span>${q.duration_seconds ? Math.round(q.duration_seconds / 60) + ' menit' : 'Tanpa batas waktu'}</span><span>KKM ${AE.fmtNum(q.passing_score)} dari ${AE.fmtNum(q.max_score)}</span></div>
        ${classes.length ? '' : AE.notice('warn', 'triangle-alert', html`<p>Daftar kelas belum diisi guru. Hubungi guru sebelum mengerjakan.</p>`)}
        <form class="stack mt" id="start-form" novalidate>
          <div class="field"><label for="sf-name">Nama tampilan</label><input id="sf-name" class="input" maxlength="40" required autocomplete="nickname" value="${ident.name || ''}"><span class="hint">Boleh nama panggilan. Jangan menulis nomor telepon, NIK, atau alamat.</span><span class="err-text" id="sf-name-err" role="alert"></span></div>
          <div class="field"><label for="sf-class">Kelas</label><select id="sf-class" class="input" required><option value="">Pilih kelas…</option>${classes.map((c) => html`<option value="${c.id}" ${ident.classId === c.id ? 'selected' : ''}>${c.name}</option>`)}</select><span class="err-text" id="sf-class-err" role="alert"></span></div>
          ${q.require_session_code ? html`<div class="field"><label for="sf-code">Kode sesi dari guru</label><input id="sf-code" class="input mono" maxlength="20" autocomplete="off" autocapitalize="characters" required></div>` : ''}
          ${q.require_participant_code ? html`<div class="field"><label for="sf-pcode">Kode peserta</label><input id="sf-pcode" class="input mono" maxlength="20" autocomplete="off" autocapitalize="characters" required><span class="hint">Kode pribadi yang dibagikan guru untuk ujian ini.</span></div>` : ''}
          <label class="check"><input type="checkbox" id="sf-consent" ${q.show_on_leaderboard ? '' : 'disabled'}><span>${q.show_on_leaderboard ? html`Saya setuju <b>nama tampilan, kelas, dan nilai saya ditampilkan di papan peringkat publik</b> yang dapat dilihat pengunjung lain. (Opsional — tanpa persetujuan, nilai tetap tersimpan untuk guru.)` : 'Hasil latihan ini tidak ditampilkan di papan peringkat.'}</span></label>
          ${q.has_manual ? AE.notice('', 'info', html`<p>Latihan ini memuat soal uraian yang dinilai guru. Nilai akhir baru final setelah guru menilai.</p>`) : ''}
          <div class="btn-row"><button class="btn btn-primary" type="submit" id="sf-go">${ic('play')} Mulai mengerjakan</button><a class="btn btn-ghost" href="#/${q.kind === 'ujian' ? 'ujian' : 'latihan'}">Batal</a></div>
        </form></div>`,
      mount() {
        AE.$('#start-form').onsubmit = async (e) => {
          e.preventDefault();
          const name = AE.normName(AE.$('#sf-name').value);
          const nErr = AE.validateDisplayName(name);
          const cls = AE.$('#sf-class').value;
          AE.$('#sf-name-err').textContent = nErr; AE.$('#sf-name').setAttribute('aria-invalid', !!nErr);
          AE.$('#sf-class-err').textContent = cls ? '' : 'Pilih kelasmu.'; AE.$('#sf-class').setAttribute('aria-invalid', !cls);
          if (nErr || !cls) return;
          const btn = AE.$('#sf-go'); btn.disabled = true; btn.innerHTML = html`<span class="spinner"></span> Menyiapkan soal…`.s;
          try {
            const data = await AE.rpc('start_quiz_session', {
              p_quiz_id: q.id, p_display_name: name, p_class_id: cls, p_consent_public: AE.$('#sf-consent').checked,
              p_session_code: AE.$('#sf-code') ? AE.$('#sf-code').value : null, p_participant_code: AE.$('#sf-pcode') ? AE.$('#sf-pcode').value : null,
            });
            localStorage.setItem(IDENT, JSON.stringify({ name, classId: cls }));
            const skew = new Date(data.server_time).getTime() - Date.now();
            const r = { sessionId: data.session_id, token: data.token, quiz: { ...data.quiz, kind: q.kind }, questions: data.questions, expiresAt: new Date(data.expires_at).getTime() - skew, startedAt: Date.now(), timed: !!data.duration_seconds, answers: {}, cur: 0, name, className: (classes.find((c) => c.id === cls) || {}).name || '' };
            setRun(r);
            AE.go('/kerjakan/' + q.id);
          } catch (err) { AE.toast(AE.errMsg(err), 'err', 6000); btn.disabled = false; btn.innerHTML = html`${ic('play')} Mulai mengerjakan`.s; }
        };
      },
    };
  }, { nav: 'latihan' });

  AE.abandonRun = async (qid) => {
    if (!(await AE.confirm('Tinggalkan pengerjaan?', 'Jawaban yang belum dikirim akan dihapus dari perangkat ini dan tidak dinilai.', { okLabel: 'Tinggalkan', danger: true }))) return;
    setRun(null); AE.go('/kerjakan/' + (qid || '')); AE.render();
  };

  function runner(el, run) {
    const qs = run.questions || [];
    let tick = null, ctl = null, submitting = false;
    AE.onLeave(() => clearInterval(tick));
    const save = () => setRun(run);
    const remaining = () => (run.timed ? (run.expiresAt - Date.now()) / 1000 : Infinity);
    const answeredCount = () => qs.filter((q) => AE.isAnswered(q, run.answers[q.id])).length;

    const draw = () => {
      const q = qs[run.cur];
      el.innerHTML = html`<div class="row between mb"><div><div class="eyebrow" style="margin:0">${run.quiz.kind === 'ujian' ? 'Ujian akhir' : 'Latihan soal'}</div><h2 style="margin:0">${run.quiz.title}</h2><span class="tiny muted">${run.name} · ${run.className}</span></div>
          ${run.timed ? html`<span class="timer" id="rn-t" role="timer" aria-live="off">${ic('timer')} ${AE.fmtClock(remaining())}</span>` : ''}</div>
        <div class="progress mb"><span style="width:${(answeredCount() / qs.length) * 100}%"></span></div>
        <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,230px);align-items:start" id="rn-grid">
          <div class="card q-card"><div id="rn-q"></div>
            <div class="btn-row mt between"><button class="btn" data-nav="-1" ${run.cur === 0 ? 'disabled' : ''}>${ic('arrow-left')} Sebelumnya</button>
              ${run.cur < qs.length - 1 ? html`<button class="btn btn-primary" data-nav="1">Berikutnya ${ic('arrow-right')}</button>` : html`<button class="btn btn-gold" data-submit>${ic('send')} Kirim jawaban</button>`}</div></div>
          <div class="card-flat stack-sm"><div class="label">Navigasi soal</div><div class="qnav">${qs.map((x, i) => html`<button type="button" data-goto="${i}" class="${AE.isAnswered(x, run.answers[x.id]) ? 'answered' : ''} ${i === run.cur ? 'current' : ''}" aria-label="Soal ${i + 1}${AE.isAnswered(x, run.answers[x.id]) ? ', sudah dijawab' : ''}">${i + 1}</button>`)}</div>
            <p class="tiny muted" style="margin:0">${answeredCount()} dari ${qs.length} terjawab. Jawaban tersimpan otomatis di perangkat ini.</p>
            <button class="btn btn-gold" data-submit>${ic('send')} Kirim jawaban</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-abandon>Tinggalkan pengerjaan</button></div></div>
        <style>@media (max-width:820px){#rn-grid{grid-template-columns:1fr!important}}</style>`.s;
      ctl = AE.mountQuestion(AE.$('#rn-q'), q, { number: run.cur + 1, total: qs.length, showPoints: true, answer: run.answers[q.id], onChange: (a) => { run.answers[q.id] = a; save(); refreshNav(); } });
      el.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => { run.cur = Math.max(0, Math.min(qs.length - 1, run.cur + +b.dataset.nav)); save(); draw(); }));
      el.querySelectorAll('[data-goto]').forEach((b) => (b.onclick = () => { run.cur = +b.dataset.goto; save(); draw(); }));
      el.querySelectorAll('[data-submit]').forEach((b) => (b.onclick = () => submit(false)));
      el.querySelector('[data-abandon]').onclick = () => AE.abandonRun(run.quiz.id);
    };
    const refreshNav = () => {
      el.querySelectorAll('[data-goto]').forEach((b) => { const x = qs[+b.dataset.goto]; b.classList.toggle('answered', AE.isAnswered(x, run.answers[x.id])); });
      const p = el.querySelector('.progress > span'); if (p) p.style.width = (answeredCount() / qs.length) * 100 + '%';
      const t = el.querySelector('.qnav + p'); if (t) t.textContent = `${answeredCount()} dari ${qs.length} terjawab. Jawaban tersimpan otomatis di perangkat ini.`;
    };

    const submit = async (auto) => {
      if (submitting) return;
      const missing = qs.length - answeredCount();
      if (!auto && !(await AE.confirm('Kirim jawaban?', missing ? `Masih ada ${missing} soal yang belum dijawab. Soal kosong dinilai salah. Jawaban yang sudah dikirim tidak dapat diubah.` : 'Jawaban yang sudah dikirim tidak dapat diubah.', { okLabel: 'Kirim sekarang' }))) return;
      submitting = true;
      clearInterval(tick);
      el.innerHTML = AE.loadingView(auto ? 'Waktu habis — mengirim jawaban…' : 'Mengirim & menilai jawaban di server…').s;
      const answers = {};
      qs.forEach((q) => { if (run.answers[q.id] != null) answers[q.id] = run.answers[q.id]; });
      let lastErr = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await AE.rpc('submit_quiz', { p_session_id: run.sessionId, p_token: run.token, p_answers: answers });
          AE.store.addHistory({ kind: run.quiz.kind, label: run.quiz.title, score: +res.percent, official: true });
          const done = { ...run, result: res };
          setRun(null);
          AE.invalidate('quizzes');
          return showResult(el, done);
        } catch (e) {
          lastErr = e;
          if (!AE.isNetworkErr(e)) break;
          await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
        }
      }
      submitting = false;
      const expired = /AE_SESSION_EXPIRED|AE_SESSION_CLOSED|AE_INVALID_SESSION/.test(String(lastErr && lastErr.message));
      el.innerHTML = html`<div class="card stack" style="max-width:640px">${AE.notice('err', 'circle-alert', html`<p><b>Hasil belum dikonfirmasi tersimpan.</b> ${AE.errMsg(lastErr)}</p>`)}
        ${expired ? html`<p class="small">Sesi ini tidak dapat dikirim lagi. Hubungi guru jika menurutmu ini kesalahan.</p><div class="btn-row"><button class="btn" id="rn-clear">Tutup sesi ini</button></div>`
          : html`<p class="small">Jawabanmu masih tersimpan di perangkat ini. Periksa koneksi internet lalu coba kirim lagi — pengiriman ulang tidak akan membuat hasil ganda.</p><div class="btn-row"><button class="btn btn-primary" id="rn-retry">${ic('refresh-cw')} Coba kirim lagi</button><button class="btn" id="rn-back">Kembali ke soal</button></div>`}</div>`.s;
      if (expired) AE.$('#rn-clear').onclick = () => { setRun(null); AE.go('/' + (run.quiz.kind === 'ujian' ? 'ujian' : 'latihan')); };
      else { AE.$('#rn-retry').onclick = () => submit(true); AE.$('#rn-back').onclick = () => { draw(); startTick(); }; }
    };
    const startTick = () => {
      if (!run.timed) return;
      clearInterval(tick);
      tick = setInterval(() => {
        const t = AE.$('#rn-t'); const l = remaining();
        if (t) { t.innerHTML = html`${ic('timer')} ${AE.fmtClock(l)}`.s; t.classList.toggle('low', l <= 60); }
        if (l <= 0) { AE.toast('Waktu habis. Jawaban dikirim otomatis.', 'info'); submit(true); }
      }, 500);
    };
    if (!qs.length) { el.innerHTML = AE.emptyView('list-checks', 'Soal tidak tersedia', 'Sesi ini tidak memiliki soal.').s; return; }
    if (run.timed && remaining() <= 0) { submit(true); return; }
    draw(); startTick();
  }

  function showResult(el, run) {
    const r = run.result;
    const byId = {}; (r.review || []).forEach((x) => (byId[x.question_id] = x));
    el.innerHTML = html`<div class="card stack" style="text-align:center;align-items:center;max-width:760px;margin:0 auto">
        <div class="score-ring" style="--p:${r.percent}"><div><div><b>${AE.fmtNum(r.score, 1)}</b><span class="small muted">dari ${AE.fmtNum(r.max_score)}</span></div></div></div>
        <div><h2 style="margin:0">${run.quiz.title}</h2><p class="muted small" style="margin:0">${r.correct_count} dari ${r.graded_count} soal otomatis benar · durasi ${AE.fmtDuration(r.duration_seconds)}</p></div>
        <div class="row" style="justify-content:center">${r.needs_manual_review ? html`<span class="badge gold">${ic('clock')} Menunggu penilaian guru (soal uraian)</span>` : r.passed ? html`<span class="badge">${ic('circle-check')} Tuntas (KKM ${AE.fmtNum(r.passing_score)})</span>` : html`<span class="badge red">${ic('circle-x')} Belum tuntas (KKM ${AE.fmtNum(r.passing_score)})</span>`}
          ${r.on_leaderboard ? html`<span class="badge gray">${ic('trophy')} Tampil di papan peringkat</span>` : ''}${r.duplicate ? html`<span class="badge gray">Hasil sudah tersimpan sebelumnya</span>` : ''}</div>
        ${AE.notice('', 'server', html`<p>Nilai ini dihitung dan <b>tersimpan di server</b>.</p>`)}
        <div class="btn-row" style="justify-content:center"><a class="btn btn-primary" href="#/peringkat">${ic('trophy')} Lihat peringkat</a><a class="btn" href="#/${run.quiz.kind === 'ujian' ? 'ujian' : 'latihan'}">Kembali ke daftar</a></div></div>
      ${r.review ? html`<div class="section" style="max-width:760px;margin-inline:auto"><h2>Pembahasan</h2><div class="stack" id="rv"></div></div>` : html`<p class="small muted mt" style="text-align:center">Pembahasan untuk latihan ini tidak ditampilkan oleh guru.</p>`}`.s;
    if (r.review) {
      const box = AE.$('#rv');
      run.questions.forEach((q, i) => {
        const rv = byId[q.id]; if (!rv) return;
        const d = document.createElement('div'); d.className = 'card q-card'; box.appendChild(d);
        const opts = q.type === 'matching' ? { ...q.options, right: q.options.right } : q.options;
        AE.mountQuestion(d, { ...q, options: opts }, { number: i + 1, total: run.questions.length, answer: run.answers[q.id], reveal: { correct: rv.correct, key: rv.answer_key, explanation: rv.explanation } });
      });
    }
  }

  /* ---------------- PAPAN PERINGKAT ---------------- */
  route('/peringkat', 'Papan Peringkat', async () => {
    const head = html`<div class="page-head"><h1>Papan Peringkat</h1><p>Hasil latihan & ujian yang dinilai server dan disetujui peserta untuk ditampilkan. Urutan: nilai tertinggi → durasi tercepat → waktu kirim lebih awal.</p></div>`;
    if (!AE.dbReady()) {
      return html`${head}${AE.notice('warn', 'database', html`<p>Database belum terhubung, sehingga belum ada data peringkat. Contoh di bawah ini <b>hanya ilustrasi tampilan</b>.</p>`)}
        <div class="table-wrap mt illustrative" aria-hidden="true"><table class="table"><thead><tr><th>#</th><th>Nama</th><th>Kelas</th><th>Latihan</th><th class="num">Nilai</th></tr></thead><tbody>
        ${[['Mukrim', 93], ['Rahmat', 90], ['Siswa lain', 85]].map(([n, s], i) => html`<tr><td><span class="rank r${i + 1}">${i + 1}</span></td><td>${n}</td><td>X</td><td>Contoh</td><td class="num"><b>${s}</b></td></tr>`)}</tbody></table></div>`;
    }
    let quizzes = [], classes = [];
    try { [quizzes, classes] = await Promise.all([AE.data.quizzes(), AE.data.classes()]); } catch (e) {}
    return {
      html: html`${head}
        <div class="row mb" style="align-items:stretch">
          <select id="lb-quiz" class="input" style="flex:1 1 220px" aria-label="Filter latihan"><option value="">Semua latihan & ujian</option>${(quizzes || []).map((q) => html`<option value="${q.id}">${q.title}</option>`)}</select>
          <select id="lb-class" class="input" style="flex:0 1 180px" aria-label="Filter kelas"><option value="">Semua kelas</option>${classes.map((c) => html`<option value="${c.name}">${c.name}</option>`)}</select>
          <select id="lb-period" class="input" style="flex:0 1 170px" aria-label="Periode"><option value="all">Semua waktu</option><option value="today">Hari ini</option><option value="week">7 hari terakhir</option><option value="month">30 hari terakhir</option></select>
          <button class="btn" id="lb-reload">${ic('refresh-cw')} Muat ulang</button></div>
        <div class="row small muted mb" style="gap:14px"><span id="lb-rt" class="badge gray">Menghubungkan real-time…</span><span id="lb-upd"></span></div>
        <div id="lb-body">${AE.loadingView()}</div>`,
      mount() {
        const f = { quizId: '', className: '', period: 'all' };
        let lastIds = new Set(), chan = null, poll = null;
        const body = AE.$('#lb-body');
        const load = async (flashNew) => {
          try {
            const rows = await AE.data.leaderboard({ ...f, limit: 100 });
            AE.$('#lb-upd').textContent = 'Diperbarui ' + new Date().toLocaleTimeString('id-ID');
            if (!rows.length) { body.innerHTML = AE.emptyView('trophy', 'Belum ada hasil latihan', 'Hasil yang dinilai server dan disetujui peserta akan muncul di sini secara otomatis.').s; lastIds = new Set(); return; }
            body.innerHTML = html`<div class="table-wrap"><table class="table"><thead><tr><th>Peringkat</th><th>Nama tampilan</th><th>Kelas</th><th>Latihan / ujian</th><th class="num">Nilai</th><th class="num">Durasi</th><th>Waktu kirim</th></tr></thead><tbody>
              ${rows.map((r) => html`<tr class="${flashNew && !lastIds.has(r.id) ? 'flash-new' : ''}"><td><span class="rank ${r.rank <= 3 ? 'r' + r.rank : ''}">${r.rank}</span></td><td><b>${r.display_name}</b></td><td>${r.class_name}</td><td class="small">${r.quiz_title}</td><td class="num"><b>${AE.fmtNum(r.percent, 2)}</b></td><td class="num small">${AE.fmtDuration(r.duration_seconds)}</td><td class="small">${AE.fmtDate(r.submitted_at)}</td></tr>`)}</tbody></table></div>
              <p class="tiny muted mt-s">Nilai ditampilkan dalam skala 0–100. Menampilkan maksimal 100 baris teratas.</p>`.s;
            lastIds = new Set(rows.map((r) => r.id));
          } catch (e) { body.innerHTML = AE.emptyView('wifi-off', 'Peringkat gagal dimuat', AE.errMsg(e), html`<button class="btn" id="lb-retry">Coba lagi</button>`).s; const b = AE.$('#lb-retry'); if (b) b.onclick = () => load(false); }
        };
        const setRt = (ok, text) => { const el = AE.$('#lb-rt'); if (!el) return; el.className = 'badge ' + (ok ? '' : 'gray'); el.innerHTML = html`${ic(ok ? 'radio' : 'wifi-off')} ${text}`.s; };
        const debouncedLoad = AE.debounce(() => load(true), 400);
        const subscribe = () => {
          const db = AE.db();
          chan = db.channel('lb-public').on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard_entries' }, debouncedLoad)
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') { setRt(true, 'Real-time aktif'); clearInterval(poll); poll = null; }
              else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                setRt(false, 'Real-time terputus — memuat ulang otomatis tiap 30 detik');
                if (!poll) poll = setInterval(() => load(true), 30000);
              }
            });
        };
        ['quiz', 'class', 'period'].forEach((k) => (AE.$('#lb-' + k).onchange = (e) => { f[k === 'quiz' ? 'quizId' : k === 'class' ? 'className' : 'period'] = e.target.value; load(false); }));
        AE.$('#lb-reload').onclick = () => load(false);
        AE.onLeave(() => { clearInterval(poll); if (chan) AE.db().removeChannel(chan); });
        load(false); subscribe();
      },
    };
  });
})();
