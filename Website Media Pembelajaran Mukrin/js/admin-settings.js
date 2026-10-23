/* ARABIYA EDU — Panel Guru: autentikasi, kerangka, dan Pengaturan Koneksi Supabase */
(function () {
  const AE = window.AE;
  const { html, ic, route } = AE;

  /* ---------- Autentikasi guru (Supabase Auth + cek teacher_profiles di server via RLS) ---------- */
  AE.auth = {
    async session() { const db = AE.db(); if (!db) return null; const { data } = await db.auth.getSession(); return data.session; },
    async profile() {
      const db = AE.db(); const s = await this.session(); if (!s) return null;
      const { data, error } = await db.from('teacher_profiles').select('user_id,full_name,role,is_active').eq('user_id', s.user.id).maybeSingle();
      if (error || !data || !data.is_active) return { user: s.user, teacher: null };
      return { user: s.user, teacher: data };
    },
    async signIn(email, password) { const { error } = await AE.db().auth.signInWithPassword({ email, password }); if (error) throw error; },
    async signOut() { const db = AE.db(); if (db) await db.auth.signOut(); },
  };

  const loginView = (msg) => html`<div class="card" style="max-width:440px;margin:20px auto">
    <div class="row mb" style="flex-wrap:nowrap"><span class="icon-tile">${ic('lock-keyhole')}</span><div><h1 style="margin:0;font-size:1.4rem">Panel Guru</h1><span class="small muted">Khusus guru/administrator yang berwenang</span></div></div>
    ${msg ? html`<div class="mb">${msg}</div>` : ''}
    <form id="lg-form" class="stack" novalidate>
      <div class="field"><label for="lg-email">Email</label><input id="lg-email" type="email" class="input" autocomplete="username" required maxlength="120"></div>
      <div class="field"><label for="lg-pass">Kata sandi</label><input id="lg-pass" type="password" class="input" autocomplete="current-password" required maxlength="200"></div>
      <button class="btn btn-primary" type="submit" id="lg-go">${ic('log-in')} Masuk</button>
      <p class="tiny muted" style="margin:0">Akun guru dibuat oleh administrator di Supabase → Authentication. Siswa tidak memerlukan akun.</p></form></div>`;

  /** Lindungi halaman guru. Pemeriksaan sesungguhnya ada di database (RLS + is_teacher()). */
  AE.requireTeacher = async (render, { adminOnly = false } = {}) => {
    if (!AE.dbReady()) {
      return html`<div class="page-head"><h1>Panel Guru</h1></div>${AE.notice('warn', 'database', html`<p><b>Database belum dikonfigurasi.</b> Panel Guru memerlukan koneksi Supabase. Ikuti panduan di <a href="#/guru/supabase">Pengaturan Supabase</a> (halaman panduan dapat dibuka tanpa login karena belum ada database).</p>`)}`;
    }
    const p = await AE.auth.profile();
    if (!p) return { html: loginView(), mount: mountLogin };
    if (!p.teacher) return { html: loginView(AE.notice('err', 'shield-x', html`<p>Akun <b>${p.user.email}</b> belum terdaftar sebagai guru aktif. Minta administrator menambahkan akun Anda. <button class="btn btn-sm" id="lg-out">Keluar</button></p>`)), mount: (r) => { mountLogin(r); AE.$('#lg-out').onclick = async () => { await AE.auth.signOut(); AE.render(); }; } };
    if (adminOnly && p.teacher.role !== 'admin') return html`${AE.notice('err', 'shield-x', html`<p>Halaman ini khusus administrator.</p>`)}`;
    AE.me = p;
    return render(p);
  };
  function mountLogin() {
    const f = AE.$('#lg-form'); if (!f) return;
    f.onsubmit = async (e) => {
      e.preventDefault();
      const email = AE.$('#lg-email').value.trim(), pass = AE.$('#lg-pass').value;
      if (!email || !pass) return AE.toast('Isi email dan kata sandi.', 'err');
      const b = AE.$('#lg-go'); b.disabled = true; b.innerHTML = html`<span class="spinner"></span> Memeriksa…`.s;
      try { await AE.auth.signIn(email, pass); AE.toast('Berhasil masuk.'); AE.render(); }
      catch (err) { AE.toast(AE.errMsg(err), 'err'); b.disabled = false; b.innerHTML = html`${ic('log-in')} Masuk`.s; }
    };
  }

  AE.ADMIN_TABS = [
    ['', 'layout-dashboard', 'Ringkasan'], ['hasil', 'table', 'Hasil & statistik'], ['kuis', 'list-checks', 'Kuis & soal'],
    ['materi', 'book-open', 'Materi'], ['kosakata', 'whole-word', 'Kosakata'], ['percakapan', 'messages-square', 'Percakapan'],
    ['kelas', 'users', 'Kelas'], ['peringkat', 'trophy', 'Peringkat'], ['akun', 'user-cog', 'Guru & log'], ['supabase', 'database', 'Supabase'],
  ];
  AE.adminShell = (p, tab, content) => html`<div class="row between mb"><div><div class="eyebrow" style="margin:0">Panel Guru</div><span class="small muted">${p.teacher.full_name || p.user.email} · ${p.teacher.role === 'admin' ? 'Administrator' : 'Guru'}</span></div>
      <button class="btn btn-sm" id="adm-out">${ic('log-out')} Keluar</button></div>
    <nav class="tabs" aria-label="Menu panel guru">${AE.ADMIN_TABS.map(([k, i, l]) => html`<a class="tab" href="#/guru${k ? '/' + k : ''}" aria-selected="${k === tab}" style="text-decoration:none">${ic(i)} ${l}</a>`)}</nav>${content}`;
  AE.bindShell = () => { const b = AE.$('#adm-out'); if (b) b.onclick = async () => { if (await AE.confirm('Keluar dari Panel Guru?', 'Anda perlu masuk lagi untuk mengelola data.', { okLabel: 'Keluar' })) { await AE.auth.signOut(); AE.toast('Anda telah keluar.'); AE.go('/'); } }; };

  /* ---------- Ringkasan ---------- */
  route('/guru', 'Panel Guru', async () => AE.requireTeacher(async (p) => {
    const db = AE.db();
    const counts = {};
    await Promise.all(['lessons', 'vocabulary', 'conversations', 'quizzes', 'classes', 'quiz_results'].map(async (t) => { const { count } = await db.from(t).select('*', { count: 'exact', head: true }); counts[t] = count || 0; }));
    const { count: pending } = await db.from('quiz_results').select('*', { count: 'exact', head: true }).eq('needs_manual_review', true);
    const steps = [
      [counts.classes > 0, 'Tambahkan daftar kelas', '/guru/kelas'],
      [counts.quizzes > 0, 'Buat atau impor kuis', '/guru/kuis'],
      [counts.lessons > 0, '(Opsional) Impor materi bawaan ke database agar dapat diedit', '/guru/materi'],
    ];
    return {
      html: AE.adminShell(p, '', html`<div class="grid grid-4 mb">${[['quiz_results', 'Hasil masuk', 'table'], ['quizzes', 'Kuis', 'list-checks'], ['classes', 'Kelas', 'users'], ['lessons', 'Materi (database)', 'book-open'], ['vocabulary', 'Kosakata (database)', 'whole-word'], ['conversations', 'Percakapan (database)', 'messages-square']].map(([k, l, i]) => html`<div class="card-flat row" style="flex-wrap:nowrap"><span class="icon-tile">${ic(i)}</span><div><div class="stat-num" style="font-size:1.4rem">${counts[k]}</div><div class="tiny muted">${l}</div></div></div>`)}</div>
        ${pending ? AE.notice('warn', 'clock', html`<p><b>${pending}</b> hasil menunggu penilaian soal uraian. <a href="#/guru/hasil">Nilai sekarang</a></p>`) : ''}
        <div class="card mt"><h3>Langkah persiapan</h3><div class="stack-sm">${steps.map(([ok, t, h]) => html`<a class="status-item ${ok ? '' : 'warn'}" href="#${h}" style="text-decoration:none;color:inherit">${ic(ok ? 'circle-check' : 'circle-dashed')} ${t}</a>`)}</div>
          <p class="tiny muted mt-s">Selama tabel materi/kosakata/percakapan di database kosong, website menampilkan konten contoh bawaan.</p></div>`),
      mount: AE.bindShell,
    };
  }), { nav: 'guru' });

  /* ---------- Pengaturan Koneksi Supabase ---------- */
  const statusMeta = {
    none: ['circle-dashed', 'warn', 'Belum dikonfigurasi'],
    partial: ['circle-alert', 'warn', 'Konfigurasi belum lengkap'],
    ok: ['circle-check', '', 'Koneksi berhasil'],
    error: ['circle-x', 'bad', 'Koneksi gagal'],
    'bad-key': ['key-round', 'bad', 'Kunci API tidak valid'],
    secret: ['shield-alert', 'bad', 'Kunci rahasia terdeteksi — tidak boleh dipakai di frontend'],
    'no-tables': ['table', 'bad', 'Tabel belum tersedia — jalankan SQL'],
    policy: ['shield-x', 'bad', 'Kebijakan akses bermasalah'],
    outdated: ['refresh-cw', 'warn', 'Konfigurasi/skema perlu diperbarui — jalankan ulang SQL terbaru'],
    realtime: ['radio', 'warn', 'Realtime belum siap'],
  };
  const statusRow = (k, extra = '') => { const [i, c, t] = statusMeta[k]; return html`<div class="status-item ${c}">${ic(i)}<span><b>${t}</b>${extra ? html` — ${extra}` : ''}</span></div>`; };

  async function testConnection(url, key) {
    const out = [];
    if (!url && !key) return [statusRow('none')];
    if (!url || !key) return [statusRow('partial', !url ? 'Project URL kosong' : 'Publishable key kosong')];
    if (AE.isSecretKey(key)) return [statusRow('secret', 'gunakan publishable key / anon public key, bukan secret/service_role')];
    if (!AE.validUrl(url)) return [statusRow('partial', 'format Project URL tidak valid (contoh: https://abcd.supabase.co)')];
    const client = window.supabase.createClient(url.replace(/\/$/, ''), key, { auth: { persistSession: false } });
    let h;
    try {
      const { data, error } = await client.rpc('arabiya_health');
      if (error) throw error;
      h = data;
    } catch (e) {
      const m = String(e.message || e.code || e);
      if (/Could not find the function|PGRST202|schema cache/i.test(m)) return [statusRow('no-tables', 'fungsi arabiya_health() tidak ditemukan')];
      if (/Invalid API key|JWT|apikey|401/i.test(m)) return [statusRow('bad-key')];
      if (/permission denied|42501/i.test(m)) return [statusRow('policy', 'role anon tidak dapat menjalankan fungsi publik')];
      return [statusRow('error', AE.isNetworkErr(e) ? 'server tidak dapat dihubungi (periksa URL & internet)' : 'periksa URL dan key')];
    }
    out.push(statusRow('ok', `skema versi ${h.schema_version}`));
    if (String(h.schema_version) !== AE.EXPECTED_SCHEMA) out.push(statusRow('outdated', `aplikasi mengharapkan versi ${AE.EXPECTED_SCHEMA}`));
    out.push(h.rls_ok ? html`<div class="status-item">${ic('shield-check')}<span><b>RLS aktif</b> di semua tabel aplikasi</span></div>` : statusRow('policy', 'ada tabel tanpa RLS — jalankan ulang SQL'));
    // Uji bahwa publik TIDAK bisa membaca kunci jawaban & hasil internal
    const leak = [];
    for (const t of ['questions', 'quiz_results', 'quiz_sessions']) {
      const { data, error } = await client.from(t).select('id').limit(1);
      if (!error && data && data.length) leak.push(t);
    }
    out.push(leak.length ? statusRow('policy', 'tabel berikut terbaca publik: ' + leak.join(', ')) : html`<div class="status-item">${ic('lock')}<span><b>Data internal terlindungi</b> — publik tidak dapat membaca soal/kunci, sesi, dan hasil</span></div>`);
    const { error: lbErr } = await client.from('leaderboard_entries').select('id').limit(1);
    out.push(lbErr ? statusRow('policy', 'papan peringkat tidak dapat dibaca publik') : html`<div class="status-item">${ic('trophy')}<span><b>Papan peringkat</b> dapat dibaca publik</span></div>`);
    if (!h.realtime_leaderboard) out.push(statusRow('realtime', 'tabel leaderboard_entries belum masuk publikasi supabase_realtime'));
    else {
      const rt = await new Promise((resolve) => {
        const ch = client.channel('ae-test-' + Math.random().toString(36).slice(2));
        const t = setTimeout(() => { client.removeChannel(ch); resolve(false); }, 8000);
        ch.on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard_entries' }, () => {}).subscribe((s) => { if (s === 'SUBSCRIBED') { clearTimeout(t); client.removeChannel(ch); resolve(true); } else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') { clearTimeout(t); client.removeChannel(ch); resolve(false); } });
      });
      out.push(rt ? html`<div class="status-item">${ic('radio')}<span><b>Realtime siap</b> untuk papan peringkat</span></div>` : statusRow('realtime', 'langganan kanal gagal; periksa pengaturan Realtime di dashboard'));
    }
    return out;
  }

  route('/guru/supabase', 'Pengaturan Supabase', async () => {
    const deployed = AE.config.deployed();
    const active = AE.config.active();
    // Bila sudah ada konfigurasi produksi, halaman ini wajib login admin.
    if (active.source === 'deployed' || active.source === 'preview') {
      return AE.requireTeacher((p) => settingsPage(p, deployed, active), { adminOnly: true });
    }
    return settingsPage(null, deployed, active);
  }, { nav: 'guru' });

  function settingsPage(p, deployed, active) {
    const content = html`
      <div class="page-head"><h1>Hubungkan ke Supabase</h1><p>Database menyimpan kuis, soal & kunci jawaban (tersembunyi), hasil nilai, dan papan peringkat. Pengaturan ini dilakukan <b>satu kali oleh pemilik website</b>. Siswa tidak perlu memasukkan URL atau kunci apa pun.</p></div>
      <div class="card mb"><div class="row between"><h3 style="margin:0">Status konfigurasi saat ini</h3><span class="badge ${active.source === 'deployed' ? '' : 'gray'}">${active.source === 'deployed' ? 'Konfigurasi produksi (config.js)' : active.source === 'preview' ? 'Pratinjau di browser ini saja' : 'Belum ada'}</span></div>
        <div class="status-list mt-s" id="st-now">${AE.loadingView('Memeriksa…')}</div>
        ${active.source === 'preview' ? AE.notice('warn', 'triangle-alert', html`<p>Konfigurasi saat ini hanya tersimpan <b>di browser Anda</b> untuk pengujian. Siswa belum terhubung sampai konfigurasi diterapkan ke website produksi (langkah 7).</p>`) : ''}</div>

      <div class="grid grid-2" style="align-items:start">
        <div class="stack">
          <div class="card stack"><h3 style="margin:0">Uji koneksi</h3>
            <div class="field"><label for="cf-url">Project URL</label><input id="cf-url" name="ae-sb-endpoint" type="url" inputmode="url" class="input mono" placeholder="https://xxxxxxxx.supabase.co" value="${deployed.url || (AE.config.preview() || {}).url || ''}" autocomplete="off" data-lpignore="true" data-1p-ignore data-form-type="other" spellcheck="false" readonly></div>
            <div class="field"><label for="cf-key">Publishable key / anon public key</label><div class="row" style="flex-wrap:nowrap"><input id="cf-key" name="ae-sb-public-key" type="text" class="input mono masked" placeholder="sb_publishable_… atau eyJ…" value="${deployed.key || (AE.config.preview() || {}).key || ''}" autocomplete="off" data-lpignore="true" data-1p-ignore data-form-type="other" spellcheck="false" readonly><button class="btn btn-icon" id="cf-eye" type="button" aria-label="Tampilkan atau sembunyikan key">${ic('eye')}</button></div>
              <span class="hint">Kunci ini memang bersifat publik dan aman berada di frontend <b>karena data dilindungi RLS</b>. <b>Jangan pernah</b> memasukkan <i>secret key</i> atau <i>service_role key</i>.</span></div>
            <div class="btn-row"><button class="btn btn-primary" id="cf-test">${ic('plug-zap')} Uji Koneksi</button><button class="btn" id="cf-save">${ic('save')} Simpan untuk pratinjau di browser ini</button>${AE.config.preview() ? html`<button class="btn btn-ghost btn-danger" id="cf-clear">Hapus pratinjau</button>` : ''}</div>
            <div class="status-list" id="cf-out"></div>
            <div class="field"><label for="cf-snippet">Isi file <span class="kbd">config.js</span> untuk produksi</label><pre class="code" id="cf-snippet"></pre><div class="btn-row"><button class="btn btn-sm" id="cf-copycfg">${ic('copy')} Salin config.js</button></div></div>
          </div>
        </div>
        <div class="stack">
          <div class="card"><h3>Panduan langkah demi langkah</h3><ol class="steps mt-s">
            <li><div><b>Buat proyek Supabase.</b> Masuk ke supabase.com → <i>New project</i>. Pilih region terdekat (mis. Singapore), simpan kata sandi database di tempat aman.</div></li>
            <li><div><b>Salin Project URL.</b> Project Settings → <i>Data API</i> (atau API) → salin <i>Project URL</i>.</div></li>
            <li><div><b>Salin publishable key.</b> Project Settings → <i>API Keys</i> → salin <i>Publishable key</i> (proyek baru) atau <i>anon public</i> (proyek lama). Jangan salin <i>secret</i>/<i>service_role</i>.</div></li>
            <li><div><b>Buka SQL Editor</b> → <i>New query</i>.</div></li>
            <li><div><b>Tempel SQL</b> (tombol “Salin SQL” di bawah) lalu klik <b>Run</b>. Aman dijalankan ulang; tidak menghapus data. Tidak perlu dijalankan setiap membuka website.</div></li>
            <li><div><b>Buat akun guru/administrator.</b> Authentication → Users → <i>Add user</i>. Jalankan perintah “jadikan admin” (di bawah) dengan email tersebut. Lalu matikan <i>Allow new users to sign up</i> di Authentication → Sign In / Providers.</div></li>
            <li><div><b>Terapkan ke produksi.</b> Di Vercel: Settings → Environment Variables, isi <span class="kbd">SUPABASE_URL</span> dan <span class="kbd">SUPABASE_PUBLISHABLE_KEY</span>, lalu <i>Redeploy</i>. (Tanpa Vercel: edit file <span class="kbd">config.js</span> dan unggah ulang.)</div></li>
            <li><div><b>Uji koneksi</b> di halaman ini dari website produksi. Pastikan semua baris berwarna hijau.</div></li>
            <li><div><b>Periksa tabel, kebijakan & Realtime.</b> Table Editor menampilkan tabel aplikasi; Database → Publications → <i>supabase_realtime</i> berisi <span class="kbd">leaderboard_entries</span> (SQL sudah mengaturnya).</div></li>
            <li><div><b>Mengubah konfigurasi nanti?</b> Ubah environment variables di Vercel lalu <b>Redeploy</b> — perubahan berlaku untuk semua pengunjung setelah deployment selesai.</div></li></ol></div>
          <div class="card stack-sm"><h3 style="margin:0">SQL skema database</h3><p class="small muted" style="margin:0">File <span class="kbd">supabase/schema.sql</span> — membuat tabel, RLS, fungsi penilaian server, dan Realtime.</p>
            <div class="btn-row"><button class="btn btn-primary" id="sql-copy">${ic('copy')} Salin SQL</button><a class="btn" href="supabase/schema.sql" target="_blank" rel="noopener">${ic('file-code')} Buka file</a></div>
            <details class="disclosure"><summary>Perintah “jadikan admin”</summary><div><pre class="code" id="sql-admin">insert into public.teacher_profiles(user_id, full_name, role)
select id, 'Nama Guru', 'admin' from auth.users where email = 'guru@contoh.sch.id'
on conflict (user_id) do update set role = 'admin', is_active = true;</pre><button class="btn btn-sm" id="sql-admin-copy">${ic('copy')} Salin</button></div></details>
            <details class="disclosure"><summary>Mengatasi masalah</summary><div class="small"><ul>
              <li><b>Tabel belum tersedia</b>: SQL belum dijalankan, atau gagal — jalankan ulang seluruh file dan periksa pesan error di SQL Editor.</li>
              <li><b>Kunci API tidak valid</b>: pastikan menyalin key dari proyek yang sama dengan URL.</li>
              <li><b>Kunci rahasia terdeteksi</b>: Anda menempel secret/service_role key. Segera <i>rotate</i> key tersebut di dashboard jika sempat tersebar.</li>
              <li><b>Realtime belum siap</b>: Database → Publications → aktifkan <i>supabase_realtime</i> untuk tabel leaderboard_entries.</li>
              <li><b>Login guru gagal</b>: pastikan akun dibuat di Authentication dan sudah dijadikan guru dengan perintah di atas.</li></ul></div></details>
          </div></div></div>`;
    return {
      html: p ? AE.adminShell(p, 'supabase', content) : content,
      async mount() {
        if (p) AE.bindShell();
        const urlEl = AE.$('#cf-url'), keyEl = AE.$('#cf-key');
        const snip = () => (AE.$('#cf-snippet').textContent = `// config.js — dibaca semua pengunjung. HANYA kunci publik.\nwindow.ARABIYA_CONFIG = {\n  supabaseUrl: ${JSON.stringify(urlEl.value.trim())},\n  supabaseKey: ${JSON.stringify(AE.isSecretKey(keyEl.value) ? '!!! JANGAN GUNAKAN SECRET KEY !!!' : keyEl.value.trim())}\n};\n`);
        snip(); urlEl.oninput = snip; keyEl.oninput = snip;
        // Cegah isian otomatis browser (email/kata sandi tersimpan) masuk ke kolom koneksi.
        [urlEl, keyEl].forEach((el) => { const unlock = () => el.removeAttribute('readonly'); el.addEventListener('focus', unlock, { once: true }); el.addEventListener('pointerdown', unlock, { once: true }); });
        const scrub = () => {
          if (urlEl.value && !/^https:\/\//i.test(urlEl.value.trim())) urlEl.value = '';
          if (keyEl.value && (/@/.test(keyEl.value) || !/^(sb_publishable_|eyJ)/.test(keyEl.value.trim()))) keyEl.value = '';
          snip();
        };
        scrub(); setTimeout(scrub, 300); setTimeout(scrub, 1200);
        AE.$('#cf-eye').onclick = () => { keyEl.classList.toggle('masked'); };
        AE.$('#cf-test').onclick = async (e) => {
          const b = e.currentTarget; b.disabled = true; const out = AE.$('#cf-out'); out.innerHTML = AE.loadingView('Menguji koneksi…').s;
          try { out.innerHTML = (await testConnection(urlEl.value.trim(), keyEl.value.trim())).map((x) => x.s).join(''); } catch (err) { out.innerHTML = statusRow('error').s; }
          b.disabled = false;
        };
        AE.$('#cf-save').onclick = async () => {
          const url = urlEl.value.trim(), key = keyEl.value.trim();
          if (AE.isSecretKey(key)) return AE.toast('Secret/service_role key tidak boleh disimpan di browser.', 'err');
          if (!url || !key) return AE.toast('Isi Project URL dan publishable key.', 'err');
          if (!(await AE.confirm('Simpan untuk pratinjau?', 'Konfigurasi hanya disimpan di browser ini untuk menguji website. Siswa TIDAK otomatis terhubung — terapkan ke config.js / Vercel agar berlaku untuk semua.', { okLabel: 'Simpan pratinjau' }))) return;
          AE.config.setPreview({ url, key }); AE.resetDb(); AE.invalidate(); await AE.checkHealth(); AE.updateConnPill(); AE.toast('Pratinjau disimpan di browser ini.'); AE.render();
        };
        const clr = AE.$('#cf-clear'); if (clr) clr.onclick = async () => { if (await AE.confirm('Hapus pratinjau?', 'Browser ini akan kembali memakai konfigurasi produksi (jika ada).', { okLabel: 'Hapus', danger: true })) { AE.config.setPreview(null); AE.resetDb(); AE.invalidate(); await AE.checkHealth(); AE.updateConnPill(); AE.render(); } };
        const copy = async (text, label) => { try { await navigator.clipboard.writeText(text); AE.toast(label + ' disalin.'); } catch (e) { AE.toast('Gagal menyalin. Salin manual dari kotak teks.', 'err'); } };
        AE.$('#cf-copycfg').onclick = () => copy(AE.$('#cf-snippet').textContent, 'config.js');
        AE.$('#sql-admin-copy').onclick = () => copy(AE.$('#sql-admin').textContent, 'Perintah');
        AE.$('#sql-copy').onclick = async () => { try { const r = await fetch('supabase/schema.sql', { cache: 'no-store' }); if (!r.ok) throw 0; copy(await r.text(), 'SQL'); } catch (e) { AE.toast('Gagal memuat file SQL. Buka file lalu salin manual.', 'err'); } };
        const now = AE.$('#st-now');
        const a = AE.config.active();
        now.innerHTML = (await testConnection(a.url, a.key)).map((x) => x.s).join('');
      },
    };
  }
})();
