/* ARABIYA EDU — inti: template aman, ikon, penyimpanan lokal, toast, modal, router, audio, koneksi Supabase. */
(function () {
  const AE = (window.AE = window.AE || {});

  /* ---------- Template aman (auto-escape) ---------- */
  class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' };
  const esc = (s) => String(s).replace(/[&<>"'`]/g, (c) => ESC[c]);
  const fmt = (v) => (v == null || v === false ? '' : v instanceof Raw ? v.s : Array.isArray(v) ? v.map(fmt).join('') : esc(v));
  const html = (strings, ...vals) => { let o = ''; strings.forEach((s, i) => { o += s; if (i < vals.length) o += fmt(vals[i]); }); return new Raw(o); };
  const raw = (s) => new Raw(s);
  Object.assign(AE, { html, raw, esc, Raw });

  /* ---------- Ikon (Lucide, ISC) ---------- */
  const pascal = (n) => n.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  const node = (n) => { const [tag, attrs, kids] = n; const a = Object.entries(attrs || {}).map(([k, v]) => `${k}="${esc(v)}"`).join(' '); return `<${tag} ${a}>${(kids || []).map(node).join('')}</${tag}>`; };
  const iconCache = {};
  AE.ic = (name, cls = '') => {
    if (!name) return raw('');
    const key = name + '|' + cls;
    if (iconCache[key]) return raw(iconCache[key]);
    const def = window.lucide && window.lucide.icons && window.lucide.icons[pascal(name)];
    if (!def) return raw('');
    const [, attrs, kids] = def;
    const a = Object.entries({ ...attrs, 'aria-hidden': 'true', focusable: 'false', class: cls }).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
    return raw((iconCache[key] = `<svg ${a}>${kids.map(node).join('')}</svg>`));
  };
  AE.hasIcon = (name) => !!(name && window.lucide && window.lucide.icons[pascal(name)]);
  const ic = AE.ic;

  /* ---------- Utilitas ---------- */
  AE.$ = (sel, root = document) => root.querySelector(sel);
  AE.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  AE.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  AE.sample = (arr, n) => AE.shuffle(arr).slice(0, n);
  AE.normName = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  AE.normText = (t) => String(t || '').toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .replace(/\s+/g, ' ')
    .replace(/[\s.,!?\u060C\u061F\u061B]+$/g, '')
    .trim();
  AE.fmtDuration = (s) => { s = Math.max(0, Math.round(s || 0)); const m = Math.floor(s / 60); const r = s % 60; return m ? `${m} m ${String(r).padStart(2, '0')} d` : `${r} d`; };
  AE.fmtClock = (s) => { s = Math.max(0, Math.ceil(s)); const m = Math.floor(s / 60); return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  AE.fmtDate = (d) => { try { return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
  AE.fmtNum = (n, d = 0) => (n == null || isNaN(n) ? '–' : Number(n).toLocaleString('id-ID', { maximumFractionDigits: d, minimumFractionDigits: 0 }));
  AE.debounce = (fn, ms = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  AE.validateDisplayName = (v) => {
    const s = AE.normName(v);
    if (s.length < 2) return 'Nama tampilan minimal 2 karakter.';
    if (s.length > 40) return 'Nama tampilan maksimal 40 karakter.';
    if (/[<>{}\[\]\\/"`;=&$#@%^*+|~:]/.test(s) || /[\u0000-\u001f]/.test(s)) return 'Nama hanya boleh berisi huruf, angka, spasi, titik, tanda petik, atau tanda hubung.';
    if (/^[0-9 .'\-]+$/.test(s)) return 'Nama harus mengandung huruf.';
    return '';
  };
  AE.SKILLS = {
    istima: { ar: 'الْاِسْتِمَاعُ', label: 'Menyimak', icon: 'ear' },
    kalam: { ar: 'الْكَلَامُ', label: 'Berbicara', icon: 'messages-square' },
    qiraah: { ar: 'الْقِرَاءَةُ', label: 'Membaca', icon: 'book-open' },
    kitabah: { ar: 'الْكِتَابَةُ', label: 'Menulis', icon: 'pen-line' },
    mufradat: { ar: 'الْمُفْرَدَاتُ', label: 'Kosakata', icon: 'whole-word' },
    qawaid: { ar: 'الْقَوَاعِدُ', label: 'Tata bahasa', icon: 'spell-check' },
  };
  AE.GRADES = { 10: 'Kelas X', 11: 'Kelas XI', 12: 'Kelas XII' };
  AE.DIFF = { mudah: 'Mudah', sedang: 'Sedang', sulit: 'Sulit' };

  /* ---------- Penyimpanan lokal (hanya preferensi & progres non-sensitif) ---------- */
  const LS_KEY = 'arabiya.progress.v1';
  const defaults = () => ({ lessons: {}, vocab: {}, history: [], games: {}, speaking: {}, prefs: { reduceMotion: false } });
  AE.store = {
    get() { try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(LS_KEY) || '{}')); } catch (e) { return defaults(); } },
    set(fn) { const s = this.get(); fn(s); try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {} return s; },
    lessonStatus(slug) { return this.get().lessons[slug] || 'belum'; },
    setLesson(slug, st) { this.set((s) => { if (st === 'belum') delete s.lessons[slug]; else s.lessons[slug] = st; }); },
    addHistory(item) { this.set((s) => { s.history.unshift({ ...item, at: new Date().toISOString() }); s.history = s.history.slice(0, 60); }); },
    reset() { try { localStorage.removeItem(LS_KEY); } catch (e) {} },
  };
  AE.STATUS = { belum: 'Belum dipelajari', sedang: 'Sedang dipelajari', selesai: 'Selesai' };

  /* ---------- Toast & modal ---------- */
  AE.toast = (msg, type = 'ok', ms = 4200) => {
    let box = AE.$('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = html`${ic(type === 'err' ? 'circle-alert' : type === 'info' ? 'info' : 'circle-check')}<div>${msg}</div>`.s;
    box.appendChild(t);
    setTimeout(() => t.remove(), ms);
  };
  AE.modal = ({ title, body, actions = [], wide = false, onMount }) => new Promise((resolve) => {
    const back = document.createElement('div');
    back.className = 'modal-back';
    const prev = document.activeElement;
    back.innerHTML = html`<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="mdl-t">
      <h2 id="mdl-t">${title}</h2><div class="modal-body">${body}</div>
      <div class="btn-row">${actions.map((a, i) => html`<button class="btn ${a.cls || ''}" data-i="${i}" type="button">${a.label}</button>`)}</div></div>`.s;
    document.body.appendChild(back);
    const close = (v) => { back.remove(); document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); resolve(v); };
    const onKey = (e) => { if (e.key === 'Escape') close(null); };
    document.addEventListener('keydown', onKey);
    back.addEventListener('click', async (e) => {
      if (e.target === back) return close(null);
      const b = e.target.closest('[data-i]');
      if (!b) return;
      const a = actions[+b.dataset.i];
      if (a.onClick) { const r = await a.onClick(back); if (r === false) return; close(r === undefined ? a.value : r); }
      else close(a.value);
    });
    if (onMount) onMount(back);
    const f = back.querySelector('input,select,textarea,button.btn-primary,button.btn-danger,button');
    if (f) f.focus();
  });
  AE.confirm = (title, message, { okLabel = 'Ya, lanjutkan', danger = false } = {}) =>
    AE.modal({ title, body: html`<p>${message}</p>`, actions: [{ label: 'Batal', value: false }, { label: okLabel, value: true, cls: danger ? 'btn-danger' : 'btn-primary' }] }).then((v) => !!v);

  AE.loadingView = (text = 'Memuat…') => html`<div class="loading"><span class="spinner" aria-hidden="true"></span><span>${text}</span></div>`;
  AE.emptyView = (icon, title, text, extra = '') => html`<div class="empty">${ic(icon)}<h3>${title}</h3><p class="small">${text}</p>${extra}</div>`;
  AE.notice = (type, icon, content) => html`<div class="notice ${type}">${ic(icon)}<div>${content}</div></div>`;

  /* ---------- Audio: rekaman bila ada, fallback Web Speech API ---------- */
  const speech = {
    supported: typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined',
    voice: null, ready: false, current: null,
    findVoice() {
      if (!this.supported) return null;
      const vs = speechSynthesis.getVoices() || [];
      this.ready = vs.length > 0;
      this.voice = vs.find((v) => /^ar(-|_)SA/i.test(v.lang)) || vs.find((v) => /^ar/i.test(v.lang)) || null;
      return this.voice;
    },
    status() {
      if (!this.supported) return 'unsupported';
      this.findVoice();
      return this.voice ? 'ok' : this.ready ? 'no-voice' : 'loading';
    },
    stop() { try { if (this.current) { this.current.pause(); this.current = null; } if (this.supported) speechSynthesis.cancel(); } catch (e) {} },
    play(text, { rate = 0.9, url = '' } = {}) {
      this.stop();
      if (url) {
        const a = new Audio(url); a.playbackRate = rate < 0.8 ? 0.75 : 1; this.current = a;
        a.play().catch(() => AE.toast('Audio rekaman gagal diputar. Coba lagi atau baca teksnya.', 'err'));
        return true;
      }
      const st = this.status();
      if (st === 'unsupported') { AE.toast('Browser ini tidak mendukung suara otomatis. Silakan baca teks Arab yang tersedia.', 'info'); return false; }
      if (st !== 'ok') { AE.toast('Suara Bahasa Arab tidak tersedia di perangkat ini. Coba Chrome di Android/laptop, atau pasang paket suara Arab di pengaturan perangkat.', 'info', 6500); return false; }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.voice.lang; u.voice = this.voice; u.rate = rate;
      speechSynthesis.speak(u);
      return true;
    },
  };
  if (speech.supported) { speech.findVoice(); speechSynthesis.onvoiceschanged = () => speech.findVoice(); }
  AE.speech = speech;
  AE.audioBtn = (text, { url = '', slow = true, label = 'Putar audio' } = {}) => html`<span class="row" style="gap:6px;flex-wrap:nowrap">
    <button type="button" class="btn btn-sm btn-icon" data-say="${text}" data-url="${url}" data-rate="0.9" aria-label="${label}" title="${label}">${ic('volume-2')}</button>
    ${slow ? html`<button type="button" class="btn btn-sm btn-icon" data-say="${text}" data-url="${url}" data-rate="0.6" aria-label="Putar perlahan" title="Putar perlahan">${ic('snail')}</button>` : ''}</span>`;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]');
    if (!b) return;
    e.preventDefault();
    speech.play(b.dataset.say, { rate: +b.dataset.rate || 0.9, url: b.dataset.url || '' });
  });

  /* ---------- Konfigurasi & klien Supabase ---------- */
  const DEV_KEY = 'arabiya.previewConfig';
  AE.EXPECTED_SCHEMA = '1';
  AE.config = {
    deployed() { const c = window.ARABIYA_CONFIG || {}; return { url: (c.supabaseUrl || '').trim(), key: (c.supabaseKey || '').trim(), site: c.siteName || '' }; },
    preview() {
      try {
        const p = JSON.parse(localStorage.getItem(DEV_KEY) || 'null');
        if (p && (!/^https:\/\//i.test(p.url || '') || /@/.test(p.key || '') || !/^(sb_publishable_|eyJ)/.test(p.key || ''))) { localStorage.removeItem(DEV_KEY); return null; }
        return p;
      } catch (e) { return null; }
    },
    setPreview(v) { if (v) localStorage.setItem(DEV_KEY, JSON.stringify(v)); else localStorage.removeItem(DEV_KEY); },
    active() {
      const d = this.deployed();
      if (d.url && d.key) return { ...d, source: 'deployed' };
      const p = this.preview();
      if (p && p.url && p.key) return { url: p.url, key: p.key, source: 'preview' };
      return { url: '', key: '', source: 'none' };
    },
  };
  AE.isSecretKey = (k) => {
    k = String(k || '').trim();
    if (/^sb_secret_/i.test(k)) return true;
    const parts = k.split('.');
    if (parts.length === 3) { try { const p = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))); return p.role === 'service_role'; } catch (e) {} }
    return false;
  };
  AE.validUrl = (u) => /^https:\/\/[a-z0-9-]+\.supabase\.(co|in|net)\/?$/i.test(String(u || '').trim()) || /^https:\/\/[^\s/]+(:\d+)?\/?$/i.test(String(u || '').trim());

  let _client = null;
  AE.db = () => {
    if (_client) return _client;
    const c = AE.config.active();
    if (!c.url || !c.key || !window.supabase || AE.isSecretKey(c.key)) return null;
    try { _client = window.supabase.createClient(c.url.replace(/\/$/, ''), c.key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'arabiya-auth' } }); }
    catch (e) { _client = null; }
    return _client;
  };
  AE.resetDb = () => { _client = null; };
  AE.dbReady = () => !!AE.db();

  const ERR = {
    AE_QUIZ_NOT_FOUND: 'Latihan tidak ditemukan atau belum diterbitkan.',
    AE_QUIZ_INACTIVE: 'Latihan ini sedang dinonaktifkan oleh guru.',
    AE_QUIZ_NOT_OPEN: 'Latihan ini belum dibuka. Periksa jadwal dari guru.',
    AE_QUIZ_CLOSED: 'Waktu pengerjaan latihan ini sudah ditutup.',
    AE_INVALID_NAME: 'Nama tampilan tidak valid. Gunakan 2–40 karakter berupa huruf, angka, dan spasi.',
    AE_INVALID_CLASS: 'Kelas tidak valid. Pilih kelas dari daftar.',
    AE_INVALID_SESSION_CODE: 'Kode sesi salah. Mintalah kode yang benar kepada guru.',
    AE_INVALID_PARTICIPANT_CODE: 'Kode peserta tidak dikenal untuk ujian ini.',
    AE_ATTEMPTS_EXCEEDED: 'Batas jumlah percobaan untuk latihan ini sudah tercapai.',
    AE_NO_QUESTIONS: 'Latihan ini belum memiliki soal.',
    AE_INVALID_ANSWERS: 'Format jawaban tidak valid.',
    AE_PAYLOAD_TOO_LARGE: 'Jawaban terlalu panjang untuk dikirim.',
    AE_INVALID_SESSION: 'Sesi pengerjaan tidak valid. Silakan mulai ulang.',
    AE_SESSION_CLOSED: 'Sesi pengerjaan ini sudah ditutup.',
    AE_SESSION_EXPIRED: 'Waktu pengerjaan sudah habis. Jawaban tidak dapat dikirim lagi.',
    AE_RATE_LIMIT: 'Terlalu banyak permintaan dari jaringan ini. Tunggu beberapa menit lalu coba lagi.',
    AE_FORBIDDEN: 'Anda tidak memiliki izin untuk tindakan ini.',
    AE_NOT_FOUND: 'Data tidak ditemukan.',
    AE_NO_CONSENT: 'Peserta tidak menyetujui penayangan di papan peringkat.',
    AE_NEEDS_REVIEW: 'Hasil ini masih menunggu penilaian manual.',
    AE_INVALID_POINTS: 'Poin tidak valid.',
    AE_INVALID_CODE: 'Kode harus 4–20 karakter.',
    AE_INVALID_COUNT: 'Jumlah kode harus 1–200.',
    AE_USER_NOT_FOUND: 'Akun dengan email tersebut belum dibuat di Supabase Authentication.',
    AE_INVALID_ROLE: 'Peran tidak valid.',
  };
  AE.errMsg = (e) => {
    if (!e) return 'Terjadi kesalahan.';
    const m = String(e.message || e.error_description || e || '');
    const code = (m.match(/AE_[A-Z_]+/) || [])[0];
    if (code && ERR[code]) return ERR[code];
    if (/Failed to fetch|NetworkError|network|Load failed/i.test(m)) return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    if (/Invalid login credentials/i.test(m)) return 'Email atau kata sandi salah.';
    if (/JWT|apikey|Invalid API key/i.test(m)) return 'Konfigurasi koneksi tidak valid. Hubungi pengelola website.';
    if (/permission denied|row-level security/i.test(m)) return 'Akses ditolak oleh kebijakan keamanan database.';
    if (/duplicate key/i.test(m)) return 'Data dengan nilai yang sama sudah ada.';
    if (/violates check constraint/i.test(m)) return 'Isian tidak memenuhi aturan (panjang atau format).';
    return 'Terjadi kesalahan. Silakan coba lagi.';
  };
  AE.isNetworkErr = (e) => /Failed to fetch|NetworkError|network|Load failed|timeout/i.test(String((e && e.message) || e || ''));
  AE.rpc = async (fn, args) => {
    const db = AE.db();
    if (!db) throw new Error('NOT_CONFIGURED');
    const { data, error } = await db.rpc(fn, args || {});
    if (error) throw error;
    return data;
  };

  /* ---------- Router (hash) ---------- */
  const routes = [];
  AE.route = (pattern, title, handler, opts = {}) => {
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:([a-z]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
    routes.push({ re, keys, title, handler, nav: opts.nav || pattern.split('/')[1] || '' });
  };
  AE.go = (path) => { if (location.hash !== '#' + path) location.hash = '#' + path; else AE.render(); };
  AE.cleanup = [];
  AE.onLeave = (fn) => AE.cleanup.push(fn);
  AE.render = async () => {
    AE.cleanup.splice(0).forEach((f) => { try { f(); } catch (e) {} });
    speech.stop();
    const path = (location.hash.replace(/^#/, '') || '/').split('?')[0];
    let match = null, params = {};
    for (const r of routes) { const m = path.match(r.re); if (m) { match = r; r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1]))); break; } }
    const root = AE.$('#view');
    document.body.classList.remove('drawer-open');
    if (!match) { root.innerHTML = AE.emptyView('map', 'Halaman tidak ditemukan', 'Alamat yang Anda buka tidak tersedia.', html`<a class="btn btn-primary" href="#/">Kembali ke Beranda</a>`).s; return; }
    AE.$$('[data-nav]').forEach((a) => a.toggleAttribute('aria-current', false));
    AE.$$(`[data-nav="${match.nav}"]`).forEach((a) => a.setAttribute('aria-current', 'page'));
    const t = typeof match.title === 'function' ? match.title(params) : match.title;
    AE.$('.topbar-title').textContent = t;
    document.title = (t ? t + ' · ' : '') + 'ARABIYA EDU';
    root.innerHTML = AE.loadingView().s;
    window.scrollTo(0, 0);
    const token = (AE._rt = (AE._rt || 0) + 1);
    try {
      const out = await match.handler(params, root);
      if (token !== AE._rt) return;
      if (out instanceof Raw) root.innerHTML = out.s;
      else if (out && out.html) { root.innerHTML = out.html.s; if (out.mount) out.mount(root); }
    } catch (e) {
      console.error(e);
      if (token === AE._rt) root.innerHTML = AE.emptyView('triangle-alert', 'Halaman gagal dimuat', AE.errMsg(e), html`<button class="btn" data-action="reload">Coba lagi</button>`).s;
    }
    root.focus({ preventScroll: true });
  };
})();
