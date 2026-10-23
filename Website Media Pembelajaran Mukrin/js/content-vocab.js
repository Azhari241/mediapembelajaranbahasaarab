/* ARABIYA EDU — Konten bawaan: kosakata, percakapan, tantangan berbicara.
   Semua konten dapat disalin ke database (supabase/seed.sql) lalu diedit guru.
   Ikon: Lucide (lisensi ISC) dipakai sebagai ilustrasi sederhana. Kosakata tanpa
   ikon yang tepat sengaja dibiarkan tanpa gambar (ditampilkan placeholder). */
(function () {
  const AE = (window.AE = window.AE || {});

  AE.VOCAB_CATEGORIES = [
    { id: 'perkenalan', label: 'Perkenalan', ar: 'التَّعَارُفُ' },
    { id: 'sekolah', label: 'Sekolah', ar: 'الْمَدْرَسَةُ' },
    { id: 'keluarga', label: 'Keluarga', ar: 'الْأُسْرَةُ' },
    { id: 'kegiatan', label: 'Kegiatan sehari-hari', ar: 'الْأَنْشِطَةُ الْيَوْمِيَّةُ' },
    { id: 'hobi', label: 'Hobi', ar: 'الْهِوَايَاتُ' },
    { id: 'waktu', label: 'Waktu', ar: 'الْوَقْتُ' },
    { id: 'makanan', label: 'Makanan & minuman', ar: 'الطَّعَامُ وَالشَّرَابُ' },
    { id: 'kesehatan', label: 'Kesehatan', ar: 'الصِّحَّةُ' },
    { id: 'lingkungan', label: 'Lingkungan', ar: 'الْبِيئَةُ' },
    { id: 'perjalanan', label: 'Perjalanan', ar: 'السَّفَرُ' },
  ];

  AE.WORD_TYPES = {
    ism: 'Isim (kata benda)',
    fiil: "Fi'il (kata kerja)",
    sifat: 'Sifat (kata sifat)',
    zharaf: 'Zharaf (keterangan)',
    ungkapan: 'Ungkapan',
  };

  // [id, arab, latin, arti, jenis, kategori, kelas, contoh arab, contoh indonesia, ikon]
  const V = [
    // Perkenalan
    ['ism', 'اِسْمٌ', 'ismun', 'nama', 'ism', 'perkenalan', 10, 'اِسْمِي أَحْمَدُ.', 'Namaku Ahmad.', 'id-card'],
    ['unwan', 'عُنْوَانٌ', "'unwānun", 'alamat', 'ism', 'perkenalan', 10, 'مَا عُنْوَانُكَ؟', 'Apa alamatmu?', 'map-pin'],
    ['shadiq', 'صَدِيقٌ', 'shadīqun', 'teman (laki-laki)', 'ism', 'perkenalan', 10, 'هٰذَا صَدِيقِي يُوسُفُ.', 'Ini temanku, Yusuf.', ''],
    ['shadiqah', 'صَدِيقَةٌ', 'shadīqatun', 'teman (perempuan)', 'ism', 'perkenalan', 10, 'فَاطِمَةُ صَدِيقَتِي.', 'Fatimah adalah temanku.', ''],
    ['umr', 'عُمْرٌ', "'umrun", 'umur', 'ism', 'perkenalan', 10, 'كَمْ عُمْرُكَ؟', 'Berapa umurmu?', ''],
    ['ahlan', 'أَهْلًا وَسَهْلًا', 'ahlan wa sahlan', 'selamat datang', 'ungkapan', 'perkenalan', 10, 'أَهْلًا وَسَهْلًا فِي مَدْرَسَتِنَا.', 'Selamat datang di sekolah kami.', 'hand'],
    ['tasyarrafna', 'تَشَرَّفْنَا', 'tasyarrafnā', 'senang berkenalan', 'ungkapan', 'perkenalan', 10, 'تَشَرَّفْنَا بِمَعْرِفَتِكَ.', 'Senang berkenalan denganmu.', ''],
    ['min-ayna', 'مِنْ أَيْنَ', 'min aina', 'dari mana', 'ungkapan', 'perkenalan', 10, 'مِنْ أَيْنَ أَنْتَ؟', 'Dari mana asalmu?', ''],

    // Sekolah
    ['madrasah', 'مَدْرَسَةٌ', 'madrasatun', 'sekolah', 'ism', 'sekolah', 10, 'هٰذِهِ مَدْرَسَةٌ كَبِيرَةٌ.', 'Ini sekolah yang besar.', 'school'],
    ['fashl', 'فَصْلٌ', 'fashlun', 'ruang kelas', 'ism', 'sekolah', 10, 'الْفَصْلُ نَظِيفٌ.', 'Ruang kelas itu bersih.', 'door-open'],
    ['mudarris', 'مُدَرِّسٌ', 'mudarrisun', 'guru (laki-laki)', 'ism', 'sekolah', 10, 'الْمُدَرِّسُ فِي الْفَصْلِ.', 'Guru itu di dalam kelas.', 'user-round'],
    ['mudarrisah', 'مُدَرِّسَةٌ', 'mudarrisatun', 'guru (perempuan)', 'ism', 'sekolah', 10, 'أُمِّي مُدَرِّسَةٌ.', 'Ibuku seorang guru.', ''],
    ['thalib', 'طَالِبٌ', 'thālibun', 'siswa', 'ism', 'sekolah', 10, 'أَنَا طَالِبٌ فِي الْمَدْرَسَةِ الثَّانَوِيَّةِ.', 'Aku siswa di sekolah menengah atas.', 'graduation-cap'],
    ['thalibah', 'طَالِبَةٌ', 'thālibatun', 'siswi', 'ism', 'sekolah', 10, 'عَائِشَةُ طَالِبَةٌ مُجْتَهِدَةٌ.', 'Aisyah adalah siswi yang rajin.', ''],
    ['kitab', 'كِتَابٌ', 'kitābun', 'buku', 'ism', 'sekolah', 10, 'هٰذَا كِتَابٌ جَدِيدٌ.', 'Ini buku baru.', 'book'],
    ['qalam', 'قَلَمٌ', 'qalamun', 'pena', 'ism', 'sekolah', 10, 'الْقَلَمُ عَلَى الْمَكْتَبِ.', 'Pena itu di atas meja.', 'pen'],
    ['daftar', 'دَفْتَرٌ', 'daftarun', 'buku tulis', 'ism', 'sekolah', 10, 'أَكْتُبُ الدَّرْسَ فِي الدَّفْتَرِ.', 'Aku menulis pelajaran di buku tulis.', 'notebook-pen'],
    ['misthara', 'مِسْطَرَةٌ', 'mistharatun', 'penggaris', 'ism', 'sekolah', 10, 'هٰذِهِ مِسْطَرَةٌ طَوِيلَةٌ.', 'Ini penggaris yang panjang.', 'ruler'],
    ['mimsahah', 'مِمْسَحَةٌ', 'mimsahatun', 'penghapus', 'ism', 'sekolah', 10, 'الْمِمْسَحَةُ فِي الْحَقِيبَةِ.', 'Penghapus itu di dalam tas.', 'eraser'],
    ['haqibah', 'حَقِيبَةٌ', 'haqībatun', 'tas', 'ism', 'sekolah', 10, 'حَقِيبَتِي ثَقِيلَةٌ.', 'Tasku berat.', 'backpack'],
    ['maktabah', 'مَكْتَبَةٌ', 'maktabatun', 'perpustakaan', 'ism', 'sekolah', 10, 'أَقْرَأُ الْكُتُبَ فِي الْمَكْتَبَةِ.', 'Aku membaca buku-buku di perpustakaan.', 'library'],
    ['sabburah', 'سَبُّورَةٌ', 'sabbūratun', 'papan tulis', 'ism', 'sekolah', 10, 'يَكْتُبُ الْمُدَرِّسُ عَلَى السَّبُّورَةِ.', 'Guru menulis di papan tulis.', 'presentation'],
    ['kursi', 'كُرْسِيٌّ', 'kursiyyun', 'kursi', 'ism', 'sekolah', 10, 'اِجْلِسْ عَلَى الْكُرْسِيِّ.', 'Duduklah di kursi.', 'armchair'],
    ['maktab', 'مَكْتَبٌ', 'maktabun', 'meja belajar', 'ism', 'sekolah', 10, 'الْكِتَابُ عَلَى الْمَكْتَبِ.', 'Buku itu di atas meja.', 'lamp-desk'],

    // Keluarga
    ['usrah', 'أُسْرَةٌ', 'usratun', 'keluarga', 'ism', 'keluarga', 10, 'أُسْرَتِي صَغِيرَةٌ.', 'Keluargaku kecil.', 'users'],
    ['ab', 'أَبٌ', 'abun', 'ayah', 'ism', 'keluarga', 10, 'أَبِي مُوَظَّفٌ.', 'Ayahku seorang pegawai.', ''],
    ['umm', 'أُمٌّ', 'ummun', 'ibu', 'ism', 'keluarga', 10, 'أُمِّي رَبَّةُ بَيْتٍ.', 'Ibuku seorang ibu rumah tangga.', ''],
    ['akh', 'أَخٌ', 'akhun', 'saudara laki-laki', 'ism', 'keluarga', 10, 'أَخِي الْكَبِيرُ طَبِيبٌ.', 'Kakak laki-lakiku seorang dokter.', ''],
    ['ukht', 'أُخْتٌ', 'ukhtun', 'saudara perempuan', 'ism', 'keluarga', 10, 'أُخْتِي الصَّغِيرَةُ طَالِبَةٌ.', 'Adik perempuanku seorang siswi.', ''],
    ['jadd', 'جَدٌّ', 'jaddun', 'kakek', 'ism', 'keluarga', 10, 'جَدِّي يَسْكُنُ فِي الْقَرْيَةِ.', 'Kakekku tinggal di desa.', ''],
    ['jaddah', 'جَدَّةٌ', 'jaddatun', 'nenek', 'ism', 'keluarga', 10, 'جَدَّتِي تُحِبُّ الطَّبْخَ.', 'Nenekku suka memasak.', ''],
    ['bait', 'بَيْتٌ', 'baitun', 'rumah', 'ism', 'keluarga', 10, 'بَيْتِي قَرِيبٌ مِنَ الْمَدْرَسَةِ.', 'Rumahku dekat dari sekolah.', 'house'],

    // Kegiatan sehari-hari
    ['istaiqazha', 'اِسْتَيْقَظَ - يَسْتَيْقِظُ', 'istaiqazha – yastaiqizhu', 'bangun tidur', 'fiil', 'kegiatan', 10, 'أَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ وَالنِّصْفِ.', 'Aku bangun pukul setengah lima.', 'alarm-clock'],
    ['ightasala', 'اِغْتَسَلَ - يَغْتَسِلُ', 'ightasala – yaghtasilu', 'mandi', 'fiil', 'kegiatan', 10, 'أَغْتَسِلُ قَبْلَ الذَّهَابِ إِلَى الْمَدْرَسَةِ.', 'Aku mandi sebelum berangkat ke sekolah.', 'shower-head'],
    ['dzahaba', 'ذَهَبَ - يَذْهَبُ', 'dzahaba – yadzhabu', 'pergi', 'fiil', 'kegiatan', 10, 'أَذْهَبُ إِلَى الْمَدْرَسَةِ بِالدَّرَّاجَةِ.', 'Aku pergi ke sekolah dengan sepeda.', 'footprints'],
    ['rajaa', 'رَجَعَ - يَرْجِعُ', "raja'a – yarji'u", 'pulang, kembali', 'fiil', 'kegiatan', 10, 'أَرْجِعُ إِلَى الْبَيْتِ بَعْدَ الظُّهْرِ.', 'Aku pulang ke rumah setelah zuhur.', ''],
    ['darasa', 'دَرَسَ - يَدْرُسُ', 'darasa – yadrusu', 'belajar', 'fiil', 'kegiatan', 10, 'أَدْرُسُ اللُّغَةَ الْعَرَبِيَّةَ فِي الْفَصْلِ.', 'Aku belajar bahasa Arab di kelas.', 'book-open'],
    ['kataba', 'كَتَبَ - يَكْتُبُ', 'kataba – yaktubu', 'menulis', 'fiil', 'kegiatan', 10, 'يَكْتُبُ الطَّالِبُ الدَّرْسَ.', 'Siswa itu menulis pelajaran.', 'pen-line'],
    ['qaraa', 'قَرَأَ - يَقْرَأُ', "qara'a – yaqra'u", 'membaca', 'fiil', 'kegiatan', 10, 'أَقْرَأُ الْقُرْآنَ بَعْدَ صَلَاةِ الْمَغْرِبِ.', 'Aku membaca Al-Qur’an setelah salat Magrib.', 'book-marked'],
    ['akala', 'أَكَلَ - يَأْكُلُ', "akala – ya'kulu", 'makan', 'fiil', 'kegiatan', 10, 'نَأْكُلُ الْغَدَاءَ فِي الْبَيْتِ.', 'Kami makan siang di rumah.', 'utensils'],
    ['syariba', 'شَرِبَ - يَشْرَبُ', 'syariba – yasyrabu', 'minum', 'fiil', 'kegiatan', 10, 'أَشْرَبُ الْمَاءَ كَثِيرًا.', 'Aku banyak minum air.', 'glass-water'],
    ['nama', 'نَامَ - يَنَامُ', 'nāma – yanāmu', 'tidur', 'fiil', 'kegiatan', 10, 'أَنَامُ فِي السَّاعَةِ الْعَاشِرَةِ لَيْلًا.', 'Aku tidur pukul sepuluh malam.', 'bed-double'],
    ['shalla', 'صَلَّى - يُصَلِّي', 'shallā – yushallī', 'salat', 'fiil', 'kegiatan', 10, 'أُصَلِّي الصُّبْحَ فِي الْمَسْجِدِ.', 'Aku salat Subuh di masjid.', ''],

    // Hobi
    ['hiwayah', 'هِوَايَةٌ', 'hiwāyatun', 'hobi', 'ism', 'hobi', 11, 'مَا هِوَايَتُكَ؟', 'Apa hobimu?', ''],
    ['qiraah', 'الْقِرَاءَةُ', "al-qirā'atu", 'membaca (kegiatan)', 'ism', 'hobi', 11, 'هِوَايَتِي الْقِرَاءَةُ.', 'Hobiku membaca.', ''],
    ['sibahah', 'السِّبَاحَةُ', 'as-sibāhatu', 'berenang', 'ism', 'hobi', 11, 'أُحِبُّ السِّبَاحَةَ فِي يَوْمِ الْأَحَدِ.', 'Aku suka berenang pada hari Ahad.', ''],
    ['rasm', 'الرَّسْمُ', 'ar-rasmu', 'menggambar', 'ism', 'hobi', 11, 'هِوَايَةُ أُخْتِي الرَّسْمُ.', 'Hobi saudara perempuanku menggambar.', 'palette'],
    ['thabkh', 'الطَّبْخُ', 'ath-thabkhu', 'memasak', 'ism', 'hobi', 11, 'تُحِبُّ أُمِّي الطَّبْخَ.', 'Ibuku suka memasak.', 'chef-hat'],
    ['tashwir', 'التَّصْوِيرُ', 'at-tashwīru', 'memotret', 'ism', 'hobi', 11, 'هِوَايَتِي التَّصْوِيرُ.', 'Hobiku memotret.', 'camera'],
    ['kurah', 'كُرَةُ الْقَدَمِ', 'kuratul qadami', 'sepak bola', 'ism', 'hobi', 11, 'نَلْعَبُ كُرَةَ الْقَدَمِ فِي الْمَيْدَانِ.', 'Kami bermain sepak bola di lapangan.', ''],
    ['ahabba', 'أَحَبَّ - يُحِبُّ', 'ahabba – yuhibbu', 'menyukai', 'fiil', 'hobi', 11, 'أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ.', 'Aku menyukai bahasa Arab.', ''],

    // Waktu
    ['saah', 'سَاعَةٌ', "sā'atun", 'jam', 'ism', 'waktu', 11, 'كَمِ السَّاعَةُ الْآنَ؟', 'Jam berapa sekarang?', 'clock'],
    ['daqiqah', 'دَقِيقَةٌ', 'daqīqatun', 'menit', 'ism', 'waktu', 11, 'انْتَظِرْ دَقِيقَةً.', 'Tunggu sebentar (satu menit).', ''],
    ['yaum', 'يَوْمٌ', 'yaumun', 'hari', 'ism', 'waktu', 11, 'الْيَوْمُ يَوْمُ الْاِثْنَيْنِ.', 'Hari ini hari Senin.', 'calendar'],
    ['usbu', 'أُسْبُوعٌ', "usbū'un", 'pekan, minggu', 'ism', 'waktu', 11, 'فِي الْأُسْبُوعِ سَبْعَةُ أَيَّامٍ.', 'Dalam sepekan ada tujuh hari.', 'calendar-days'],
    ['syahr', 'شَهْرٌ', 'syahrun', 'bulan (kalender)', 'ism', 'waktu', 11, 'رَمَضَانُ شَهْرٌ مُبَارَكٌ.', 'Ramadan adalah bulan yang diberkahi.', ''],
    ['shabah', 'صَبَاحٌ', 'shabāhun', 'pagi', 'ism', 'waktu', 11, 'صَبَاحَ الْخَيْرِ يَا أُسْتَاذُ.', 'Selamat pagi, Ustaz.', 'sunrise'],
    ['nahar', 'نَهَارٌ', 'nahārun', 'siang', 'ism', 'waktu', 11, 'الْجَوُّ حَارٌّ فِي النَّهَارِ.', 'Cuaca panas pada siang hari.', 'sun'],
    ['masa', 'مَسَاءٌ', "masā'un", 'sore, petang', 'ism', 'waktu', 11, 'مَسَاءَ الْخَيْرِ.', 'Selamat sore.', 'sunset'],
    ['lail', 'لَيْلٌ', 'lailun', 'malam', 'ism', 'waktu', 11, 'أُرَاجِعُ الدُّرُوسَ فِي اللَّيْلِ.', 'Aku mengulang pelajaran pada malam hari.', 'moon'],
    ['alana', 'الْآنَ', 'al-āna', 'sekarang', 'zharaf', 'waktu', 11, 'أَنَا فِي الْفَصْلِ الْآنَ.', 'Aku di kelas sekarang.', ''],
    ['ghadan', 'غَدًا', 'ghadan', 'besok', 'zharaf', 'waktu', 11, 'سَأَذْهَبُ إِلَى الْمَكْتَبَةِ غَدًا.', 'Aku akan pergi ke perpustakaan besok.', ''],
    ['amsi', 'أَمْسِ', 'amsi', 'kemarin', 'zharaf', 'waktu', 11, 'ذَهَبْتُ إِلَى السُّوقِ أَمْسِ.', 'Aku pergi ke pasar kemarin.', ''],

    // Makanan & minuman
    ['thaam', 'طَعَامٌ', "tha'āmun", 'makanan', 'ism', 'makanan', 11, 'الطَّعَامُ لَذِيذٌ.', 'Makanan itu lezat.', 'salad'],
    ['maa', 'مَاءٌ', "mā'un", 'air', 'ism', 'makanan', 11, 'أُرِيدُ كُوبًا مِنَ الْمَاءِ.', 'Aku mau segelas air.', 'droplet'],
    ['halib', 'حَلِيبٌ', 'halībun', 'susu', 'ism', 'makanan', 11, 'أَشْرَبُ الْحَلِيبَ كُلَّ صَبَاحٍ.', 'Aku minum susu setiap pagi.', 'milk'],
    ['qahwah', 'قَهْوَةٌ', 'qahwatun', 'kopi', 'ism', 'makanan', 11, 'يَشْرَبُ أَبِي الْقَهْوَةَ.', 'Ayahku minum kopi.', 'coffee'],
    ['syai', 'شَايٌ', 'syāyun', 'teh', 'ism', 'makanan', 11, 'أُحِبُّ الشَّايَ بِالْحَلِيبِ.', 'Aku suka teh susu.', ''],
    ['aruzz', 'أَرُزٌّ', 'aruzzun', 'nasi, beras', 'ism', 'makanan', 11, 'آكُلُ الْأَرُزَّ وَالسَّمَكَ.', 'Aku makan nasi dan ikan.', ''],
    ['khubz', 'خُبْزٌ', 'khubzun', 'roti', 'ism', 'makanan', 11, 'أُرِيدُ خُبْزًا.', 'Aku mau roti.', 'croissant'],
    ['samak', 'سَمَكٌ', 'samakun', 'ikan', 'ism', 'makanan', 11, 'السَّمَكُ طَازَجٌ.', 'Ikan itu segar.', 'fish'],
    ['baidh', 'بَيْضٌ', 'baidhun', 'telur', 'ism', 'makanan', 11, 'أَكَلْتُ الْبَيْضَ فِي الْفَطُورِ.', 'Aku makan telur saat sarapan.', 'egg'],
    ['tuffah', 'تُفَّاحٌ', 'tuffāhun', 'apel', 'ism', 'makanan', 11, 'التُّفَّاحُ فَاكِهَةٌ مُفِيدَةٌ.', 'Apel adalah buah yang bermanfaat.', 'apple'],
    ['mauz', 'مَوْزٌ', 'mauzun', 'pisang', 'ism', 'makanan', 11, 'الْمَوْزُ أَصْفَرُ.', 'Pisang itu kuning.', 'banana'],
    ['lahm', 'لَحْمٌ', 'lahmun', 'daging', 'ism', 'makanan', 11, 'لَا آكُلُ اللَّحْمَ كَثِيرًا.', 'Aku tidak banyak makan daging.', 'beef'],
    ['maqshaf', 'مَقْصَفٌ', 'maqshafun', 'kantin', 'ism', 'makanan', 11, 'نَذْهَبُ إِلَى الْمَقْصَفِ فِي وَقْتِ الْاِسْتِرَاحَةِ.', 'Kami pergi ke kantin pada waktu istirahat.', 'store'],

    // Kesehatan
    ['shihhah', 'صِحَّةٌ', 'shihhatun', 'kesehatan', 'ism', 'kesehatan', 12, 'الصِّحَّةُ تَاجٌ عَلَى رُؤُوسِ الْأَصِحَّاءِ.', 'Kesehatan adalah mahkota di atas kepala orang-orang sehat.', 'heart-pulse'],
    ['maridh', 'مَرِيضٌ', 'marīdhun', 'sakit (orang yang sakit)', 'sifat', 'kesehatan', 12, 'أَنَا مَرِيضٌ الْيَوْمَ.', 'Aku sakit hari ini.', 'thermometer'],
    ['thabib', 'طَبِيبٌ', 'thabībun', 'dokter', 'ism', 'kesehatan', 12, 'ذَهَبْتُ إِلَى الطَّبِيبِ.', 'Aku pergi ke dokter.', 'stethoscope'],
    ['mustasyfa', 'مُسْتَشْفًى', 'mustasyfan', 'rumah sakit', 'ism', 'kesehatan', 12, 'الْمُسْتَشْفَى بَعِيدٌ مِنْ بَيْتِي.', 'Rumah sakit itu jauh dari rumahku.', 'hospital'],
    ['dawa', 'دَوَاءٌ', "dawā'un", 'obat', 'ism', 'kesehatan', 12, 'اِشْرَبِ الدَّوَاءَ ثَلَاثَ مَرَّاتٍ فِي الْيَوْمِ.', 'Minumlah obat tiga kali sehari.', 'pill'],
    ['riyadhah', 'رِيَاضَةٌ', 'riyādhatun', 'olahraga', 'ism', 'kesehatan', 12, 'الرِّيَاضَةُ مُفِيدَةٌ لِلْجِسْمِ.', 'Olahraga bermanfaat bagi tubuh.', 'dumbbell'],
    ['shuda', 'صُدَاعٌ', "shudā'un", 'sakit kepala', 'ism', 'kesehatan', 12, 'عِنْدِي صُدَاعٌ.', 'Aku sakit kepala.', ''],
    ['jism', 'جِسْمٌ', 'jismun', 'tubuh, badan', 'ism', 'kesehatan', 12, 'الْعَقْلُ السَّلِيمُ فِي الْجِسْمِ السَّلِيمِ.', 'Akal yang sehat terdapat dalam tubuh yang sehat.', ''],
    ['nazhif', 'نَظِيفٌ', 'nazhīfun', 'bersih', 'sifat', 'kesehatan', 12, 'الْفَصْلُ نَظِيفٌ وَجَمِيلٌ.', 'Kelas itu bersih dan indah.', 'sparkles'],

    // Lingkungan
    ['biah', 'بِيئَةٌ', "bī'atun", 'lingkungan', 'ism', 'lingkungan', 12, 'نُحَافِظُ عَلَى نَظَافَةِ الْبِيئَةِ.', 'Kita menjaga kebersihan lingkungan.', 'leaf'],
    ['syajarah', 'شَجَرَةٌ', 'syajaratun', 'pohon', 'ism', 'lingkungan', 12, 'نَزْرَعُ الْأَشْجَارَ حَوْلَ الْمَدْرَسَةِ.', 'Kami menanam pohon-pohon di sekitar sekolah.', 'tree-pine'],
    ['zahrah', 'زَهْرَةٌ', 'zahratun', 'bunga', 'ism', 'lingkungan', 12, 'الزَّهْرَةُ جَمِيلَةٌ.', 'Bunga itu indah.', 'flower'],
    ['bahr', 'بَحْرٌ', 'bahrun', 'laut', 'ism', 'lingkungan', 12, 'الْبَحْرُ وَاسِعٌ.', 'Laut itu luas.', 'waves'],
    ['jabal', 'جَبَلٌ', 'jabalun', 'gunung', 'ism', 'lingkungan', 12, 'الْجَبَلُ عَالٍ.', 'Gunung itu tinggi.', 'mountain'],
    ['mathar', 'مَطَرٌ', 'matharun', 'hujan', 'ism', 'lingkungan', 12, 'يَنْزِلُ الْمَطَرُ كَثِيرًا فِي هٰذَا الشَّهْرِ.', 'Hujan banyak turun pada bulan ini.', 'cloud-rain'],
    ['nufayat', 'النُّفَايَاتُ', 'an-nufāyātu', 'sampah', 'ism', 'lingkungan', 12, 'لَا تَرْمِ النُّفَايَاتِ فِي النَّهْرِ.', 'Jangan membuang sampah ke sungai.', 'trash-2'],
    ['hawa', 'هَوَاءٌ', "hawā'un", 'udara', 'ism', 'lingkungan', 12, 'الْهَوَاءُ نَقِيٌّ فِي الْقَرْيَةِ.', 'Udara bersih di desa.', 'wind'],
    ['nahr', 'نَهْرٌ', 'nahrun', 'sungai', 'ism', 'lingkungan', 12, 'مَاءُ النَّهْرِ صَافٍ.', 'Air sungai itu jernih.', ''],

    // Perjalanan
    ['safar', 'سَفَرٌ', 'safarun', 'perjalanan (bepergian)', 'ism', 'perjalanan', 12, 'السَّفَرُ مُمْتِعٌ.', 'Bepergian itu menyenangkan.', 'luggage'],
    ['sayyarah', 'سَيَّارَةٌ', 'sayyāratun', 'mobil', 'ism', 'perjalanan', 12, 'سَافَرْنَا بِالسَّيَّارَةِ.', 'Kami bepergian dengan mobil.', 'car'],
    ['hafilah', 'حَافِلَةٌ', 'hāfilatun', 'bus', 'ism', 'perjalanan', 12, 'أَذْهَبُ إِلَى الْمَدِينَةِ بِالْحَافِلَةِ.', 'Aku pergi ke kota dengan bus.', 'bus'],
    ['thairah', 'طَائِرَةٌ', "thā'iratun", 'pesawat terbang', 'ism', 'perjalanan', 12, 'سَافَرْتُ إِلَى جَاكَرْتَا بِالطَّائِرَةِ.', 'Aku bepergian ke Jakarta dengan pesawat.', 'plane'],
    ['qithar', 'قِطَارٌ', 'qithārun', 'kereta api', 'ism', 'perjalanan', 12, 'الْقِطَارُ سَرِيعٌ.', 'Kereta itu cepat.', 'train-front'],
    ['safinah', 'سَفِينَةٌ', 'safīnatun', 'kapal laut', 'ism', 'perjalanan', 12, 'تَسِيرُ السَّفِينَةُ فِي الْبَحْرِ.', 'Kapal berlayar di laut.', 'ship'],
    ['mathar-bandara', 'مَطَارٌ', 'mathārun', 'bandara', 'ism', 'perjalanan', 12, 'أَيْنَ الْمَطَارُ؟', 'Di mana bandara?', 'plane-landing'],
    ['funduq', 'فُنْدُقٌ', 'funduqun', 'hotel', 'ism', 'perjalanan', 12, 'نَزَلْنَا فِي فُنْدُقٍ قَرِيبٍ.', 'Kami menginap di hotel yang dekat.', 'hotel'],
    ['tadzkirah', 'تَذْكِرَةٌ', 'tadzkiratun', 'tiket', 'ism', 'perjalanan', 12, 'أُرِيدُ أَنْ أَحْجِزَ تَذْكِرَةً.', 'Aku ingin memesan tiket.', 'ticket'],
    ['kharithah', 'خَرِيطَةٌ', 'kharīthatun', 'peta', 'ism', 'perjalanan', 12, 'اُنْظُرْ إِلَى الْخَرِيطَةِ.', 'Lihatlah peta itu.', 'map'],
    ['darrajah', 'دَرَّاجَةٌ', 'darrājatun', 'sepeda', 'ism', 'perjalanan', 12, 'دَرَّاجَتِي جَدِيدَةٌ.', 'Sepedaku baru.', 'bike'],
  ];

  AE.BUNDLED_VOCAB = V.map((r, i) => ({
    id: 'v-' + r[0],
    arabic: r[1],
    latin: r[2],
    meaning: r[3],
    word_type: r[4],
    category: r[5],
    grade_level: r[6],
    example_ar: r[7],
    example_id: r[8],
    icon: r[9],
    image_url: '',
    audio_url: '',
    position: i,
  }));

  /* ------------------------------------------------------------------ */
  /* PERCAKAPAN                                                          */
  /* ------------------------------------------------------------------ */
  const L = (speaker, ar, id) => ({ speaker, ar, id });
  AE.BUNDLED_CONVERSATIONS = [
    {
      slug: 'perkenalan', title: 'Perkenalan', title_ar: 'التَّعَارُفُ', grade_level: 10,
      lines: [
        L('أَحْمَدُ', 'اَلسَّلَامُ عَلَيْكُمْ.', 'Assalamu’alaikum.'),
        L('يُوسُفُ', 'وَعَلَيْكُمُ السَّلَامُ.', 'Wa’alaikumussalam.'),
        L('أَحْمَدُ', 'مَا اسْمُكَ؟', 'Siapa namamu?'),
        L('يُوسُفُ', 'اِسْمِي يُوسُفُ. وَمَا اسْمُكَ؟', 'Namaku Yusuf. Dan siapa namamu?'),
        L('أَحْمَدُ', 'اِسْمِي أَحْمَدُ. مِنْ أَيْنَ أَنْتَ؟', 'Namaku Ahmad. Dari mana asalmu?'),
        L('يُوسُفُ', 'أَنَا مِنْ مَاكَاسَار.', 'Aku dari Makassar.'),
        L('أَحْمَدُ', 'تَشَرَّفْنَا بِمَعْرِفَتِكَ.', 'Senang berkenalan denganmu.'),
        L('يُوسُفُ', 'اَلشَّرَفُ لِي.', 'Kehormatan bagiku.'),
      ],
    },
    {
      slug: 'di-kelas', title: 'Percakapan di kelas', title_ar: 'فِي الْفَصْلِ', grade_level: 10,
      lines: [
        L('الْأُسْتَاذُ', 'صَبَاحَ الْخَيْرِ يَا طُلَّابُ.', 'Selamat pagi, para siswa.'),
        L('الطُّلَّابُ', 'صَبَاحَ النُّورِ يَا أُسْتَاذُ.', 'Selamat pagi juga, Ustaz.'),
        L('الْأُسْتَاذُ', 'اِفْتَحُوا الْكُتُبَ، الصَّفْحَةَ الْعَاشِرَةَ.', 'Bukalah buku kalian, halaman sepuluh.'),
        L('عَائِشَةُ', 'عَفْوًا يَا أُسْتَاذُ، لَيْسَ عِنْدِي كِتَابٌ.', 'Maaf, Ustaz, saya tidak punya buku.'),
        L('الْأُسْتَاذُ', 'لَا بَأْسَ، اُنْظُرِي مَعَ صَدِيقَتِكِ.', 'Tidak apa-apa, lihatlah bersama temanmu.'),
        L('عَائِشَةُ', 'شُكْرًا يَا أُسْتَاذُ.', 'Terima kasih, Ustaz.'),
      ],
    },
    {
      slug: 'bertanya-pelajaran', title: 'Bertanya tentang pelajaran', title_ar: 'السُّؤَالُ عَنِ الدَّرْسِ', grade_level: 10,
      lines: [
        L('فَاطِمَةُ', 'يَا أُسْتَاذَةُ، مَا مَعْنَى كَلِمَةِ مِمْسَحَةٍ؟', 'Ustazah, apa arti kata mimsahah?'),
        L('الْأُسْتَاذَةُ', 'مَعْنَاهَا penghapus بِاللُّغَةِ الْإِنْدُونِيسِيَّةِ.', 'Artinya “penghapus” dalam bahasa Indonesia.'),
        L('فَاطِمَةُ', 'كَيْفَ نَكْتُبُ هٰذِهِ الْكَلِمَةَ؟', 'Bagaimana kita menulis kata ini?'),
        L('الْأُسْتَاذَةُ', 'اُنْظُرِي إِلَى السَّبُّورَةِ.', 'Lihatlah ke papan tulis.'),
        L('فَاطِمَةُ', 'هَلْ يُمْكِنُ أَنْ تُكَرِّرِي مَرَّةً أُخْرَى؟', 'Bisakah Ustazah mengulanginya sekali lagi?'),
        L('الْأُسْتَاذَةُ', 'طَبْعًا، اِسْمَعِي جَيِّدًا.', 'Tentu, dengarkan baik-baik.'),
      ],
    },
    {
      slug: 'waktu', title: 'Bertanya tentang waktu', title_ar: 'السُّؤَالُ عَنِ الْوَقْتِ', grade_level: 11,
      lines: [
        L('عَلِيٌّ', 'يَا عُمَرُ، كَمِ السَّاعَةُ الْآنَ؟', 'Umar, jam berapa sekarang?'),
        L('عُمَرُ', 'السَّاعَةُ السَّابِعَةُ إِلَّا رُبْعًا.', 'Pukul tujuh kurang seperempat.'),
        L('عَلِيٌّ', 'مَتَى يَبْدَأُ الدَّرْسُ؟', 'Kapan pelajaran dimulai?'),
        L('عُمَرُ', 'يَبْدَأُ الدَّرْسُ فِي السَّاعَةِ السَّابِعَةِ تَمَامًا.', 'Pelajaran dimulai tepat pukul tujuh.'),
        L('عَلِيٌّ', 'هَيَّا نُسْرِعْ إِلَى الْفَصْلِ!', 'Ayo kita bergegas ke kelas!'),
        L('عُمَرُ', 'هَيَّا!', 'Ayo!'),
      ],
    },
    {
      slug: 'kegiatan-harian', title: 'Kegiatan sehari-hari', title_ar: 'الْأَنْشِطَةُ الْيَوْمِيَّةُ', grade_level: 11,
      lines: [
        L('زَيْنَبُ', 'مَتَى تَسْتَيْقِظِينَ مِنَ النَّوْمِ يَا مَرْيَمُ؟', 'Kapan kamu bangun tidur, Maryam?'),
        L('مَرْيَمُ', 'أَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ وَالنِّصْفِ.', 'Aku bangun pukul setengah lima.'),
        L('زَيْنَبُ', 'وَمَاذَا تَفْعَلِينَ بَعْدَ ذٰلِكَ؟', 'Lalu apa yang kamu lakukan setelah itu?'),
        L('مَرْيَمُ', 'أُصَلِّي الصُّبْحَ، ثُمَّ أُسَاعِدُ أُمِّي فِي الْبَيْتِ.', 'Aku salat Subuh, kemudian membantu ibuku di rumah.'),
        L('زَيْنَبُ', 'وَمَتَى تَذْهَبِينَ إِلَى الْمَدْرَسَةِ؟', 'Dan kapan kamu berangkat ke sekolah?'),
        L('مَرْيَمُ', 'أَذْهَبُ إِلَى الْمَدْرَسَةِ فِي السَّاعَةِ السَّادِسَةِ وَالنِّصْفِ.', 'Aku berangkat ke sekolah pukul setengah tujuh.'),
      ],
    },
    {
      slug: 'di-kantin', title: 'Percakapan di kantin', title_ar: 'فِي الْمَقْصَفِ', grade_level: 11,
      lines: [
        L('يُوسُفُ', 'اَلسَّلَامُ عَلَيْكُمْ يَا عَمِّي.', 'Assalamu’alaikum, Pak.'),
        L('الْبَائِعُ', 'وَعَلَيْكُمُ السَّلَامُ. مَاذَا تُرِيدُ؟', 'Wa’alaikumussalam. Mau beli apa?'),
        L('يُوسُفُ', 'أُرِيدُ خُبْزًا وَكُوبًا مِنَ الشَّايِ.', 'Saya mau roti dan segelas teh.'),
        L('الْبَائِعُ', 'تَفَضَّلْ.', 'Silakan.'),
        L('يُوسُفُ', 'بِكَمْ هٰذَا؟', 'Berapa harganya?'),
        L('الْبَائِعُ', 'بِعَشَرَةِ آلَافِ رُوبِيَّةٍ.', 'Sepuluh ribu rupiah.'),
        L('يُوسُفُ', 'تَفَضَّلْ، شُكْرًا.', 'Silakan (uangnya), terima kasih.'),
        L('الْبَائِعُ', 'عَفْوًا.', 'Sama-sama.'),
      ],
    },
    {
      slug: 'meminta-bantuan', title: 'Meminta bantuan', title_ar: 'طَلَبُ الْمُسَاعَدَةِ', grade_level: 12,
      lines: [
        L('عَائِشَةُ', 'يَا فَاطِمَةُ، هَلْ تَسْتَطِيعِينَ أَنْ تُسَاعِدِينِي؟', 'Fatimah, bisakah kamu membantuku?'),
        L('فَاطِمَةُ', 'نَعَمْ، بِكُلِّ سُرُورٍ. مَاذَا تُرِيدِينَ؟', 'Ya, dengan senang hati. Apa yang kamu perlukan?'),
        L('عَائِشَةُ', 'لَا أَفْهَمُ هٰذَا الدَّرْسَ.', 'Aku tidak memahami pelajaran ini.'),
        L('فَاطِمَةُ', 'لَا بَأْسَ، سَأَشْرَحُهُ لَكِ.', 'Tidak apa-apa, aku akan menjelaskannya untukmu.'),
        L('عَائِشَةُ', 'جَزَاكِ اللّٰهُ خَيْرًا.', 'Semoga Allah membalasmu dengan kebaikan.'),
        L('فَاطِمَةُ', 'وَإِيَّاكِ.', 'Begitu pula untukmu.'),
      ],
    },
    {
      slug: 'menanyakan-lokasi', title: 'Menanyakan lokasi', title_ar: 'السُّؤَالُ عَنِ الْمَكَانِ', grade_level: 12,
      lines: [
        L('أَحْمَدُ', 'عَفْوًا، أَيْنَ الْمَكْتَبَةُ؟', 'Permisi, di mana perpustakaan?'),
        L('الْحَارِسُ', 'الْمَكْتَبَةُ بِجَانِبِ الْمَسْجِدِ.', 'Perpustakaan ada di samping masjid.'),
        L('أَحْمَدُ', 'وَأَيْنَ غُرْفَةُ الْمُدَرِّسِينَ؟', 'Lalu di mana ruang guru?'),
        L('الْحَارِسُ', 'هِيَ أَمَامَ الْمَيْدَانِ.', 'Ruang guru ada di depan lapangan.'),
        L('أَحْمَدُ', 'شُكْرًا جَزِيلًا.', 'Terima kasih banyak.'),
        L('الْحَارِسُ', 'عَفْوًا.', 'Sama-sama.'),
      ],
    },
  ].map((c, i) => ({ ...c, id: 'c-' + c.slug, position: i }));

  /* ------------------------------------------------------------------ */
  /* TANTANGAN BERBICARA                                                 */
  /* ------------------------------------------------------------------ */
  AE.SPEAKING = [
    {
      id: 's-diri', title: 'Perkenalkan dirimu', grade: 10, seconds: 60,
      prompt: 'Perkenalkan dirimu dalam 4–5 kalimat: nama, asal, kelas, sekolah, dan hobi.',
      prompt_ar: 'عَرِّفْ نَفْسَكَ!',
      model: [
        ['اِسْمِي أَحْمَدُ.', 'Namaku Ahmad.'],
        ['أَنَا مِنْ إِنْدُونِيسِيَا.', 'Aku dari Indonesia.'],
        ['أَنَا طَالِبٌ فِي الصَّفِّ الْعَاشِرِ.', 'Aku siswa kelas sepuluh.'],
        ['هِوَايَتِي الْقِرَاءَةُ.', 'Hobiku membaca.'],
      ],
      vocab: ['اِسْمِي', 'أَنَا مِنْ', 'الصَّفُّ الْعَاشِرُ', 'هِوَايَتِي'],
      tips: ['Ucapkan ص (shad) dengan lidah lebih tebal daripada س (sin).', 'Bedakan panjang-pendek: هِوَايَتِي (hi-wā-ya-tī) memiliki dua bunyi panjang.'],
    },
    {
      id: 's-sekolah', title: 'Benda di kelasku', grade: 10, seconds: 60,
      prompt: 'Sebutkan dan tunjuk minimal lima benda di sekitarmu dengan pola هٰذَا / هٰذِهِ.',
      prompt_ar: 'مَا هٰذَا؟ مَا هٰذِهِ؟',
      model: [
        ['هٰذَا قَلَمٌ.', 'Ini pena.'],
        ['هٰذِهِ مِسْطَرَةٌ.', 'Ini penggaris.'],
        ['هٰذَا كِتَابٌ جَدِيدٌ.', 'Ini buku baru.'],
        ['تِلْكَ سَبُّورَةٌ.', 'Itu papan tulis.'],
      ],
      vocab: ['هٰذَا', 'هٰذِهِ', 'ذٰلِكَ', 'تِلْكَ'],
      tips: ['هٰذَا dibaca hādzā — ذ diucapkan dengan ujung lidah di antara gigi.', 'Perhatikan tanwin di akhir kata: قَلَمٌ = qalamun.'],
    },
    {
      id: 's-harian', title: 'Hari-hariku', grade: 11, seconds: 90,
      prompt: 'Ceritakan kegiatanmu dari bangun tidur sampai berangkat sekolah, lengkap dengan jamnya.',
      prompt_ar: 'مَاذَا تَفْعَلُ فِي الصَّبَاحِ؟',
      model: [
        ['أَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ وَالنِّصْفِ.', 'Aku bangun pukul setengah lima.'],
        ['ثُمَّ أُصَلِّي الصُّبْحَ.', 'Kemudian aku salat Subuh.'],
        ['بَعْدَ ذٰلِكَ أَغْتَسِلُ وَأَتَنَاوَلُ الْفَطُورَ.', 'Setelah itu aku mandi dan sarapan.'],
        ['أَذْهَبُ إِلَى الْمَدْرَسَةِ فِي السَّاعَةِ السَّادِسَةِ وَالنِّصْفِ.', 'Aku berangkat ke sekolah pukul setengah tujuh.'],
      ],
      vocab: ['أَسْتَيْقِظُ', 'ثُمَّ', 'بَعْدَ ذٰلِكَ', 'السَّاعَةُ ... وَالنِّصْفُ'],
      tips: ['ظ pada أَسْتَيْقِظُ diucapkan tebal, berbeda dari ز.', 'Gunakan kata sambung ثُمَّ dan بَعْدَ ذٰلِكَ agar cerita runtut.'],
    },
    {
      id: 's-hobi', title: 'Hobiku', grade: 11, seconds: 60,
      prompt: 'Jelaskan hobimu, kapan dan di mana kamu melakukannya, serta mengapa kamu menyukainya.',
      prompt_ar: 'مَا هِوَايَتُكَ؟',
      model: [
        ['هِوَايَتِي السِّبَاحَةُ.', 'Hobiku berenang.'],
        ['أَسْبَحُ فِي يَوْمِ الْأَحَدِ.', 'Aku berenang pada hari Ahad.'],
        ['أُحِبُّ السِّبَاحَةَ لِأَنَّهَا مُفِيدَةٌ لِلْجِسْمِ.', 'Aku suka berenang karena bermanfaat bagi tubuh.'],
      ],
      vocab: ['هِوَايَتِي', 'أُحِبُّ', 'لِأَنَّ', 'مُفِيدٌ'],
      tips: ['ح pada أُحِبُّ dihembuskan dari tengah tenggorokan, bukan seperti h biasa.', 'Tasydid pada أُحِبُّ: tahan bunyi b sedikit lebih lama.'],
    },
    {
      id: 's-sehat', title: 'Di dokter', grade: 12, seconds: 60,
      prompt: 'Peragakan sebagai pasien: sampaikan keluhanmu kepada dokter dan tanyakan cara minum obat.',
      prompt_ar: 'مَاذَا بِكَ؟',
      model: [
        ['عِنْدِي صُدَاعٌ مُنْذُ أَمْسِ.', 'Aku sakit kepala sejak kemarin.'],
        ['هَلْ يَجِبُ أَنْ أَشْرَبَ الدَّوَاءَ؟', 'Apakah aku harus minum obat?'],
        ['كَمْ مَرَّةً فِي الْيَوْمِ؟', 'Berapa kali sehari?'],
      ],
      vocab: ['عِنْدِي', 'صُدَاعٌ', 'دَوَاءٌ', 'كَمْ مَرَّةً'],
      tips: ['ع pada عِنْدِي berasal dari tengah tenggorokan.', 'ص pada صُدَاعٌ diucapkan tebal.'],
    },
    {
      id: 's-bumi', title: 'Menjaga lingkungan', grade: 12, seconds: 90,
      prompt: 'Sampaikan ajakan singkat kepada teman-teman untuk menjaga kebersihan lingkungan sekolah.',
      prompt_ar: 'كَيْفَ نُحَافِظُ عَلَى الْبِيئَةِ؟',
      model: [
        ['يَا أَصْدِقَائِي، النَّظَافَةُ مِنَ الْإِيمَانِ.', 'Teman-temanku, kebersihan adalah bagian dari iman.'],
        ['لَا تَرْمُوا النُّفَايَاتِ فِي كُلِّ مَكَانٍ.', 'Janganlah kalian membuang sampah di sembarang tempat.'],
        ['هَيَّا نَزْرَعُ الْأَشْجَارَ حَوْلَ الْمَدْرَسَةِ.', 'Ayo kita menanam pohon di sekitar sekolah.'],
      ],
      vocab: ['النَّظَافَةُ', 'لَا تَرْمُوا', 'نَزْرَعُ', 'الْبِيئَةُ'],
      tips: ['ظ pada النَّظَافَةُ diucapkan tebal dengan ujung lidah keluar sedikit.', 'Tekankan kata kerja perintah/larangan dengan intonasi tegas namun sopan.'],
    },
  ];

  AE.SPEAKING_RUBRIC = [
    { id: 'lafal', label: 'Pelafalan (makhraj & panjang-pendek)' },
    { id: 'kosakata', label: 'Penggunaan kosakata' },
    { id: 'struktur', label: 'Ketepatan struktur kalimat' },
    { id: 'lancar', label: 'Kelancaran & kepercayaan diri' },
  ];
})();
