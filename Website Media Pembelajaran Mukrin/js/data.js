/* ARABIYA EDU — lapisan data: konten dari database (jika terhubung & tersedia),
   jika tidak memakai konten bawaan. Nilai & peringkat SELALU dari database. */
(function () {
  const AE = window.AE;
  const cache = {};
  const TTL = 60 * 1000;

  async function cached(key, fn) {
    const c = cache[key];
    if (c && Date.now() - c.t < TTL) return c.v;
    const v = await fn();
    cache[key] = { t: Date.now(), v };
    return v;
  }
  AE.invalidate = (prefix) => Object.keys(cache).forEach((k) => (!prefix || k.startsWith(prefix)) && delete cache[k]);

  const bundledLessons = () => [...AE.BUNDLED_THEME_LESSONS, ...AE.BUNDLED_GRAMMAR_LESSONS].map((l, i) => ({ ...l, id: 'b-' + l.slug, position: i, source: 'bundled', is_published: true }));
  const fromDbLesson = (r) => ({ ...(r.content || {}), id: r.id, slug: r.slug, title: r.title, title_ar: r.title_ar, description: r.description, grade_level: r.grade_level, category: r.category, skill: r.skill, difficulty: r.difficulty, position: r.position, is_published: r.is_published, is_archived: r.is_archived, source: 'db' });

  AE.contentSource = { lessons: 'bundled', vocab: 'bundled', conversations: 'bundled' };

  AE.data = {
    async lessons() {
      return cached('lessons', async () => {
        const db = AE.db();
        if (db) {
          try {
            const { data, error } = await db.from('lessons').select('*').eq('is_published', true).eq('is_archived', false).order('grade_level').order('position').limit(500);
            if (!error && data && data.length) { AE.contentSource.lessons = 'db'; return data.map(fromDbLesson); }
          } catch (e) {}
        }
        AE.contentSource.lessons = 'bundled';
        return bundledLessons();
      });
    },
    async lesson(slug) { return (await this.lessons()).find((l) => l.slug === slug) || null; },
    async vocab() {
      return cached('vocab', async () => {
        const db = AE.db();
        if (db) {
          try {
            const { data, error } = await db.from('vocabulary').select('id,arabic,latin,meaning,word_type,category,grade_level,example_ar,example_id,image_url,audio_url,icon').eq('is_published', true).order('category').order('created_at').limit(2000);
            if (!error && data && data.length) { AE.contentSource.vocab = 'db'; return data; }
          } catch (e) {}
        }
        AE.contentSource.vocab = 'bundled';
        return AE.BUNDLED_VOCAB;
      });
    },
    async conversations() {
      return cached('conv', async () => {
        const db = AE.db();
        if (db) {
          try {
            const { data, error } = await db.from('conversations').select('*').eq('is_published', true).order('grade_level').order('position').limit(200);
            if (!error && data && data.length) { AE.contentSource.conversations = 'db'; return data; }
          } catch (e) {}
        }
        AE.contentSource.conversations = 'bundled';
        return AE.BUNDLED_CONVERSATIONS;
      });
    },
    async classes() {
      return cached('classes', async () => {
        const db = AE.db();
        if (!db) return [];
        const { data, error } = await db.from('classes').select('id,name,grade_level').eq('is_active', true).order('grade_level').order('name');
        if (error) throw error;
        return data || [];
      });
    },
    async quizzes() {
      return cached('quizzes', async () => {
        if (!AE.db()) return null;
        return (await AE.rpc('list_public_quizzes')) || [];
      });
    },
    async leaderboard({ quizId = '', className = '', period = 'all', limit = 100 } = {}) {
      const db = AE.db();
      if (!db) return null;
      let q = db.from('leaderboard_entries').select('id,quiz_id,quiz_title,display_name,class_name,grade_level,score,max_score,percent,duration_seconds,submitted_at');
      if (quizId) q = q.eq('quiz_id', quizId);
      if (className) q = q.eq('class_name', className);
      if (period !== 'all') {
        const d = new Date();
        if (period === 'today') d.setHours(0, 0, 0, 0);
        if (period === 'week') d.setDate(d.getDate() - 7);
        if (period === 'month') d.setMonth(d.getMonth() - 1);
        q = q.gte('submitted_at', d.toISOString());
      }
      const { data, error } = await q.order('percent', { ascending: false }).order('duration_seconds', { ascending: true }).order('submitted_at', { ascending: true }).order('id', { ascending: true }).limit(limit);
      if (error) throw error;
      return AE.rankRows(data || []);
    },
  };

  /* Aturan peringkat (stabil & konsisten dengan index di database):
     1) persentase nilai tertinggi; 2) durasi tercepat; 3) waktu kirim lebih awal; 4) id.
     Peserta dengan nilai, durasi, dan waktu sama persis mendapat peringkat sama. */
  AE.compareRank = (a, b) =>
    (+b.percent - +a.percent) || ((+a.duration_seconds || 0) - (+b.duration_seconds || 0)) ||
    (new Date(a.submitted_at) - new Date(b.submitted_at)) || String(a.id).localeCompare(String(b.id));
  AE.rankRows = (rows) => {
    const sorted = rows.slice().sort(AE.compareRank);
    let rank = 0, prev = null;
    return sorted.map((r, i) => {
      const tie = prev && +prev.percent === +r.percent && (+prev.duration_seconds || 0) === (+r.duration_seconds || 0) && prev.submitted_at === r.submitted_at;
      if (!tie) rank = i + 1;
      prev = r;
      return { ...r, rank };
    });
  };

  /* Status koneksi untuk indikator di topbar */
  AE.connState = { status: 'unknown', detail: '' };
  AE.checkHealth = async () => {
    const c = AE.config.active();
    if (!c.url && !c.key) return (AE.connState = { status: 'none', detail: 'Belum dikonfigurasi' });
    if (!c.url || !c.key) return (AE.connState = { status: 'partial', detail: 'Konfigurasi belum lengkap' });
    if (AE.isSecretKey(c.key)) return (AE.connState = { status: 'secret', detail: 'Kunci rahasia terdeteksi — ditolak' });
    if (!AE.db()) return (AE.connState = { status: 'error', detail: 'Klien database gagal dimuat' });
    try {
      const h = await AE.rpc('arabiya_health');
      if (!h || !h.ok) return (AE.connState = { status: 'error', detail: 'Respons tidak dikenal' });
      AE.connState = { status: String(h.schema_version) === AE.EXPECTED_SCHEMA ? 'ok' : 'outdated', detail: '', health: h };
    } catch (e) {
      const m = String(e.message || e.code || '');
      if (/Could not find the function|PGRST202|404/i.test(m)) AE.connState = { status: 'no-tables', detail: 'Tabel/fungsi belum tersedia' };
      else if (/permission denied|42501/i.test(m)) AE.connState = { status: 'policy', detail: 'Kebijakan akses bermasalah' };
      else if (/JWT|Invalid API key|401|apikey/i.test(m)) AE.connState = { status: 'bad-key', detail: 'Kunci API tidak valid' };
      else AE.connState = { status: 'error', detail: 'Koneksi gagal' };
    }
    return AE.connState;
  };
  AE.updateConnPill = () => {
    const el = AE.$('#conn-pill');
    if (!el) return;
    const s = AE.connState.status;
    const map = { ok: ['Database terhubung', ''], none: ['Mode belajar (offline)', 'off'], unknown: ['Memeriksa…', 'off'], outdated: ['Skema perlu diperbarui', 'off'] };
    const [label, cls] = map[s] || ['Database bermasalah', 'err'];
    el.textContent = label;
    el.className = 'conn-pill ' + cls;
    el.title = s === 'none' ? 'Materi dan permainan tetap bisa digunakan. Nilai belum dapat disimpan online.' : AE.connState.detail || label;
  };
})();
