/* ARABIYA EDU — Permainan edukatif (6 permainan). Skor & permainan yang sedang berjalan
   disimpan di perangkat agar tidak hilang saat halaman dimuat ulang. */
(function () {
  const AE = window.AE;
  const { html, ic, route } = AE;
  const SAVE = 'arabiya.game.v1';

  const sentencesFrom = (lessons) => {
    const out = [];
    lessons.forEach((l) => [...(l.examples || []), ...(l.daily || [])].forEach(([ar, id]) => {
      const words = ar.replace(/[.،؟!?]+$/g, '').trim().split(/\s+/);
      if (words.length >= 3 && words.length <= 7 && new Set(words).size === words.length) out.push({ ar, id, words });
    }));
    return out;
  };
  const picOK = (v) => v.image_url || AE.hasIcon(v.icon);

  const GAMES = [
    { id: 'tebak-arti', title: 'Tebak Arti', icon: 'circle-help', rounds: 10, seconds: 0,
      rules: ['Sebuah kata Arab akan ditampilkan.', 'Pilih arti yang tepat dari empat pilihan.', 'Benar = +10 poin. Tidak ada pengurangan poin.'],
      build: ({ vocab }) => AE.sample(vocab, 10).map((v, i) => { const o = AE.shuffle([v, ...AE.sample(vocab.filter((x) => x.meaning !== v.meaning), 3)]); return { id: 'g' + i, type: 'choose_meaning', text: 'Apa arti kata ini?', ar: v.arabic, options: o.map((x, j) => ({ id: 'abcd'[j], text: x.meaning })), key: { correct: 'abcd'[o.indexOf(v)] }, explanation: `${v.arabic} (${v.latin}) = ${v.meaning}` }; }) },
    { id: 'kata-gambar', title: 'Cocokkan Kata dan Gambar', icon: 'image', rounds: 8, seconds: 0,
      rules: ['Sebuah gambar ditampilkan.', 'Pilih kata Arab yang sesuai dengan gambar.', 'Hanya kosakata yang memiliki ilustrasi yang dipakai.'],
      build: ({ vocab }) => { const p = vocab.filter(picOK); return AE.sample(p, 8).map((v, i) => { const o = AE.shuffle([v, ...AE.sample(p.filter((x) => x.id !== v.id), 3)]); return { id: 'g' + i, type: 'mcq', text: 'Kata Arab mana yang sesuai dengan gambar ini?', picture: v, options: o.map((x, j) => ({ id: 'abcd'[j], text: x.arabic })), key: { correct: 'abcd'[o.indexOf(v)] }, explanation: `${v.arabic} = ${v.meaning}` }; }); } },
    { id: 'susun-kalimat', title: 'Susun Kalimat Arab', icon: 'blocks', rounds: 6, seconds: 0,
      rules: ['Terjemahan kalimat ditampilkan.', 'Ketuk kata-kata Arab sesuai urutan yang benar (dari kanan ke kiri).', 'Benar = +10 poin.'],
      build: ({ sentences }) => AE.sample(sentences, 6).map((s, i) => ({ id: 'g' + i, type: 'arrange', text: `Susun menjadi: “${s.id}”`, options: { tokens: AE.shuffleUntilDifferent(s.words) }, key: { order: s.words }, explanation: s.ar })) },
    { id: 'lengkapi', title: 'Lengkapi Kalimat', icon: 'text-cursor-input', rounds: 8, seconds: 0,
      rules: ['Satu kata dalam kalimat dihilangkan.', 'Pilih kata yang tepat untuk melengkapi kalimat.', 'Perhatikan terjemahannya sebagai petunjuk.'],
      build: ({ sentences }) => AE.sample(sentences, 8).map((s, i) => {
        const wi = Math.floor(Math.random() * s.words.length);
        const ans = s.words[wi];
        const pool = [...new Set(sentences.flatMap((x) => x.words))].filter((w) => w !== ans);
        const o = AE.shuffle([ans, ...AE.sample(pool, 3)]);
        return { id: 'g' + i, type: 'mcq', text: `Lengkapi kalimat: “${s.id}”`, ar: s.words.map((w, j) => (j === wi ? '_____' : w)).join(' '), options: o.map((x, j) => ({ id: 'abcd'[j], text: x })), key: { correct: 'abcd'[o.indexOf(ans)] }, explanation: s.ar };
      }) },
    { id: 'audio', title: 'Tebak Kosakata dari Audio', icon: 'headphones', rounds: 8, seconds: 0, needsAudio: true,
      rules: ['Tekan tombol putar untuk mendengar sebuah kata.', 'Pilih kata Arab dan artinya yang sesuai.', 'Butuh suara Bahasa Arab di perangkat. Jika tidak tersedia, teks dapat dibuka sebagai alternatif.'],
      build: ({ vocab }) => AE.sample(vocab, 8).map((v, i) => { const o = AE.shuffle([v, ...AE.sample(vocab.filter((x) => x.id !== v.id), 3)]); return { id: 'g' + i, type: 'listening', text: 'Dengarkan, lalu pilih kata yang kamu dengar.', audio_text: v.arabic, options: o.map((x, j) => ({ id: 'abcd'[j], text: `${x.arabic} — ${x.meaning}` })), key: { correct: 'abcd'[o.indexOf(v)] }, explanation: `${v.arabic} = ${v.meaning}` }; }) },
    { id: 'cepat', title: 'Tantangan Cepat Bahasa Arab', icon: 'zap', rounds: 0, seconds: 60,
      rules: ['Jawab sebanyak mungkin soal dalam 60 detik.', 'Benar = +10 poin, salah = tidak ada poin dan langsung lanjut.', 'Waktu terus berjalan, termasuk saat halaman dimuat ulang.'],
      build: ({ vocab }) => AE.sample(vocab, Math.min(40, vocab.length)).map((v, i) => { const o = AE.shuffle([v, ...AE.sample(vocab.filter((x) => x.meaning !== v.meaning), 3)]); const rev = i % 2; return rev
        ? { id: 'g' + i, type: 'mcq', text: `Bahasa Arabnya “${v.meaning}” adalah …`, options: o.map((x, j) => ({ id: 'abcd'[j], text: x.arabic })), key: { correct: 'abcd'[o.indexOf(v)] }, explanation: `${v.meaning} = ${v.arabic}` }
        : { id: 'g' + i, type: 'choose_meaning', text: 'Arti kata ini …', ar: v.arabic, options: o.map((x, j) => ({ id: 'abcd'[j], text: x.meaning })), key: { correct: 'abcd'[o.indexOf(v)] }, explanation: `${v.arabic} = ${v.meaning}` }; }) },
  ];

  const loadSave = () => { try { return JSON.parse(localStorage.getItem(SAVE) || 'null'); } catch (e) { return null; } };
  const writeSave = (s) => { try { s ? localStorage.setItem(SAVE, JSON.stringify(s)) : localStorage.removeItem(SAVE); } catch (e) {} };

  route('/permainan', 'Permainan Bahasa Arab', async () => {
    const best = AE.store.get().games || {};
    const saved = loadSave();
    return html`<div class="page-head"><h1>Permainan Bahasa Arab</h1><p>Enam permainan untuk mengasah kosakata, struktur kalimat, dan menyimak. Skor terbaik tersimpan di perangkat ini dan bukan nilai resmi.</p></div>
      ${saved && GAMES.find((g) => g.id === saved.game) ? html`<div class="mb">${AE.notice('', 'history', html`<p>Kamu punya permainan <b>${GAMES.find((g) => g.id === saved.game).title}</b> yang belum selesai. <a href="#/permainan/${saved.game}">Lanjutkan</a></p>`)}</div>` : ''}
      <div class="grid grid-3">${GAMES.map((g) => html`<a class="card-flat card-link stack-sm" href="#/permainan/${g.id}"><span class="icon-tile ${g.id === 'cepat' ? 'gold' : ''}">${ic(g.icon)}</span><h3 style="margin:0">${g.title}</h3><p class="small muted" style="margin:0">${g.rules[0]}</p>
        <div class="row between"><span class="tiny muted">${g.seconds ? g.seconds + ' detik' : g.rounds + ' ronde'}</span>${best[g.id] != null ? html`<span class="badge gold">${ic('trophy')} Terbaik ${best[g.id]}</span>` : html`<span class="badge gray">Belum dimainkan</span>`}</div></a>`)}</div>`;
  });

  route('/permainan/:id', 'Permainan', async ({ id }) => {
    const g = GAMES.find((x) => x.id === id);
    if (!g) return AE.emptyView('gamepad-2', 'Permainan tidak ditemukan', '', html`<a class="btn" href="#/permainan">Kembali</a>`);
    AE.$('.topbar-title').textContent = g.title;
    const [vocab, lessons] = await Promise.all([AE.data.vocab(), AE.data.lessons()]);
    const ctx = { vocab, sentences: sentencesFrom(lessons) };
    return {
      html: html`<a class="btn btn-sm btn-ghost" href="#/permainan">${ic('arrow-left')} Semua permainan</a><div class="mt-s" id="game" style="max-width:760px"></div>`,
      mount() {
        const el = AE.$('#game');
        let S = null, ctl = null, tick = null;
        AE.onLeave(() => clearInterval(tick));
        const persist = () => writeSave(S);
        const intro = () => {
          clearInterval(tick);
          const best = (AE.store.get().games || {})[g.id];
          const sv = loadSave();
          const resumable = sv && sv.game === g.id && !sv.done && (!g.seconds || sv.endsAt > Date.now());
          const audioWarn = g.needsAudio && AE.speech.status() !== 'ok';
          el.innerHTML = html`<div class="card stack"><div class="row" style="flex-wrap:nowrap"><span class="icon-tile">${ic(g.icon)}</span><div><h1 style="margin:0">${g.title}</h1>${best != null ? html`<span class="small muted">Skor terbaikmu: <b>${best}</b></span>` : ''}</div></div>
            <div><div class="label">Aturan permainan</div><ol class="small">${g.rules.map((r) => html`<li>${r}</li>`)}</ol></div>
            ${audioWarn ? AE.notice('warn', 'volume-x', html`<p>Suara Bahasa Arab tidak tersedia di perangkat ini. Kamu tetap bisa bermain dengan membuka teks pada setiap soal, tetapi latihan menyimak kurang optimal.</p>`) : ''}
            <div class="btn-row">${resumable ? html`<button class="btn btn-primary" data-resume>${ic('play')} Lanjutkan permainan</button><button class="btn" data-start>${ic('rotate-ccw')} Mulai baru</button>` : html`<button class="btn btn-primary" data-start>${ic('play')} Mulai</button>`}</div></div>`.s;
          el.querySelector('[data-start]').onclick = start;
          const r = el.querySelector('[data-resume]'); if (r) r.onclick = () => { S = loadSave(); step(); };
        };
        const start = () => {
          const rounds = g.build(ctx);
          if (rounds.length < 3) { el.innerHTML = AE.emptyView('gamepad-2', 'Konten belum cukup', 'Permainan ini membutuhkan lebih banyak kosakata atau kalimat contoh.').s; return; }
          S = { game: g.id, rounds, i: 0, score: 0, correct: 0, log: [], endsAt: g.seconds ? Date.now() + g.seconds * 1000 : 0, done: false };
          persist(); step();
        };
        const timeLeft = () => Math.max(0, (S.endsAt - Date.now()) / 1000);
        const step = () => {
          clearInterval(tick);
          if (S.i >= S.rounds.length || (g.seconds && timeLeft() <= 0)) return finish();
          const q = S.rounds[S.i];
          el.innerHTML = html`<div class="row between mb"><span class="badge">${ic('star')} ${S.score} poin</span>${g.seconds ? html`<span class="timer" id="g-t">${ic('timer')} ${AE.fmtClock(timeLeft())}</span>` : html`<span class="small muted">Ronde ${S.i + 1} / ${S.rounds.length}</span>`}</div>
            ${g.seconds ? '' : html`<div class="progress mb"><span style="width:${(S.i / S.rounds.length) * 100}%"></span></div>`}
            <div class="card q-card"><div class="q-slot"></div><div class="btn-row mt" id="g-act">${q.type === 'arrange' ? html`<button class="btn btn-primary" data-check>${ic('check')} Periksa</button>` : ''}</div></div>`.s;
          ctl = AE.mountQuestion(el.querySelector('.q-slot'), q, { number: g.seconds ? S.i + 1 : null, showType: false, onChange: (a) => { if (q.type !== 'arrange' && q.type !== 'matching') check(a); } });
          const cb = el.querySelector('[data-check]'); if (cb) cb.onclick = () => check(ctl.getAnswer());
          if (q.audio_text) setTimeout(() => AE.speech.status() === 'ok' && AE.speech.play(q.audio_text, { rate: 0.85 }), 250);
          if (g.seconds) tick = setInterval(() => { const t = AE.$('#g-t'); if (!t) return; const l = timeLeft(); t.innerHTML = html`${ic('timer')} ${AE.fmtClock(l)}`.s; t.classList.toggle('low', l <= 10); if (l <= 0) finish(); }, 250);
        };
        let busy = false;
        const check = (a) => {
          if (busy) return;
          const q = S.rounds[S.i];
          if (!AE.isAnswered(q, a)) { AE.toast('Lengkapi jawaban dulu.', 'info', 2000); return; }
          busy = true;
          const ok = AE.gradeLocal(q.type, q.key, a);
          if (ok) { S.score += 10; S.correct++; }
          S.log.push({ text: q.text, ar: q.ar || q.audio_text || '', ok, explanation: q.explanation });
          S.i++; persist();
          ctl.reveal({ correct: ok, key: q.key });
          if (g.seconds) { setTimeout(() => { busy = false; step(); }, ok ? 450 : 1100); return; }
          const act = AE.$('#g-act');
          act.innerHTML = html`<button class="btn btn-primary" data-next>${S.i < S.rounds.length ? html`Lanjut ${ic('arrow-right')}` : html`Lihat hasil ${ic('flag')}`}</button>`.s;
          act.querySelector('[data-next]').onclick = () => { busy = false; step(); };
          act.querySelector('[data-next]').focus();
        };
        const finish = () => {
          clearInterval(tick);
          if (!S.done) {
            S.done = true;
            const prev = (AE.store.get().games || {})[g.id];
            AE.store.set((s) => { s.games = s.games || {}; if (prev == null || S.score > prev) s.games[g.id] = S.score; });
            AE.store.addHistory({ kind: 'permainan', label: 'Permainan: ' + g.title, score: S.log.length ? Math.round((S.correct / S.log.length) * 100) : 0 });
            S.newBest = prev == null || S.score > prev;
            writeSave(null);
          }
          const total = S.log.length;
          el.innerHTML = html`<div class="card stack" style="text-align:center;align-items:center">
            <span class="icon-tile gold" style="width:64px;height:64px">${ic('trophy')}</span><h1 style="margin:0">${S.score} poin</h1>
            <p class="muted" style="margin:0">${S.correct} dari ${total} benar${S.newBest ? ' · Skor terbaik baru!' : ''}</p>
            <div class="btn-row" style="justify-content:center"><button class="btn btn-primary" data-again>${ic('rotate-ccw')} Main lagi</button><a class="btn" href="#/permainan">Permainan lain</a></div></div>
            ${total ? html`<details class="disclosure mt"><summary>Pembahasan jawaban (${total})</summary><div class="stack-sm">${S.log.map((l, i) => html`<div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="badge ${l.ok ? '' : 'red'}">${ic(l.ok ? 'check' : 'x')} ${i + 1}</span><div class="small" style="flex:1"><div>${l.text}</div>${l.ar ? html`<div class="ar-inline" lang="ar" dir="rtl">${l.ar}</div>` : ''}<div class="muted">${AE.mixText(l.explanation || '')}</div></div></div>`)}</div></details>` : ''}`.s;
          el.querySelector('[data-again]').onclick = start;
        };
        intro();
      },
    };
  }, { nav: 'permainan' });
})();
