/* ARABIYA EDU — Laboratorium Tata Bahasa (القواعد). Contoh awal yang dapat diedit. */
window.AE_CONTENT = window.AE_CONTENT || {};
window.AE_CONTENT.grammar = [
  {
    slug: 'dhamair', title: 'Kata Ganti', title_ar: 'الضَّمَائِرُ', grade_level: 10, category: 'qawaid', skill: 'qawaid', difficulty: 'mudah', position: 11,
    description: 'Kata ganti orang pertama, kedua, dan ketiga (dhamir munfashil).',
    content: {
      objectives: ['Mengenal 12 dhamir munfashil yang umum.', 'Membedakan dhamir untuk laki-laki dan perempuan.'],
      intro: 'Dhamir (kata ganti) dipakai untuk menggantikan nama orang. Bahasa Arab membedakan laki-laki/perempuan dan tunggal/dual/jamak.',
      table: { head: ['Dhamir', 'Arti', 'Keterangan'], rows: [
        ['أَنَا', 'saya', 'tunggal, L/P'], ['نَحْنُ', 'kami/kita', 'jamak/dual, L/P'],
        ['أَنْتَ', 'kamu (lk)', 'tunggal'], ['أَنْتِ', 'kamu (pr)', 'tunggal'],
        ['أَنْتُمَا', 'kamu berdua', 'dual, L/P'], ['أَنْتُمْ', 'kalian (lk)', 'jamak'], ['أَنْتُنَّ', 'kalian (pr)', 'jamak'],
        ['هُوَ', 'dia (lk)', 'tunggal'], ['هِيَ', 'dia (pr)', 'tunggal'],
        ['هُمَا', 'mereka berdua', 'dual, L/P'], ['هُمْ', 'mereka (lk)', 'jamak'], ['هُنَّ', 'mereka (pr)', 'jamak']
      ] },
      explanation: ['Dhamir hampir selalu menjadi subjek di awal kalimat nominal: هُوَ طَالِبٌ (Dia siswa).', 'Predikat menyesuaikan jenis dhamir: هِيَ طَالِبَةٌ (Dia siswi).'],
      examples: [
        { ar: 'أَنَا طَالِبٌ.', id: 'Saya seorang siswa.' }, { ar: 'هِيَ مُدَرِّسَةٌ.', id: 'Dia (pr) seorang guru.' },
        { ar: 'نَحْنُ مِنْ إِنْدُونِيسِيَا.', id: 'Kami dari Indonesia.' }, { ar: 'هُمْ فِي الْفَصْلِ.', id: 'Mereka (lk) di dalam kelas.' }
      ],
      exercises: [
        { q: 'Kata ganti untuk "dia (perempuan)" adalah ...', options: ['هُوَ', 'هِيَ', 'هُمْ'], answer: 1, explain: 'هِيَ = dia perempuan.' },
        { q: '___ طَالِبَاتٌ (kalian semua siswi)', options: ['أَنْتُمْ', 'أَنْتُنَّ', 'أَنْتِ'], answer: 1, explain: 'أَنْتُنَّ untuk jamak perempuan.' },
        { q: 'نَحْنُ artinya ...', options: ['kami/kita', 'mereka', 'kalian'], answer: 0, explain: 'نَحْنُ = kami/kita.' }
      ],
      summary: ['Dhamir membedakan jenis dan jumlah.'], reflection: ['Dhamir apa yang kamu pakai saat berbicara kepada guru perempuan?']
    }
  },
  {
    slug: 'asma-isyarah', title: 'Kata Tunjuk', title_ar: 'أَسْمَاءُ الْإِشَارَةِ', grade_level: 10, category: 'qawaid', skill: 'qawaid', difficulty: 'mudah', position: 12,
    description: 'هَذَا، هَذِهِ، ذَلِكَ، تِلْكَ untuk menunjuk benda dekat dan jauh.',
    content: {
      objectives: ['Menggunakan kata tunjuk dekat dan jauh.', 'Menyesuaikan kata tunjuk dengan mudzakkar/muannats.'],
      intro: 'Kata tunjuk (isim isyarah) dipakai untuk menunjuk benda atau orang.',
      table: { head: ['', 'Mudzakkar', 'Muannats'], rows: [['Dekat (ini)', 'هَذَا', 'هَذِهِ'], ['Jauh (itu)', 'ذَلِكَ', 'تِلْكَ']] },
      explanation: ['هَذَا كِتَابٌ = Ini buku. Bila kata sesudahnya memakai ال, artinya berubah: هَذَا الْكِتَابُ = buku ini.', 'تِلْكَ سَيَّارَةٌ = Itu mobil (muannats, jauh).'],
      examples: [
        { ar: 'هَذَا قَلَمٌ.', id: 'Ini pena.' }, { ar: 'هَذِهِ حَقِيبَةٌ.', id: 'Ini tas.' },
        { ar: 'ذَلِكَ مَسْجِدٌ.', id: 'Itu masjid.' }, { ar: 'تِلْكَ مَدْرَسَةٌ.', id: 'Itu sekolah.' },
        { ar: 'هَذَا الْكِتَابُ جَدِيدٌ.', id: 'Buku ini baru.' }
      ],
      exercises: [
        { q: '___ مَدْرَسَةٌ (Itu sekolah)', options: ['ذَلِكَ', 'تِلْكَ', 'هَذَا'], answer: 1, explain: 'مَدْرَسَةٌ muannats dan jauh → تِلْكَ.' },
        { q: '___ بَابٌ (Ini pintu)', options: ['هَذَا', 'هَذِهِ'], answer: 0, explain: 'بَابٌ mudzakkar dan dekat → هَذَا.' },
        { q: 'هَذَا الْقَلَمُ جَدِيدٌ artinya ...', options: ['Ini pena baru', 'Pena ini baru', 'Itu pena baru'], answer: 1, explain: 'Kata tunjuk + kata ber-ال = "... ini".' }
      ],
      summary: ['هَذَا/هَذِهِ dekat, ذَلِكَ/تِلْكَ jauh.'], reflection: ['Tunjuk lima benda di sekitarmu dengan kata tunjuk yang tepat.']
    }
  },
  {
    slug: 'mudzakkar-muannats', title: 'Mudzakkar dan Muannats', title_ar: 'الْمُذَكَّرُ وَالْمُؤَنَّثُ', grade_level: 10, category: 'qawaid', skill: 'qawaid', difficulty: 'mudah', position: 13,
    description: 'Membedakan kata benda maskulin dan feminin.',
    content: {
      objectives: ['Mengenali tanda muannats.', 'Membentuk muannats dari mudzakkar dengan ة.'],
      intro: 'Setiap kata benda dalam Bahasa Arab memiliki jenis: mudzakkar (maskulin) atau muannats (feminin).',
      table: { head: ['Mudzakkar', 'Muannats', 'Arti'], rows: [['طَالِبٌ', 'طَالِبَةٌ', 'siswa / siswi'], ['مُدَرِّسٌ', 'مُدَرِّسَةٌ', 'guru lk / pr'], ['طَبِيبٌ', 'طَبِيبَةٌ', 'dokter lk / pr'], ['كَبِيرٌ', 'كَبِيرَةٌ', 'besar']] },
      explanation: ['Tanda muannats yang paling umum adalah ta marbuthah (ة).', 'Ada muannats tanpa ة, misalnya nama anggota tubuh berpasangan (عَيْنٌ mata, يَدٌ tangan) dan kata seperti شَمْسٌ (matahari).'],
      examples: [{ ar: 'هُوَ طَبِيبٌ.', id: 'Dia (lk) dokter.' }, { ar: 'هِيَ طَبِيبَةٌ.', id: 'Dia (pr) dokter.' }, { ar: 'الشَّمْسُ طَالِعَةٌ.', id: 'Matahari terbit.' }],
      exercises: [
        { q: 'Bentuk muannats dari مُدَرِّسٌ adalah ...', options: ['مُدَرِّسَةٌ', 'مُدَرِّسُونَ', 'مُدَرِّسَانِ'], answer: 0, explain: 'Tambahkan ة untuk muannats.' },
        { q: 'Manakah kata muannats?', options: ['قَلَمٌ', 'سَيَّارَةٌ', 'بَابٌ'], answer: 1, explain: 'سَيَّارَةٌ berakhiran ة.' },
        { q: 'Kata شَمْسٌ termasuk ...', options: ['mudzakkar', 'muannats'], answer: 1, explain: 'شَمْسٌ muannats walau tanpa ة.' }
      ],
      summary: ['ة adalah tanda muannats paling umum.'], reflection: ['Sebutkan tiga kata muannats tanpa ة.']
    }
  },
  {
    slug: 'mufrad-mutsanna-jama', title: 'Tunggal, Dual, dan Jamak', title_ar: 'الْمُفْرَدُ وَالْمُثَنَّى وَالْجَمْعُ', grade_level: 10, category: 'qawaid', skill: 'qawaid', difficulty: 'sedang', position: 14,
    description: 'Bentuk tunggal, dua (dual), dan jamak (lebih dari dua).',
    content: {
      objectives: ['Membentuk mutsanna dengan ـَانِ / ـَيْنِ.', 'Mengenal jamak mudzakkar salim, jamak muannats salim, dan jamak taksir.'],
      intro: 'Bahasa Arab memiliki bentuk khusus untuk "dua" yang disebut mutsanna.',
      table: { head: ['Mufrad', 'Mutsanna', 'Jamak', 'Jenis jamak'], rows: [
        ['مُسْلِمٌ', 'مُسْلِمَانِ', 'مُسْلِمُونَ', 'mudzakkar salim'], ['طَالِبَةٌ', 'طَالِبَتَانِ', 'طَالِبَاتٌ', 'muannats salim'],
        ['كِتَابٌ', 'كِتَابَانِ', 'كُتُبٌ', 'taksir'], ['قَلَمٌ', 'قَلَمَانِ', 'أَقْلَامٌ', 'taksir']
      ] },
      explanation: ['Mutsanna: tambahkan ـَانِ (rafa\') atau ـَيْنِ (nashab/jar).', 'Jamak mudzakkar salim: ـُونَ / ـِينَ. Jamak muannats salim: ـَاتٌ.', 'Jamak taksir mengubah bentuk kata dan perlu dihafal.'],
      examples: [{ ar: 'فِي الْفَصْلِ طَالِبَانِ.', id: 'Di kelas ada dua orang siswa.' }, { ar: 'الْمُسْلِمُونَ يُصَلُّونَ.', id: 'Orang-orang muslim sedang shalat.' }, { ar: 'قَرَأْتُ كُتُبًا كَثِيرَةً.', id: 'Saya membaca banyak buku.' }],
      exercises: [
        { q: 'Bentuk dual dari قَلَمٌ (marfu\') adalah ...', options: ['قَلَمَانِ', 'أَقْلَامٌ', 'قَلَمَاتٌ'], answer: 0, explain: 'Dual marfu\' = ـَانِ.' },
        { q: 'طَالِبَاتٌ termasuk ...', options: ['jamak mudzakkar salim', 'jamak muannats salim', 'jamak taksir'], answer: 1, explain: 'Akhiran ـَاتٌ = jamak muannats salim.' },
        { q: 'Jamak dari كِتَابٌ adalah ...', options: ['كِتَابُونَ', 'كُتُبٌ', 'كِتَابَاتٌ'], answer: 1, explain: 'كُتُبٌ adalah jamak taksir.' }
      ],
      summary: ['Mutsanna: ـَانِ/ـَيْنِ. Jamak salim: ـُونَ/ـِينَ dan ـَاتٌ.'], reflection: ['Mengapa jamak taksir perlu dihafal?']
    }
  },
  {
    slug: 'jumlah-ismiyyah', title: 'Kalimat Nominal', title_ar: 'الْجُمْلَةُ الِاسْمِيَّةُ', grade_level: 10, category: 'qawaid', skill: 'qawaid', difficulty: 'sedang', position: 15,
    description: 'Kalimat yang diawali kata benda: mubtada\' dan khabar.',
    content: {
      objectives: ['Mengenali mubtada\' dan khabar.', 'Menyesuaikan khabar dengan mubtada\'.'],
      intro: 'Jumlah ismiyyah adalah kalimat yang diawali isim (kata benda). Terdiri dari mubtada\' (subjek) dan khabar (predikat).',
      explanation: ['Mubtada\' biasanya ma\'rifah (ber-ال atau dhamir) dan dibaca rafa\' (dhammah).', 'Khabar biasanya nakirah dan menyesuaikan jenis serta jumlah mubtada\'.', 'Contoh: الْبَيْتُ كَبِيرٌ — الْبَيْتُ = mubtada\', كَبِيرٌ = khabar.'],
      examples: [{ ar: 'الْبَيْتُ كَبِيرٌ.', id: 'Rumah itu besar.' }, { ar: 'الْمَدْرَسَةُ نَظِيفَةٌ.', id: 'Sekolah itu bersih.' }, { ar: 'الطُّلَّابُ مُجْتَهِدُونَ.', id: 'Para siswa itu rajin.' }, { ar: 'أَحْمَدُ فِي الْمَكْتَبَةِ.', id: 'Ahmad ada di perpustakaan.' }],
      exercises: [
        { q: 'Pada kalimat الْمَدْرَسَةُ نَظِيفَةٌ, khabar-nya adalah ...', options: ['الْمَدْرَسَةُ', 'نَظِيفَةٌ'], answer: 1, explain: 'نَظِيفَةٌ menerangkan mubtada\'.' },
        { q: 'Lengkapi: الطَّالِبَةُ ___', options: ['مُجْتَهِدٌ', 'مُجْتَهِدَةٌ', 'مُجْتَهِدُونَ'], answer: 1, explain: 'Khabar mengikuti mubtada\' muannats tunggal.' },
        { q: 'Kalimat nominal diawali dengan ...', options: ['kata kerja', 'kata benda', 'huruf'], answer: 1, explain: 'Jumlah ismiyyah diawali isim.' }
      ],
      summary: ['Mubtada\' + khabar.', 'Khabar menyesuaikan mubtada\'.'], reflection: ['Buat tiga kalimat nominal tentang sekolahmu.']
    }
  },
  {
    slug: 'jumlah-filiyyah', title: 'Kalimat Verbal', title_ar: 'الْجُمْلَةُ الْفِعْلِيَّةُ', grade_level: 11, category: 'qawaid', skill: 'qawaid', difficulty: 'sedang', position: 16,
    description: 'Kalimat yang diawali kata kerja: fi\'il, fa\'il, dan maf\'ul bih.',
    content: {
      objectives: ['Mengenali fi\'il, fa\'il, dan maf\'ul bih.', 'Memahami bahwa fi\'il di awal kalimat tetap tunggal.'],
      intro: 'Jumlah fi\'liyyah diawali fi\'il (kata kerja), diikuti fa\'il (pelaku), dan kadang maf\'ul bih (objek).',
      explanation: ['Fa\'il dibaca rafa\' (dhammah), maf\'ul bih dibaca nashab (fathah).', 'Bila fa\'il muannats, fi\'il ditambah ـتْ (madhi) atau diawali تَـ (mudhari\'): كَتَبَتْ فَاطِمَةُ.', 'Fi\'il yang mendahului fa\'il berupa isim zhahir tetap berbentuk tunggal: ذَهَبَ الطُّلَّابُ.'],
      examples: [{ ar: 'كَتَبَ أَحْمَدُ الدَّرْسَ.', id: 'Ahmad menulis pelajaran.' }, { ar: 'قَرَأَتْ فَاطِمَةُ الْقُرْآنَ.', id: 'Fatimah membaca Al-Qur\'an.' }, { ar: 'يَشْرَبُ الْوَلَدُ الْحَلِيبَ.', id: 'Anak itu meminum susu.' }, { ar: 'ذَهَبَ الطُّلَّابُ إِلَى الْمَدْرَسَةِ.', id: 'Para siswa pergi ke sekolah.' }],
      exercises: [
        { q: 'Pada كَتَبَ أَحْمَدُ الدَّرْسَ, maf\'ul bih-nya adalah ...', options: ['كَتَبَ', 'أَحْمَدُ', 'الدَّرْسَ'], answer: 2, explain: 'الدَّرْسَ adalah objek (dibaca fathah).' },
        { q: 'Lengkapi: ___ مَرْيَمُ الرِّسَالَةَ', options: ['كَتَبَ', 'كَتَبَتْ', 'كَتَبُوا'], answer: 1, explain: 'Fa\'il muannats → fi\'il madhi + ـتْ.' },
        { q: 'Kalimat verbal diawali dengan ...', options: ['fi\'il', 'isim', 'huruf jar'], answer: 0, explain: 'Jumlah fi\'liyyah diawali fi\'il.' }
      ],
      summary: ['Fi\'il + fa\'il (+ maf\'ul bih).'], reflection: ['Ubah tiga kalimat nominal menjadi kalimat verbal.']
    }
  },
  {
    slug: 'fiil-madhi', title: 'Kata Kerja Lampau', title_ar: 'الْفِعْلُ الْمَاضِي', grade_level: 11, category: 'qawaid', skill: 'qawaid', difficulty: 'sedang', position: 17,
    description: 'Perubahan fi\'il madhi berdasarkan pelaku.',
    content: {
      objectives: ['Mengenal tashrif fi\'il madhi untuk dhamir utama.'],
      intro: 'Fi\'il madhi menunjukkan perbuatan yang telah terjadi. Akhirannya berubah sesuai pelaku.',
      table: { head: ['Dhamir', 'Fi\'il', 'Arti'], rows: [['هُوَ', 'كَتَبَ', 'dia (lk) telah menulis'], ['هِيَ', 'كَتَبَتْ', 'dia (pr) telah menulis'], ['هُمْ', 'كَتَبُوا', 'mereka telah menulis'], ['أَنْتَ', 'كَتَبْتَ', 'kamu (lk) telah menulis'], ['أَنْتِ', 'كَتَبْتِ', 'kamu (pr) telah menulis'], ['أَنَا', 'كَتَبْتُ', 'saya telah menulis'], ['نَحْنُ', 'كَتَبْنَا', 'kami telah menulis']] },
      explanation: ['Perhatikan akhiran ـْتُ (saya), ـْتَ (kamu lk), ـْتِ (kamu pr), ـْنَا (kami).'],
      examples: [{ ar: 'ذَهَبْتُ إِلَى السُّوقِ أَمْسِ.', id: 'Saya pergi ke pasar kemarin.' }, { ar: 'دَرَسْنَا الْعَرَبِيَّةَ.', id: 'Kami telah belajar Bahasa Arab.' }, { ar: 'هَلْ أَكَلْتَ؟', id: 'Apakah kamu (lk) sudah makan?' }],
      exercises: [
        { q: '"Saya telah membaca" adalah ...', options: ['قَرَأْتُ', 'قَرَأَتْ', 'قَرَأْنَا'], answer: 0, explain: 'Akhiran ـْتُ untuk أَنَا.' },
        { q: 'كَتَبُوا pelakunya adalah ...', options: ['هُوَ', 'هُمْ', 'نَحْنُ'], answer: 1, explain: 'Akhiran ـُوا untuk هُمْ.' },
        { q: 'Lengkapi: أَنْتِ ___ (pergi)', options: ['ذَهَبْتَ', 'ذَهَبْتِ', 'ذَهَبَتْ'], answer: 1, explain: 'أَنْتِ → ـْتِ.' }
      ],
      summary: ['Akhiran fi\'il madhi menunjukkan pelaku.'], reflection: ['Ceritakan kegiatanmu kemarin dengan fi\'il madhi.']
    }
  },
  {
    slug: 'fiil-mudhari', title: 'Kata Kerja Sekarang', title_ar: 'الْفِعْلُ الْمُضَارِعُ', grade_level: 11, category: 'qawaid', skill: 'qawaid', difficulty: 'sedang', position: 18,
    description: 'Fi\'il mudhari\' untuk perbuatan sekarang atau akan datang.',
    content: {
      objectives: ['Mengenal huruf awalan mudhari\' (أ، ن، ي، ت).', 'Menggunakan سَـ / سَوْفَ untuk masa depan.'],
      intro: 'Fi\'il mudhari\' menunjukkan perbuatan yang sedang atau akan terjadi. Ciri utamanya adalah huruf awalan.',
      table: { head: ['Dhamir', 'Fi\'il', 'Arti'], rows: [['أَنَا', 'أَكْتُبُ', 'saya menulis'], ['نَحْنُ', 'نَكْتُبُ', 'kami menulis'], ['أَنْتَ', 'تَكْتُبُ', 'kamu (lk) menulis'], ['أَنْتِ', 'تَكْتُبِينَ', 'kamu (pr) menulis'], ['هُوَ', 'يَكْتُبُ', 'dia (lk) menulis'], ['هِيَ', 'تَكْتُبُ', 'dia (pr) menulis'], ['هُمْ', 'يَكْتُبُونَ', 'mereka menulis']] },
      explanation: ['Awalan: أَ (saya), نَ (kami), تَ (kamu / dia pr), يَ (dia lk / mereka).', 'سَـ atau سَوْفَ di depan mudhari\' bermakna "akan": سَأَذْهَبُ (saya akan pergi).'],
      examples: [{ ar: 'أَدْرُسُ فِي الْمَكْتَبَةِ.', id: 'Saya belajar di perpustakaan.' }, { ar: 'تَكْتُبُ هِنْدُ الْوَاجِبَ.', id: 'Hindun menulis tugas.' }, { ar: 'سَأُسَافِرُ غَدًا.', id: 'Saya akan bepergian besok.' }],
      exercises: [
        { q: 'يَكْتُبُونَ artinya ...', options: ['mereka menulis', 'kami menulis', 'kamu menulis'], answer: 0, explain: 'يَـ ... ـُونَ untuk هُمْ.' },
        { q: '"Kami belajar" adalah ...', options: ['أَدْرُسُ', 'نَدْرُسُ', 'يَدْرُسُ'], answer: 1, explain: 'Awalan نَـ untuk نَحْنُ.' },
        { q: 'سَأَذْهَبُ bermakna ...', options: ['saya telah pergi', 'saya akan pergi', 'pergilah'], answer: 1, explain: 'سَـ = akan.' }
      ],
      summary: ['Awalan أَنَيْتُ menandai mudhari\'.', 'سَـ / سَوْفَ = akan.'], reflection: ['Sebutkan rencanamu besok dengan سَـ.']
    }
  },
  {
    slug: 'fiil-amr', title: 'Kata Kerja Perintah', title_ar: 'فِعْلُ الْأَمْرِ', grade_level: 12, category: 'qawaid', skill: 'qawaid', difficulty: 'sedang', position: 19,
    description: 'Membentuk kalimat perintah dari fi\'il mudhari\'.',
    content: {
      objectives: ['Membentuk fi\'il amr dari mudhari\'.', 'Menyesuaikan perintah untuk laki-laki, perempuan, dan jamak.'],
      intro: 'Fi\'il amr dipakai untuk memerintah atau meminta. Bentuknya diambil dari fi\'il mudhari\' untuk أَنْتَ.',
      table: { head: ['Mudhari\'', 'Amr (lk)', 'Amr (pr)', 'Amr (jamak lk)'], rows: [['تَكْتُبُ', 'اُكْتُبْ', 'اُكْتُبِي', 'اُكْتُبُوا'], ['تَجْلِسُ', 'اِجْلِسْ', 'اِجْلِسِي', 'اِجْلِسُوا'], ['تَفْتَحُ', 'اِفْتَحْ', 'اِفْتَحِي', 'اِفْتَحُوا']] },
      explanation: ['Langkah: hapus huruf تَـ di awal, sukunkan akhirnya. Jika huruf pertama sukun, tambahkan hamzah washal (اُ jika huruf ketiga dhammah, اِ jika fathah/kasrah).'],
      examples: [{ ar: 'اُكْتُبِ الدَّرْسَ.', id: 'Tulislah pelajaran itu.' }, { ar: 'اِجْلِسِي هُنَا يَا فَاطِمَةُ.', id: 'Duduklah di sini, wahai Fatimah.' }, { ar: 'اِفْتَحُوا الْكُتُبَ.', id: 'Bukalah buku-buku kalian.' }],
      exercises: [
        { q: 'Fi\'il amr dari تَجْلِسُ (untuk lk) adalah ...', options: ['اِجْلِسْ', 'جَلَسَ', 'يَجْلِسُ'], answer: 0, explain: 'Hapus تَـ, sukunkan akhir, tambah hamzah.' },
        { q: 'Perintah untuk perempuan "tulislah" adalah ...', options: ['اُكْتُبْ', 'اُكْتُبِي', 'اُكْتُبُوا'], answer: 1, explain: 'Akhiran ـِي untuk perempuan.' },
        { q: 'اِفْتَحُوا ditujukan kepada ...', options: ['satu laki-laki', 'satu perempuan', 'banyak laki-laki'], answer: 2, explain: 'Akhiran ـُوا untuk jamak.' }
      ],
      summary: ['Amr dibentuk dari mudhari\' untuk أَنْتَ.'], reflection: ['Tuliskan tiga perintah sopan yang sering dipakai guru di kelas.']
    }
  },
  {
    slug: 'naat-manut', title: 'Sifat dan yang Disifati', title_ar: 'النَّعْتُ وَالْمَنْعُوتُ', grade_level: 12, category: 'qawaid', skill: 'qawaid', difficulty: 'sulit', position: 20,
    description: 'Kesesuaian na\'at dengan man\'ut dalam jenis, jumlah, ma\'rifah/nakirah, dan i\'rab.',
    content: {
      objectives: ['Memahami empat kesesuaian na\'at dan man\'ut.', 'Membedakan na\'at dengan khabar.'],
      intro: 'Na\'at (sifat) mengikuti man\'ut (yang disifati) dan diletakkan sesudahnya.',
      explanation: ['Na\'at mengikuti man\'ut dalam: jenis (mudzakkar/muannats), jumlah, ma\'rifah/nakirah, dan i\'rab.', 'بَيْتٌ كَبِيرٌ = rumah besar (frasa). الْبَيْتُ الْكَبِيرُ = rumah yang besar itu (frasa). الْبَيْتُ كَبِيرٌ = rumah itu besar (kalimat, karena كَبِيرٌ nakirah → khabar).', 'Untuk jamak benda tak berakal, na\'at biasanya muannats tunggal: كُتُبٌ جَدِيدَةٌ.'],
      examples: [{ ar: 'هَذَا طَالِبٌ مُجْتَهِدٌ.', id: 'Ini siswa yang rajin.' }, { ar: 'رَأَيْتُ الطَّالِبَةَ الْمُجْتَهِدَةَ.', id: 'Saya melihat siswi yang rajin itu.' }, { ar: 'اِشْتَرَيْتُ كُتُبًا جَدِيدَةً.', id: 'Saya membeli buku-buku baru.' }],
      exercises: [
        { q: 'Lengkapi: رَأَيْتُ السَّيَّارَةَ ___', options: ['الْجَدِيدَةَ', 'جَدِيدَةٌ', 'الْجَدِيدُ'], answer: 0, explain: 'Na\'at mengikuti: muannats, ma\'rifah, nashab.' },
        { q: 'الْبَيْتُ كَبِيرٌ adalah ...', options: ['frasa na\'at–man\'ut', 'kalimat mubtada\'–khabar'], answer: 1, explain: 'كَبِيرٌ nakirah sehingga berfungsi sebagai khabar.' },
        { q: 'Na\'at yang tepat untuk كُتُبٌ adalah ...', options: ['جَدِيدٌ', 'جَدِيدَةٌ', 'جَدِيدُونَ'], answer: 1, explain: 'Jamak tak berakal → na\'at muannats tunggal.' }
      ],
      summary: ['Na\'at mengikuti man\'ut dalam 4 hal.'], reflection: ['Buat tiga frasa na\'at–man\'ut tentang kelasmu.']
    }
  }
];
