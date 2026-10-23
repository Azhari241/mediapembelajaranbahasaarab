/* ARABIYA EDU — Materi tematik bawaan (dapat diedit/diganti guru).
   Catatan: materi ini adalah contoh awal dan BELUM diverifikasi sebagai kurikulum resmi.
   Sesuaikan dengan buku ajar, ATP, dan CP SMA GUPPI Samata melalui Panel Guru. */
(function () {
  const AE = (window.AE = window.AE || {});
  const mcq = (q, options, answer, explain, ar) => ({ type: 'mcq', q, ar: ar || '', options, answer, explain });
  const tf = (q, ar, answer, explain) => ({ type: 'tf', q, ar, answer, explain });
  const fill = (q, ar, answer, explain) => ({ type: 'fill', q, ar, answer: [].concat(answer), explain });
  const arrange = (q, tokens, explain) => ({ type: 'arrange', q, tokens, explain });

  AE.BUNDLED_THEME_LESSONS = [
    {
      slug: 'taaruf', title: 'Perkenalan', title_ar: 'التَّعَارُفُ', grade_level: 10, category: 'tema', skill: 'kalam', difficulty: 'mudah',
      objectives: ['Menyapa dan membalas salam dalam bahasa Arab.', 'Memperkenalkan nama, asal, dan kelas.', 'Menanyakan identitas teman dengan sopan.'],
      intro: 'Perkenalan adalah percakapan pertama yang kita lakukan ketika bertemu orang baru. Dalam bahasa Arab, perkenalan biasanya diawali salam, lalu menyebut nama dan asal.',
      vocab_category: 'perkenalan',
      explanation: [
        'Untuk menanyakan nama, gunakan مَا اسْمُكَ؟ (kepada laki-laki) atau مَا اسْمُكِ؟ (kepada perempuan). Perbedaannya hanya pada harakat huruf terakhir: fathah untuk laki-laki, kasrah untuk perempuan.',
        'Jawablah dengan اِسْمِي ... (namaku ...). Akhiran ـِي berarti “-ku/saya”.',
        'Untuk menanyakan asal, gunakan مِنْ أَيْنَ أَنْتَ؟ (laki-laki) atau مِنْ أَيْنَ أَنْتِ؟ (perempuan). Jawab dengan أَنَا مِنْ ... (aku dari ...).',
      ],
      examples: [
        ['اَلسَّلَامُ عَلَيْكُمْ، اِسْمِي أَحْمَدُ.', 'Assalamu’alaikum, namaku Ahmad.'],
        ['مَا اسْمُكِ يَا أُخْتِي؟', 'Siapa namamu, saudariku?'],
        ['أَنَا مِنْ غُووَا، سُولَاوِيسِي الْجَنُوبِيَّةِ.', 'Aku dari Gowa, Sulawesi Selatan.'],
        ['أَنَا طَالِبٌ فِي الصَّفِّ الْعَاشِرِ.', 'Aku siswa di kelas sepuluh.'],
      ],
      daily: [
        ['تَشَرَّفْنَا بِمَعْرِفَتِكَ.', 'Diucapkan setelah berkenalan: “Senang berkenalan denganmu.”'],
        ['أَهْلًا وَسَهْلًا.', 'Menyambut tamu atau teman baru: “Selamat datang.”'],
      ],
      exercises: [
        mcq('Pertanyaan yang tepat untuk menanyakan nama teman perempuan adalah …', ['مَا اسْمُكَ؟', 'مَا اسْمُكِ؟', 'مِنْ أَيْنَ أَنْتَ؟', 'كَمْ عُمْرُكَ؟'], 1, 'Kepada perempuan, kata ganti “-mu” berharakat kasrah: اسْمُكِ.'),
        tf('Kalimat berikut berarti “Aku dari Makassar”.', 'أَنَا مِنْ مَاكَاسَار.', true, 'أَنَا = aku, مِنْ = dari.'),
        fill('Lengkapi: ___ أَحْمَدُ. (Namaku Ahmad.)', '', ['اسمي', 'اِسْمِي'], 'اِسْمِي = namaku.'),
        arrange('Susun menjadi “Siapa namamu?” (laki-laki)', ['مَا', 'اسْمُكَ', '؟'], 'Pola tanya: مَا + kata benda.'),
      ],
      summary: ['Salam: اَلسَّلَامُ عَلَيْكُمْ — balasan: وَعَلَيْكُمُ السَّلَامُ.', 'Nama: مَا اسْمُكَ؟ / اِسْمِي ...', 'Asal: مِنْ أَيْنَ أَنْتَ؟ / أَنَا مِنْ ...'],
      reflection: ['Dapatkah kamu memperkenalkan diri tanpa melihat teks?', 'Kata mana yang paling sulit kamu ucapkan?'],
    },
    {
      slug: 'madrasah', title: 'Sekolah', title_ar: 'الْمَدْرَسَةُ', grade_level: 10, category: 'tema', skill: 'mufradat', difficulty: 'mudah',
      objectives: ['Menyebutkan benda dan tempat di sekolah.', 'Menggunakan kata tunjuk هٰذَا dan هٰذِهِ.', 'Mendeskripsikan benda dengan kata sifat sederhana.'],
      intro: 'Sekolah adalah tempat yang kita kunjungi hampir setiap hari. Mengenal nama benda di kelas membantu kita berkomunikasi dengan guru dan teman.',
      vocab_category: 'sekolah',
      explanation: [
        'Gunakan هٰذَا (ini) untuk kata benda mudzakkar (maskulin), seperti قَلَمٌ dan كِتَابٌ.',
        'Gunakan هٰذِهِ (ini) untuk kata benda muannats (feminin), yang umumnya diakhiri ta marbuthah (ـةٌ), seperti مِسْطَرَةٌ dan حَقِيبَةٌ.',
        'Kata sifat mengikuti jenis kata bendanya: كِتَابٌ جَدِيدٌ (buku baru), حَقِيبَةٌ جَدِيدَةٌ (tas baru).',
      ],
      examples: [
        ['هٰذَا قَلَمٌ.', 'Ini pena.'],
        ['هٰذِهِ حَقِيبَةٌ.', 'Ini tas.'],
        ['هٰذَا فَصْلٌ نَظِيفٌ.', 'Ini kelas yang bersih.'],
        ['الْمَكْتَبَةُ كَبِيرَةٌ.', 'Perpustakaan itu besar.'],
      ],
      daily: [
        ['أَيْنَ الْمَكْتَبَةُ؟', 'Menanyakan letak perpustakaan kepada penjaga sekolah.'],
        ['هَلْ عِنْدَكَ قَلَمٌ؟', 'Meminjam pena: “Apakah kamu punya pena?”'],
      ],
      exercises: [
        mcq('Kata tunjuk yang tepat untuk حَقِيبَةٌ adalah …', ['هٰذَا', 'هٰذِهِ', 'هُوَ', 'أَنَا'], 1, 'حَقِيبَةٌ berakhiran ta marbuthah → muannats → هٰذِهِ.'),
        mcq('Arti مَكْتَبَةٌ adalah …', ['meja belajar', 'perpustakaan', 'kantor', 'buku tulis'], 1, 'مَكْتَبَةٌ = perpustakaan; مَكْتَبٌ = meja belajar/kantor.'),
        tf('Kalimat berikut sudah benar.', 'هٰذِهِ قَلَمٌ.', false, 'قَلَمٌ mudzakkar, maka seharusnya هٰذَا قَلَمٌ.'),
        arrange('Susun menjadi “Ini buku baru.”', ['هٰذَا', 'كِتَابٌ', 'جَدِيدٌ'], 'Kata sifat diletakkan setelah kata benda.'),
      ],
      summary: ['هٰذَا untuk mudzakkar, هٰذِهِ untuk muannats.', 'Kata sifat diletakkan setelah kata benda dan menyesuaikan jenisnya.'],
      reflection: ['Sebutkan lima benda di mejamu dalam bahasa Arab.', 'Apakah kamu bisa membedakan مَكْتَبٌ dan مَكْتَبَةٌ?'],
    },
    {
      slug: 'usrah', title: 'Keluarga', title_ar: 'الْأُسْرَةُ', grade_level: 10, category: 'tema', skill: 'qiraah', difficulty: 'mudah',
      objectives: ['Menyebutkan anggota keluarga.', 'Menggunakan akhiran kepemilikan ـِي (-ku).', 'Membaca teks pendek tentang keluarga.'],
      intro: 'Keluarga adalah lingkungan terdekat kita. Pada materi ini kamu akan belajar menyebut anggota keluarga dan pekerjaannya.',
      vocab_category: 'keluarga',
      explanation: [
        'Tambahkan ـِي di akhir kata benda untuk menyatakan “-ku”: بَيْتٌ → بَيْتِي (rumahku).',
        'Untuk أَبٌ dan أَخٌ, bentuk “-ku” menjadi أَبِي dan أَخِي.',
        'Jika kata berakhiran ـةٌ, ta marbuthah berubah menjadi ta biasa: أُسْرَةٌ → أُسْرَتِي.',
      ],
      passage: {
        ar: 'اِسْمِي فَاطِمَةُ. أُسْرَتِي صَغِيرَةٌ. أَبِي مُوَظَّفٌ وَأُمِّي مُدَرِّسَةٌ. لِي أَخٌ وَاحِدٌ، اِسْمُهُ عَلِيٌّ. هُوَ طَالِبٌ فِي الْجَامِعَةِ. نَحْنُ نَسْكُنُ فِي سَامَاتَا.',
        id: 'Namaku Fatimah. Keluargaku kecil. Ayahku seorang pegawai dan ibuku seorang guru. Aku punya satu saudara laki-laki, namanya Ali. Dia mahasiswa di universitas. Kami tinggal di Samata.',
      },
      examples: [
        ['هٰذَا أَبِي.', 'Ini ayahku.'],
        ['أُمِّي مُدَرِّسَةٌ.', 'Ibuku seorang guru.'],
        ['بَيْتُنَا قَرِيبٌ مِنَ الْمَسْجِدِ.', 'Rumah kami dekat dari masjid.'],
      ],
      daily: [['كَمْ شَخْصًا فِي أُسْرَتِكَ؟', 'Menanyakan jumlah anggota keluarga teman.']],
      exercises: [
        mcq('Berdasarkan bacaan, pekerjaan ibu Fatimah adalah …', ['pegawai', 'guru', 'dokter', 'mahasiswa'], 1, 'أُمِّي مُدَرِّسَةٌ = ibuku seorang guru.'),
        tf('Fatimah mempunyai dua saudara laki-laki.', '', false, 'لِي أَخٌ وَاحِدٌ = aku punya satu saudara laki-laki.'),
        fill('Lengkapi: ___ كَبِيرٌ. (Rumahku besar.)', '', ['بيتي', 'بَيْتِي'], 'بَيْتٌ + ـِي = بَيْتِي.'),
      ],
      summary: ['Akhiran ـِي = -ku.', 'ـةٌ berubah menjadi ـتِـ saat diberi akhiran.'],
      reflection: ['Tulislah tiga kalimat tentang keluargamu.'],
    },
    {
      slug: 'anshithah', title: 'Kegiatan sehari-hari', title_ar: 'الْأَنْشِطَةُ الْيَوْمِيَّةُ', grade_level: 10, category: 'tema', skill: 'kitabah', difficulty: 'sedang',
      objectives: ['Menyebutkan kegiatan harian dengan fi’il mudhari’.', 'Menyusun urutan kegiatan menggunakan ثُمَّ dan بَعْدَ ذٰلِكَ.'],
      intro: 'Setiap hari kita melakukan banyak kegiatan: bangun, mandi, belajar, makan, dan tidur. Kita akan belajar menceritakannya dalam bahasa Arab.',
      vocab_category: 'kegiatan',
      explanation: [
        'Untuk menceritakan kebiasaan, gunakan fi’il mudhari’ (kata kerja sekarang). Untuk “aku”, awali dengan huruf أَ: أَذْهَبُ (aku pergi), أَكْتُبُ (aku menulis).',
        'Untuk “kami/kita”, awali dengan نَـ: نَذْهَبُ (kami pergi).',
        'Gunakan ثُمَّ (kemudian) dan بَعْدَ ذٰلِكَ (setelah itu) untuk menyambung kegiatan.',
      ],
      examples: [
        ['أَسْتَيْقِظُ مُبَكِّرًا.', 'Aku bangun pagi-pagi.'],
        ['أُصَلِّي الصُّبْحَ، ثُمَّ أَقْرَأُ الْقُرْآنَ.', 'Aku salat Subuh, kemudian membaca Al-Qur’an.'],
        ['نَذْهَبُ إِلَى الْمَدْرَسَةِ مَعًا.', 'Kami pergi ke sekolah bersama-sama.'],
      ],
      daily: [['مَاذَا تَفْعَلُ بَعْدَ الْمَدْرَسَةِ؟', 'Menanyakan kegiatan teman setelah sekolah.']],
      exercises: [
        mcq('Arti أَكْتُبُ adalah …', ['dia menulis', 'aku menulis', 'kami menulis', 'tulislah'], 1, 'Awalan أَ pada mudhari’ menunjukkan “aku”.'),
        fill('Lengkapi: ___ إِلَى الْمَدْرَسَةِ. (Kami pergi ke sekolah.)', '', ['نذهب', 'نَذْهَبُ'], 'Awalan نَـ = kami.'),
        arrange('Susun: “Aku mandi kemudian sarapan.”', ['أَغْتَسِلُ', 'ثُمَّ', 'أَتَنَاوَلُ', 'الْفَطُورَ'], 'ثُمَّ menyambung dua kegiatan berurutan.'),
      ],
      summary: ['أَ… = aku, نَـ… = kami (fi’il mudhari’).', 'ثُمَّ = kemudian, بَعْدَ ذٰلِكَ = setelah itu.'],
      reflection: ['Tuliskan lima kegiatan pagimu secara berurutan.'],
    },
    {
      slug: 'hiwayat', title: 'Hobi', title_ar: 'الْهِوَايَاتُ', grade_level: 11, category: 'tema', skill: 'kalam', difficulty: 'mudah',
      objectives: ['Menanyakan dan menyebutkan hobi.', 'Memberi alasan dengan لِأَنَّ.'],
      intro: 'Hobi adalah kegiatan yang kita sukai di waktu luang. Membicarakan hobi adalah cara yang baik untuk mengenal teman.',
      vocab_category: 'hobi',
      explanation: [
        'Tanyakan hobi dengan مَا هِوَايَتُكَ؟ dan jawab هِوَايَتِي ... diikuti mashdar (kata benda kegiatan), seperti الْقِرَاءَةُ atau السِّبَاحَةُ.',
        'Gunakan أُحِبُّ (aku suka) + kata benda berharakat fathah: أُحِبُّ الرَّسْمَ.',
        'Untuk alasan, gunakan لِأَنَّ (karena) lalu kata ganti: لِأَنَّهُ مُمْتِعٌ (karena itu menyenangkan).',
      ],
      examples: [
        ['هِوَايَتِي التَّصْوِيرُ.', 'Hobiku memotret.'],
        ['أُحِبُّ الطَّبْخَ لِأَنَّهُ مُمْتِعٌ.', 'Aku suka memasak karena menyenangkan.'],
        ['نَلْعَبُ كُرَةَ الْقَدَمِ يَوْمَ الْجُمُعَةِ.', 'Kami bermain sepak bola pada hari Jumat.'],
      ],
      daily: [['مَتَى تُمَارِسُ هِوَايَتَكَ؟', 'Kapan kamu melakukan hobimu?']],
      exercises: [
        mcq('Jawaban yang tepat untuk مَا هِوَايَتُكَ؟ adalah …', ['اِسْمِي عَلِيٌّ', 'هِوَايَتِي الرَّسْمُ', 'أَنَا مِنْ جَاكَرْتَا', 'السَّاعَةُ الثَّامِنَةُ'], 1, 'Pertanyaan tentang hobi dijawab dengan هِوَايَتِي ...'),
        tf('لِأَنَّ berarti “karena”.', '', true, 'لِأَنَّ digunakan untuk memberi alasan.'),
      ],
      summary: ['مَا هِوَايَتُكَ؟ — هِوَايَتِي ...', 'أُحِبُّ + kata benda; لِأَنَّ untuk alasan.'],
      reflection: ['Jelaskan hobimu beserta alasannya dalam dua kalimat.'],
    },
    {
      slug: 'waqt', title: 'Waktu', title_ar: 'الْوَقْتُ', grade_level: 11, category: 'tema', skill: 'istima', difficulty: 'sedang',
      objectives: ['Menanyakan dan menyebutkan jam.', 'Menggunakan وَالنِّصْفُ, وَالرُّبْعُ, dan إِلَّا رُبْعًا.'],
      intro: 'Mengetahui cara menyebut waktu membantu kita membuat janji dan menceritakan jadwal kegiatan.',
      vocab_category: 'waktu',
      explanation: [
        'Tanyakan waktu dengan كَمِ السَّاعَةُ الْآنَ؟ (Jam berapa sekarang?).',
        'Jam disebut dengan bilangan bertingkat (ordinal) berbentuk muannats: السَّاعَةُ الْوَاحِدَةُ، الثَّانِيَةُ، الثَّالِثَةُ، الرَّابِعَةُ، الْخَامِسَةُ، السَّادِسَةُ، السَّابِعَةُ، الثَّامِنَةُ، التَّاسِعَةُ، الْعَاشِرَةُ.',
        'Tambahkan وَالنِّصْفُ (setengah lewat / “setengah” berikutnya dalam bahasa Indonesia), وَالرُّبْعُ (lewat seperempat), atau إِلَّا رُبْعًا (kurang seperempat).',
      ],
      examples: [
        ['السَّاعَةُ السَّابِعَةُ تَمَامًا.', 'Pukul tujuh tepat.'],
        ['السَّاعَةُ الرَّابِعَةُ وَالنِّصْفُ.', 'Pukul empat lewat tiga puluh (setengah lima).'],
        ['السَّاعَةُ الْعَاشِرَةُ وَالرُّبْعُ.', 'Pukul sepuluh lewat seperempat.'],
        ['السَّاعَةُ الثَّامِنَةُ إِلَّا رُبْعًا.', 'Pukul delapan kurang seperempat.'],
      ],
      daily: [['مَتَى يَبْدَأُ الدَّرْسُ؟', 'Kapan pelajaran dimulai?']],
      exercises: [
        mcq('السَّاعَةُ السَّادِسَةُ وَالنِّصْفُ berarti pukul …', ['06.15', '06.30', '05.30', '06.45'], 1, 'وَالنِّصْفُ = lewat 30 menit.'),
        mcq('Pukul 09.45 dalam bahasa Arab adalah …', ['السَّاعَةُ التَّاسِعَةُ وَالرُّبْعُ', 'السَّاعَةُ الْعَاشِرَةُ إِلَّا رُبْعًا', 'السَّاعَةُ التَّاسِعَةُ وَالنِّصْفُ', 'السَّاعَةُ الْعَاشِرَةُ وَالرُّبْعُ'], 1, '09.45 = sepuluh kurang seperempat.'),
        tf('أَمْسِ berarti “besok”.', '', false, 'أَمْسِ = kemarin; غَدًا = besok.'),
      ],
      summary: ['كَمِ السَّاعَةُ؟', 'وَالنِّصْفُ (+30), وَالرُّبْعُ (+15), إِلَّا رُبْعًا (−15).'],
      reflection: ['Sebutkan jadwal harianmu dengan jam dalam bahasa Arab.'],
    },
    {
      slug: 'thaam', title: 'Makanan dan minuman', title_ar: 'الطَّعَامُ وَالشَّرَابُ', grade_level: 11, category: 'tema', skill: 'kalam', difficulty: 'mudah',
      objectives: ['Menyebutkan makanan dan minuman.', 'Memesan makanan dengan أُرِيدُ.', 'Menanyakan harga dengan بِكَمْ.'],
      intro: 'Di kantin atau rumah makan, kita perlu memesan dan menanyakan harga. Materi ini melatih percakapan sederhana tentang makanan.',
      vocab_category: 'makanan',
      explanation: [
        'Gunakan أُرِيدُ (aku mau) + kata benda bertanwin fathah: أُرِيدُ خُبْزًا.',
        'Untuk “segelas …”, gunakan كُوبًا مِنْ ...: أُرِيدُ كُوبًا مِنَ الْمَاءِ.',
        'Untuk menanyakan harga, gunakan بِكَمْ هٰذَا؟ (Berapa harga ini?).',
      ],
      examples: [
        ['أُرِيدُ أَرُزًّا وَسَمَكًا.', 'Aku mau nasi dan ikan.'],
        ['أُرِيدُ كُوبًا مِنَ الشَّايِ.', 'Aku mau segelas teh.'],
        ['بِكَمْ هٰذَا الْخُبْزُ؟', 'Berapa harga roti ini?'],
      ],
      daily: [['هٰذَا الطَّعَامُ لَذِيذٌ جِدًّا!', 'Memuji makanan: “Makanan ini sangat lezat!”']],
      exercises: [
        mcq('Ungkapan untuk menanyakan harga adalah …', ['أَيْنَ هٰذَا؟', 'بِكَمْ هٰذَا؟', 'مَا هٰذَا؟', 'مَنْ هٰذَا؟'], 1, 'بِكَمْ = dengan berapa (harga).'),
        fill('Lengkapi: أُرِيدُ كُوبًا مِنَ ___ . (air)', '', ['الماء', 'الْمَاءِ', 'المَاءِ'], 'الْمَاءُ = air; setelah مِنْ berharakat kasrah.'),
      ],
      summary: ['أُرِيدُ ... = aku mau ...', 'بِكَمْ هٰذَا؟ = berapa harganya?'],
      reflection: ['Peragakan memesan makanan di kantin bersama teman.'],
    },
    {
      slug: 'shihhah', title: 'Kesehatan', title_ar: 'الصِّحَّةُ', grade_level: 12, category: 'tema', skill: 'qiraah', difficulty: 'sedang',
      objectives: ['Menyebutkan keluhan kesehatan.', 'Memahami nasihat kesehatan sederhana dalam teks Arab.'],
      intro: 'Menjaga kesehatan adalah bagian dari ibadah. Materi ini membahas kosakata kesehatan dan cara menyampaikan keluhan.',
      vocab_category: 'kesehatan',
      explanation: [
        'Sampaikan keluhan dengan عِنْدِي ... (aku mengalami …): عِنْدِي صُدَاعٌ.',
        'Dokter biasanya bertanya مَاذَا بِكَ؟ (Kamu kenapa?).',
        'Nasihat sering memakai fi’il amr (kata kerja perintah): اِشْرَبْ (minumlah), نَمْ (tidurlah).',
      ],
      passage: {
        ar: 'الرِّيَاضَةُ مُفِيدَةٌ لِلْجِسْمِ. يَجِبُ عَلَيْنَا أَنْ نَأْكُلَ طَعَامًا صِحِّيًّا وَنَشْرَبَ الْمَاءَ كَثِيرًا. وَإِذَا مَرِضْنَا نَذْهَبُ إِلَى الطَّبِيبِ.',
        id: 'Olahraga bermanfaat bagi tubuh. Kita wajib makan makanan sehat dan banyak minum air. Jika kita sakit, kita pergi ke dokter.',
      },
      examples: [
        ['عِنْدِي صُدَاعٌ مُنْذُ أَمْسِ.', 'Aku sakit kepala sejak kemarin.'],
        ['اِشْرَبِ الدَّوَاءَ بَعْدَ الْأَكْلِ.', 'Minumlah obat setelah makan.'],
      ],
      daily: [['شَفَاكَ اللّٰهُ.', 'Doa untuk teman yang sakit: “Semoga Allah menyembuhkanmu.”']],
      exercises: [
        mcq('Menurut bacaan, jika kita sakit kita pergi ke …', ['pasar', 'dokter', 'sekolah', 'perpustakaan'], 1, 'نَذْهَبُ إِلَى الطَّبِيبِ.'),
        tf('مُسْتَشْفًى berarti “rumah sakit”.', '', true, 'مُسْتَشْفًى = rumah sakit.'),
      ],
      summary: ['عِنْدِي + keluhan.', 'شَفَاكَ اللّٰهُ untuk mendoakan kesembuhan.'],
      reflection: ['Apa kebiasaan sehat yang sudah kamu lakukan?'],
    },
    {
      slug: 'biah', title: 'Lingkungan', title_ar: 'الْبِيئَةُ', grade_level: 12, category: 'tema', skill: 'kitabah', difficulty: 'sedang',
      objectives: ['Menyebutkan unsur-unsur lingkungan.', 'Menulis ajakan menjaga lingkungan dengan fi’il amr dan larangan لَا.'],
      intro: 'Lingkungan yang bersih membuat kita sehat dan nyaman belajar. Pada materi ini kamu akan belajar menulis ajakan menjaga lingkungan.',
      vocab_category: 'lingkungan',
      explanation: [
        'Ajakan bersama: هَيَّا + fi’il mudhari’ untuk “kita”: هَيَّا نَزْرَعُ (ayo kita menanam).',
        'Larangan: لَا + fi’il mudhari’ dengan akhir sukun: لَا تَرْمِ (jangan membuang — kepada satu orang laki-laki).',
        'Untuk banyak orang: لَا تَرْمُوا (jangan kalian membuang).',
      ],
      examples: [
        ['هَيَّا نُحَافِظُ عَلَى نَظَافَةِ الْبِيئَةِ.', 'Ayo kita menjaga kebersihan lingkungan.'],
        ['لَا تَرْمُوا النُّفَايَاتِ فِي النَّهْرِ.', 'Janganlah kalian membuang sampah ke sungai.'],
      ],
      daily: [['النَّظَافَةُ مِنَ الْإِيمَانِ.', 'Ungkapan populer: “Kebersihan adalah bagian dari iman.”']],
      exercises: [
        mcq('Arti لَا تَرْمِ النُّفَايَاتِ adalah …', ['Buanglah sampah', 'Jangan membuang sampah', 'Aku membuang sampah', 'Sampah itu kotor'], 1, 'لَا + mudhari’ majzum = larangan.'),
        arrange('Susun: “Ayo kita menanam pohon.”', ['هَيَّا', 'نَزْرَعُ', 'الْأَشْجَارَ'], 'هَيَّا + fi’il untuk “kita”.'),
      ],
      summary: ['هَيَّا + نَـ... = ayo kita ...', 'لَا + fi’il = larangan.'],
      reflection: ['Tulis satu poster ajakan menjaga lingkungan sekolah dalam bahasa Arab.'],
    },
    {
      slug: 'safar', title: 'Perjalanan', title_ar: 'السَّفَرُ', grade_level: 12, category: 'tema', skill: 'istima', difficulty: 'sulit',
      objectives: ['Menyebutkan alat transportasi dan tempat perjalanan.', 'Menceritakan perjalanan menggunakan fi’il madhi.'],
      intro: 'Bepergian memberi kita pengalaman baru. Kita akan belajar menceritakan perjalanan yang sudah dilakukan.',
      vocab_category: 'perjalanan',
      explanation: [
        'Gunakan بِـ + nama kendaraan untuk menyatakan “dengan/naik”: بِالطَّائِرَةِ (dengan pesawat).',
        'Untuk menceritakan pengalaman lampau, gunakan fi’il madhi. Untuk “aku”, tambahkan ـْتُ: سَافَرْتُ (aku bepergian), زُرْتُ (aku mengunjungi).',
        'Untuk “kami”, tambahkan ـْنَا: سَافَرْنَا (kami bepergian).',
      ],
      examples: [
        ['سَافَرْتُ إِلَى مَكَّةَ مَعَ أُسْرَتِي.', 'Aku bepergian ke Makkah bersama keluargaku.'],
        ['ذَهَبْنَا إِلَى الْمَطَارِ بِالسَّيَّارَةِ.', 'Kami pergi ke bandara dengan mobil.'],
        ['نَزَلْنَا فِي فُنْدُقٍ قَرِيبٍ مِنَ الْبَحْرِ.', 'Kami menginap di hotel yang dekat dengan laut.'],
      ],
      daily: [['رِحْلَةً سَعِيدَةً!', 'Ucapan untuk orang yang akan bepergian: “Selamat jalan!”']],
      exercises: [
        mcq('سَافَرْنَا بِالْقِطَارِ berarti …', ['Kami bepergian dengan kereta', 'Aku bepergian dengan kapal', 'Mereka naik bus', 'Kami pergi ke bandara'], 0, 'ـنَا = kami; الْقِطَارُ = kereta.'),
        fill('Lengkapi: ___ إِلَى جَاكَرْتَا أَمْسِ. (Aku bepergian ke Jakarta kemarin.)', '', ['سافرت', 'سَافَرْتُ'], 'Madhi + ـْتُ = aku.'),
      ],
      summary: ['بِـ + kendaraan = dengan/naik.', 'Madhi: ـْتُ = aku, ـْنَا = kami.'],
      reflection: ['Ceritakan perjalanan terakhirmu dalam tiga kalimat.'],
    },
  ];
})();
