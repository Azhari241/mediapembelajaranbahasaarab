/* ARABIYA EDU — Kosakata, percakapan, tantangan berbicara (contoh awal yang dapat diedit).
   Ikon gambar memakai set ikon Lucide (lisensi ISC). Jika ikon tidak sesuai, kartu menampilkan placeholder. */
window.AE_CONTENT = window.AE_CONTENT || {};
(function () {
  const V = (arabic, meaning, category, grade_level, icon, word_type, example_ar, example_id, latin) =>
    ({ arabic, meaning, category, grade_level, icon, word_type, example_ar, example_id, latin: latin || '' });
  window.AE_CONTENT.vocabulary = [
    // Sekolah
    V('مَدْرَسَةٌ', 'sekolah', 'Sekolah', 10, 'school', 'isim (muannats)', 'أَذْهَبُ إِلَى الْمَدْرَسَةِ.', 'Saya pergi ke sekolah.', 'madrasah'),
    V('كِتَابٌ', 'buku', 'Sekolah', 10, 'book', 'isim (mudzakkar)', 'هَذَا كِتَابٌ جَدِيدٌ.', 'Ini buku baru.', 'kitāb'),
    V('قَلَمٌ', 'pena', 'Sekolah', 10, 'pen', 'isim (mudzakkar)', 'الْقَلَمُ عَلَى الْمَكْتَبِ.', 'Pena itu di atas meja.', 'qalam'),
    V('دَفْتَرٌ', 'buku tulis', 'Sekolah', 10, 'notebook-pen', 'isim (mudzakkar)', 'أَكْتُبُ فِي الدَّفْتَرِ.', 'Saya menulis di buku tulis.', 'daftar'),
    V('مِسْطَرَةٌ', 'penggaris', 'Sekolah', 10, 'ruler', 'isim (muannats)', 'هَذِهِ مِسْطَرَةٌ طَوِيلَةٌ.', 'Ini penggaris yang panjang.', 'misṭarah'),
    V('حَقِيبَةٌ', 'tas', 'Sekolah', 10, 'backpack', 'isim (muannats)', 'الْكِتَابُ فِي الْحَقِيبَةِ.', 'Buku itu di dalam tas.', 'ḥaqībah'),
    V('سَبُّورَةٌ', 'papan tulis', 'Sekolah', 10, 'presentation', 'isim (muannats)', 'يَكْتُبُ الْمُدَرِّسُ عَلَى السَّبُّورَةِ.', 'Guru menulis di papan tulis.', 'sabbūrah'),
    V('مَكْتَبَةٌ', 'perpustakaan', 'Sekolah', 10, 'library', 'isim (muannats)', 'أَقْرَأُ فِي الْمَكْتَبَةِ.', 'Saya membaca di perpustakaan.', 'maktabah'),
    V('كُرْسِيٌّ', 'kursi', 'Sekolah', 10, 'armchair', 'isim (mudzakkar)', 'اِجْلِسْ عَلَى الْكُرْسِيِّ.', 'Duduklah di kursi.', 'kursiyy'),
    V('مُدَرِّسٌ', 'guru (lk)', 'Sekolah', 10, 'graduation-cap', 'isim (mudzakkar)', 'الْمُدَرِّسُ فِي الْفَصْلِ.', 'Guru itu di dalam kelas.', 'mudarris'),
    // Keluarga
    V('أَبٌ', 'ayah', 'Keluarga', 10, 'user-round', 'isim (mudzakkar)', 'أَبِي مُدَرِّسٌ.', 'Ayahku seorang guru.', 'ab'),
    V('أُمٌّ', 'ibu', 'Keluarga', 10, 'heart', 'isim (muannats)', 'أُمِّي فِي الْبَيْتِ.', 'Ibuku di rumah.', 'umm'),
    V('أُسْرَةٌ', 'keluarga', 'Keluarga', 10, 'users', 'isim (muannats)', 'أُسْرَتِي سَعِيدَةٌ.', 'Keluargaku bahagia.', 'usrah'),
    V('بَيْتٌ', 'rumah', 'Keluarga', 10, 'house', 'isim (mudzakkar)', 'بَيْتِي قَرِيبٌ.', 'Rumahku dekat.', 'bayt'),
    V('طِفْلٌ', 'anak kecil', 'Keluarga', 10, 'baby', 'isim (mudzakkar)', 'الطِّفْلُ نَائِمٌ.', 'Anak kecil itu tidur.', 'ṭifl'),
    // Makanan
    V('مَاءٌ', 'air', 'Makanan & Minuman', 11, 'glass-water', 'isim (mudzakkar)', 'أَشْرَبُ الْمَاءَ.', 'Saya minum air.', 'mā’'),
    V('حَلِيبٌ', 'susu', 'Makanan & Minuman', 11, 'milk', 'isim (mudzakkar)', 'الْحَلِيبُ مُفِيدٌ.', 'Susu itu bermanfaat.', 'ḥalīb'),
    V('قَهْوَةٌ', 'kopi', 'Makanan & Minuman', 11, 'coffee', 'isim (muannats)', 'أَبِي يَشْرَبُ الْقَهْوَةَ.', 'Ayahku minum kopi.', 'qahwah'),
    V('خُبْزٌ', 'roti', 'Makanan & Minuman', 11, 'croissant', 'isim (mudzakkar)', 'آكُلُ الْخُبْزَ صَبَاحًا.', 'Saya makan roti di pagi hari.', 'khubz'),
    V('سَمَكٌ', 'ikan', 'Makanan & Minuman', 11, 'fish', 'isim (mudzakkar)', 'نَأْكُلُ السَّمَكَ.', 'Kami makan ikan.', 'samak'),
    V('بَيْضٌ', 'telur', 'Makanan & Minuman', 11, 'egg', 'isim (mudzakkar)', 'الْبَيْضُ فِي الثَّلَّاجَةِ.', 'Telur itu di dalam kulkas.', 'bayḍ'),
    V('تُفَّاحَةٌ', 'apel', 'Makanan & Minuman', 11, 'apple', 'isim (muannats)', 'هَذِهِ تُفَّاحَةٌ حَمْرَاءُ.', 'Ini apel merah.', 'tuffāḥah'),
    V('مَوْزٌ', 'pisang', 'Makanan & Minuman', 11, 'banana', 'isim (mudzakkar)', 'أُحِبُّ الْمَوْزَ.', 'Saya suka pisang.', 'mawz'),
    V('لَحْمٌ', 'daging', 'Makanan & Minuman', 11, 'beef', 'isim (mudzakkar)', 'تَطْبُخُ أُمِّي اللَّحْمَ.', 'Ibuku memasak daging.', 'laḥm'),
    V('سَلَطَةٌ', 'salad, sayuran', 'Makanan & Minuman', 11, 'salad', 'isim (muannats)', 'السَّلَطَةُ لَذِيذَةٌ.', 'Salad itu lezat.', 'salaṭah'),
    // Waktu
    V('سَاعَةٌ', 'jam', 'Waktu', 11, 'clock', 'isim (muannats)', 'كَمِ السَّاعَةُ الْآنَ؟', 'Jam berapa sekarang?', 'sā‘ah'),
    V('يَوْمٌ', 'hari', 'Waktu', 11, 'calendar', 'isim (mudzakkar)', 'الْيَوْمَ يَوْمُ الْجُمُعَةِ.', 'Hari ini hari Jumat.', 'yawm'),
    V('صَبَاحٌ', 'pagi', 'Waktu', 11, 'sunrise', 'isim (mudzakkar)', 'صَبَاحُ الْخَيْرِ.', 'Selamat pagi.', 'ṣabāḥ'),
    V('مَسَاءٌ', 'sore, petang', 'Waktu', 11, 'sunset', 'isim (mudzakkar)', 'مَسَاءُ الْخَيْرِ.', 'Selamat sore.', 'masā’'),
    V('لَيْلٌ', 'malam', 'Waktu', 11, 'moon', 'isim (mudzakkar)', 'أَنَامُ فِي اللَّيْلِ مُبَكِّرًا.', 'Saya tidur lebih awal di malam hari.', 'layl'),
    V('مُنَبِّهٌ', 'jam weker', 'Waktu', 11, 'alarm-clock', 'isim (mudzakkar)', 'يُوقِظُنِي الْمُنَبِّهُ.', 'Jam weker membangunkanku.', 'munabbih'),
    // Kesehatan
    V('طَبِيبٌ', 'dokter', 'Kesehatan', 12, 'stethoscope', 'isim (mudzakkar)', 'ذَهَبْتُ إِلَى الطَّبِيبِ.', 'Saya pergi ke dokter.', 'ṭabīb'),
    V('مُسْتَشْفًى', 'rumah sakit', 'Kesehatan', 12, 'hospital', 'isim (mudzakkar)', 'الْمُسْتَشْفَى بَعِيدٌ.', 'Rumah sakit itu jauh.', 'mustasyfā'),
    V('دَوَاءٌ', 'obat', 'Kesehatan', 12, 'pill', 'isim (mudzakkar)', 'اِشْرَبِ الدَّوَاءَ.', 'Minumlah obat itu.', 'dawā’'),
    V('رِيَاضَةٌ', 'olahraga', 'Kesehatan', 12, 'dumbbell', 'isim (muannats)', 'الرِّيَاضَةُ مُفِيدَةٌ لِلْجِسْمِ.', 'Olahraga bermanfaat bagi tubuh.', 'riyāḍah'),
    V('حُمَّى', 'demam', 'Kesehatan', 12, 'thermometer', 'isim (muannats)', 'عِنْدِي حُمَّى.', 'Saya demam.', 'ḥummā'),
    V('صِحَّةٌ', 'kesehatan', 'Kesehatan', 12, 'heart-pulse', 'isim (muannats)', 'الصِّحَّةُ تَاجٌ.', 'Kesehatan adalah mahkota.', 'ṣiḥḥah'),
    // Lingkungan
    V('شَجَرَةٌ', 'pohon', 'Lingkungan', 12, 'tree-pine', 'isim (muannats)', 'نَغْرِسُ شَجَرَةً.', 'Kami menanam sebuah pohon.', 'syajarah'),
    V('وَرْدَةٌ', 'bunga mawar', 'Lingkungan', 12, 'flower', 'isim (muannats)', 'الْوَرْدَةُ جَمِيلَةٌ.', 'Bunga mawar itu indah.', 'wardah'),
    V('بَحْرٌ', 'laut', 'Lingkungan', 12, 'waves', 'isim (mudzakkar)', 'الْبَحْرُ وَاسِعٌ.', 'Laut itu luas.', 'baḥr'),
    V('جَبَلٌ', 'gunung', 'Lingkungan', 12, 'mountain', 'isim (mudzakkar)', 'الْجَبَلُ عَالٍ.', 'Gunung itu tinggi.', 'jabal'),
    V('مَطَرٌ', 'hujan', 'Lingkungan', 12, 'cloud-rain', 'isim (mudzakkar)', 'نَزَلَ الْمَطَرُ.', 'Hujan turun.', 'maṭar'),
    V('قُمَامَةٌ', 'sampah', 'Lingkungan', 12, 'trash-2', 'isim (muannats)', 'لَا تَرْمِ الْقُمَامَةَ.', 'Jangan membuang sampah.', 'qumāmah'),
    V('شَمْسٌ', 'matahari', 'Lingkungan', 12, 'sun', 'isim (muannats)', 'الشَّمْسُ مُشْرِقَةٌ.', 'Matahari bersinar.', 'syams'),
    V('رِيحٌ', 'angin', 'Lingkungan', 12, 'wind', 'isim (muannats)', 'الرِّيحُ شَدِيدَةٌ.', 'Angin itu kencang.', 'rīḥ'),
    // Perjalanan
    V('طَائِرَةٌ', 'pesawat', 'Perjalanan', 12, 'plane', 'isim (muannats)', 'سَافَرْتُ بِالطَّائِرَةِ.', 'Saya bepergian dengan pesawat.', 'ṭā’irah'),
    V('سَيَّارَةٌ', 'mobil', 'Perjalanan', 12, 'car', 'isim (muannats)', 'سَيَّارَةُ أَبِي جَدِيدَةٌ.', 'Mobil ayahku baru.', 'sayyārah'),
    V('حَافِلَةٌ', 'bus', 'Perjalanan', 12, 'bus', 'isim (muannats)', 'نَرْكَبُ الْحَافِلَةَ.', 'Kami naik bus.', 'ḥāfilah'),
    V('قِطَارٌ', 'kereta api', 'Perjalanan', 12, 'train-front', 'isim (mudzakkar)', 'الْقِطَارُ سَرِيعٌ.', 'Kereta api itu cepat.', 'qiṭār'),
    V('سَفِينَةٌ', 'kapal', 'Perjalanan', 12, 'ship', 'isim (muannats)', 'السَّفِينَةُ فِي الْبَحْرِ.', 'Kapal itu di laut.', 'safīnah'),
    V('دَرَّاجَةٌ', 'sepeda', 'Perjalanan', 12, 'bike', 'isim (muannats)', 'أَذْهَبُ بِالدَّرَّاجَةِ.', 'Saya pergi dengan sepeda.', 'darrājah'),
    V('حَقِيبَةُ السَّفَرِ', 'koper', 'Perjalanan', 12, 'luggage', 'isim (muannats)', 'حَقِيبَةُ السَّفَرِ ثَقِيلَةٌ.', 'Koper itu berat.', 'ḥaqībat as-safar'),
    V('تَذْكِرَةٌ', 'tiket', 'Perjalanan', 12, 'ticket', 'isim (muannats)', 'أُرِيدُ تَذْكِرَةً.', 'Saya ingin tiket.', 'tadzkirah'),
    V('خَرِيطَةٌ', 'peta', 'Perjalanan', 12, 'map', 'isim (muannats)', 'اُنْظُرْ إِلَى الْخَرِيطَةِ.', 'Lihatlah peta itu.', 'kharīṭah'),
    // Hobi
    V('الرَّسْمُ', 'menggambar', 'Hobi', 11, 'palette', 'mashdar', 'هِوَايَتِي الرَّسْمُ.', 'Hobiku menggambar.', 'ar-rasm'),
    V('التَّصْوِيرُ', 'fotografi', 'Hobi', 11, 'camera', 'mashdar', 'أُحِبُّ التَّصْوِيرَ.', 'Saya suka fotografi.', 'at-taṣwīr'),
    V('الطَّبْخُ', 'memasak', 'Hobi', 11, 'chef-hat', 'mashdar', 'تُحِبُّ أُخْتِي الطَّبْخَ.', 'Saudariku suka memasak.', 'aṭ-ṭabkh'),
    V('الْقِرَاءَةُ', 'membaca', 'Hobi', 11, 'book-open', 'mashdar', 'الْقِرَاءَةُ تُوَسِّعُ الْمَعْرِفَةَ.', 'Membaca memperluas pengetahuan.', 'al-qirā’ah'),
    V('الْخَطُّ', 'kaligrafi', 'Hobi', 11, 'pen-line', 'isim', 'يَكْتُبُ عَلِيٌّ الْخَطَّ الْجَمِيلَ.', 'Ali menulis kaligrafi yang indah.', 'al-khaṭṭ'),
    V('الْمُخَيَّمُ', 'perkemahan', 'Hobi', 11, 'tent', 'isim', 'ذَهَبْنَا إِلَى الْمُخَيَّمِ.', 'Kami pergi ke perkemahan.', 'al-mukhayyam'),
    // Kegiatan
    V('نَوْمٌ', 'tidur', 'Kegiatan', 10, 'bed-double', 'mashdar', 'النَّوْمُ مُبَكِّرًا صِحِّيٌّ.', 'Tidur lebih awal itu sehat.', 'nawm'),
    V('مَشْيٌ', 'berjalan kaki', 'Kegiatan', 10, 'footprints', 'mashdar', 'أَذْهَبُ إِلَى الْمَدْرَسَةِ مَشْيًا.', 'Saya pergi ke sekolah dengan berjalan kaki.', 'masy-y'),
    V('بَابٌ', 'pintu', 'Kegiatan', 10, 'door-open', 'isim (mudzakkar)', 'اِفْتَحِ الْبَابَ.', 'Bukalah pintu.', 'bāb'),
    V('سُوقٌ', 'pasar', 'Kegiatan', 10, 'store', 'isim (muannats)', 'تَذْهَبُ أُمِّي إِلَى السُّوقِ.', 'Ibuku pergi ke pasar.', 'sūq')
  ];

  window.AE_CONTENT.conversations = [
    { slug: 'taaruf', title: 'Perkenalan', title_ar: 'التَّعَارُفُ', grade_level: 10, position: 1, lines: [
      { who: 'أَحْمَدُ', ar: 'السَّلَامُ عَلَيْكُمْ.', id: 'Assalamu‘alaikum.' },
      { who: 'زَيْدٌ', ar: 'وَعَلَيْكُمُ السَّلَامُ.', id: 'Wa‘alaikumussalam.' },
      { who: 'أَحْمَدُ', ar: 'مَا اسْمُكَ؟', id: 'Siapa namamu?' },
      { who: 'زَيْدٌ', ar: 'اِسْمِي زَيْدٌ. وَمَا اسْمُكَ؟', id: 'Namaku Zaid. Dan siapa namamu?' },
      { who: 'أَحْمَدُ', ar: 'اِسْمِي أَحْمَدُ. مِنْ أَيْنَ أَنْتَ؟', id: 'Namaku Ahmad. Dari mana kamu?' },
      { who: 'زَيْدٌ', ar: 'أَنَا مِنْ مَكَاسَرَ.', id: 'Saya dari Makassar.' },
      { who: 'أَحْمَدُ', ar: 'تَشَرَّفْتُ بِمَعْرِفَتِكَ.', id: 'Senang berkenalan denganmu.' }
    ], respond: { prompt: 'مَا اسْمُكَ؟', options: ['اِسْمِي زَيْدٌ.', 'أَنَا مِنْ مَكَاسَرَ.', 'بِخَيْرٍ، الْحَمْدُ لِلهِ.'], answer: 0 } },
    { slug: 'fil-fashl', title: 'Percakapan di Kelas', title_ar: 'فِي الْفَصْلِ', grade_level: 10, position: 2, lines: [
      { who: 'الْمُدَرِّسُ', ar: 'صَبَاحَ الْخَيْرِ يَا طُلَّابُ.', id: 'Selamat pagi, para siswa.' },
      { who: 'الطُّلَّابُ', ar: 'صَبَاحَ النُّورِ يَا أُسْتَاذُ.', id: 'Selamat pagi juga, Ustadz.' },
      { who: 'الْمُدَرِّسُ', ar: 'اِفْتَحُوا الْكُتُبَ، الصَّفْحَةَ الْعَاشِرَةَ.', id: 'Bukalah buku kalian, halaman sepuluh.' },
      { who: 'فَاطِمَةُ', ar: 'يَا أُسْتَاذُ، أَيْنَ الصَّفْحَةُ الْعَاشِرَةُ؟', id: 'Ustadz, di mana halaman sepuluh?' },
      { who: 'الْمُدَرِّسُ', ar: 'بَعْدَ الدَّرْسِ الثَّانِي.', id: 'Setelah pelajaran kedua.' },
      { who: 'فَاطِمَةُ', ar: 'شُكْرًا يَا أُسْتَاذُ.', id: 'Terima kasih, Ustadz.' }
    ], respond: { prompt: 'صَبَاحَ الْخَيْرِ.', options: ['مَعَ السَّلَامَةِ.', 'صَبَاحَ النُّورِ.', 'عَفْوًا.'], answer: 1 } },
    { slug: 'sual-dars', title: 'Bertanya tentang Pelajaran', title_ar: 'السُّؤَالُ عَنِ الدَّرْسِ', grade_level: 10, position: 3, lines: [
      { who: 'عَلِيٌّ', ar: 'يَا أُسْتَاذَةُ، عِنْدِي سُؤَالٌ.', id: 'Ustadzah, saya punya pertanyaan.' },
      { who: 'الْمُدَرِّسَةُ', ar: 'تَفَضَّلْ يَا عَلِيُّ.', id: 'Silakan, Ali.' },
      { who: 'عَلِيٌّ', ar: 'مَا مَعْنَى كَلِمَةِ «مُجْتَهِدٌ»؟', id: 'Apa arti kata "mujtahid"?' },
      { who: 'الْمُدَرِّسَةُ', ar: 'مَعْنَاهَا: الَّذِي يَدْرُسُ بِجِدٍّ.', id: 'Artinya: orang yang belajar dengan sungguh-sungguh (rajin).' },
      { who: 'عَلِيٌّ', ar: 'فَهِمْتُ، جَزَاكِ اللهُ خَيْرًا.', id: 'Saya paham, semoga Allah membalas kebaikan Ustadzah.' }
    ], respond: { prompt: 'عِنْدِي سُؤَالٌ.', options: ['تَفَضَّلْ.', 'لَا أَعْرِفُ.', 'أَنَا جَائِعٌ.'], answer: 0 } },
    { slug: 'sual-waqt', title: 'Bertanya tentang Waktu', title_ar: 'السُّؤَالُ عَنِ الْوَقْتِ', grade_level: 11, position: 4, lines: [
      { who: 'مَرْيَمُ', ar: 'كَمِ السَّاعَةُ الْآنَ؟', id: 'Jam berapa sekarang?' },
      { who: 'هِنْدُ', ar: 'السَّاعَةُ السَّابِعَةُ إِلَّا رُبُعًا.', id: 'Pukul tujuh kurang seperempat.' },
      { who: 'مَرْيَمُ', ar: 'مَتَى يَبْدَأُ الدَّرْسُ؟', id: 'Kapan pelajaran dimulai?' },
      { who: 'هِنْدُ', ar: 'يَبْدَأُ فِي السَّاعَةِ السَّابِعَةِ وَالنِّصْفِ.', id: 'Dimulai pada pukul tujuh lewat tiga puluh menit.' },
      { who: 'مَرْيَمُ', ar: 'إِذَنْ، عِنْدَنَا وَقْتٌ لِلْفَطُورِ.', id: 'Kalau begitu, kita punya waktu untuk sarapan.' }
    ], respond: { prompt: 'كَمِ السَّاعَةُ الْآنَ؟', options: ['السَّاعَةُ الثَّامِنَةُ.', 'أَنَا فِي الْبَيْتِ.', 'اِسْمِي مَرْيَمُ.'], answer: 0 } },
    { slug: 'yaumiyyat', title: 'Kegiatan Sehari-hari', title_ar: 'الْأَنْشِطَةُ الْيَوْمِيَّةُ', grade_level: 10, position: 5, lines: [
      { who: 'يُوسُفُ', ar: 'مَتَى تَسْتَيْقِظُ مِنَ النَّوْمِ؟', id: 'Kapan kamu bangun tidur?' },
      { who: 'رَحْمَةُ', ar: 'أَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ وَالنِّصْفِ.', id: 'Saya bangun pukul setengah lima.' },
      { who: 'يُوسُفُ', ar: 'وَمَاذَا تَفْعَلِينَ بَعْدَ ذَلِكَ؟', id: 'Lalu apa yang kamu lakukan setelah itu?' },
      { who: 'رَحْمَةُ', ar: 'أُصَلِّي الصُّبْحَ ثُمَّ أَقْرَأُ الْقُرْآنَ.', id: 'Saya shalat subuh, kemudian membaca Al-Qur\'an.' }
    ], respond: { prompt: 'مَاذَا تَفْعَلُ بَعْدَ الصَّلَاةِ؟', options: ['أَقْرَأُ الْقُرْآنَ.', 'اِسْمِي يُوسُفُ.', 'السَّاعَةُ الْخَامِسَةُ.'], answer: 0 } },
    { slug: 'kantin', title: 'Percakapan di Kantin', title_ar: 'فِي الْمَقْصَفِ', grade_level: 11, position: 6, lines: [
      { who: 'الْبَائِعُ', ar: 'أَهْلًا وَسَهْلًا، مَاذَا تُرِيدُ؟', id: 'Selamat datang, apa yang kamu inginkan?' },
      { who: 'خَالِدٌ', ar: 'أُرِيدُ أَرُزًّا بِالدَّجَاجِ وَكُوبًا مِنَ الشَّايِ.', id: 'Saya ingin nasi ayam dan segelas teh.' },
      { who: 'الْبَائِعُ', ar: 'تَفَضَّلْ.', id: 'Silakan.' },
      { who: 'خَالِدٌ', ar: 'بِكَمْ هَذَا؟', id: 'Berapa harganya?' },
      { who: 'الْبَائِعُ', ar: 'بِخَمْسَةَ عَشَرَ أَلْفَ رُوبِيَّةٍ.', id: 'Lima belas ribu rupiah.' },
      { who: 'خَالِدٌ', ar: 'هَذِهِ هِيَ النُّقُودُ، شُكْرًا.', id: 'Ini uangnya, terima kasih.' }
    ], respond: { prompt: 'مَاذَا تُرِيدُ؟', options: ['أُرِيدُ كُوبًا مِنَ الشَّايِ.', 'أَنَا مِنْ جَاكَرْتَا.', 'إِلَى اللِّقَاءِ.'], answer: 0 } },
    { slug: 'musaadah', title: 'Meminta Bantuan', title_ar: 'طَلَبُ الْمُسَاعَدَةِ', grade_level: 11, position: 7, lines: [
      { who: 'سَلْمَى', ar: 'مِنْ فَضْلِكِ، هَلْ تُسَاعِدِينَنِي؟', id: 'Tolong, bisakah kamu membantuku?' },
      { who: 'نُورٌ', ar: 'نَعَمْ، بِكُلِّ سُرُورٍ. مَا الْمُشْكِلَةُ؟', id: 'Ya, dengan senang hati. Apa masalahnya?' },
      { who: 'سَلْمَى', ar: 'لَا أَفْهَمُ هَذَا الدَّرْسَ.', id: 'Saya tidak paham pelajaran ini.' },
      { who: 'نُورٌ', ar: 'لَا بَأْسَ، نَدْرُسُ مَعًا بَعْدَ الصَّلَاةِ.', id: 'Tidak apa-apa, kita belajar bersama setelah shalat.' },
      { who: 'سَلْمَى', ar: 'شُكْرًا جَزِيلًا.', id: 'Terima kasih banyak.' },
      { who: 'نُورٌ', ar: 'عَفْوًا.', id: 'Sama-sama.' }
    ], respond: { prompt: 'شُكْرًا جَزِيلًا.', options: ['عَفْوًا.', 'نَعَمْ.', 'صَبَاحَ النُّورِ.'], answer: 0 } },
    { slug: 'makan', title: 'Menanyakan Lokasi', title_ar: 'السُّؤَالُ عَنِ الْمَكَانِ', grade_level: 12, position: 8, lines: [
      { who: 'عُمَرُ', ar: 'عَفْوًا، أَيْنَ مَكْتَبُ الْمُدِيرِ؟', id: 'Permisi, di mana kantor kepala sekolah?' },
      { who: 'حَسَنٌ', ar: 'اِمْشِ مُسْتَقِيمًا، ثُمَّ خُذْ يَمِينًا.', id: 'Berjalanlah lurus, kemudian belok kanan.' },
      { who: 'عُمَرُ', ar: 'هَلْ هُوَ بِجَانِبِ الْمَكْتَبَةِ؟', id: 'Apakah ia di samping perpustakaan?' },
      { who: 'حَسَنٌ', ar: 'لَا، هُوَ أَمَامَ الْمُخْتَبَرِ.', id: 'Tidak, ia di depan laboratorium.' },
      { who: 'عُمَرُ', ar: 'شُكْرًا لَكَ.', id: 'Terima kasih.' }
    ], respond: { prompt: 'أَيْنَ الْمَكْتَبَةُ؟', options: ['الْمَكْتَبَةُ بِجَانِبِ الْفَصْلِ.', 'أُرِيدُ كِتَابًا.', 'اِسْمِي حَسَنٌ.'], answer: 0 } }
  ];

  window.AE_CONTENT.speaking = [
    { id: 'sp1', grade_level: 10, title: 'Perkenalkan dirimu', prompt_ar: 'عَرِّفْ نَفْسَكَ!', prompt_id: 'Perkenalkan dirimu: nama, asal, kelas, dan hobi.', seconds: 60,
      sample: [ { ar: 'اِسْمِي مُحَمَّدٌ.', id: 'Namaku Muhammad.' }, { ar: 'أَنَا مِنْ غُووَا.', id: 'Saya dari Gowa.' }, { ar: 'أَنَا طَالِبٌ فِي الْفَصْلِ الْعَاشِرِ.', id: 'Saya siswa kelas sepuluh.' }, { ar: 'هِوَايَتِي الْقِرَاءَةُ.', id: 'Hobiku membaca.' } ],
      vocab: ['اِسْمِي', 'أَنَا مِنْ', 'طَالِبٌ / طَالِبَةٌ', 'هِوَايَتِي'], tips: ['Panjangkan bacaan huruf mad (ا، و، ي) dua harakat.', 'Ucapkan huruf ع dari tengah tenggorokan, bukan seperti "a" biasa.'] },
    { id: 'sp2', grade_level: 10, title: 'Ceritakan sekolahmu', prompt_ar: 'صِفْ مَدْرَسَتَكَ.', prompt_id: 'Gambarkan sekolahmu: ruangan, benda, dan kegiatan.', seconds: 75,
      sample: [ { ar: 'مَدْرَسَتِي كَبِيرَةٌ وَنَظِيفَةٌ.', id: 'Sekolahku besar dan bersih.' }, { ar: 'فِيهَا مَكْتَبَةٌ وَمُخْتَبَرٌ وَمَسْجِدٌ.', id: 'Di dalamnya ada perpustakaan, laboratorium, dan masjid.' }, { ar: 'أَدْرُسُ فِيهَا كُلَّ يَوْمٍ.', id: 'Saya belajar di sana setiap hari.' } ],
      vocab: ['فَصْلٌ', 'مَكْتَبَةٌ', 'مُخْتَبَرٌ', 'نَظِيفٌ'], tips: ['Bedakan ص (tebal) dan س (tipis).', 'Huruf ة di akhir kalimat dibaca "h" saat berhenti (waqaf).'] },
    { id: 'sp3', grade_level: 11, title: 'Jadwal harianku', prompt_ar: 'مَاذَا تَفْعَلُ كُلَّ يَوْمٍ؟', prompt_id: 'Ceritakan kegiatanmu dari pagi sampai malam beserta jamnya.', seconds: 90,
      sample: [ { ar: 'أَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ وَالنِّصْفِ.', id: 'Saya bangun pukul setengah lima.' }, { ar: 'ثُمَّ أُصَلِّي الصُّبْحَ.', id: 'Kemudian saya shalat subuh.' }, { ar: 'أَذْهَبُ إِلَى الْمَدْرَسَةِ فِي السَّاعَةِ السَّادِسَةِ وَالنِّصْفِ.', id: 'Saya pergi ke sekolah pukul setengah tujuh.' } ],
      vocab: ['أَسْتَيْقِظُ', 'ثُمَّ', 'فِي السَّاعَةِ', 'أَرْجِعُ'], tips: ['Bedakan ث (lidah di antara gigi) dan س.', 'Tekankan syaddah pada ثُمَّ.'] },
    { id: 'sp4', grade_level: 12, title: 'Ajakan menjaga lingkungan', prompt_ar: 'كَيْفَ نُحَافِظُ عَلَى الْبِيئَةِ؟', prompt_id: 'Sampaikan tiga ajakan menjaga lingkungan sekolah.', seconds: 90,
      sample: [ { ar: 'لِنُحَافِظْ عَلَى نَظَافَةِ الْمَدْرَسَةِ.', id: 'Mari kita jaga kebersihan sekolah.' }, { ar: 'لَا تَرْمِ الْقُمَامَةَ فِي الْفَصْلِ.', id: 'Jangan membuang sampah di kelas.' }, { ar: 'نَغْرِسُ الْأَشْجَارَ حَوْلَ الْمَدْرَسَةِ.', id: 'Kita menanam pohon di sekitar sekolah.' } ],
      vocab: ['لِنُحَافِظْ', 'لَا تَرْمِ', 'نَظَافَةٌ', 'نَغْرِسُ'], tips: ['Huruf ظ dibaca tebal dengan ujung lidah di antara gigi.', 'Bedakan ح (desah halus) dan ه.'] }
  ];
})();
