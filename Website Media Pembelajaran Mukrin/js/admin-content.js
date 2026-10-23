/* ARABIYA EDU — Panel Guru: Materi, Kosakata, Percakapan, Kelas, Guru & log (CRUD dengan RLS) */
(function () {
  const AE = window.AE;
  const { html, ic, route } = AE;

  AE.dbErr = (error) => { if (error) throw error; };
  AE.readForm = (root) => {
    const o = {};
    root.querySelectorAll('[name]').forEach((el) => {
      if (el.type === 'checkbox') o[el.name] = el.checked;
      else if (el.dataset.type === 'int') o[el.name] = el.value === '' ? null : parseInt(el.value, 10);
      else if (el.dataset.type === 'num') o[el.name] = el.value === '' ? null : Number(el.value);
      else if (el.dataset.type === 'json') o[el.name] = el.value;
      else o[el.name] = el.value.trim();
    });
    return o;
  };
  const F = {
    text: (name, label, v = '', extra = {}) => html`<div class="field" style="${extra.full ? 'grid-column:1/-1' : ''}"><label for="f-${name}">${label}</label><input id="f-${name}" name="${name}" class="input ${extra.ar ? 'ar' : ''}" ${extra.ar ? 'dir="rtl" lang="ar"' : ''} value="${v ?? ''}" maxlength="${extra.max || 200}" ${extra.req ? 'required' : ''} ${extra.ph ? html`placeholder="${extra.ph}"` : ''}>${extra.hint ? html`<span class="hint">${extra.hint}</span>` : ''}</div>`,
    area: (name, label, v = '', extra = {}) => html`<div class="field" style="grid-column:1/-1"><label for="f-${name}">${label}</label><textarea id="f-${name}" name="${name}" class="input ${extra.ar ? 'ar' : ''} ${extra.mono ? 'mono' : ''}" ${extra.ar ? 'dir="rtl" lang="ar"' : ''} data-type="${extra.json ? 'json' : ''}" rows="${extra.rows || 4}" maxlength="${extra.max || 4000}">${v ?? ''}</textarea>${extra.hint ? html`<span class="hint">${extra.hint}</span>` : ''}</div>`,
    num: (name, label, v, extra = {}) => html`<div class="field"><label for="f-${name}">${label}</label><input id="f-${name}" name="${name}" type="number" class="input" data-type="${extra.int ? 'int' : 'num'}" value="${v ?? ''}" ${extra.min != null ? html`min="${extra.min}"` : ''} ${extra.max != null ? html`max="${extra.max}"` : ''} step="${extra.step || 'any'}">${extra.hint ? html`<span class="hint">${extra.hint}</span>` : ''}</div>`,
    sel: (name, label, v, opts, extra = {}) => html`<div class="field"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}" class="input" data-type="${extra.int ? 'int' : ''}">${opts.map(([k, l]) => html`<option value="${k}" ${String(k) === String(v) ? 'selected' : ''}>${l}</option>`)}</select></div>`,
    chk: (name, label, v) => html`<label class="check" style="grid-column:1/-1"><input type="checkbox" name="${name}" ${v ? 'checked' : ''}> ${label}</label>`,
  };
  AE.F = F;
  AE.gradeOpts = [[10, 'Kelas X'], [11, 'Kelas XI'], [12, 'Kelas XII']];

  /** Modal form generik. save(values) harus melempar error jika gagal. */
  AE.formModal = (title, fields, save, { wide = true } = {}) => AE.modal({
    title, wide, body: html`<form class="form-grid" data-noform>${fields}</form>`,
    actions: [{ label: 'Batal', value: null }, { label: 'Simpan', cls: 'btn-primary', onClick: async (root) => {
      const btn = root.querySelector('.btn-primary'); btn.disabled = true;
      try { const v = AE.readForm(root.querySelector('form')); await save(v); AE.toast('Perubahan disimpan.'); return true; }
      catch (e) { AE.toast(AE.errMsg(e), 'err', 6000); btn.disabled = false; return false; }
    } }],
  });
  const parseJSON = (s, label) => { try { return JSON.parse(s || 'null'); } catch (e) { throw new Error(`Format JSON pada “${label}” tidak valid.`); } };
  const linesToPairs = (s) => String(s || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => l.split('|').map((x) => x.trim())).filter((p) => p[0]);
  const pairsToLines = (arr) => (arr || []).map((p) => p.join(' | ')).join('\n');
  const listToLines = (arr) => (arr || []).join('\n');
  const linesToList = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);

  const pageWrap = (tab, fn) => AE.requireTeacher(async (p) => { const r = await fn(p); return { html: AE.adminShell(p, tab, r.html || r), mount: (root) => { AE.bindShell(); r.mount && r.mount(root); } }; });

  /* ---------------- MATERI ---------------- */
  const lessonFields = (l = {}) => html`
    ${F.text('title', 'Judul (Indonesia)', l.title, { req: true, max: 120 })}${F.text('title_ar', 'Judul (Arab berharakat)', l.title_ar, { ar: true, max: 120 })}
    ${F.text('slug', 'Slug URL', l.slug, { req: true, max: 60, hint: 'Huruf kecil, angka, tanda hubung. Contoh: perkenalan' })}
    ${F.sel('grade_level', 'Kelas', l.grade_level || 10, AE.gradeOpts, { int: true })}
    ${F.sel('category', 'Kategori', l.category || 'tema', [['tema', 'Materi tematik'], ['qawaid', 'Tata bahasa']])}
    ${F.sel('skill', 'Keterampilan', l.skill || 'mufradat', Object.entries(AE.SKILLS).map(([k, s]) => [k, s.label]))}
    ${F.sel('difficulty', 'Tingkat kesulitan', l.difficulty || 'mudah', Object.entries(AE.DIFF))}
    ${F.num('position', 'Urutan', l.position ?? 0, { int: true })}
    ${F.sel('vocab_category', 'Kategori kosakata terkait', l.vocab_category || '', [['', '(tidak ada)'], ...AE.VOCAB_CATEGORIES.map((c) => [c.id, c.label])])}
    ${F.area('objectives', 'Tujuan pembelajaran (satu per baris)', listToLines(l.objectives), { rows: 3 })}
    ${F.area('intro', 'Pengantar', l.intro, { rows: 3 })}
    ${F.area('explanation', 'Penjelasan (satu paragraf per baris)', listToLines(l.explanation), { rows: 4 })}
    ${F.area('examples', 'Contoh kalimat — format: Arab | terjemahan (satu per baris)', pairsToLines(l.examples), { rows: 4 })}
    ${F.area('daily', 'Penggunaan sehari-hari — format: Arab | keterangan', pairsToLines(l.daily), { rows: 2 })}
    ${F.area('passage_ar', 'Bacaan (Arab, opsional)', l.passage && l.passage.ar, { ar: true, rows: 3 })}${F.area('passage_id', 'Terjemahan bacaan', l.passage && l.passage.id, { rows: 2 })}
    ${F.area('exercises', 'Latihan interaktif (JSON)', JSON.stringify(l.exercises || [], null, 1), { mono: true, json: true, rows: 6, max: 20000, hint: 'Jenis: mcq {q, options[], answer:index}, tf {q, ar, answer:true/false}, fill {q, answer:[...]}, arrange {q, tokens[] urutan benar}. Tambahkan "explain".' })}
    ${F.area('summary', 'Rangkuman (satu per baris)', listToLines(l.summary), { rows: 3 })}
    ${F.area('reflection', 'Refleksi (satu per baris)', listToLines(l.reflection), { rows: 2 })}
    ${F.chk('is_published', 'Terbitkan (tampil untuk siswa)', l.is_published !== false)}`;
  const lessonRow = (v) => {
    const content = { objectives: linesToList(v.objectives), intro: v.intro, vocab_category: v.vocab_category, explanation: linesToList(v.explanation), examples: linesToPairs(v.examples), daily: linesToPairs(v.daily), exercises: parseJSON(v.exercises, 'Latihan') || [], summary: linesToList(v.summary), reflection: linesToList(v.reflection) };
    if (v.passage_ar) content.passage = { ar: v.passage_ar, id: v.passage_id };
    if (!/^[a-z0-9-]{2,60}$/.test(v.slug)) throw new Error('Slug hanya boleh huruf kecil, angka, dan tanda hubung (2–60 karakter).');
    return { slug: v.slug, title: v.title, title_ar: v.title_ar, grade_level: v.grade_level, category: v.category, skill: v.skill, difficulty: v.difficulty, position: v.position || 0, description: (v.intro || '').slice(0, 600), content, is_published: v.is_published };
  };
  const toDbLesson = (l, i) => ({ slug: l.slug, title: l.title, title_ar: l.title_ar, grade_level: l.grade_level, category: l.category, skill: l.skill, difficulty: l.difficulty, position: i, description: (l.intro || '').slice(0, 600), is_published: true,
    content: { objectives: l.objectives, intro: l.intro, vocab_category: l.vocab_category, explanation: l.explanation, examples: l.examples, daily: l.daily, passage: l.passage, table: l.table, exercises: l.exercises, summary: l.summary, reflection: l.reflection } });

  route('/guru/materi', 'Kelola Materi', async () => pageWrap('materi', async () => {
    const db = AE.db();
    const { data, error } = await db.from('lessons').select('*').order('category').order('grade_level').order('position'); AE.dbErr(error);
    const rows = data || [];
    return {
      html: html`<div class="row between mb"><p class="small muted" style="margin:0">Materi di database menggantikan materi bawaan. ${rows.length ? '' : 'Saat ini database kosong, sehingga siswa melihat materi bawaan.'}</p>
        <div class="btn-row">${!rows.length ? html`<button class="btn" id="m-import">${ic('download')} Impor ${AE.BUNDLED_THEME_LESSONS.length + AE.BUNDLED_GRAMMAR_LESSONS.length} materi bawaan</button>` : ''}<button class="btn btn-primary" id="m-add">${ic('plus')} Tambah materi</button></div></div>
        ${rows.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th>Urutan</th><th>Judul</th><th>Kelas</th><th>Kategori</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((r) => html`<tr>
          <td class="num">${r.position}</td><td><b>${r.title}</b> <span class="ar-inline" lang="ar" dir="rtl">${r.title_ar}</span><div class="tiny muted">/${r.slug}</div></td><td>${AE.GRADES[r.grade_level]}</td><td class="small">${r.category === 'qawaid' ? 'Tata bahasa' : 'Tematik'} · ${AE.SKILLS[r.skill].label}</td>
          <td>${r.is_archived ? html`<span class="badge gray">Diarsipkan</span>` : r.is_published ? html`<span class="badge">Terbit</span>` : html`<span class="badge gold">Disembunyikan</span>`}</td>
          <td><div class="row" style="flex-wrap:nowrap;gap:4px"><button class="btn btn-sm btn-icon" data-up="${r.id}" aria-label="Naikkan">${ic('arrow-up')}</button><button class="btn btn-sm btn-icon" data-down="${r.id}" aria-label="Turunkan">${ic('arrow-down')}</button><button class="btn btn-sm" data-edit="${r.id}">${ic('pencil')} Ubah</button>
            <button class="btn btn-sm" data-pub="${r.id}">${r.is_published ? 'Sembunyikan' : 'Terbitkan'}</button><button class="btn btn-sm" data-arc="${r.id}">${r.is_archived ? 'Pulihkan' : 'Arsipkan'}</button><button class="btn btn-sm btn-icon btn-danger" data-del="${r.id}" aria-label="Hapus">${ic('trash-2')}</button></div></td></tr>`)}</tbody></table></div>`
          : AE.emptyView('book-open', 'Belum ada materi di database', 'Impor materi bawaan untuk mulai mengedit, atau tambahkan materi baru.')}`,
      mount() {
        const done = () => { AE.invalidate('lessons'); AE.render(); };
        const byId = (id) => rows.find((r) => r.id === id);
        AE.$('#m-add').onclick = () => AE.formModal('Tambah materi', lessonFields(), async (v) => { const { error } = await db.from('lessons').insert(lessonRow(v)); AE.dbErr(error); }).then((ok) => ok && done());
        const imp = AE.$('#m-import');
        if (imp) imp.onclick = async () => { if (!(await AE.confirm('Impor materi bawaan?', 'Materi contoh akan disalin ke database agar dapat diedit, diurutkan, dan disembunyikan.', { okLabel: 'Impor' }))) return; const all = [...AE.BUNDLED_THEME_LESSONS, ...AE.BUNDLED_GRAMMAR_LESSONS].map(toDbLesson); const { error } = await db.from('lessons').upsert(all, { onConflict: 'slug', ignoreDuplicates: true }); if (error) return AE.toast(AE.errMsg(error), 'err'); AE.toast('Materi diimpor.'); done(); };
        document.querySelector('#view').onclick = async (e) => {
          const b = e.target.closest('button'); if (!b) return;
          const d = b.dataset;
          if (d.edit) { const r = byId(d.edit); const l = { ...r, ...(r.content || {}) }; if (await AE.formModal('Ubah materi', lessonFields(l), async (v) => { const { error } = await db.from('lessons').update(lessonRow(v)).eq('id', r.id); AE.dbErr(error); })) done(); }
          if (d.pub) { const r = byId(d.pub); const { error } = await db.from('lessons').update({ is_published: !r.is_published }).eq('id', r.id); error ? AE.toast(AE.errMsg(error), 'err') : done(); }
          if (d.arc) { const r = byId(d.arc); if (!r.is_archived && !(await AE.confirm('Arsipkan materi?', 'Materi tidak akan tampil untuk siswa, tetapi data tetap tersimpan dan dapat dipulihkan.', { okLabel: 'Arsipkan' }))) return; const { error } = await db.from('lessons').update({ is_archived: !r.is_archived }).eq('id', r.id); error ? AE.toast(AE.errMsg(error), 'err') : done(); }
          if (d.del) { const r = byId(d.del); if (!(await AE.confirm('Hapus materi permanen?', `“${r.title}” akan dihapus permanen. Kuis yang terhubung tetap ada. Pertimbangkan “Arsipkan” jika ragu.`, { okLabel: 'Hapus permanen', danger: true }))) return; const { error } = await db.from('lessons').delete().eq('id', r.id); error ? AE.toast(AE.errMsg(error), 'err') : done(); }
          if (d.up || d.down) {
            const r = byId(d.up || d.down); const peers = rows.filter((x) => x.category === r.category && x.grade_level === r.grade_level); const i = peers.indexOf(r); const j = d.up ? i - 1 : i + 1;
            if (j < 0 || j >= peers.length) return;
            const o = peers[j]; const a = r.position === o.position ? (d.up ? o.position - 1 : o.position + 1) : o.position;
            const e1 = await db.from('lessons').update({ position: a }).eq('id', r.id); const e2 = await db.from('lessons').update({ position: r.position }).eq('id', o.id);
            (e1.error || e2.error) ? AE.toast(AE.errMsg(e1.error || e2.error), 'err') : done();
          }
        };
      },
    };
  }), { nav: 'guru' });

  /* ---------------- KOSAKATA ---------------- */
  const vocabFields = (v = {}) => html`${F.text('arabic', 'Kata Arab berharakat', v.arabic, { ar: true, req: true, max: 80 })}${F.text('meaning', 'Arti', v.meaning, { req: true, max: 120 })}
    ${F.text('latin', 'Transliterasi', v.latin, { max: 80 })}${F.sel('word_type', 'Jenis kata', v.word_type || '', [['', '–'], ...Object.entries(AE.WORD_TYPES)])}
    ${F.sel('category', 'Kategori', v.category || 'sekolah', AE.VOCAB_CATEGORIES.map((c) => [c.id, c.label]))}${F.sel('grade_level', 'Kelas', v.grade_level || 10, AE.gradeOpts, { int: true })}
    ${F.text('example_ar', 'Contoh kalimat (Arab)', v.example_ar, { ar: true, max: 300, full: true })}${F.text('example_id', 'Terjemahan contoh', v.example_id, { max: 300, full: true })}
    ${F.text('image_url', 'URL gambar (https, opsional)', v.image_url, { max: 500, hint: 'Gunakan gambar yang legal dipakai. Kosongkan untuk ikon/placeholder.' })}${F.text('audio_url', 'URL audio rekaman (https, opsional)', v.audio_url, { max: 500 })}
    ${F.text('icon', 'Nama ikon Lucide (opsional)', v.icon, { max: 40, hint: 'Contoh: school, book, apple' })}${F.chk('is_published', 'Terbitkan', v.is_published !== false)}`;
  route('/guru/kosakata', 'Kelola Kosakata', async () => pageWrap('kosakata', async () => {
    const db = AE.db();
    const { data, error } = await db.from('vocabulary').select('*').order('category').order('created_at').limit(2000); AE.dbErr(error);
    const rows = data || [];
    return {
      html: html`<div class="row between mb"><div class="search" style="flex:1 1 260px">${ic('search')}<input id="kv-q" class="input" placeholder="Cari…" aria-label="Cari kosakata"></div>
        <div class="btn-row">${!rows.length ? html`<button class="btn" id="kv-import">${ic('download')} Impor ${AE.BUNDLED_VOCAB.length} kosakata bawaan</button>` : ''}<button class="btn btn-primary" id="kv-add">${ic('plus')} Tambah kosakata</button></div></div>
        <div id="kv-body"></div>`,
      mount() {
        const done = () => { AE.invalidate('vocab'); AE.render(); };
        const body = AE.$('#kv-body');
        const draw = (q = '') => { const n = AE.normText(q); const list = rows.filter((r) => !n || AE.normText(r.arabic).includes(n) || r.meaning.toLowerCase().includes(n)); body.innerHTML = list.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th style="text-align:right">Arab</th><th>Arti</th><th>Kategori</th><th>Kelas</th><th>Status</th><th></th></tr></thead><tbody>${list.slice(0, 300).map((r) => html`<tr><td style="text-align:right"><span class="ar-inline" lang="ar" dir="rtl">${r.arabic}</span></td><td>${r.meaning}</td><td class="small">${(AE.VOCAB_CATEGORIES.find((c) => c.id === r.category) || {}).label || r.category}</td><td>${AE.GRADES[r.grade_level]}</td><td>${r.is_published ? html`<span class="badge">Terbit</span>` : html`<span class="badge gold">Disembunyikan</span>`}</td><td><div class="row" style="flex-wrap:nowrap;gap:4px"><button class="btn btn-sm" data-edit="${r.id}">${ic('pencil')} Ubah</button><button class="btn btn-sm btn-icon btn-danger" data-del="${r.id}" aria-label="Hapus">${ic('trash-2')}</button></div></td></tr>`)}</tbody></table></div>`.s : AE.emptyView('whole-word', 'Belum ada kosakata di database', 'Siswa saat ini melihat kosakata bawaan.').s; };
        draw();
        AE.$('#kv-q').oninput = AE.debounce((e) => draw(e.target.value), 150);
        const clean = (v) => { ['image_url', 'audio_url'].forEach((k) => { if (v[k] && !/^https:\/\//.test(v[k])) throw new Error('URL gambar/audio harus diawali https://'); }); if (v.icon && !/^[a-z0-9-]{0,40}$/.test(v.icon)) throw new Error('Nama ikon tidak valid.'); return v; };
        AE.$('#kv-add').onclick = () => AE.formModal('Tambah kosakata', vocabFields(), async (v) => { const { error } = await db.from('vocabulary').insert(clean(v)); AE.dbErr(error); }).then((ok) => ok && done());
        const imp = AE.$('#kv-import');
        if (imp) imp.onclick = async () => { if (!(await AE.confirm('Impor kosakata bawaan?', 'Kosakata contoh disalin ke database agar dapat diedit.', { okLabel: 'Impor' }))) return; const all = AE.BUNDLED_VOCAB.map(({ id, position, ...r }) => r); const { error } = await db.from('vocabulary').insert(all); if (error) return AE.toast(AE.errMsg(error), 'err'); AE.toast('Kosakata diimpor.'); done(); };
        body.onclick = async (e) => {
          const b = e.target.closest('button'); if (!b) return; const r = rows.find((x) => x.id === (b.dataset.edit || b.dataset.del));
          if (b.dataset.edit) { if (await AE.formModal('Ubah kosakata', vocabFields(r), async (v) => { const { error } = await db.from('vocabulary').update(clean(v)).eq('id', r.id); AE.dbErr(error); })) done(); }
          if (b.dataset.del) { if (!(await AE.confirm('Hapus kosakata?', `“${r.arabic} — ${r.meaning}” akan dihapus permanen.`, { okLabel: 'Hapus', danger: true }))) return; const { error } = await db.from('vocabulary').delete().eq('id', r.id); error ? AE.toast(AE.errMsg(error), 'err') : done(); }
        };
      },
    };
  }), { nav: 'guru' });

  /* ---------------- PERCAKAPAN ---------------- */
  const convFields = (c = {}) => html`${F.text('title', 'Judul', c.title, { req: true, max: 120 })}${F.text('title_ar', 'Judul Arab', c.title_ar, { ar: true, max: 120 })}
    ${F.text('slug', 'Slug URL', c.slug, { req: true, max: 60 })}${F.sel('grade_level', 'Kelas', c.grade_level || 10, AE.gradeOpts, { int: true })}${F.num('position', 'Urutan', c.position ?? 0, { int: true })}
    ${F.area('lines', 'Baris dialog — format: Nama tokoh (Arab) | Teks Arab | Terjemahan', (c.lines || []).map((l) => [l.speaker, l.ar, l.id].join(' | ')).join('\n'), { rows: 8, max: 10000 })}
    ${F.chk('is_published', 'Terbitkan', c.is_published !== false)}`;
  const convRow = (v) => { if (!/^[a-z0-9-]{2,60}$/.test(v.slug)) throw new Error('Slug tidak valid.'); const lines = linesToPairs(v.lines).map((p) => ({ speaker: p[0], ar: p[1] || '', id: p[2] || '' })); if (lines.length < 2) throw new Error('Minimal 2 baris dialog.'); return { slug: v.slug, title: v.title, title_ar: v.title_ar, grade_level: v.grade_level, position: v.position || 0, lines, is_published: v.is_published }; };
  route('/guru/percakapan', 'Kelola Percakapan', async () => pageWrap('percakapan', async () => {
    const db = AE.db();
    const { data, error } = await db.from('conversations').select('*').order('grade_level').order('position'); AE.dbErr(error);
    const rows = data || [];
    return {
      html: html`<div class="row between mb"><p class="small muted" style="margin:0">${rows.length ? '' : 'Database kosong — siswa melihat percakapan bawaan.'}</p><div class="btn-row">${!rows.length ? html`<button class="btn" id="cv-import">${ic('download')} Impor percakapan bawaan</button>` : ''}<button class="btn btn-primary" id="cv-add">${ic('plus')} Tambah percakapan</button></div></div>
        ${rows.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th>Judul</th><th>Kelas</th><th>Baris</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((r) => html`<tr><td><b>${r.title}</b> <span class="ar-inline" lang="ar" dir="rtl">${r.title_ar}</span></td><td>${AE.GRADES[r.grade_level]}</td><td class="num">${(r.lines || []).length}</td><td>${r.is_published ? html`<span class="badge">Terbit</span>` : html`<span class="badge gold">Disembunyikan</span>`}</td><td><div class="row" style="flex-wrap:nowrap;gap:4px"><button class="btn btn-sm" data-edit="${r.id}">${ic('pencil')} Ubah</button><button class="btn btn-sm btn-icon btn-danger" data-del="${r.id}" aria-label="Hapus">${ic('trash-2')}</button></div></td></tr>`)}</tbody></table></div>` : AE.emptyView('messages-square', 'Belum ada percakapan di database', '')}`,
      mount() {
        const done = () => { AE.invalidate('conv'); AE.render(); };
        AE.$('#cv-add').onclick = () => AE.formModal('Tambah percakapan', convFields(), async (v) => { const { error } = await db.from('conversations').insert(convRow(v)); AE.dbErr(error); }).then((ok) => ok && done());
        const imp = AE.$('#cv-import'); if (imp) imp.onclick = async () => { const all = AE.BUNDLED_CONVERSATIONS.map(({ id, ...c }) => ({ ...c, is_published: true })); const { error } = await db.from('conversations').upsert(all, { onConflict: 'slug', ignoreDuplicates: true }); if (error) return AE.toast(AE.errMsg(error), 'err'); AE.toast('Percakapan diimpor.'); done(); };
        AE.$('#view').onclick = async (e) => {
          const b = e.target.closest('button[data-edit],button[data-del]'); if (!b) return; const r = rows.find((x) => x.id === (b.dataset.edit || b.dataset.del));
          if (b.dataset.edit) { if (await AE.formModal('Ubah percakapan', convFields(r), async (v) => { const { error } = await db.from('conversations').update(convRow(v)).eq('id', r.id); AE.dbErr(error); })) done(); }
          else { if (!(await AE.confirm('Hapus percakapan?', `“${r.title}” akan dihapus permanen.`, { okLabel: 'Hapus', danger: true }))) return; const { error } = await db.from('conversations').delete().eq('id', r.id); error ? AE.toast(AE.errMsg(error), 'err') : done(); }
        };
      },
    };
  }), { nav: 'guru' });

  /* ---------------- KELAS ---------------- */
  route('/guru/kelas', 'Kelola Kelas', async () => pageWrap('kelas', async () => {
    const db = AE.db();
    const { data, error } = await db.from('classes').select('*').order('grade_level').order('name'); AE.dbErr(error);
    const rows = data || [];
    const fields = (c = {}) => html`${F.text('name', 'Nama kelas', c.name, { req: true, max: 40, ph: 'contoh: X IPA 1' })}${F.sel('grade_level', 'Tingkat', c.grade_level || 10, AE.gradeOpts, { int: true })}${F.chk('is_active', 'Aktif (dapat dipilih siswa)', c.is_active !== false)}`;
    return {
      html: html`<div class="row between mb"><p class="small muted" style="margin:0">Siswa memilih kelas dari daftar ini saat mengirim hasil.</p><div class="btn-row"><button class="btn" id="kl-bulk">${ic('list-plus')} Tambah banyak</button><button class="btn btn-primary" id="kl-add">${ic('plus')} Tambah kelas</button></div></div>
        ${rows.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th>Nama</th><th>Tingkat</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((r) => html`<tr><td><b>${r.name}</b></td><td>${AE.GRADES[r.grade_level]}</td><td>${r.is_active ? html`<span class="badge">Aktif</span>` : html`<span class="badge gray">Nonaktif</span>`}</td><td><div class="row" style="flex-wrap:nowrap;gap:4px"><button class="btn btn-sm" data-edit="${r.id}">${ic('pencil')} Ubah</button><button class="btn btn-sm btn-icon btn-danger" data-del="${r.id}" aria-label="Hapus">${ic('trash-2')}</button></div></td></tr>`)}</tbody></table></div>` : AE.emptyView('users', 'Belum ada kelas', 'Tambahkan kelas agar siswa dapat mengirim hasil latihan.')}`,
      mount() {
        const done = () => { AE.invalidate('classes'); AE.render(); };
        AE.$('#kl-add').onclick = () => AE.formModal('Tambah kelas', fields(), async (v) => { const { error } = await db.from('classes').insert(v); AE.dbErr(error); }, { wide: false }).then((ok) => ok && done());
        AE.$('#kl-bulk').onclick = () => AE.formModal('Tambah banyak kelas', html`${F.sel('grade_level', 'Tingkat', 10, AE.gradeOpts, { int: true })}${F.area('names', 'Nama kelas (satu per baris)', '', { rows: 6, ph: 'X IPA 1' })}`, async (v) => { const list = linesToList(v.names).map((name) => ({ name: name.slice(0, 40), grade_level: v.grade_level })); if (!list.length) throw new Error('Isi minimal satu nama kelas.'); const { error } = await db.from('classes').upsert(list, { onConflict: 'name', ignoreDuplicates: true }); AE.dbErr(error); }, { wide: false }).then((ok) => ok && done());
        AE.$('#view').onclick = async (e) => {
          const b = e.target.closest('button[data-edit],button[data-del]'); if (!b) return; const r = rows.find((x) => x.id === (b.dataset.edit || b.dataset.del));
          if (b.dataset.edit) { if (await AE.formModal('Ubah kelas', fields(r), async (v) => { const { error } = await db.from('classes').update(v).eq('id', r.id); AE.dbErr(error); }, { wide: false })) done(); }
          else { if (!(await AE.confirm('Hapus kelas?', `Kelas “${r.name}” akan dihapus. Hasil siswa tetap tersimpan, tetapi tidak lagi terhubung ke kelas ini. Disarankan menonaktifkan saja.`, { okLabel: 'Hapus', danger: true }))) return; const { error } = await db.from('classes').delete().eq('id', r.id); error ? AE.toast(AE.errMsg(error), 'err') : done(); }
        };
      },
    };
  }), { nav: 'guru' });

  /* ---------------- GURU & LOG ---------------- */
  route('/guru/akun', 'Guru & Log', async () => pageWrap('akun', async (p) => {
    const db = AE.db();
    const isAdmin = p.teacher.role === 'admin';
    let teachers = [], logs = [];
    if (isAdmin) {
      teachers = (await AE.rpc('list_teachers')) || [];
      const { data } = await db.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100); logs = data || [];
    }
    return {
      html: html`<div class="grid grid-2" style="align-items:start">
        <div class="card"><h3>Profil saya</h3><p class="small">${p.user.email}<br>Peran: <b>${isAdmin ? 'Administrator' : 'Guru'}</b></p>
          <form id="pw-form" class="stack-sm"><div class="field"><label for="pw-new">Ganti kata sandi</label><input id="pw-new" type="password" class="input" minlength="10" maxlength="200" autocomplete="new-password"><span class="hint">Minimal 10 karakter.</span></div><button class="btn" type="submit">${ic('key-round')} Simpan kata sandi</button></form></div>
        ${isAdmin ? html`<div class="card"><h3>Guru terdaftar</h3>
          <div class="stack-sm">${teachers.map((t) => html`<div class="row between" style="flex-wrap:nowrap"><div><b class="small">${t.full_name || t.email}</b><div class="tiny muted">${t.email} · ${t.role === 'admin' ? 'Administrator' : 'Guru'}</div></div>${t.user_id !== p.user.id ? html`<button class="btn btn-sm ${t.is_active ? 'btn-danger' : ''}" data-tog="${t.user_id}" data-act="${t.is_active}">${t.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button>` : html`<span class="badge">Anda</span>`}</div>`)}</div>
          <hr style="border:0;border-top:1px solid var(--line);margin:16px 0">
          <form id="tg-form" class="stack-sm"><p class="small muted" style="margin:0">Buat akun dulu di Supabase → Authentication → Users → Add user, lalu daftarkan di sini.</p>
            <div class="field"><label for="tg-email">Email akun</label><input id="tg-email" type="email" class="input" required maxlength="120"></div>
            <div class="field"><label for="tg-name">Nama</label><input id="tg-name" class="input" maxlength="80"></div>
            <div class="field"><label for="tg-role">Peran</label><select id="tg-role" class="input"><option value="teacher">Guru</option><option value="admin">Administrator</option></select></div>
            <button class="btn btn-primary" type="submit">${ic('user-plus')} Daftarkan sebagai guru</button></form></div>` : ''}</div>
        ${isAdmin ? html`<div class="section"><h2>Log tindakan administratif</h2>${logs.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th>Waktu</th><th>Tindakan</th><th>Data</th><th>Keterangan</th></tr></thead><tbody>${logs.map((l) => html`<tr><td class="small">${AE.fmtDate(l.created_at)}</td><td><span class="badge gray">${l.action}</span></td><td class="small">${l.entity}</td><td class="small">${(l.details && (l.details.title || l.details.points)) || ''}</td></tr>`)}</tbody></table></div>` : html`<p class="small muted">Belum ada log.</p>`}</div>` : ''}`,
      mount() {
        AE.$('#pw-form').onsubmit = async (e) => { e.preventDefault(); const v = AE.$('#pw-new').value; if (v.length < 10) return AE.toast('Kata sandi minimal 10 karakter.', 'err'); const { error } = await db.auth.updateUser({ password: v }); error ? AE.toast(AE.errMsg(error), 'err') : (AE.toast('Kata sandi diperbarui.'), (AE.$('#pw-new').value = '')); };
        const tg = AE.$('#tg-form');
        if (tg) tg.onsubmit = async (e) => { e.preventDefault(); try { await AE.rpc('grant_teacher_by_email', { p_email: AE.$('#tg-email').value, p_role: AE.$('#tg-role').value, p_name: AE.$('#tg-name').value }); AE.toast('Guru didaftarkan.'); AE.render(); } catch (err) { AE.toast(AE.errMsg(err), 'err'); } };
        AE.$('#view').addEventListener('click', async (e) => { const b = e.target.closest('[data-tog]'); if (!b) return; const act = b.dataset.act === 'true'; if (act && !(await AE.confirm('Nonaktifkan guru?', 'Akun ini tidak lagi dapat mengakses Panel Guru.', { okLabel: 'Nonaktifkan', danger: true }))) return; const { error } = await db.from('teacher_profiles').update({ is_active: !act }).eq('user_id', b.dataset.tog); error ? AE.toast(AE.errMsg(error), 'err') : AE.render(); });
      },
    };
  }), { nav: 'guru' });
})();
