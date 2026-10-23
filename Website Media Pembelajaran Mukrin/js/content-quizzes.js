/* ARABIYA EDU — Kuis contoh untuk diimpor guru ke database (Panel Guru → Kuis → "Impor kuis contoh").
   Kunci jawaban di file ini hanya dipakai saat impor oleh guru. Kuis RESMI yang dinilai
   server mengambil soal dari database; kunci tidak dikirim ke browser siswa. */
(function () {
  const AE = (window.AE = window.AE || {});
  const opt = (arr) => arr.map((t, i) => ({ id: 'abcde'[i], text: t }));
  const MCQ = (text, ar, options, correctIdx, explanation, points = 1, type = 'mcq', extra = {}) => ({
    question_type: type, question_text: text, question_ar: ar, options: opt(options),
    answer_key: { correct: 'abcde'[correctIdx] }, explanation, points, ...extra,
  });
  const TF = (text, ar, correct, explanation, points = 1) => ({
    question_type: 'true_false', question_text: text, question_ar: ar, options: [],
    answer_key: { correct }, explanation, points,
  });
  const FILL = (text, ar, accepted, explanation, points = 1) => ({
    question_type: 'fill_blank', question_text: text, question_ar: ar, options: [],
    answer_key: { accepted }, explanation, points,
  });
  const ARR = (text, tokens, explanation, points = 1) => ({
    question_type: 'arrange', question_text: text, question_ar: '', options: { tokens },
    answer_key: { order: tokens }, explanation, points,
  });
  const MATCH = (text, pairs, explanation, points = 2) => {
    const left = pairs.map((p, i) => ({ id: 'l' + (i + 1), text: p[0] }));
    const right = pairs.map((p, i) => ({ id: 'r' + (i + 1), text: p[1] }));
    const key = {}; pairs.forEach((p, i) => (key['l' + (i + 1)] = 'r' + (i + 1)));
    return { question_type: 'matching', question_text: text, question_ar: '', options: { left, right }, answer_key: { pairs: key }, explanation, points };
  };

  AE.SAMPLE_QUIZZES = [
    {
      title: 'Latihan Kelas X — Sekolah & Perkenalan', grade_level: 10, kind: 'latihan',
      description: 'Latihan kosakata sekolah, kata tunjuk, dan ungkapan perkenalan.',
      duration_seconds: 900, max_attempts: null, passing_score: 75, max_score: 100,
      questions: [
        MCQ('Arti kata berikut adalah …', 'مَدْرَسَةٌ', ['rumah', 'sekolah', 'masjid', 'pasar'], 1, 'مَدْرَسَةٌ = sekolah.', 1, 'choose_meaning'),
        MCQ('Kata tunjuk yang tepat untuk حَقِيبَةٌ (dekat) adalah …', '', ['هٰذَا', 'هٰذِهِ', 'ذٰلِكَ', 'هُوَ'], 1, 'حَقِيبَةٌ muannats → هٰذِهِ.'),
        TF('Kalimat berikut berarti “Ini pena”.', 'هٰذَا قَلَمٌ.', true, 'هٰذَا = ini; قَلَمٌ = pena.'),
        FILL('Lengkapi dengan kata Arab yang berarti “namaku”: ___ أَحْمَدُ.', '', ['اسمي', 'اِسْمِي'], 'اِسْمِي = namaku.'),
        ARR('Susun menjadi kalimat “Ini buku baru.”', ['هٰذَا', 'كِتَابٌ', 'جَدِيدٌ'], 'Kata sifat diletakkan setelah kata benda.'),
        MATCH('Jodohkan kata dengan artinya.', [['قَلَمٌ', 'pena'], ['كِتَابٌ', 'buku'], ['كُرْسِيٌّ', 'kursi'], ['سَبُّورَةٌ', 'papan tulis']], 'Hafalkan kosakata benda di kelas.'),
        MCQ('Bacalah teks lalu jawab: Di mana Ahmad belajar?', '', ['di rumah', 'di perpustakaan', 'di kantin', 'di masjid'], 1, 'يَدْرُسُ فِي الْمَكْتَبَةِ = belajar di perpustakaan.', 1, 'reading',
          { passage: 'أَحْمَدُ طَالِبٌ مُجْتَهِدٌ. يَدْرُسُ فِي الْمَكْتَبَةِ كُلَّ يَوْمٍ.' }),
        MCQ('Dengarkan audio, lalu pilih artinya.', '', ['Selamat pagi', 'Selamat datang', 'Terima kasih', 'Sampai jumpa'], 1, 'أَهْلًا وَسَهْلًا = selamat datang.', 1, 'listening',
          { audio_text: 'أَهْلًا وَسَهْلًا' }),
      ],
    },
    {
      title: 'Latihan Kelas XI — Waktu & Kegiatan', grade_level: 11, kind: 'latihan',
      description: 'Latihan menyebutkan jam, fi’il madhi, dan fi’il mudhari’.',
      duration_seconds: 900, max_attempts: null, passing_score: 75, max_score: 100,
      questions: [
        MCQ('السَّاعَةُ السَّادِسَةُ وَالنِّصْفُ berarti pukul …', '', ['06.15', '06.30', '05.30', '06.45'], 1, 'وَالنِّصْفُ = lewat 30 menit.'),
        MCQ('“Kami telah belajar” dalam bahasa Arab adalah …', '', ['دَرَسْتُ', 'دَرَسْنَا', 'دَرَسُوا', 'نَدْرُسُ'], 1, 'Akhiran ـْنَا = kami (madhi).', 2),
        TF('سَأَذْهَبُ berarti “aku akan pergi”.', '', true, 'سَـ menunjukkan masa depan.'),
        FILL('Tulis kata Arab untuk “besok”.', '', ['غدا', 'غَدًا'], 'غَدًا = besok.'),
        MCQ('Bacalah dialog: Kapan pelajaran dimulai?', '', ['pukul 06.45', 'pukul 07.00', 'pukul 07.30', 'pukul 06.30'], 1, 'يَبْدَأُ الدَّرْسُ فِي السَّاعَةِ السَّابِعَةِ تَمَامًا.', 1, 'dialog',
          { passage: 'عَلِيٌّ: مَتَى يَبْدَأُ الدَّرْسُ؟\nعُمَرُ: يَبْدَأُ الدَّرْسُ فِي السَّاعَةِ السَّابِعَةِ تَمَامًا.' }),
        ARR('Susun: “Aku bangun pukul setengah lima.”', ['أَسْتَيْقِظُ', 'فِي', 'السَّاعَةِ', 'الرَّابِعَةِ', 'وَالنِّصْفِ'], 'Fi’il + keterangan waktu.'),
      ],
    },
    {
      title: 'Ujian Akhir — Bahasa Arab Dasar', grade_level: 10, kind: 'ujian',
      description: 'Ujian akhir berwaktu. Nilai dihitung di server. Satu soal uraian dinilai guru.',
      duration_seconds: 1200, max_attempts: 1, passing_score: 75, max_score: 100,
      questions: [
        MCQ('Kata ganti untuk “dia (perempuan)” adalah …', '', ['هُوَ', 'هِيَ', 'هُمْ', 'أَنْتِ'], 1, 'هِيَ = dia (perempuan).', 2),
        MCQ('Jamak dari كِتَابٌ adalah …', '', ['كِتَابَاتٌ', 'كُتُبٌ', 'كِتَابُونَ', 'كِتَابَانِ'], 1, 'كِتَابٌ → كُتُبٌ (jamak taksir).', 2),
        TF('Kalimat berikut sudah sesuai kaidah.', 'الطَّالِبَةُ مُجْتَهِدٌ.', false, 'Khabar harus muannats: مُجْتَهِدَةٌ.', 2),
        FILL('Fi’il amr dari تَجْلِسُ adalah ___', '', ['اجلس', 'اِجْلِسْ'], 'تَجْلِسُ → اِجْلِسْ.', 2),
        MATCH('Jodohkan kata tunjuk dengan artinya.', [['هٰذَا', 'ini (lk)'], ['هٰذِهِ', 'ini (pr)'], ['ذٰلِكَ', 'itu (lk)'], ['تِلْكَ', 'itu (pr)']], 'Dekat: هٰذَا/هٰذِهِ; jauh: ذٰلِكَ/تِلْكَ.', 4),
        ARR('Susun: “Siswa itu menulis pelajaran.”', ['كَتَبَ', 'الطَّالِبُ', 'الدَّرْسَ'], 'Fi’il + fa’il + maf’ul bih.', 2),
        { question_type: 'essay', question_text: 'Tuliskan 3 kalimat bahasa Arab tentang keluargamu (dinilai guru).', question_ar: '', options: [], answer_key: {}, explanation: 'Dinilai manual oleh guru berdasarkan ketepatan kosakata dan struktur.', points: 6 },
      ],
    },
  ];
})();
