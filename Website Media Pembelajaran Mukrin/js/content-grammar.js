/* ARABIYA EDU — Laboratorium Tata Bahasa (qawaid) bawaan. Dapat diedit guru. */
(function () {
  const AE = (window.AE = window.AE || {});
  const mcq = (q, options, answer, explain, ar) => ({ type: 'mcq', q, ar: ar || '', options, answer, explain });
  const tf = (q, ar, answer, explain) => ({ type: 'tf', q, ar, answer, explain });
  const fill = (q, ar, answer, explain) => ({ type: 'fill', q, ar, answer: [].concat(answer), explain });
  const arrange = (q, tokens, explain) => ({ type: 'arrange', q, tokens, explain });

  AE.BUNDLED_GRAMMAR_LESSONS = [
    {
      slug: 'dhamair', title: 'Kata ganti', title_ar: 'الضَّمَائِرُ', grade_level: 10, skill: 'qawaid', difficulty: 'mudah',
      objectives: ['Mengenal dhamir munfashil (kata ganti terpisah).', 'Menggunakan kata ganti sesuai jenis dan jumlah.'],
      intro: 'Kata ganti (ضَمِيرٌ) dipakai untuk menggantikan nama orang atau benda. Bahasa Arab membedakan kata ganti berdasarkan jenis (laki-laki/perempuan) dan jumlah.',
      explanation: [
        'Orang pertama: أَنَا (aku), نَحْنُ (kami/kita).',
        'Orang kedua: أَنْتَ (kamu, lk), أَنْتِ (kamu, pr), أَنْتُمَا (kamu berdua), أَنْتُمْ (kalian, lk), أَنْتُنَّ (kalian, pr).',
        'Orang ketiga: هُوَ (dia, lk), هِيَ (dia, pr), هُمَا (mereka berdua), هُمْ (mereka, lk), هُنَّ (mereka, pr).',
      ],
      table: { head: ['Kata ganti', 'Arti'], rows: [['أَنَا', 'aku'], ['نَحْنُ', 'kami/kita'], ['أَنْتَ', 'kamu (lk)'], ['أَنْتِ', 'kamu (pr)'], ['أَنْتُمْ', 'kalian (lk)'], ['أَنْتُنَّ', 'kalian (pr)'], ['هُوَ', 'dia (lk)'], ['هِيَ', 'dia (pr)'], ['هُمْ', 'mereka (lk)'], ['هُنَّ', 'mereka (pr)']] },
      examples: [['هُوَ طَالِبٌ.', 'Dia (lk) seorang siswa.'], ['هِيَ طَالِبَةٌ.', 'Dia (pr) seorang siswi.'], ['نَحْنُ طُلَّابٌ.', 'Kami adalah siswa-siswa.']],
      exercises: [
        mcq('Kata ganti untuk “dia (perempuan)” adalah …', ['هُوَ', 'هِيَ', 'هُمْ', 'أَنْتِ'], 1, 'هِيَ = dia (perempuan).'),
        mcq('أَنْتُمْ digunakan untuk …', ['kamu (lk)', 'kalian (lk)', 'mereka (lk)', 'kami'], 1, 'أَنْتُمْ = kalian (laki-laki atau campuran).'),
        tf('Kalimat berikut benar.', 'هِيَ طَالِبٌ.', false, 'هِيَ untuk perempuan → طَالِبَةٌ.'),
      ],
      summary: ['Kata ganti membedakan jenis dan jumlah.', 'Predikat menyesuaikan kata gantinya.'],
      reflection: ['Buat satu kalimat untuk setiap kata ganti orang ketiga.'],
    },
    {
      slug: 'isyarah', title: 'Kata tunjuk', title_ar: 'أَسْمَاءُ الْإِشَارَةِ', grade_level: 10, skill: 'qawaid', difficulty: 'mudah',
      objectives: ['Membedakan kata tunjuk dekat dan jauh.', 'Menyesuaikan kata tunjuk dengan jenis kata benda.'],
      intro: 'Kata tunjuk (اِسْمُ الْإِشَارَةِ) dipakai untuk menunjuk benda yang dekat atau jauh.',
      explanation: [
        'Dekat: هٰذَا (ini, mudzakkar), هٰذِهِ (ini, muannats).',
        'Jauh: ذٰلِكَ (itu, mudzakkar), تِلْكَ (itu, muannats).',
        'Untuk jamak (manusia), gunakan هٰؤُلَاءِ (ini) dan أُولٰئِكَ (itu).',
      ],
      table: { head: ['', 'Mudzakkar', 'Muannats'], rows: [['Dekat', 'هٰذَا', 'هٰذِهِ'], ['Jauh', 'ذٰلِكَ', 'تِلْكَ']] },
      examples: [['هٰذَا مَكْتَبٌ.', 'Ini meja.'], ['تِلْكَ سَبُّورَةٌ.', 'Itu papan tulis.'], ['هٰؤُلَاءِ طُلَّابٌ.', 'Mereka ini siswa-siswa.']],
      exercises: [
        mcq('Kata tunjuk yang tepat: ___ مَدْرَسَةٌ (itu sekolah).', ['ذٰلِكَ', 'تِلْكَ', 'هٰذَا', 'هٰؤُلَاءِ'], 1, 'مَدْرَسَةٌ muannats + jauh → تِلْكَ.'),
        tf('ذٰلِكَ digunakan untuk benda mudzakkar yang jauh.', '', true, 'ذٰلِكَ = itu (mudzakkar).'),
        fill('Lengkapi: ___ قَلَمٌ. (Ini pena.)', '', ['هذا', 'هٰذَا', 'هَذَا'], 'قَلَمٌ mudzakkar + dekat → هٰذَا.'),
      ],
      summary: ['هٰذَا / هٰذِهِ (dekat); ذٰلِكَ / تِلْكَ (jauh).'],
      reflection: ['Tunjuk tiga benda di kelas dan sebutkan dengan kata tunjuk yang tepat.'],
    },
    {
      slug: 'asma', title: 'Kata benda', title_ar: 'الْأَسْمَاءُ', grade_level: 10, skill: 'qawaid', difficulty: 'mudah',
      objectives: ['Mengenali ciri-ciri isim.', 'Membedakan isim nakirah dan ma’rifah.'],
      intro: 'Isim (اِسْمٌ) adalah kata yang menunjukkan orang, benda, tempat, atau makna, dan tidak terikat waktu.',
      explanation: [
        'Ciri isim antara lain: dapat diawali الـ, dapat bertanwin (ـٌ ـٍ ـً), dan dapat didahului huruf jar seperti فِي atau مِنْ.',
        'Isim nakirah (umum) biasanya bertanwin: كِتَابٌ (sebuah buku).',
        'Isim ma’rifah (khusus) misalnya diawali الـ: الْكِتَابُ (buku itu). Isim dengan الـ tidak bertanwin.',
      ],
      examples: [['كِتَابٌ', 'sebuah buku (nakirah)'], ['الْكِتَابُ', 'buku itu (ma’rifah)'], ['فِي الْفَصْلِ', 'di dalam kelas (didahului huruf jar)']],
      exercises: [
        mcq('Manakah yang merupakan isim ma’rifah?', ['قَلَمٌ', 'الْقَلَمُ', 'كَتَبَ', 'يَكْتُبُ'], 1, 'Diawali الـ → ma’rifah.'),
        tf('Isim yang diawali الـ boleh bertanwin.', '', false, 'الـ dan tanwin tidak berkumpul dalam satu kata.'),
      ],
      summary: ['Ciri isim: الـ, tanwin, huruf jar.', 'Nakirah bertanwin; ma’rifah diawali الـ.'],
      reflection: ['Ubah lima isim nakirah menjadi ma’rifah.'],
    },
    {
      slug: 'mudzakkar-muannats', title: 'Mudzakkar dan muannats', title_ar: 'الْمُذَكَّرُ وَالْمُؤَنَّثُ', grade_level: 10, skill: 'qawaid', difficulty: 'mudah',
      objectives: ['Membedakan kata benda mudzakkar dan muannats.', 'Mengubah mudzakkar menjadi muannats dengan ta marbuthah.'],
      intro: 'Setiap kata benda dalam bahasa Arab memiliki jenis: mudzakkar (maskulin) atau muannats (feminin).',
      explanation: [
        'Tanda muannats yang paling umum adalah ta marbuthah (ـةٌ): مُدَرِّسٌ → مُدَرِّسَةٌ.',
        'Ada kata muannats tanpa ta marbuthah, misalnya nama perempuan (مَرْيَمُ), kata yang memang perempuan (أُمٌّ), dan beberapa kata khusus (شَمْسٌ = matahari).',
        'Kata sifat dan kata tunjuk harus menyesuaikan jenis kata bendanya.',
      ],
      table: { head: ['Mudzakkar', 'Muannats', 'Arti'], rows: [['طَالِبٌ', 'طَالِبَةٌ', 'siswa/siswi'], ['مُدَرِّسٌ', 'مُدَرِّسَةٌ', 'guru'], ['صَدِيقٌ', 'صَدِيقَةٌ', 'teman'], ['كَبِيرٌ', 'كَبِيرَةٌ', 'besar']] },
      examples: [['هٰذَا طَالِبٌ مُجْتَهِدٌ.', 'Ini siswa yang rajin.'], ['هٰذِهِ طَالِبَةٌ مُجْتَهِدَةٌ.', 'Ini siswi yang rajin.']],
      exercises: [
        mcq('Bentuk muannats dari صَدِيقٌ adalah …', ['صَدِيقَانِ', 'صَدِيقَةٌ', 'أَصْدِقَاءُ', 'الصَّدِيقُ'], 1, 'Tambahkan ta marbuthah.'),
        tf('Kata أُمٌّ termasuk muannats.', '', true, 'أُمٌّ (ibu) secara makna adalah perempuan.'),
      ],
      summary: ['ـةٌ adalah tanda muannats yang paling umum.', 'Sifat & kata tunjuk menyesuaikan jenis.'],
      reflection: ['Tulis tiga pasangan mudzakkar–muannats yang kamu ketahui.'],
    },
    {
      slug: 'mufrad-mutsanna-jama', title: 'Tunggal, dual, dan jamak', title_ar: 'الْمُفْرَدُ وَالْمُثَنَّى وَالْجَمْعُ', grade_level: 11, skill: 'qawaid', difficulty: 'sedang',
      objectives: ['Membentuk mutsanna (dual).', 'Mengenal jamak mudzakkar salim, jamak muannats salim, dan jamak taksir.'],
      intro: 'Bahasa Arab memiliki bentuk tunggal (مُفْرَدٌ), dua (مُثَنًّى), dan banyak/tiga ke atas (جَمْعٌ).',
      explanation: [
        'Mutsanna: tambahkan ـَانِ (rafa’) atau ـَيْنِ (nashab/jar): طَالِبٌ → طَالِبَانِ.',
        'Jamak mudzakkar salim: ـُونَ / ـِينَ: مُدَرِّسٌ → مُدَرِّسُونَ.',
        'Jamak muannats salim: ـَاتٌ: مُدَرِّسَةٌ → مُدَرِّسَاتٌ.',
        'Jamak taksir (tidak beraturan) mengubah pola kata dan perlu dihafal: كِتَابٌ → كُتُبٌ، قَلَمٌ → أَقْلَامٌ، طَالِبٌ → طُلَّابٌ.',
      ],
      table: { head: ['Mufrad', 'Mutsanna', 'Jamak'], rows: [['مُدَرِّسٌ', 'مُدَرِّسَانِ', 'مُدَرِّسُونَ'], ['مُدَرِّسَةٌ', 'مُدَرِّسَتَانِ', 'مُدَرِّسَاتٌ'], ['كِتَابٌ', 'كِتَابَانِ', 'كُتُبٌ'], ['قَلَمٌ', 'قَلَمَانِ', 'أَقْلَامٌ']] },
      examples: [['فِي الْفَصْلِ طَالِبَانِ.', 'Di kelas ada dua siswa.'], ['الْمُدَرِّسُونَ فِي الْمَكْتَبِ.', 'Para guru (lk) ada di kantor.']],
      exercises: [
        mcq('Bentuk mutsanna dari كِتَابٌ (rafa’) adalah …', ['كُتُبٌ', 'كِتَابَانِ', 'كِتَابَاتٌ', 'كِتَابُونَ'], 1, 'Tambahkan ـَانِ.'),
        mcq('Jamak dari قَلَمٌ adalah …', ['قَلَمَاتٌ', 'أَقْلَامٌ', 'قَلَمُونَ', 'قَلَمَانِ'], 1, 'قَلَمٌ memiliki jamak taksir أَقْلَامٌ.'),
        fill('Jamak muannats salim dari طَالِبَةٌ adalah ___', '', ['طالبات', 'طَالِبَاتٌ'], 'ـةٌ diganti ـَاتٌ.'),
      ],
      summary: ['Mutsanna: ـَانِ / ـَيْنِ.', 'Jamak salim: ـُونَ / ـِينَ dan ـَاتٌ.', 'Jamak taksir perlu dihafal.'],
      reflection: ['Kumpulkan lima jamak taksir dari kosakata sekolah.'],
    },
    {
      slug: 'jumlah-ismiyyah', title: 'Kalimat nominal', title_ar: 'الْجُمْلَةُ الْاِسْمِيَّةُ', grade_level: 11, skill: 'qawaid', difficulty: 'sedang',
      objectives: ['Mengenali mubtada’ dan khabar.', 'Menyusun kalimat nominal sederhana.'],
      intro: 'Jumlah ismiyyah adalah kalimat yang diawali isim. Unsurnya adalah مُبْتَدَأٌ (subjek) dan خَبَرٌ (predikat).',
      explanation: [
        'Mubtada’ umumnya ma’rifah dan berharakat dhammah: الْكِتَابُ.',
        'Khabar menjelaskan mubtada’, umumnya nakirah dan juga berharakat dhammah: جَدِيدٌ.',
        'Khabar menyesuaikan mubtada’ dalam jenis dan jumlah: الطَّالِبَةُ مُجْتَهِدَةٌ.',
      ],
      examples: [['الْكِتَابُ جَدِيدٌ.', 'Buku itu baru.'], ['الْمَدْرَسَةُ كَبِيرَةٌ.', 'Sekolah itu besar.'], ['أَنَا طَالِبٌ.', 'Aku seorang siswa.']],
      exercises: [
        mcq('Mubtada’ pada kalimat الْفَصْلُ نَظِيفٌ adalah …', ['الْفَصْلُ', 'نَظِيفٌ', 'keduanya', 'tidak ada'], 0, 'Kata pertama (isim ma’rifah) = mubtada’.'),
        arrange('Susun: “Sekolah itu besar.”', ['الْمَدْرَسَةُ', 'كَبِيرَةٌ'], 'Mubtada’ lalu khabar; khabar muannats menyesuaikan.'),
        tf('Kalimat berikut sudah sesuai kaidah.', 'الطَّالِبَةُ مُجْتَهِدٌ.', false, 'Khabar harus muannats: مُجْتَهِدَةٌ.'),
      ],
      summary: ['Mubtada’ + khabar, keduanya marfu’.', 'Khabar menyesuaikan jenis dan jumlah mubtada’.'],
      reflection: ['Deskripsikan ruang kelasmu dengan tiga jumlah ismiyyah.'],
    },
    {
      slug: 'jumlah-filiyyah', title: 'Kalimat verbal', title_ar: 'الْجُمْلَةُ الْفِعْلِيَّةُ', grade_level: 11, skill: 'qawaid', difficulty: 'sedang',
      objectives: ['Mengenali fi’il, fa’il, dan maf’ul bih.', 'Menyusun kalimat verbal sederhana.'],
      intro: 'Jumlah fi’liyyah adalah kalimat yang diawali fi’il (kata kerja).',
      explanation: [
        'Susunan dasar: فِعْلٌ (kata kerja) + فَاعِلٌ (pelaku, marfu’) + مَفْعُولٌ بِهِ (objek, manshub).',
        'Contoh: كَتَبَ الطَّالِبُ الدَّرْسَ — كَتَبَ (fi’il), الطَّالِبُ (fa’il), الدَّرْسَ (maf’ul bih).',
        'Jika fa’il perempuan, fi’il madhi diberi ta sukun: كَتَبَتِ الطَّالِبَةُ.',
      ],
      examples: [['قَرَأَ أَحْمَدُ الْكِتَابَ.', 'Ahmad membaca buku itu.'], ['تَكْتُبُ فَاطِمَةُ الرِّسَالَةَ.', 'Fatimah menulis surat.']],
      exercises: [
        mcq('Fa’il pada kalimat شَرِبَ عَلِيٌّ الْمَاءَ adalah …', ['شَرِبَ', 'عَلِيٌّ', 'الْمَاءَ', 'tidak ada'], 1, 'Pelaku perbuatan = عَلِيٌّ.'),
        arrange('Susun: “Siswa itu menulis pelajaran.”', ['كَتَبَ', 'الطَّالِبُ', 'الدَّرْسَ'], 'Fi’il + fa’il + maf’ul bih.'),
      ],
      summary: ['Fi’il + fa’il (marfu’) + maf’ul bih (manshub).'],
      reflection: ['Tulis tiga kalimat verbal tentang kegiatanmu kemarin.'],
    },
    {
      slug: 'fiil-madhi', title: 'Kata kerja lampau', title_ar: 'الْفِعْلُ الْمَاضِي', grade_level: 11, skill: 'qawaid', difficulty: 'sedang',
      objectives: ['Mengenali fi’il madhi.', 'Mengubah fi’il madhi sesuai pelaku.'],
      intro: 'Fi’il madhi menunjukkan perbuatan yang sudah terjadi.',
      explanation: [
        'Bentuk dasar (dia lk): كَتَبَ (dia telah menulis).',
        'Akhiran pelaku: كَتَبَتْ (dia pr), كَتَبْتُ (aku), كَتَبْنَا (kami), كَتَبْتَ (kamu lk), كَتَبْتِ (kamu pr), كَتَبُوا (mereka lk).',
      ],
      table: { head: ['Pelaku', 'Fi’il madhi'], rows: [['هُوَ', 'كَتَبَ'], ['هِيَ', 'كَتَبَتْ'], ['أَنَا', 'كَتَبْتُ'], ['نَحْنُ', 'كَتَبْنَا'], ['أَنْتَ', 'كَتَبْتَ'], ['أَنْتِ', 'كَتَبْتِ'], ['هُمْ', 'كَتَبُوا']] },
      examples: [['ذَهَبْتُ إِلَى الْمَكْتَبَةِ.', 'Aku (telah) pergi ke perpustakaan.'], ['قَرَأَتْ مَرْيَمُ الْقِصَّةَ.', 'Maryam (telah) membaca cerita itu.']],
      exercises: [
        mcq('“Kami telah belajar” adalah …', ['دَرَسْتُ', 'دَرَسْنَا', 'دَرَسُوا', 'نَدْرُسُ'], 1, 'Akhiran ـْنَا = kami.'),
        fill('Lengkapi: ___ الدَّرْسَ أَمْسِ. (Aku telah menulis pelajaran kemarin.)', '', ['كتبت', 'كَتَبْتُ'], 'Akhiran ـْتُ = aku.'),
      ],
      summary: ['Madhi = lampau. Akhiran menunjukkan pelaku.'],
      reflection: ['Ceritakan kegiatanmu kemarin dengan fi’il madhi.'],
    },
    {
      slug: 'fiil-mudhari', title: 'Kata kerja sekarang/akan datang', title_ar: 'الْفِعْلُ الْمُضَارِعُ', grade_level: 11, skill: 'qawaid', difficulty: 'sedang',
      objectives: ['Mengenali huruf mudhara’ah (أ ن ي ت).', 'Menggunakan سَـ untuk masa depan.'],
      intro: 'Fi’il mudhari’ menunjukkan perbuatan yang sedang atau akan terjadi.',
      explanation: [
        'Diawali salah satu huruf أَنَيْتُ: أَكْتُبُ (aku), نَكْتُبُ (kami), يَكْتُبُ (dia lk), تَكْتُبُ (dia pr / kamu lk).',
        'Tambahkan سَـ atau سَوْفَ untuk masa depan: سَأَكْتُبُ (aku akan menulis).',
      ],
      table: { head: ['Pelaku', 'Fi’il mudhari’'], rows: [['أَنَا', 'أَكْتُبُ'], ['نَحْنُ', 'نَكْتُبُ'], ['هُوَ', 'يَكْتُبُ'], ['هِيَ', 'تَكْتُبُ'], ['أَنْتَ', 'تَكْتُبُ'], ['أَنْتِ', 'تَكْتُبِينَ'], ['هُمْ', 'يَكْتُبُونَ']] },
      examples: [['يَدْرُسُ أَخِي فِي الْجَامِعَةِ.', 'Saudaraku belajar di universitas.'], ['سَأَذْهَبُ إِلَى الْمَكْتَبَةِ غَدًا.', 'Aku akan pergi ke perpustakaan besok.']],
      exercises: [
        mcq('“Dia (pr) sedang membaca” adalah …', ['يَقْرَأُ', 'تَقْرَأُ', 'أَقْرَأُ', 'قَرَأَتْ'], 1, 'تَـ untuk dia (pr).'),
        tf('سَأَكْتُبُ berarti “aku telah menulis”.', '', false, 'سَـ menunjukkan masa depan: aku akan menulis.'),
      ],
      summary: ['Huruf mudhara’ah: أ ن ي ت.', 'سَـ / سَوْفَ = akan.'],
      reflection: ['Tulis rencanamu untuk besok dengan سَـ.'],
    },
    {
      slug: 'fiil-amr', title: 'Kata kerja perintah', title_ar: 'فِعْلُ الْأَمْرِ', grade_level: 12, skill: 'qawaid', difficulty: 'sedang',
      objectives: ['Membentuk fi’il amr dari mudhari’.', 'Menggunakan perintah secara sopan.'],
      intro: 'Fi’il amr digunakan untuk memerintah atau meminta seseorang melakukan sesuatu.',
      explanation: [
        'Ambil fi’il mudhari’ untuk “kamu”, buang huruf تَـ di depan, dan sukunkan huruf terakhir: تَكْتُبُ → كْتُبْ → tambahkan alif berharakat: اُكْتُبْ.',
        'Harakat alif mengikuti huruf ketiga: jika dhammah → اُ (اُكْتُبْ), jika fathah/kasrah → اِ (اِجْلِسْ، اِفْتَحْ).',
        'Untuk perempuan: اُكْتُبِي; untuk banyak orang: اُكْتُبُوا.',
      ],
      examples: [['اِجْلِسْ مِنْ فَضْلِكَ.', 'Silakan duduk.'], ['اِفْتَحُوا الْكُتُبَ.', 'Bukalah buku-buku kalian.'], ['اُكْتُبِي اسْمَكِ.', 'Tulislah namamu (pr).']],
      exercises: [
        mcq('Fi’il amr dari تَجْلِسُ adalah …', ['اُجْلُسْ', 'اِجْلِسْ', 'جَلَسَ', 'يَجْلِسُ'], 1, 'Huruf ketiga berharakat kasrah → alif kasrah: اِجْلِسْ.'),
        fill('Perintah “Bukalah!” (kepada satu laki-laki) adalah ___', '', ['افتح', 'اِفْتَحْ'], 'تَفْتَحُ → اِفْتَحْ.'),
      ],
      summary: ['Amr dibentuk dari mudhari’ untuk “kamu”.', 'Gunakan مِنْ فَضْلِكَ agar sopan.'],
      reflection: ['Tulis lima perintah yang sering diucapkan guru di kelas.'],
    },
    {
      slug: 'naat-manut', title: 'Sifat dan yang disifati', title_ar: 'النَّعْتُ وَالْمَنْعُوتُ', grade_level: 12, skill: 'qawaid', difficulty: 'sulit',
      objectives: ['Mengenali na’at dan man’ut.', 'Menyesuaikan na’at dalam empat hal.'],
      intro: 'Na’at (sifat) menjelaskan man’ut (kata benda yang disifati) dan diletakkan setelahnya.',
      explanation: [
        'Na’at mengikuti man’ut dalam: jenis (mudzakkar/muannats), jumlah (tunggal/dual/jamak), ma’rifah/nakirah, dan i’rab (harakat akhir).',
        'كِتَابٌ جَدِيدٌ (buku baru — keduanya nakirah) dan الْكِتَابُ الْجَدِيدُ (buku yang baru itu — keduanya ma’rifah).',
        'Bedakan dengan jumlah ismiyyah: الْكِتَابُ جَدِيدٌ (Buku itu baru) adalah kalimat lengkap, sedangkan الْكِتَابُ الْجَدِيدُ masih berupa frasa.',
      ],
      examples: [['رَأَيْتُ طَالِبَةً مُجْتَهِدَةً.', 'Aku melihat seorang siswi yang rajin.'], ['جَلَسْتُ فِي الْفَصْلِ الْكَبِيرِ.', 'Aku duduk di kelas yang besar.']],
      exercises: [
        mcq('Na’at yang tepat: الْمَدْرَسَةُ ___', ['الْكَبِيرُ', 'الْكَبِيرَةُ', 'كَبِيرَةٌ', 'كَبِيرٌ'], 1, 'Man’ut muannats, ma’rifah, marfu’ → الْكَبِيرَةُ.'),
        tf('الْكِتَابُ جَدِيدٌ adalah susunan na’at–man’ut.', '', false, 'Itu jumlah ismiyyah (mubtada’–khabar), karena berbeda dalam ma’rifah/nakirah.'),
      ],
      summary: ['Na’at mengikuti man’ut dalam 4 hal.', 'Perhatikan beda frasa na’at dan kalimat nominal.'],
      reflection: ['Deskripsikan sekolahmu dengan tiga frasa na’at–man’ut.'],
    },
  ].map((l) => ({ ...l, category: 'qawaid' }));
})();
