/* ARABIYA EDU — Materi bawaan (contoh yang dapat diedit guru).
   Catatan: materi ini adalah contoh awal, BUKAN kurikulum resmi yang telah diverifikasi.
   Sesuaikan dengan buku ajar, ATP, dan capaian pembelajaran SMA GUPPI Samata melalui Panel Guru. */
window.AE_CONTENT = window.AE_CONTENT || {};
window.AE_CONTENT.lessons = [
  // ======================= KELAS X — TEMA =======================
  {
    slug: 'taaruf', title: 'Perkenalan', title_ar: 'التَّعَارُفُ', grade_level: 10, category: 'tema', skill: 'kalam', difficulty: 'mudah', position: 1,
    description: 'Menyapa, memperkenalkan diri, dan menanyakan identitas teman.',
    content: {
      objectives: ['Mengucapkan salam dan menjawabnya.', 'Memperkenalkan nama dan asal diri.', 'Menanyakan nama dan asal teman.'],
      intro: 'Perkenalan adalah percakapan pertama yang kita lakukan saat bertemu orang baru. Dalam Bahasa Arab, perkenalan biasanya dimulai dengan salam, lalu menyebutkan nama dan asal.',
      vocab: [
        { ar: 'اِسْمٌ', id: 'nama' }, { ar: 'طَالِبٌ', id: 'siswa (laki-laki)' }, { ar: 'طَالِبَةٌ', id: 'siswi (perempuan)' },
        { ar: 'مُدَرِّسٌ', id: 'guru (laki-laki)' }, { ar: 'صَدِيقٌ', id: 'teman' }, { ar: 'مِنْ أَيْنَ', id: 'dari mana' },
        { ar: 'بَلَدٌ', id: 'negeri, kota' }
      ],
      explanation: [
        'Untuk menanyakan nama, gunakan مَا اسْمُكَ؟ kepada laki-laki dan مَا اسْمُكِ؟ kepada perempuan. Perbedaannya ada pada harakat akhir: ـكَ (fathah) untuk laki-laki, ـكِ (kasrah) untuk perempuan.',
        'Untuk menjawab, gunakan اِسْمِي ... (namaku ...). Akhiran ـي berarti "milikku".',
        'Untuk menanyakan asal, gunakan مِنْ أَيْنَ أَنْتَ؟ (laki-laki) atau مِنْ أَيْنَ أَنْتِ؟ (perempuan).'
      ],
      examples: [
        { ar: 'مَا اسْمُكَ؟', id: 'Siapa namamu? (kepada laki-laki)' },
        { ar: 'اِسْمِي أَحْمَدُ.', id: 'Namaku Ahmad.' },
        { ar: 'مِنْ أَيْنَ أَنْتِ؟', id: 'Dari mana kamu? (kepada perempuan)' },
        { ar: 'أَنَا مِنْ إِنْدُونِيسِيَا.', id: 'Saya dari Indonesia.' },
        { ar: 'أَنَا طَالِبٌ فِي الْمَدْرَسَةِ الثَّانَوِيَّةِ.', id: 'Saya siswa di sekolah menengah atas.' },
        { ar: 'تَشَرَّفْتُ بِمَعْرِفَتِكَ.', id: 'Senang berkenalan denganmu.' }
      ],
      daily: [
        { ar: 'السَّلَامُ عَلَيْكُمْ.', id: 'Semoga keselamatan tercurah atasmu.' },
        { ar: 'وَعَلَيْكُمُ السَّلَامُ.', id: 'Dan semoga keselamatan juga tercurah atasmu.' }
      ],
      exercises: [
        { q: 'Bagaimana menanyakan nama kepada teman perempuan?', options: ['مَا اسْمُكَ؟', 'مَا اسْمُكِ؟', 'مَا اسْمِي؟'], answer: 1, explain: 'Untuk perempuan gunakan akhiran ـكِ (kasrah).' },
        { q: 'Arti اِسْمِي زَيْدٌ adalah ...', options: ['Namamu Zaid', 'Namaku Zaid', 'Namanya Zaid'], answer: 1, explain: 'Akhiran ـي berarti "milikku", jadi اِسْمِي = namaku.' },
        { q: 'Jawaban yang tepat untuk مِنْ أَيْنَ أَنْتَ؟ adalah ...', options: ['أَنَا مِنْ إِنْدُونِيسِيَا.', 'اِسْمِي أَحْمَدُ.', 'وَعَلَيْكُمُ السَّلَامُ.'], answer: 0, explain: 'Pertanyaan menanyakan asal, sehingga dijawab dengan أَنَا مِنْ ...' }
      ],
      summary: ['مَا اسْمُكَ / مَا اسْمُكِ untuk menanyakan nama.', 'اِسْمِي ... untuk menyebut nama sendiri.', 'مِنْ أَيْنَ أَنْتَ / أَنْتِ untuk menanyakan asal.'],
      reflection: ['Bisakah kamu memperkenalkan dirimu dalam tiga kalimat Arab?', 'Kapan kamu memakai ـكَ dan kapan memakai ـكِ?']
    }
  },
  {
    slug: 'madrasah', title: 'Sekolah', title_ar: 'الْمَدْرَسَةُ', grade_level: 10, category: 'tema', skill: 'mufradat', difficulty: 'mudah', position: 2,
    description: 'Nama ruangan dan benda di sekolah serta kalimat sederhana tentang lingkungan sekolah.',
    content: {
      objectives: ['Menyebutkan nama ruangan dan benda di sekolah.', 'Menggunakan هَذَا dan هَذِهِ untuk menunjuk benda.', 'Menyusun kalimat sederhana tentang sekolah.'],
      intro: 'Sekolah adalah tempat kita belajar setiap hari. Mari mengenal nama ruangan dan benda di sekolah dalam Bahasa Arab.',
      vocab: [
        { ar: 'فَصْلٌ', id: 'kelas' }, { ar: 'مَكْتَبَةٌ', id: 'perpustakaan' }, { ar: 'مُخْتَبَرٌ', id: 'laboratorium' },
        { ar: 'سَبُّورَةٌ', id: 'papan tulis' }, { ar: 'كِتَابٌ', id: 'buku' }, { ar: 'قَلَمٌ', id: 'pena' },
        { ar: 'مَكْتَبٌ', id: 'meja tulis' }, { ar: 'حَقِيبَةٌ', id: 'tas' }
      ],
      explanation: [
        'Gunakan هَذَا untuk menunjuk benda dekat yang mudzakkar (maskulin), misalnya هَذَا كِتَابٌ.',
        'Gunakan هَذِهِ untuk benda dekat yang muannats (feminin), biasanya berakhiran ـة, misalnya هَذِهِ مَكْتَبَةٌ.',
        'Kata depan عَلَى berarti "di atas" dan فِي berarti "di dalam".'
      ],
      examples: [
        { ar: 'هَذَا فَصْلٌ وَاسِعٌ.', id: 'Ini kelas yang luas.' },
        { ar: 'هَذِهِ مَكْتَبَةُ الْمَدْرَسَةِ.', id: 'Ini perpustakaan sekolah.' },
        { ar: 'الْكِتَابُ عَلَى الْمَكْتَبِ.', id: 'Buku itu di atas meja.' },
        { ar: 'الْقَلَمُ فِي الْحَقِيبَةِ.', id: 'Pena itu di dalam tas.' },
        { ar: 'أَذْهَبُ إِلَى الْمَدْرَسَةِ صَبَاحًا.', id: 'Saya pergi ke sekolah pada pagi hari.' }
      ],
      daily: [
        { ar: 'أَيْنَ الْمَكْتَبَةُ؟', id: 'Di mana perpustakaan?' },
        { ar: 'الْمَكْتَبَةُ بِجَانِبِ الْفَصْلِ.', id: 'Perpustakaan ada di samping kelas.' }
      ],
      exercises: [
        { q: 'Kata tunjuk yang tepat: ___ سَبُّورَةٌ', options: ['هَذَا', 'هَذِهِ'], answer: 1, explain: 'سَبُّورَةٌ berakhiran ـة (muannats), maka memakai هَذِهِ.' },
        { q: 'Arti مُخْتَبَرٌ adalah ...', options: ['perpustakaan', 'laboratorium', 'kantor'], answer: 1, explain: 'مُخْتَبَرٌ = laboratorium.' },
        { q: 'الْكِتَابُ عَلَى الْمَكْتَبِ artinya ...', options: ['Buku di dalam tas', 'Buku di atas meja', 'Buku di bawah kursi'], answer: 1, explain: 'عَلَى = di atas, الْمَكْتَب = meja.' }
      ],
      summary: ['هَذَا untuk mudzakkar dekat, هَذِهِ untuk muannats dekat.', 'فِي = di dalam, عَلَى = di atas.'],
      reflection: ['Sebutkan lima benda di kelasmu dalam Bahasa Arab.', 'Benda apa saja yang memakai هَذِهِ?']
    }
  },
  {
    slug: 'usrah', title: 'Keluarga', title_ar: 'الْأُسْرَةُ', grade_level: 10, category: 'tema', skill: 'qiraah', difficulty: 'mudah', position: 3,
    description: 'Anggota keluarga, kata ganti kepemilikan, dan teks bacaan pendek tentang keluarga.',
    content: {
      objectives: ['Menyebutkan anggota keluarga.', 'Menggunakan akhiran kepemilikan ـي (milikku).', 'Memahami teks pendek tentang keluarga.'],
      intro: 'Setiap orang memiliki keluarga. Pada pelajaran ini kita mengenal nama anggota keluarga dan cara menceritakan keluarga sendiri.',
      vocab: [
        { ar: 'أَبٌ', id: 'ayah' }, { ar: 'أُمٌّ', id: 'ibu' }, { ar: 'أَخٌ', id: 'saudara laki-laki' },
        { ar: 'أُخْتٌ', id: 'saudara perempuan' }, { ar: 'جَدٌّ', id: 'kakek' }, { ar: 'جَدَّةٌ', id: 'nenek' },
        { ar: 'عَمٌّ', id: 'paman (saudara ayah)' }, { ar: 'بَيْتٌ', id: 'rumah' }
      ],
      explanation: [
        'Untuk menyatakan "milikku", tambahkan ـي di akhir kata benda dan hilangkan tanwinnya: بَيْتٌ ← بَيْتِي (rumahku), أُمٌّ ← أُمِّي (ibuku).',
        'Kata أَبٌ dan أَخٌ menjadi أَبِي (ayahku) dan أَخِي (saudaraku).',
        'Untuk menyatakan kepemilikan jumlah, gunakan لِي (aku punya): لِي أَخٌ وَاحِدٌ = aku punya satu saudara laki-laki.'
      ],
      examples: [
        { ar: 'أُسْرَتِي سَعِيدَةٌ.', id: 'Keluargaku bahagia.' },
        { ar: 'هَذَا أَبِي، هُوَ مُوَظَّفٌ.', id: 'Ini ayahku, dia seorang pegawai.' },
        { ar: 'أُمِّي تَطْبُخُ فِي الْمَطْبَخِ.', id: 'Ibuku memasak di dapur.' },
        { ar: 'لِي أَخٌ وَاحِدٌ وَأُخْتَانِ.', id: 'Aku punya satu saudara laki-laki dan dua saudara perempuan.' }
      ],
      reading: {
        ar: 'اِسْمِي فَاطِمَةُ. أُسْرَتِي صَغِيرَةٌ. أَبِي مُدَرِّسٌ، وَأُمِّي طَبِيبَةٌ. لِي أَخٌ وَاحِدٌ، اِسْمُهُ عَلِيٌّ. نَحْنُ نَسْكُنُ فِي بَيْتٍ قَرِيبٍ مِنَ الْمَسْجِدِ.',
        id: 'Namaku Fatimah. Keluargaku kecil. Ayahku seorang guru, dan ibuku seorang dokter. Aku punya satu saudara laki-laki, namanya Ali. Kami tinggal di rumah yang dekat dengan masjid.'
      },
      daily: [{ ar: 'كَمْ عَدَدُ أَفْرَادِ أُسْرَتِكَ؟', id: 'Berapa jumlah anggota keluargamu?' }],
      exercises: [
        { q: 'Menurut bacaan, apa pekerjaan ibu Fatimah?', options: ['guru', 'dokter', 'pegawai'], answer: 1, explain: 'وَأُمِّي طَبِيبَةٌ = dan ibuku seorang dokter.' },
        { q: 'بَيْتِي artinya ...', options: ['rumahmu', 'rumahku', 'rumahnya'], answer: 1, explain: 'Akhiran ـي berarti milikku.' },
        { q: 'Arti جَدَّةٌ adalah ...', options: ['kakek', 'nenek', 'bibi'], answer: 1, explain: 'جَدٌّ = kakek, جَدَّةٌ = nenek.' }
      ],
      summary: ['Akhiran ـي = milikku.', 'لِي ... = aku punya ...'],
      reflection: ['Ceritakan anggota keluargamu dalam empat kalimat.', 'Apa perbedaan أَخٌ dan أُخْتٌ?']
    }
  },
  {
    slug: 'anshithah-yaumiyyah', title: 'Kegiatan Sehari-hari', title_ar: 'الْأَنْشِطَةُ الْيَوْمِيَّةُ', grade_level: 10, category: 'tema', skill: 'kitabah', difficulty: 'sedang', position: 4,
    description: 'Menceritakan rutinitas harian dari bangun tidur hingga tidur kembali.',
    content: {
      objectives: ['Menyebutkan kegiatan harian dengan kata kerja mudhari\' untuk "saya".', 'Menggunakan kata sambung ثُمَّ (kemudian).', 'Menulis paragraf pendek tentang rutinitas.'],
      intro: 'Kegiatan sehari-hari diceritakan dengan kata kerja bentuk sekarang (fi\'il mudhari\'). Untuk "saya", kata kerja diawali huruf أَ.',
      vocab: [
        { ar: 'أَسْتَيْقِظُ', id: 'saya bangun' }, { ar: 'أَغْتَسِلُ', id: 'saya mandi' }, { ar: 'أُصَلِّي', id: 'saya shalat' },
        { ar: 'أَتَنَاوَلُ الْفَطُورَ', id: 'saya sarapan' }, { ar: 'أَذْهَبُ', id: 'saya pergi' }, { ar: 'أَرْجِعُ', id: 'saya pulang' },
        { ar: 'أُذَاكِرُ', id: 'saya mengulang pelajaran' }, { ar: 'أَنَامُ', id: 'saya tidur' }
      ],
      explanation: [
        'Kata kerja untuk "saya" (أَنَا) dalam bentuk mudhari\' diawali أَ atau أُ, contohnya أَذْهَبُ (saya pergi) dan أُصَلِّي (saya shalat).',
        'Gunakan ثُمَّ (kemudian) untuk mengurutkan kegiatan dan بَعْدَ ذَلِكَ (setelah itu).',
        'Untuk menyebut waktu, gunakan فِي السَّاعَةِ ... (pada pukul ...).'
      ],
      examples: [
        { ar: 'أَسْتَيْقِظُ مِنَ النَّوْمِ فِي السَّاعَةِ الرَّابِعَةِ وَالنِّصْفِ.', id: 'Saya bangun tidur pada pukul setengah lima.' },
        { ar: 'ثُمَّ أُصَلِّي الصُّبْحَ جَمَاعَةً.', id: 'Kemudian saya shalat subuh berjamaah.' },
        { ar: 'أَتَنَاوَلُ الْفَطُورَ مَعَ أُسْرَتِي.', id: 'Saya sarapan bersama keluargaku.' },
        { ar: 'أَرْجِعُ مِنَ الْمَدْرَسَةِ فِي السَّاعَةِ الثَّانِيَةِ ظُهْرًا.', id: 'Saya pulang dari sekolah pada pukul dua siang.' }
      ],
      daily: [{ ar: 'مَاذَا تَفْعَلُ بَعْدَ الْمَدْرَسَةِ؟', id: 'Apa yang kamu lakukan setelah sekolah?' }],
      exercises: [
        { q: 'Arti أَرْجِعُ مِنَ الْمَدْرَسَةِ adalah ...', options: ['Saya pergi ke sekolah', 'Saya pulang dari sekolah', 'Saya belajar di sekolah'], answer: 1, explain: 'أَرْجِعُ = saya pulang, مِنْ = dari.' },
        { q: 'Kata sambung yang berarti "kemudian" adalah ...', options: ['ثُمَّ', 'فِي', 'مَعَ'], answer: 0, explain: 'ثُمَّ = kemudian.' },
        { q: '"Saya tidur" dalam Bahasa Arab adalah ...', options: ['أَنَامُ', 'أَقُومُ', 'أَكْتُبُ'], answer: 0, explain: 'أَنَامُ = saya tidur.' }
      ],
      summary: ['Kata kerja untuk "saya" diawali أَ/أُ.', 'ثُمَّ dan بَعْدَ ذَلِكَ untuk urutan kegiatan.'],
      reflection: ['Tuliskan lima kegiatanmu hari ini secara berurutan.']
    }
  },
  // ======================= KELAS XI — TEMA =======================
  {
    slug: 'hiwayat', title: 'Hobi', title_ar: 'الْهِوَايَاتُ', grade_level: 11, category: 'tema', skill: 'kalam', difficulty: 'mudah', position: 5,
    description: 'Menanyakan dan menceritakan hobi dengan ungkapan أُحِبُّ (saya suka).',
    content: {
      objectives: ['Menyebutkan jenis-jenis hobi.', 'Menanyakan hobi teman.', 'Menyatakan kesukaan dengan أُحِبُّ.'],
      intro: 'Hobi adalah kegiatan yang kita sukai di waktu luang. Mari belajar menanyakan dan menceritakan hobi.',
      vocab: [
        { ar: 'هِوَايَةٌ', id: 'hobi' }, { ar: 'الْقِرَاءَةُ', id: 'membaca' }, { ar: 'الرَّسْمُ', id: 'menggambar' },
        { ar: 'السِّبَاحَةُ', id: 'berenang' }, { ar: 'كُرَةُ الْقَدَمِ', id: 'sepak bola' }, { ar: 'الطَّبْخُ', id: 'memasak' },
        { ar: 'التَّصْوِيرُ', id: 'fotografi' }, { ar: 'الْخَطُّ', id: 'kaligrafi' }
      ],
      explanation: [
        'Untuk menanyakan hobi: مَا هِوَايَتُكَ؟ (laki-laki) atau مَا هِوَايَتُكِ؟ (perempuan).',
        'Untuk menjawab: هِوَايَتِي ... (hobiku ...). Perhatikan: هِوَايَةٌ berubah menjadi هِوَايَتِي — huruf ة berubah menjadi ت ketika diberi akhiran.',
        'Untuk menyatakan suka: أُحِبُّ + kata benda, misalnya أُحِبُّ السِّبَاحَةَ (saya suka berenang).'
      ],
      examples: [
        { ar: 'مَا هِوَايَتُكَ؟', id: 'Apa hobimu?' },
        { ar: 'هِوَايَتِي الْقِرَاءَةُ.', id: 'Hobiku membaca.' },
        { ar: 'أُحِبُّ لَعِبَ كُرَةِ الْقَدَمِ.', id: 'Saya suka bermain sepak bola.' },
        { ar: 'تُحِبُّ فَاطِمَةُ الرَّسْمَ.', id: 'Fatimah suka menggambar.' }
      ],
      daily: [{ ar: 'مَاذَا تَفْعَلُ فِي وَقْتِ الْفَرَاغِ؟', id: 'Apa yang kamu lakukan di waktu luang?' }],
      exercises: [
        { q: 'هِوَايَتِي السِّبَاحَةُ artinya ...', options: ['Hobiku berenang', 'Hobimu berenang', 'Saya tidak suka berenang'], answer: 0, explain: 'هِوَايَتِي = hobiku; السِّبَاحَة = berenang.' },
        { q: 'Kata yang berarti "kaligrafi" adalah ...', options: ['الرَّسْمُ', 'الْخَطُّ', 'الطَّبْخُ'], answer: 1, explain: 'الْخَطُّ = kaligrafi/tulisan indah.' },
        { q: 'Mengapa هِوَايَةٌ menjadi هِوَايَتِي?', options: ['ة berubah menjadi ت saat diberi akhiran', 'Karena kata jamak', 'Karena kata kerja'], answer: 0, explain: 'Ta marbuthah (ة) ditulis ت jika bersambung dengan akhiran.' }
      ],
      summary: ['مَا هِوَايَتُكَ؟ untuk bertanya hobi.', 'أُحِبُّ = saya suka.'],
      reflection: ['Ceritakan hobimu dan alasan kamu menyukainya.']
    }
  },
  {
    slug: 'waqt', title: 'Waktu', title_ar: 'الْوَقْتُ', grade_level: 11, category: 'tema', skill: 'istima', difficulty: 'sedang', position: 6,
    description: 'Menanyakan jam, menyebut waktu, hari, dan jadwal kegiatan.',
    content: {
      objectives: ['Menanyakan jam dengan كَمِ السَّاعَةُ؟', 'Menyebut jam dengan bilangan urutan.', 'Menyebut nama hari.'],
      intro: 'Dalam Bahasa Arab, jam disebut dengan bilangan urutan muannats seperti الْوَاحِدَةُ، الثَّانِيَةُ، الثَّالِثَةُ karena kata السَّاعَةُ adalah muannats.',
      vocab: [
        { ar: 'سَاعَةٌ', id: 'jam' }, { ar: 'دَقِيقَةٌ', id: 'menit' }, { ar: 'صَبَاحٌ', id: 'pagi' },
        { ar: 'مَسَاءٌ', id: 'sore, petang' }, { ar: 'الْيَوْمَ', id: 'hari ini' }, { ar: 'غَدًا', id: 'besok' },
        { ar: 'أَمْسِ', id: 'kemarin' }, { ar: 'أُسْبُوعٌ', id: 'pekan' }
      ],
      explanation: [
        'Bertanya jam: كَمِ السَّاعَةُ الْآنَ؟ (Jam berapa sekarang?).',
        'Menjawab: السَّاعَةُ + bilangan urutan: السَّاعَةُ الثَّالِثَةُ (pukul tiga). Tambahkan وَالرُّبُعُ (lewat seperempat), وَالنِّصْفُ (setengah lebih / lewat tiga puluh menit), إِلَّا رُبُعًا (kurang seperempat).',
        'Nama hari: الْأَحَدُ (Ahad), الِاثْنَيْنِ (Senin), الثُّلَاثَاءُ (Selasa), الْأَرْبِعَاءُ (Rabu), الْخَمِيسُ (Kamis), الْجُمُعَةُ (Jumat), السَّبْتُ (Sabtu).'
      ],
      examples: [
        { ar: 'كَمِ السَّاعَةُ الْآنَ؟', id: 'Jam berapa sekarang?' },
        { ar: 'السَّاعَةُ السَّابِعَةُ تَمَامًا.', id: 'Pukul tujuh tepat.' },
        { ar: 'السَّاعَةُ الثَّامِنَةُ وَالرُّبُعُ.', id: 'Pukul delapan lewat seperempat.' },
        { ar: 'السَّاعَةُ الْعَاشِرَةُ وَالنِّصْفُ.', id: 'Pukul sepuluh lewat tiga puluh menit (setengah sebelas).' },
        { ar: 'يَبْدَأُ الدَّرْسُ فِي السَّاعَةِ السَّابِعَةِ صَبَاحًا.', id: 'Pelajaran dimulai pada pukul tujuh pagi.' }
      ],
      daily: [{ ar: 'مَتَى تَذْهَبُ إِلَى الْمَدْرَسَةِ؟', id: 'Kapan kamu pergi ke sekolah?' }],
      exercises: [
        { q: 'السَّاعَةُ الثَّامِنَةُ وَالرُّبُعُ artinya ...', options: ['08.15', '08.30', '07.45'], answer: 0, explain: 'وَالرُّبُعُ = lewat seperempat (15 menit).' },
        { q: 'Hari Jumat dalam Bahasa Arab adalah ...', options: ['الْخَمِيسُ', 'الْجُمُعَةُ', 'السَّبْتُ'], answer: 1, explain: 'الْجُمُعَةُ = Jumat.' },
        { q: 'Pertanyaan "Jam berapa sekarang?" adalah ...', options: ['كَمِ السَّاعَةُ الْآنَ؟', 'مَتَى الدَّرْسُ؟', 'أَيْنَ السَّاعَةُ؟'], answer: 0, explain: 'كَمْ = berapa; السَّاعَة = jam.' }
      ],
      summary: ['Jam memakai bilangan urutan muannats.', 'وَالرُّبُعُ، وَالنِّصْفُ، إِلَّا رُبُعًا untuk menit.'],
      reflection: ['Sebutkan jadwal harianmu lengkap dengan jamnya.']
    }
  },
  {
    slug: 'thaam-syarab', title: 'Makanan dan Minuman', title_ar: 'الطَّعَامُ وَالشَّرَابُ', grade_level: 11, category: 'tema', skill: 'kalam', difficulty: 'mudah', position: 7,
    description: 'Nama makanan dan minuman serta ungkapan saat makan dan membeli.',
    content: {
      objectives: ['Menyebutkan nama makanan dan minuman.', 'Menyatakan lapar dan haus.', 'Bertanya harga.'],
      intro: 'Makanan dan minuman adalah kebutuhan sehari-hari. Pelajaran ini membantu kita memesan makanan dan menanyakan harga.',
      vocab: [
        { ar: 'أَرُزٌّ', id: 'nasi, beras' }, { ar: 'خُبْزٌ', id: 'roti' }, { ar: 'سَمَكٌ', id: 'ikan' },
        { ar: 'دَجَاجٌ', id: 'ayam' }, { ar: 'بَيْضٌ', id: 'telur' }, { ar: 'مَاءٌ', id: 'air' },
        { ar: 'شَايٌ', id: 'teh' }, { ar: 'فَاكِهَةٌ', id: 'buah-buahan' }
      ],
      explanation: [
        'Untuk menyatakan lapar: أَنَا جَائِعٌ (laki-laki) / أَنَا جَائِعَةٌ (perempuan). Haus: أَنَا عَطْشَانُ / أَنَا عَطْشَى.',
        'Untuk menyatakan keinginan: أُرِيدُ + kata benda, atau أُرِيدُ أَنْ + kata kerja.',
        'Untuk bertanya harga: بِكَمْ هَذَا؟ (Berapa harga ini?).'
      ],
      examples: [
        { ar: 'أَنَا جَائِعٌ.', id: 'Saya lapar.' },
        { ar: 'أُرِيدُ أَنْ أَشْرَبَ الْمَاءَ.', id: 'Saya ingin minum air.' },
        { ar: 'نَأْكُلُ الْأَرُزَّ مَعَ السَّمَكِ.', id: 'Kami makan nasi dengan ikan.' },
        { ar: 'بِكَمْ هَذَا؟', id: 'Berapa harga ini?' }
      ],
      daily: [
        { ar: 'بِسْمِ اللهِ.', id: 'Dengan nama Allah (sebelum makan).' },
        { ar: 'الْحَمْدُ لِلهِ.', id: 'Segala puji bagi Allah (setelah makan).' }
      ],
      exercises: [
        { q: 'أُرِيدُ أَنْ أَشْرَبَ الشَّايَ artinya ...', options: ['Saya ingin minum teh', 'Saya ingin makan roti', 'Saya minum air'], answer: 0, explain: 'أَشْرَبَ = minum, الشَّاي = teh.' },
        { q: 'Kata "ayam" dalam Bahasa Arab adalah ...', options: ['سَمَكٌ', 'دَجَاجٌ', 'بَيْضٌ'], answer: 1, explain: 'دَجَاجٌ = ayam.' },
        { q: 'Untuk bertanya harga, kita mengatakan ...', options: ['بِكَمْ هَذَا؟', 'مَا هَذَا؟', 'أَيْنَ هَذَا؟'], answer: 0, explain: 'بِكَمْ = dengan (harga) berapa.' }
      ],
      summary: ['أُرِيدُ = saya ingin.', 'بِكَمْ هَذَا؟ = berapa harganya?'],
      reflection: ['Apa makanan favoritmu? Tuliskan dalam kalimat Arab.']
    }
  },
  // ======================= KELAS XII — TEMA =======================
  {
    slug: 'shihhah', title: 'Kesehatan', title_ar: 'الصِّحَّةُ', grade_level: 12, category: 'tema', skill: 'qiraah', difficulty: 'sedang', position: 8,
    description: 'Ungkapan tentang kesehatan, penyakit ringan, dan menjaga tubuh.',
    content: {
      objectives: ['Menyebutkan kosakata kesehatan.', 'Menyampaikan keluhan sakit ringan.', 'Memahami teks pendek tentang pola hidup sehat.'],
      intro: 'Kesehatan adalah nikmat yang besar. Pelajaran ini membahas cara menyampaikan keluhan dan menjaga kesehatan.',
      vocab: [
        { ar: 'صِحَّةٌ', id: 'kesehatan' }, { ar: 'مَرِيضٌ', id: 'sakit (orang yang sakit)' }, { ar: 'طَبِيبٌ', id: 'dokter' },
        { ar: 'مُسْتَشْفًى', id: 'rumah sakit' }, { ar: 'دَوَاءٌ', id: 'obat' }, { ar: 'رِيَاضَةٌ', id: 'olahraga' },
        { ar: 'صُدَاعٌ', id: 'sakit kepala' }, { ar: 'حُمَّى', id: 'demam' }
      ],
      explanation: [
        'Untuk menyampaikan keluhan: أَشْعُرُ بِـ ... (saya merasakan ...), misalnya أَشْعُرُ بِالصُّدَاعِ.',
        'Untuk menanyakan keadaan: كَيْفَ حَالُكَ؟ (Bagaimana keadaanmu?). Jawaban: بِخَيْرٍ، الْحَمْدُ لِلهِ.',
        'Untuk mendoakan orang sakit: شَفَاكَ اللهُ (semoga Allah menyembuhkanmu).'
      ],
      examples: [
        { ar: 'الْعَقْلُ السَّلِيمُ فِي الْجِسْمِ السَّلِيمِ.', id: 'Akal yang sehat terdapat dalam tubuh yang sehat.' },
        { ar: 'أَشْعُرُ بِالصُّدَاعِ.', id: 'Saya merasa sakit kepala.' },
        { ar: 'ذَهَبَ أَخِي إِلَى الطَّبِيبِ.', id: 'Saudaraku pergi ke dokter.' },
        { ar: 'نُمَارِسُ الرِّيَاضَةَ كُلَّ صَبَاحٍ.', id: 'Kami berolahraga setiap pagi.' }
      ],
      reading: {
        ar: 'يُحِبُّ عُمَرُ الرِّيَاضَةَ. هُوَ يَجْرِي كُلَّ صَبَاحٍ وَيَأْكُلُ الْفَاكِهَةَ وَالْخُضْرَوَاتِ. يَشْرَبُ عُمَرُ الْمَاءَ كَثِيرًا وَيَنَامُ مُبَكِّرًا. لِذَلِكَ هُوَ نَشِيطٌ وَصَحِيحُ الْجِسْمِ.',
        id: 'Umar menyukai olahraga. Ia berlari setiap pagi serta makan buah-buahan dan sayuran. Umar banyak minum air dan tidur lebih awal. Karena itu ia bersemangat dan bertubuh sehat.'
      },
      daily: [{ ar: 'شَفَاكَ اللهُ.', id: 'Semoga Allah menyembuhkanmu.' }],
      exercises: [
        { q: 'Menurut bacaan, kapan Umar berlari?', options: ['setiap pagi', 'setiap sore', 'setiap malam'], answer: 0, explain: 'يَجْرِي كُلَّ صَبَاحٍ = berlari setiap pagi.' },
        { q: 'أَشْعُرُ بِالْحُمَّى artinya ...', options: ['Saya merasa demam', 'Saya minum obat', 'Saya ke rumah sakit'], answer: 0, explain: 'الْحُمَّى = demam.' },
        { q: 'Ucapan untuk mendoakan teman yang sakit adalah ...', options: ['شَفَاكَ اللهُ', 'بِسْمِ اللهِ', 'مَعَ السَّلَامَةِ'], answer: 0, explain: 'شَفَاكَ اللهُ = semoga Allah menyembuhkanmu.' }
      ],
      summary: ['أَشْعُرُ بِـ ... untuk keluhan.', 'شَفَاكَ اللهُ untuk mendoakan kesembuhan.'],
      reflection: ['Kebiasaan sehat apa yang sudah kamu lakukan?']
    }
  },
  {
    slug: 'biah', title: 'Lingkungan', title_ar: 'الْبِيئَةُ', grade_level: 12, category: 'tema', skill: 'kitabah', difficulty: 'sedang', position: 9,
    description: 'Kosakata lingkungan hidup dan ajakan menjaga kebersihan.',
    content: {
      objectives: ['Menyebutkan kosakata lingkungan.', 'Menggunakan larangan لَا + fi\'il.', 'Menulis ajakan menjaga lingkungan.'],
      intro: 'Menjaga lingkungan adalah tanggung jawab bersama. Mari belajar kosakata dan ungkapan tentang lingkungan.',
      vocab: [
        { ar: 'بِيئَةٌ', id: 'lingkungan' }, { ar: 'نَظِيفٌ', id: 'bersih' }, { ar: 'قُمَامَةٌ', id: 'sampah' },
        { ar: 'شَجَرَةٌ', id: 'pohon' }, { ar: 'نَهْرٌ', id: 'sungai' }, { ar: 'بَحْرٌ', id: 'laut' },
        { ar: 'هَوَاءٌ', id: 'udara' }, { ar: 'نَبَاتٌ', id: 'tumbuhan' }
      ],
      explanation: [
        'Larangan dibentuk dengan لَا + fi\'il mudhari\' yang dibaca sukun/dihapus akhirnya: لَا تَرْمِ (jangan membuang), لَا تَقْطَعْ (jangan menebang).',
        'Ajakan dapat memakai لِنُحَافِظْ عَلَى ... (mari kita menjaga ...).'
      ],
      examples: [
        { ar: 'النَّظَافَةُ مِنَ الْإِيمَانِ.', id: 'Kebersihan adalah sebagian dari iman.' },
        { ar: 'لَا تَرْمِ الْقُمَامَةَ فِي النَّهْرِ.', id: 'Jangan membuang sampah ke sungai.' },
        { ar: 'نَغْرِسُ الْأَشْجَارَ حَوْلَ الْمَدْرَسَةِ.', id: 'Kami menanam pohon di sekitar sekolah.' },
        { ar: 'الْهَوَاءُ فِي الْقَرْيَةِ نَقِيٌّ.', id: 'Udara di desa itu bersih (segar).' },
        { ar: 'لِنُحَافِظْ عَلَى نَظَافَةِ الْبِيئَةِ.', id: 'Mari kita menjaga kebersihan lingkungan.' }
      ],
      daily: [{ ar: 'ضَعِ الْقُمَامَةَ فِي مَكَانِهَا.', id: 'Letakkan sampah pada tempatnya.' }],
      exercises: [
        { q: 'لَا تَرْمِ الْقُمَامَةَ artinya ...', options: ['Jangan membuang sampah', 'Buanglah sampah', 'Sampah itu bersih'], answer: 0, explain: 'لَا + fi\'il = larangan.' },
        { q: 'Arti شَجَرَةٌ adalah ...', options: ['sungai', 'pohon', 'udara'], answer: 1, explain: 'شَجَرَةٌ = pohon.' },
        { q: 'Kalimat ajakan "Mari kita menjaga ..." adalah ...', options: ['لِنُحَافِظْ عَلَى ...', 'لَا تُحَافِظْ ...', 'حَافَظَ ...'], answer: 0, explain: 'لِنُحَافِظْ = mari kita menjaga.' }
      ],
      summary: ['لَا + fi\'il mudhari\' = larangan.', 'لِنُحَافِظْ عَلَى = mari kita menjaga.'],
      reflection: ['Tulis tiga ajakan menjaga lingkungan sekolah dalam Bahasa Arab.']
    }
  },
  {
    slug: 'safar', title: 'Perjalanan', title_ar: 'السَّفَرُ', grade_level: 12, category: 'tema', skill: 'istima', difficulty: 'sulit', position: 10,
    description: 'Alat transportasi, tempat-tempat perjalanan, dan percakapan di bandara/hotel.',
    content: {
      objectives: ['Menyebutkan alat transportasi dan tempat perjalanan.', 'Menceritakan perjalanan dengan fi\'il madhi.', 'Bertanya arah dan tiket.'],
      intro: 'Bepergian membutuhkan kosakata khusus seperti tiket, bandara, dan hotel. Cerita perjalanan biasanya memakai kata kerja lampau (fi\'il madhi).',
      vocab: [
        { ar: 'سَفَرٌ', id: 'perjalanan' }, { ar: 'مَطَارٌ', id: 'bandara' }, { ar: 'طَائِرَةٌ', id: 'pesawat' },
        { ar: 'سَيَّارَةٌ', id: 'mobil' }, { ar: 'حَافِلَةٌ', id: 'bus' }, { ar: 'تَذْكِرَةٌ', id: 'tiket' },
        { ar: 'فُنْدُقٌ', id: 'hotel' }, { ar: 'جَوَازُ السَّفَرِ', id: 'paspor' }
      ],
      explanation: [
        'Gunakan بِـ untuk menyebut alat transportasi: بِالطَّائِرَةِ (dengan pesawat), بِالسَّيَّارَةِ (dengan mobil).',
        'Cerita perjalanan memakai fi\'il madhi: سَافَرْتُ (saya bepergian), وَصَلْتُ (saya tiba), نَزَلْنَا (kami menginap).'
      ],
      examples: [
        { ar: 'سَافَرْتُ إِلَى جَاكَرْتَا بِالطَّائِرَةِ.', id: 'Saya bepergian ke Jakarta dengan pesawat.' },
        { ar: 'أَيْنَ الْمَطَارُ؟', id: 'Di mana bandara?' },
        { ar: 'أُرِيدُ تَذْكِرَةً إِلَى مَكَّةَ.', id: 'Saya ingin tiket ke Makkah.' },
        { ar: 'نَزَلْنَا فِي فُنْدُقٍ قَرِيبٍ مِنَ الْبَحْرِ.', id: 'Kami menginap di hotel yang dekat dengan laut.' }
      ],
      daily: [{ ar: 'رِحْلَةً سَعِيدَةً!', id: 'Selamat jalan! (Semoga perjalananmu menyenangkan)' }],
      exercises: [
        { q: 'بِالْحَافِلَةِ artinya ...', options: ['dengan bus', 'dengan pesawat', 'dengan mobil'], answer: 0, explain: 'حَافِلَةٌ = bus.' },
        { q: '"Saya tiba" dalam fi\'il madhi adalah ...', options: ['وَصَلْتُ', 'أَصِلُ', 'صِلْ'], answer: 0, explain: 'وَصَلْتُ = saya telah tiba (lampau).' },
        { q: 'Arti فُنْدُقٌ adalah ...', options: ['bandara', 'hotel', 'tiket'], answer: 1, explain: 'فُنْدُقٌ = hotel.' }
      ],
      summary: ['بِـ + kendaraan = dengan ...', 'Cerita perjalanan memakai fi\'il madhi.'],
      reflection: ['Ceritakan perjalanan yang pernah kamu lakukan dalam empat kalimat.']
    }
  }
];
