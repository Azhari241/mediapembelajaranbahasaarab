/* ARABIYA EDU — Panel Guru: Kuis & soal, Hasil & statistik, Ekspor CSV, Pengelolaan peringkat */
(function () {
  const AE = window.AE;
  const { html, ic, route, F } = AE;
  const pageWrap = (tab, fn) => AE.requireTeacher(async (p) => { const r = await fn(p); return { html: AE.adminShell(p, tab, r.html || r), mount: (root) => { AE.bindShell(); r.mount && r.mount(root); } }; });
  const toLocalInput = (d) => (d ? new Date(new Date(d).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '');

  /* ---------------- KUIS ---------------- */
  const quizFields = (q = {}, lessons = []) => html`${F.text('title', 'Judul', q.title, { req: true, max: 120 })}${F.sel('kind', 'Jenis', q.kind || 'latihan', [['latihan', 'Latihan soal'], ['ujian', 'Ujian akhir']])}
    ${F.sel('grade_level', 'Kelas', q.grade_level || 10, AE.gradeOpts, { int: true })}${F.sel('lesson_id', 'Materi terkait', q.lesson_id || '', [['', '(tidak ada)'], ...lessons.map((l) => [l.id, l.title])])}
    ${F.area('description', 'Deskripsi', q.description, { rows: 2, max: 600 })}
    ${F.num('duration_minutes', 'Durasi (menit, kosong = tanpa batas)', q.duration_seconds ? Math.round(q.duration_seconds / 60) : '', { int: true, min: 1, max: 240 })}
    ${F.num('max_attempts', 'Batas percobaan (kosong = tanpa batas)', q.max_attempts ?? '', { int: true, min: 1, max: 50, hint: 'Tanpa kode peserta: dihitung per nama + kelas (bukan jaminan identitas).' })}
    ${F.num('max_score', 'Nilai maksimum', q.max_score ?? 100, { min: 1, max: 1000 })}${F.num('passing_score', 'Batas kelulusan (KKM)', q.passing_score ?? 75, { min: 0, max: 1000 })}
    <div class="field"><label for="f-opens_at">Dibuka pada (opsional)</label><input id="f-opens_at" name="opens_at" type="datetime-local" class="input" value="${toLocalInput(q.opens_at)}"></div>
    <div class="field"><label for="f-closes_at">Ditutup pada (opsional)</label><input id="f-closes_at" name="closes_at" type="datetime-local" class="input" value="${toLocalInput(q.closes_at)}"></div>
    ${F.chk('show_on_leaderboard', 'Tampilkan hasil di papan peringkat (jika siswa setuju)', q.show_on_leaderboard !== false)}
    ${F.chk('show_explanations', 'Tampilkan kunci & pembahasan setelah dikirim', q.show_explanations !== false)}
    ${F.chk('is_published', 'Terbitkan', !!q.is_published)}${F.chk('is_active', 'Aktif (dapat dikerjakan)', q.is_active !== false)}`;
  const quizRow = (v) => {
    if (v.max_score != null && v.passing_score != null && v.passing_score > v.max_score) throw new Error('KKM tidak boleh melebihi nilai maksimum.');
    return { title: v.title, kind: v.kind, grade_level: v.grade_level, lesson_id: v.lesson_id || null, description: v.description, duration_seconds: v.duration_minutes ? v.duration_minutes * 60 : null, max_attempts: v.max_attempts || null, max_score: v.max_score || 100, passing_score: v.passing_score ?? 75,
      opens_at: v.opens_at ? new Date(v.opens_at).toISOString() : null, closes_at: v.closes_at ? new Date(v.closes_at).toISOString() : null, show_on_leaderboard: v.show_on_leaderboard, show_explanations: v.show_explanations, is_published: v.is_published, is_active: v.is_active };
  };

  route('/guru/kuis', 'Kelola Kuis', async () => pageWrap('kuis', async () => {
    const db = AE.db();
    const [{ data: quizzes, error }, { data: lessons }, { data: qcount }] = await Promise.all([db.from('quizzes').select('*').order('created_at', { ascending: false }), db.from('lessons').select('id,title').order('title'), db.from('questions').select('quiz_id')]);
    AE.dbErr(error);
    const cnt = {}; (qcount || []).forEach((x) => (cnt[x.quiz_id] = (cnt[x.quiz_id] || 0) + 1));
    const rows = quizzes || [];
    return {
      html: html`<div class="row between mb"><p class="small muted" style="margin:0">Kunci jawaban tersimpan di database dan tidak pernah dikirim ke browser siswa sebelum jawaban dikumpulkan.</p>
        <div class="btn-row"><button class="btn" id="qz-import">${ic('download')} Impor kuis contoh</button><button class="btn btn-primary" id="qz-add">${ic('plus')} Buat kuis</button></div></div>
        ${rows.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th>Judul</th><th>Jenis</th><th class="num">Soal</th><th>Pengaturan</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((q) => html`<tr>
          <td><b>${q.title}</b><div class="tiny muted">${AE.GRADES[q.grade_level]}</div></td><td>${q.kind === 'ujian' ? 'Ujian' : 'Latihan'}</td><td class="num">${cnt[q.id] || 0}</td>
          <td class="small">${q.duration_seconds ? Math.round(q.duration_seconds / 60) + ' mnt' : 'Tanpa batas'} · KKM ${AE.fmtNum(q.passing_score)}/${AE.fmtNum(q.max_score)}${q.max_attempts ? ' · ' + q.max_attempts + '×' : ''}${q.require_session_code ? ' · kode sesi' : ''}${q.require_participant_code ? ' · kode peserta' : ''}</td>
          <td>${!q.is_active ? html`<span class="badge red">Nonaktif</span>` : q.is_published ? html`<span class="badge">Terbit</span>` : html`<span class="badge gold">Draf</span>`}</td>
          <td><div class="row" style="flex-wrap:nowrap;gap:4px"><a class="btn btn-sm btn-primary" href="#/guru/kuis/${q.id}">${ic('list-ordered')} Soal</a><button class="btn btn-sm" data-edit="${q.id}">${ic('settings')} Atur</button><button class="btn btn-sm" data-act="${q.id}">${q.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button><button class="btn btn-sm btn-icon btn-danger" data-del="${q.id}" aria-label="Hapus">${ic('trash-2')}</button></div></td></tr>`)}</tbody></table></div>`
          : AE.emptyView('list-checks', 'Belum ada kuis', 'Buat kuis baru atau impor kuis contoh untuk mencoba alur penilaian.')}`,
      mount() {
        const done = () => { AE.invalidate('quizzes'); AE.render(); };
        AE.$('#qz-add').onclick = async () => { const ok = await AE.formModal('Buat kuis', quizFields({}, lessons || []), async (v) => { const { data, error } = await db.from('quizzes').insert(quizRow(v)).select('id').single(); AE.dbErr(error); AE._newQuiz = data.id; }); if (ok) AE.go('/guru/kuis/' + AE._newQuiz); };
        AE.$('#qz-import').onclick = async () => {
          if (!(await AE.confirm('Impor kuis contoh?', `${AE.SAMPLE_QUIZZES.length} kuis contoh (dengan soal & kunci) akan dibuat sebagai DRAF. Terbitkan setelah Anda memeriksanya.`, { okLabel: 'Impor' }))) return;
          try {
            for (const s of AE.SAMPLE_QUIZZES) {
              const { questions, ...q } = s;
              const { data, error } = await db.from('quizzes').insert({ ...q, is_published: false }).select('id').single(); AE.dbErr(error);
              const { error: e2 } = await db.from('questions').insert(questions.map((x, i) => ({ passage: '', audio_text: '', ...x, quiz_id: data.id, position: i }))); AE.dbErr(e2);
            }
            AE.toast('Kuis contoh diimpor sebagai draf.'); done();
          } catch (e) { AE.toast(AE.errMsg(e), 'err'); }
        };
        AE.$('#view').onclick = async (e) => {
          const b = e.target.closest('button[data-edit],button[data-act],button[data-del]'); if (!b) return;
          const q = rows.find((x) => x.id === (b.dataset.edit || b.dataset.act || b.dataset.del));
          if (b.dataset.edit) { if (await AE.formModal('Pengaturan kuis', quizFields(q, lessons || []), async (v) => { const { error } = await db.from('quizzes').update(quizRow(v)).eq('id', q.id); AE.dbErr(error); })) done(); }
          if (b.dataset.act) { if (q.is_active && !(await AE.confirm('Nonaktifkan kuis?', 'Siswa tidak dapat memulai maupun mengirim jawaban untuk kuis ini sampai diaktifkan kembali.', { okLabel: 'Nonaktifkan', danger: true }))) return; const { error } = await db.from('quizzes').update({ is_active: !q.is_active }).eq('id', q.id); error ? AE.toast(AE.errMsg(error), 'err') : done(); }
          if (b.dataset.del) { if (!(await AE.confirm('Hapus kuis permanen?', `“${q.title}” beserta SEMUA soal, hasil siswa, dan entri peringkatnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan. Pertimbangkan “Nonaktifkan”.`, { okLabel: 'Hapus permanen', danger: true }))) return; const { error } = await db.from('quizzes').delete().eq('id', q.id); error ? AE.toast(AE.errMsg(error), 'err') : done(); }
        };
      },
    };
  }), { nav: 'guru' });

  /* ---------------- SOAL DALAM KUIS ---------------- */
  const QTYPES = Object.entries(AE.TYPE_LABEL);
  const CHOICE = ['mcq', 'choose_meaning', 'reading', 'listening', 'dialog'];
  const qForm = (q = {}) => {
    const t = q.question_type || 'mcq';
    const opts = Array.isArray(q.options) ? q.options : [];
    const key = q.answer_key || {};
    let typeFields = '';
    if (CHOICE.includes(t)) typeFields = html`${F.area('opts', 'Pilihan jawaban (satu per baris, maks. 5)', opts.map((o) => o.text).join('\n'), { rows: 4 })}${F.sel('correct', 'Jawaban benar', key.correct || 'a', ['a', 'b', 'c', 'd', 'e'].map((k) => [k, 'Pilihan ' + k.toUpperCase()]))}`;
    if (t === 'true_false') typeFields = F.sel('correct_tf', 'Jawaban benar', String(!!key.correct), [['true', 'Benar'], ['false', 'Salah']]);
    if (t === 'fill_blank') typeFields = F.area('accepted', 'Jawaban yang diterima (satu per baris; harakat & variasi alif diabaikan)', (key.accepted || []).join('\n'), { rows: 3, ar: true });
    if (t === 'arrange') typeFields = F.area('order', 'Kata dalam URUTAN BENAR (satu per baris) — akan diacak untuk siswa', (key.order || []).join('\n'), { rows: 4, ar: true });
    if (t === 'matching') typeFields = F.area('pairs', 'Pasangan — format: kiri | kanan (satu per baris)', ((q.options && q.options.left) || []).map((l) => { const r = (q.options.right || []).find((x) => x.id === key.pairs[l.id]); return l.text + ' | ' + (r ? r.text : ''); }).join('\n'), { rows: 5 });
    return html`${F.sel('question_type', 'Jenis soal', t, QTYPES)}${F.num('points', 'Bobot / poin', q.points ?? 1, { min: 0.5, max: 100, step: 0.5 })}
      ${F.area('question_text', 'Pertanyaan / perintah', q.question_text, { rows: 2, max: 1000 })}${F.area('question_ar', 'Teks Arab pada soal (opsional)', q.question_ar, { rows: 2, ar: true, max: 1000 })}
      ${t === 'reading' || t === 'dialog' ? F.area('passage', 'Teks bacaan / dialog (Arab)', q.passage, { rows: 4, ar: true, max: 4000 }) : ''}
      ${t === 'listening' ? F.text('audio_text', 'Teks yang dibacakan audio (Arab)', q.audio_text, { ar: true, max: 1000, full: true }) : ''}
      ${typeFields}${F.area('explanation', 'Pembahasan', q.explanation, { rows: 2, max: 2000 })}`;
  };
  const qRow = (v, t) => {
    const r = { question_type: t, points: v.points || 1, question_text: v.question_text, question_ar: v.question_ar || '', passage: v.passage || '', audio_text: v.audio_text || '', explanation: v.explanation || '', options: [], answer_key: {} };
    if (!r.question_text) throw new Error('Pertanyaan wajib diisi.');
    const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);
    if (CHOICE.includes(t)) { const o = lines(v.opts).slice(0, 5); if (o.length < 2) throw new Error('Minimal 2 pilihan jawaban.'); r.options = o.map((text, i) => ({ id: 'abcde'[i], text })); if (!r.options.some((x) => x.id === v.correct)) throw new Error('Jawaban benar harus salah satu pilihan yang tersedia.'); r.answer_key = { correct: v.correct }; }
    if (t === 'true_false') r.answer_key = { correct: v.correct_tf === 'true' };
    if (t === 'fill_blank') { const a = lines(v.accepted); if (!a.length) throw new Error('Isi minimal satu jawaban yang diterima.'); r.answer_key = { accepted: a }; }
    if (t === 'arrange') { const a = lines(v.order); if (a.length < 2) throw new Error('Minimal 2 kata.'); r.options = { tokens: a }; r.answer_key = { order: a }; }
    if (t === 'matching') { const p = lines(v.pairs).map((l) => l.split('|').map((x) => x.trim())); if (p.length < 2 || p.some((x) => !x[0] || !x[1])) throw new Error('Minimal 2 pasangan dengan format kiri | kanan.'); r.options = { left: p.map((x, i) => ({ id: 'l' + (i + 1), text: x[0] })), right: p.map((x, i) => ({ id: 'r' + (i + 1), text: x[1] })) }; r.answer_key = { pairs: Object.fromEntries(p.map((_, i) => ['l' + (i + 1), 'r' + (i + 1)])) }; }
    return r;
  };
  const openQForm = (title, q, save) => {
    let type = q.question_type || 'mcq';
    return AE.modal({ title, wide: true, body: html`<form class="form-grid" data-noform id="qf">${qForm(q)}</form>`,
      onMount: (root) => { root.addEventListener('change', (e) => { if (e.target.name === 'question_type') { const cur = AE.readForm(root.querySelector('#qf')); type = e.target.value; root.querySelector('#qf').innerHTML = qForm({ ...q, ...cur, question_type: type, answer_key: {}, options: [] }).s; } }); },
      actions: [{ label: 'Batal', value: null }, { label: 'Simpan soal', cls: 'btn-primary', onClick: async (root) => { try { await save(qRow(AE.readForm(root.querySelector('#qf')), type)); AE.toast('Soal disimpan.'); return true; } catch (e) { AE.toast(AE.errMsg(e) === 'Terjadi kesalahan. Silakan coba lagi.' ? e.message : AE.errMsg(e), 'err', 6000); return false; } } }] });
  };

  route('/guru/kuis/:id', 'Soal Kuis', async ({ id }) => pageWrap('kuis', async () => {
    const db = AE.db();
    const [{ data: quiz, error }, { data: qs }, { data: codes }] = await Promise.all([db.from('quizzes').select('*').eq('id', id).single(), db.from('questions').select('*').eq('quiz_id', id).order('position').order('created_at'), db.from('participant_codes').select('id,label,used_count,created_at').eq('quiz_id', id).order('created_at')]);
    AE.dbErr(error);
    const list = qs || [];
    const totalPts = list.reduce((a, b) => a + +b.points, 0);
    return {
      html: html`<a class="btn btn-sm btn-ghost" href="#/guru/kuis">${ic('arrow-left')} Semua kuis</a>
        <div class="row between mt-s mb"><div><h2 style="margin:0">${quiz.title}</h2><span class="small muted">${list.length} soal · total bobot ${AE.fmtNum(totalPts, 2)} · ${quiz.is_published ? 'Terbit' : 'Draf'}${quiz.is_active ? '' : ' · Nonaktif'}</span></div>
          <div class="btn-row"><button class="btn" id="qp-pub">${quiz.is_published ? 'Jadikan draf' : html`${ic('send')} Terbitkan`}</button><button class="btn btn-primary" id="qp-add">${ic('plus')} Tambah soal</button></div></div>
        ${AE.notice('', 'calculator', html`<p>Nilai = (jumlah poin soal otomatis yang benar ÷ total poin soal otomatis) × nilai maksimum (${AE.fmtNum(quiz.max_score)}). Jika semua bobot sama, rumus ini setara dengan (jumlah benar ÷ jumlah soal) × 100. Soal uraian dinilai manual lalu nilai dihitung ulang di server.</p>`)}
        <div class="stack mt" id="qp-list">${list.length ? list.map((q, i) => html`<div class="card-flat"><div class="row between" style="flex-wrap:nowrap;align-items:flex-start"><div style="min-width:0"><div class="row" style="gap:6px"><span class="badge gray">${i + 1}</span><span class="badge">${AE.TYPE_LABEL[q.question_type]}</span><span class="badge gold">${AE.fmtNum(q.points, 2)} poin</span>${q.question_type === 'essay' ? html`<span class="badge red">Penilaian manual</span>` : ''}</div>
            <p class="mt-s" style="margin-bottom:4px"><b>${q.question_text}</b></p>${q.question_ar ? html`<div class="ar-inline" lang="ar" dir="rtl">${q.question_ar}</div>` : ''}
            <p class="small muted" style="margin:4px 0 0">Kunci: ${AE.txt(AE.keyText({ type: q.question_type, options: q.options }, q.answer_key) || (q.question_type === 'essay' ? '(manual)' : '–'))}</p></div>
          <div class="row" style="flex-wrap:nowrap;gap:4px"><button class="btn btn-sm btn-icon" data-up="${q.id}" aria-label="Naikkan">${ic('arrow-up')}</button><button class="btn btn-sm btn-icon" data-down="${q.id}" aria-label="Turunkan">${ic('arrow-down')}</button><button class="btn btn-sm" data-edit="${q.id}">${ic('pencil')} Ubah</button><button class="btn btn-sm btn-icon btn-danger" data-del="${q.id}" aria-label="Hapus">${ic('trash-2')}</button></div></div></div>`)
          : AE.emptyView('list-plus', 'Belum ada soal', 'Tambahkan soal pertama untuk kuis ini.')}</div>
        <div class="grid grid-2 section" style="align-items:start">
          <div class="card stack-sm"><h3 style="margin:0">Kode sesi</h3><p class="small muted" style="margin:0">Satu kode untuk seluruh kelas (mis. diumumkan di kelas). Disimpan dalam bentuk hash.</p>
            <p class="small" style="margin:0">Status: <b>${quiz.require_session_code ? 'Wajib kode sesi' : 'Tidak memakai kode sesi'}</b></p>
            <div class="row" style="flex-wrap:nowrap"><input id="sc-code" class="input mono" maxlength="20" placeholder="contoh: ARAB10A" aria-label="Kode sesi baru"><button class="btn" id="sc-set">Atur</button></div>
            ${quiz.require_session_code ? html`<button class="btn btn-sm btn-ghost btn-danger" id="sc-clear">Hapus kode sesi</button>` : ''}</div>
          <div class="card stack-sm"><h3 style="margin:0">Kode peserta (untuk ujian resmi)</h3><p class="small muted" style="margin:0">Kode unik per siswa. Kode asli hanya ditampilkan sekali saat dibuat — unduh/cetak segera. Batas pemakaian per kode = batas percobaan (default 1).</p>
            <p class="small" style="margin:0">${(codes || []).length} kode dibuat · ${(codes || []).filter((c) => c.used_count > 0).length} sudah dipakai · Status: <b>${quiz.require_participant_code ? 'Wajib' : 'Tidak wajib'}</b></p>
            <div class="row" style="flex-wrap:nowrap"><input id="pc-n" type="number" class="input" min="1" max="200" value="30" style="max-width:100px" aria-label="Jumlah kode"><input id="pc-label" class="input" maxlength="80" placeholder="Label (mis. X IPA 1)" aria-label="Label"><button class="btn" id="pc-gen">Buat</button></div>
            ${quiz.require_participant_code ? html`<button class="btn btn-sm btn-ghost" id="pc-off">Matikan kewajiban kode peserta</button>` : ''}</div></div>`,
      mount() {
        const done = () => { AE.invalidate('quizzes'); AE.render(); };
        AE.$('#qp-add').onclick = () => openQForm('Tambah soal', {}, async (r) => { const { error } = await db.from('questions').insert({ ...r, quiz_id: id, position: list.length ? Math.max(...list.map((x) => x.position)) + 1 : 0 }); AE.dbErr(error); }).then((ok) => ok && done());
        AE.$('#qp-pub').onclick = async () => { if (!quiz.is_published && !list.length) return AE.toast('Tambahkan soal sebelum menerbitkan.', 'err'); const { error } = await db.from('quizzes').update({ is_published: !quiz.is_published }).eq('id', id); error ? AE.toast(AE.errMsg(error), 'err') : (AE.toast(quiz.is_published ? 'Kuis dijadikan draf.' : 'Kuis diterbitkan.'), done()); };
        AE.$('#qp-list').onclick = async (e) => {
          const b = e.target.closest('button'); if (!b) return; const d = b.dataset; const q = list.find((x) => x.id === (d.edit || d.del || d.up || d.down)); if (!q) return;
          if (d.edit) { if (await openQForm('Ubah soal', q, async (r) => { const { error } = await db.from('questions').update(r).eq('id', q.id); AE.dbErr(error); })) done(); }
          if (d.del) { if (!(await AE.confirm('Hapus soal?', 'Soal akan dihapus permanen. Hasil yang sudah masuk tidak berubah.', { okLabel: 'Hapus', danger: true }))) return; const { error } = await db.from('questions').delete().eq('id', q.id); error ? AE.toast(AE.errMsg(error), 'err') : done(); }
          if (d.up || d.down) { const i = list.indexOf(q), j = d.up ? i - 1 : i + 1; if (j < 0 || j >= list.length) return; const o = list[j]; const reorder = list.slice(); reorder[i] = o; reorder[j] = q; for (let k = 0; k < reorder.length; k++) if (reorder[k].position !== k) await db.from('questions').update({ position: k }).eq('id', reorder[k].id); done(); }
        };
        AE.$('#sc-set').onclick = async () => { try { await AE.rpc('set_quiz_session_code', { p_quiz_id: id, p_code: AE.$('#sc-code').value }); AE.toast('Kode sesi diatur. Umumkan kode kepada siswa.'); done(); } catch (e) { AE.toast(AE.errMsg(e), 'err'); } };
        const scc = AE.$('#sc-clear'); if (scc) scc.onclick = async () => { await AE.rpc('set_quiz_session_code', { p_quiz_id: id, p_code: '' }); done(); };
        AE.$('#pc-gen').onclick = async () => {
          const n = +AE.$('#pc-n').value, label = AE.$('#pc-label').value;
          if (!(await AE.confirm('Buat kode peserta?', `${n} kode akan dibuat dan ujian ini akan MEWAJIBKAN kode peserta. Kode hanya ditampilkan sekali.`, { okLabel: 'Buat kode' }))) return;
          try {
            const rows = await AE.rpc('generate_participant_codes', { p_quiz_id: id, p_count: n, p_prefix: label });
            const codesTxt = rows.map((r) => r.code);
            const csv = 'no,kode,label\n' + codesTxt.map((c, i) => `${i + 1},${c},"${label.replace(/"/g, '""')}"`).join('\n');
            await AE.modal({ title: 'Kode peserta baru', wide: true, body: html`${AE.notice('warn', 'triangle-alert', html`<p>Simpan sekarang. Kode ini <b>tidak dapat ditampilkan lagi</b> (database hanya menyimpan hash).</p>`)}<pre class="code mt-s">${codesTxt.join('\n')}</pre>`,
              actions: [{ label: 'Unduh CSV', cls: 'btn-primary', onClick: () => { AE.downloadCSV(csv, `kode-peserta-${quiz.title}.csv`); return false; } }, { label: 'Selesai', value: true }] });
            done();
          } catch (e) { AE.toast(AE.errMsg(e), 'err'); }
        };
        const pco = AE.$('#pc-off'); if (pco) pco.onclick = async () => { const { error } = await db.from('quizzes').update({ require_participant_code: false }).eq('id', id); error ? AE.toast(AE.errMsg(error), 'err') : done(); };
      },
    };
  }), { nav: 'guru' });

  /* ---------------- CSV ---------------- */
  AE.csvCell = (v) => { let s = v == null ? '' : String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  AE.downloadCSV = (text, name) => { const blob = new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name.replace(/[^\w\-. ]+/g, '_'); document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); };

  /* ---------------- HASIL & STATISTIK ---------------- */
  route('/guru/hasil', 'Hasil & Statistik', async () => pageWrap('hasil', async () => {
    const db = AE.db();
    const [{ data: quizzes }, { data: classes }] = await Promise.all([db.from('quizzes').select('id,title,passing_score').order('title'), db.from('classes').select('id,name').order('name')]);
    const f = { quiz: '', cls: '', from: '', to: '', review: false };
    const PAGE = 50; let page = 0;
    return {
      html: html`<div class="row mb" style="align-items:end">
          <div class="field" style="flex:1 1 200px"><label for="hs-quiz">Kuis</label><select id="hs-quiz" class="input"><option value="">Semua kuis</option>${(quizzes || []).map((q) => html`<option value="${q.id}">${q.title}</option>`)}</select></div>
          <div class="field" style="flex:0 1 170px"><label for="hs-cls">Kelas</label><select id="hs-cls" class="input"><option value="">Semua kelas</option>${(classes || []).map((c) => html`<option value="${c.id}">${c.name}</option>`)}</select></div>
          <div class="field" style="flex:0 1 160px"><label for="hs-from">Dari tanggal</label><input id="hs-from" type="date" class="input"></div>
          <div class="field" style="flex:0 1 160px"><label for="hs-to">Sampai tanggal</label><input id="hs-to" type="date" class="input"></div>
          <label class="check" style="flex:0 1 auto;margin-bottom:10px"><input type="checkbox" id="hs-rev"> Hanya menunggu penilaian</label>
          <button class="btn" id="hs-csv">${ic('download')} Ekspor CSV</button></div>
        <div id="hs-stats">${AE.loadingView()}</div><div class="section" id="hs-table"></div>`,
      mount() {
        const cmap = Object.fromEntries((classes || []).map((c) => [c.id, c.name]));
        const qmap = Object.fromEntries((quizzes || []).map((q) => [q.id, q.title]));
        const range = () => ({ from: f.from ? new Date(f.from + 'T00:00:00').toISOString() : null, to: f.to ? new Date(new Date(f.to + 'T00:00:00').getTime() + 86400000).toISOString() : null });
        const query = (sel = '*') => { let q = db.from('quiz_results').select(sel, { count: 'exact' }); if (f.quiz) q = q.eq('quiz_id', f.quiz); if (f.cls) q = q.eq('class_id', f.cls); const r = range(); if (r.from) q = q.gte('submitted_at', r.from); if (r.to) q = q.lt('submitted_at', r.to); if (f.review) q = q.eq('needs_manual_review', true); return q; };
        const loadStats = async () => {
          const box = AE.$('#hs-stats');
          try {
            const r = range();
            const s = await AE.rpc('teacher_result_stats', { p_quiz_id: f.quiz || null, p_class_id: f.cls || null, p_from: r.from, p_to: r.to });
            if (!s.count) { box.innerHTML = AE.emptyView('chart-column', 'Belum ada hasil', 'Statistik akan muncul setelah siswa mengirim latihan.').s; return; }
            const maxB = Math.max(...s.distribution.map((d) => d.n), 1);
            box.innerHTML = html`<div class="grid grid-4">${[[s.count, 'Jumlah pengerjaan'], [AE.fmtNum(s.avg_percent, 1), 'Rata-rata (0–100)'], [AE.fmtNum(s.max_percent, 1), 'Tertinggi'], [AE.fmtNum(s.min_percent, 1), 'Terendah'], [s.passed, 'Mencapai KKM'], [s.pending_review, 'Menunggu penilaian']].map(([n, l]) => html`<div class="card-flat"><div class="stat-num" style="font-size:1.5rem">${n}</div><div class="tiny muted">${l}</div></div>`)}</div>
              <div class="grid grid-2 mt"><div class="card-flat"><h3>Distribusi nilai</h3><div class="bars">${s.distribution.map((d) => html`<div class="bar" style="height:${(d.n / maxB) * 100}%" title="${d.bucket * 10}–${d.bucket === 9 ? 100 : d.bucket * 10 + 9}: ${d.n}"><span>${d.n || ''}</span></div>`)}</div><div class="bars-x">${s.distribution.map((d) => html`<span>${d.bucket * 10}</span>`)}</div></div>
                <div class="card-flat"><h3>Perbandingan latihan</h3>${s.by_quiz.length ? html`<table class="table"><thead><tr><th>Kuis</th><th class="num">n</th><th class="num">Rata-rata</th><th class="num">Tuntas</th></tr></thead><tbody>${s.by_quiz.map((x) => html`<tr><td class="small">${x.title}</td><td class="num">${x.n}</td><td class="num">${AE.fmtNum(x.avg, 1)}</td><td class="num">${x.passed}</td></tr>`)}</tbody></table>` : ''}</div>
                <div class="card-flat"><h3>Hasil per kelas</h3><table class="table"><tbody>${s.by_class.map((x) => html`<tr><td>${x.name}</td><td class="num">${x.n} hasil</td><td class="num"><b>${AE.fmtNum(x.avg, 1)}</b></td></tr>`)}</tbody></table></div>
                <div class="card-flat"><h3>Hasil per pekan</h3><table class="table"><tbody>${s.by_week.map((x) => html`<tr><td>Pekan ${x.week}</td><td class="num">${x.n} hasil</td><td class="num"><b>${AE.fmtNum(x.avg, 1)}</b></td></tr>`)}</tbody></table></div></div>`.s;
          } catch (e) { box.innerHTML = AE.notice('err', 'circle-alert', html`<p>${AE.errMsg(e)}</p>`).s; }
        };
        const loadTable = async () => {
          const box = AE.$('#hs-table'); box.innerHTML = AE.loadingView().s;
          const { data, count, error } = await query('id,quiz_id,display_name,class_id,score,max_score,percent,correct_count,graded_count,needs_manual_review,manual_max_points,manual_points,passed,duration_seconds,consent_public,status,submitted_at').order('submitted_at', { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1);
          if (error) { box.innerHTML = AE.notice('err', 'circle-alert', html`<p>${AE.errMsg(error)}</p>`).s; return; }
          const rows = data || [];
          box.innerHTML = html`<div class="section-head"><h2>Daftar hasil</h2><span class="small muted">${count || 0} hasil</span></div>
            ${rows.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th>Waktu</th><th>Nama</th><th>Kelas</th><th>Kuis</th><th class="num">Nilai</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((r) => html`<tr>
              <td class="small">${AE.fmtDate(r.submitted_at)}</td><td><b>${r.display_name}</b></td><td>${cmap[r.class_id] || '–'}</td><td class="small">${qmap[r.quiz_id] || ''}</td><td class="num"><b>${AE.fmtNum(r.score, 2)}</b><div class="tiny muted">${r.correct_count}/${r.graded_count} benar</div></td>
              <td>${r.needs_manual_review ? html`<span class="badge gold">Perlu dinilai</span>` : r.passed ? html`<span class="badge">Tuntas</span>` : html`<span class="badge red">Belum tuntas</span>`} ${r.status === 'hidden' ? html`<span class="badge gray">Disembunyikan</span>` : ''}${!r.consent_public ? html`<span class="badge gray">Privat</span>` : ''}</td>
              <td><div class="row" style="flex-wrap:nowrap;gap:4px"><button class="btn btn-sm" data-view="${r.id}">${ic('eye')} Detail</button>${r.needs_manual_review ? html`<button class="btn btn-sm btn-primary" data-grade="${r.id}" data-max="${r.manual_max_points}">Nilai</button>` : ''}<button class="btn btn-sm btn-icon" data-ren="${r.id}" aria-label="Ubah nama">${ic('pencil')}</button><button class="btn btn-sm btn-icon btn-danger" data-del="${r.id}" aria-label="Hapus">${ic('trash-2')}</button></div></td></tr>`)}</tbody></table></div>
              <div class="row mt-s" style="justify-content:center"><button class="btn btn-sm" data-pg="-1" ${page ? '' : 'disabled'}>${ic('chevron-left')} Sebelumnya</button><span class="small muted">Halaman ${page + 1} dari ${Math.max(1, Math.ceil((count || 0) / PAGE))}</span><button class="btn btn-sm" data-pg="1" ${(page + 1) * PAGE < (count || 0) ? '' : 'disabled'}>Berikutnya ${ic('chevron-right')}</button></div>`
              : AE.emptyView('table', 'Belum ada hasil untuk filter ini', '')}`.s;
          box.onclick = async (e) => {
            const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
            if (d.pg) { page += +d.pg; loadTable(); return; }
            const r = rows.find((x) => x.id === (d.view || d.grade || d.ren || d.del));
            if (d.view) {
              const [{ data: full }, { data: qs }] = await Promise.all([db.from('quiz_results').select('answers').eq('id', r.id).single(), db.from('questions').select('id,question_type,question_text,options,answer_key,points').eq('quiz_id', r.quiz_id).order('position')]);
              const ans = (full && full.answers) || {};
              AE.modal({ title: `${r.display_name} — ${qmap[r.quiz_id] || ''}`, wide: true, body: html`<div class="stack-sm">${(qs || []).map((q, i) => { const a = ans[q.id]; const ok = AE.gradeLocal(q.question_type, q.answer_key, a); const mq = { type: q.question_type, options: q.options };
                const shown = a == null ? '(kosong)' : q.question_type === 'arrange' ? a.join(' ') : q.question_type === 'matching' ? AE.keyText(mq, { pairs: a }) : AE.CHOICE_TYPES.includes(q.question_type) ? AE.keyText(mq, { correct: a }) : q.question_type === 'true_false' ? (a ? 'Benar' : 'Salah') : String(a);
                return html`<div class="card-flat"><div class="row" style="gap:6px"><span class="badge gray">${i + 1}</span>${q.question_type === 'essay' ? html`<span class="badge gold">Uraian</span>` : ok ? html`<span class="badge">${ic('check')} Benar</span>` : html`<span class="badge red">${ic('x')} Salah</span>`}<span class="tiny muted">${AE.fmtNum(q.points, 2)} poin</span></div><p class="small mt-s" style="margin-bottom:4px"><b>${q.question_text}</b></p><p class="small" style="margin:0">Jawaban: ${AE.txt(shown)}</p>${q.question_type !== 'essay' ? html`<p class="small muted" style="margin:0">Kunci: ${AE.txt(AE.keyText(mq, q.answer_key))}</p>` : ''}</div>`; })}</div>`, actions: [{ label: 'Tutup', value: true }] });
            }
            if (d.grade) {
              const max = +d.max;
              const v = await AE.modal({ title: 'Nilai soal uraian', body: html`<p class="small">Masukkan poin untuk soal uraian (0–${AE.fmtNum(max, 2)}). Nilai akhir dihitung ulang di server.</p><div class="field"><label for="gm-p">Poin uraian</label><input id="gm-p" type="number" class="input" min="0" max="${max}" step="0.5"></div>`,
                actions: [{ label: 'Batal', value: null }, { label: 'Simpan nilai', cls: 'btn-primary', onClick: async (root) => { const p = Number(root.querySelector('#gm-p').value); if (isNaN(p) || p < 0 || p > max) { AE.toast('Poin di luar rentang.', 'err'); return false; } try { await AE.rpc('grade_manual', { p_result_id: r.id, p_manual_points: p }); return true; } catch (e) { AE.toast(AE.errMsg(e), 'err'); return false; } } }] });
              if (v) { AE.toast('Nilai disimpan.'); loadStats(); loadTable(); }
            }
            if (d.ren) {
              const v = await AE.modal({ title: 'Perbaiki nama tampilan', body: html`<div class="field"><label for="rn-n">Nama tampilan</label><input id="rn-n" class="input" maxlength="40" value="${r.display_name}"></div>`,
                actions: [{ label: 'Batal', value: null }, { label: 'Simpan', cls: 'btn-primary', onClick: async (root) => { const n = root.querySelector('#rn-n').value; const er = AE.validateDisplayName(n); if (er) { AE.toast(er, 'err'); return false; } try { await AE.rpc('rename_result', { p_result_id: r.id, p_name: n }); return true; } catch (e) { AE.toast(AE.errMsg(e), 'err'); return false; } } }] });
              if (v) { AE.toast('Nama diperbarui.'); loadTable(); }
            }
            if (d.del) { if (!(await AE.confirm('Hapus hasil?', `Hasil ${r.display_name} (${AE.fmtNum(r.score, 2)}) dan entri peringkatnya akan dihapus permanen.`, { okLabel: 'Hapus permanen', danger: true }))) return; const { error: e2 } = await db.from('quiz_results').delete().eq('id', r.id); e2 ? AE.toast(AE.errMsg(e2), 'err') : (AE.toast('Hasil dihapus.'), loadStats(), loadTable()); }
          };
        };
        const reload = () => { page = 0; loadStats(); loadTable(); };
        AE.$('#hs-quiz').onchange = (e) => { f.quiz = e.target.value; reload(); };
        AE.$('#hs-cls').onchange = (e) => { f.cls = e.target.value; reload(); };
        AE.$('#hs-from').onchange = (e) => { f.from = e.target.value; reload(); };
        AE.$('#hs-to').onchange = (e) => { f.to = e.target.value; reload(); };
        AE.$('#hs-rev').onchange = (e) => { f.review = e.target.checked; page = 0; loadTable(); };
        AE.$('#hs-csv').onclick = async (e) => {
          const b = e.currentTarget; b.disabled = true;
          try {
            const all = []; for (let i = 0; i < 20; i++) { const { data, error } = await query('display_name,class_id,quiz_id,score,max_score,percent,correct_count,graded_count,passed,needs_manual_review,duration_seconds,submitted_at,status').order('submitted_at').range(i * 1000, i * 1000 + 999); AE.dbErr(error); all.push(...data); if (data.length < 1000) break; }
            if (!all.length) { AE.toast('Tidak ada data untuk diekspor.', 'info'); return; }
            const head = ['waktu_kirim', 'nama_tampilan', 'kelas', 'kuis', 'nilai', 'nilai_maks', 'persen', 'benar', 'dinilai_otomatis', 'tuntas', 'menunggu_penilaian', 'durasi_detik', 'status'];
            const lines = all.map((r) => [new Date(r.submitted_at).toLocaleString('id-ID'), r.display_name, cmap[r.class_id] || '', qmap[r.quiz_id] || '', r.score, r.max_score, r.percent, r.correct_count, r.graded_count, r.passed ? 'ya' : 'tidak', r.needs_manual_review ? 'ya' : 'tidak', r.duration_seconds, r.status].map(AE.csvCell).join(','));
            AE.downloadCSV([head.join(','), ...lines].join('\n'), `nilai-arabiya-${new Date().toISOString().slice(0, 10)}.csv`);
            AE.toast(`${all.length} baris diekspor.`);
          } catch (err) { AE.toast(AE.errMsg(err), 'err'); } finally { b.disabled = false; }
        };
        reload();
      },
    };
  }), { nav: 'guru' });
  AE.CHOICE_TYPES = CHOICE;

  /* ---------------- PENGELOLAAN PERINGKAT ---------------- */
  route('/guru/peringkat', 'Kelola Peringkat', async () => pageWrap('peringkat', async () => {
    const db = AE.db();
    const { data, error } = await db.from('quiz_results').select('id,display_name,class_id,quiz_id,percent,consent_public,needs_manual_review,status,submitted_at').eq('consent_public', true).order('submitted_at', { ascending: false }).limit(200); AE.dbErr(error);
    const [{ data: lb }, { data: quizzes }, { data: classes }] = await Promise.all([db.from('leaderboard_entries').select('result_id'), db.from('quizzes').select('id,title'), db.from('classes').select('id,name')]);
    const on = new Set((lb || []).map((x) => x.result_id));
    const qmap = Object.fromEntries((quizzes || []).map((q) => [q.id, q.title])), cmap = Object.fromEntries((classes || []).map((c) => [c.id, c.name]));
    const rows = data || [];
    return {
      html: html`${AE.notice('', 'info', html`<p>Hanya hasil yang <b>disetujui siswa</b> untuk ditampilkan yang muncul di sini. Sembunyikan entri yang bermasalah (nama tidak pantas, dugaan kecurangan) — data hasil tetap tersimpan.</p>`)}
        ${rows.length ? html`<div class="table-wrap mt"><table class="table"><thead><tr><th>Nama</th><th>Kelas</th><th>Kuis</th><th class="num">Nilai</th><th>Di peringkat</th><th></th></tr></thead><tbody>${rows.map((r) => html`<tr><td><b>${r.display_name}</b></td><td>${cmap[r.class_id] || ''}</td><td class="small">${qmap[r.quiz_id] || ''}</td><td class="num">${AE.fmtNum(r.percent, 2)}</td>
          <td>${on.has(r.id) ? html`<span class="badge">Tampil</span>` : r.needs_manual_review ? html`<span class="badge gold">Menunggu penilaian</span>` : html`<span class="badge gray">Disembunyikan</span>`}</td>
          <td>${r.needs_manual_review ? '' : html`<button class="btn btn-sm ${on.has(r.id) ? 'btn-danger' : ''}" data-vis="${r.id}" data-on="${on.has(r.id)}">${on.has(r.id) ? 'Sembunyikan' : 'Tampilkan'}</button>`}</td></tr>`)}</tbody></table></div>` : AE.emptyView('trophy', 'Belum ada hasil publik', '')}`,
      mount() {
        AE.$('#view').onclick = async (e) => { const b = e.target.closest('[data-vis]'); if (!b) return; const showing = b.dataset.on === 'true'; if (showing && !(await AE.confirm('Sembunyikan dari peringkat?', 'Entri akan hilang dari papan peringkat publik secara real-time.', { okLabel: 'Sembunyikan' }))) return; try { await AE.rpc('set_result_visibility', { p_result_id: b.dataset.vis, p_visible: !showing }); AE.toast('Papan peringkat diperbarui.'); AE.render(); } catch (err) { AE.toast(AE.errMsg(err), 'err'); } };
      },
    };
  }), { nav: 'guru' });
})();
