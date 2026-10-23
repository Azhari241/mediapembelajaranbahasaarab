# ARABIYA EDU — Laboratorium Bahasa Arab Digital
**SMA GUPPI Samata** · Yayasan Pendidikan Pesantren Modern Cendekia Puruhita GUPPI Samata, Gowa
*“Belajar Bahasa Arab dengan Mudah, Menyenangkan, dan Bermakna.”*

> Belum menjadi aplikasi resmi sekolah sampai ada persetujuan resmi dari sekolah/yayasan.

---

## 1. Ringkasan arsitektur

| Lapisan | Teknologi | Catatan |
|---|---|---|
| Frontend | HTML + CSS + JavaScript murni (SPA, router hash) | Tanpa proses build berat; berjalan di hosting statis mana pun. |
| Ikon | Lucide 0.454.0 (lisensi ISC), disimpan lokal di `assets/vendor/` | |
| Font | Plus Jakarta Sans & Noto Naskh Arabic (SIL OFL, Google Fonts) | |
| Database | Supabase PostgreSQL + Row Level Security | `supabase/schema.sql` |
| Backend / proses sensitif | **Fungsi PostgreSQL `SECURITY DEFINER`** dipanggil lewat RPC Supabase | Penilaian, sesi ujian, kode sesi/peserta, statistik. |
| Realtime | Supabase Realtime — **hanya** tabel `leaderboard_entries` | |
| Autentikasi guru | Supabase Auth (email + kata sandi) + tabel `teacher_profiles` | Diperiksa di database melalui `is_teacher()` / `is_admin()`. |
| Hosting | Vercel (atau hosting statis lain) | `vercel.json` + `scripts/build-config.mjs` |

### Penyesuaian terhadap spesifikasi awal (dokumentasi asumsi)
Spesifikasi menyebut Next.js/React/TypeScript/Tailwind. Versi ini sengaja dibangun sebagai **aplikasi statis tanpa framework** dengan logika server di dalam database, karena:
1. **Tidak ada secret key sama sekali** yang perlu disimpan di mana pun (tidak di Vercel, tidak di GitHub). Semua operasi sensitif berjalan di PostgreSQL dengan hak yang dikunci RLS dan `GRANT`.
2. Hemat biaya: tidak memakai fungsi serverless Vercel → aman untuk paket gratis Vercel & Supabase.
3. Mudah dirawat guru/operator sekolah: cukup unggah file, tanpa `npm install` untuk produksi.

Seluruh perilaku keamanan yang diminta (penilaian di server, kunci jawaban tersembunyi, token sesi acak ber-hash, rate limiting, batas ukuran, anti-duplikat, validasi waktu, RLS) **tetap terpenuhi** dan diuji otomatis (lihat §9). Jika nanti ingin migrasi ke Next.js, skema & RPC dapat dipakai ulang apa adanya.

---

## 2. Struktur folder
```
index.html                 Kerangka aplikasi & navigasi
config.js                  Konfigurasi produksi (HANYA kunci publik) — dibuat otomatis saat build
css/app.css                Gaya (hijau tua, hijau muda, putih, emas lembut, abu-abu)
js/core.js                 Template aman (auto-escape), ikon, router, toast, modal, audio, koneksi
js/data.js                 Lapisan data (database → fallback konten bawaan), aturan peringkat
js/quiz-engine.js          Tampilan & interaksi 10 jenis soal
js/content-*.js            Konten bawaan: 105 kosakata, 10 materi tematik, 11 materi qawaid,
                           8 percakapan, 6 tantangan berbicara, 3 kuis contoh
js/pages-learn.js          Beranda, Peta Pembelajaran, Materi, Kosakata Bergambar
js/pages-practice.js       Lab Audio, Percakapan, Kamus, Tantangan Berbicara, Progres, Tentang, Privasi
js/pages-games.js          6 permainan
js/pages-quiz.js           Latihan Soal, Ujian Akhir, pengerjaan & pengiriman, Papan Peringkat real-time
js/admin-settings.js       Login guru, kerangka Panel Guru, Pengaturan Supabase + Uji Koneksi
js/admin-content.js        Kelola materi, kosakata, percakapan, kelas, guru & log audit
js/admin-quiz.js           Kelola kuis & soal, kode sesi/peserta, hasil, statistik, CSV, peringkat
supabase/schema.sql        Skema + RLS + fungsi penilaian + Realtime (idempoten)
supabase/seed.sql          Data awal opsional (daftar kelas)
scripts/build-config.mjs   Membuat config.js dari environment variables; menolak secret key
tests/run-tests.mjs        Pengujian otomatis (PostgreSQL tertanam)
vercel.json                Build + header keamanan (CSP, HSTS, dll.)
.env.example               Contoh variabel lingkungan (tanpa secret)
```

---

## 3. Membuat proyek Supabase & menjalankan SQL
1. Buka **supabase.com** → *New project*. Pilih region **Southeast Asia (Singapore)**. Simpan kata sandi database.
2. **Project Settings → Data API**: salin **Project URL**.
3. **Project Settings → API Keys**: salin **Publishable key** (`sb_publishable_…`) — untuk proyek lama gunakan **anon public** (`eyJ…`).
   ⚠️ Jangan pernah menyalin *secret key* / *service_role*.
4. **SQL Editor → New query** → tempel seluruh isi `supabase/schema.sql` → **Run**.
   - Aman dijalankan ulang (tidak ada `DROP TABLE`, tidak menghapus data).
   - Tidak perlu dijalankan setiap membuka website — cukup sekali, dan saat ada versi skema baru.
5. (Opsional) jalankan `supabase/seed.sql` untuk kelas awal.
6. **Buat akun administrator**: *Authentication → Users → Add user* (email + kata sandi kuat, centang *Auto confirm*). Lalu di SQL Editor:
   ```sql
   insert into public.teacher_profiles(user_id, full_name, role)
   select id, 'Nama Guru', 'admin' from auth.users where email = 'guru@contoh.sch.id'
   on conflict (user_id) do update set role = 'admin', is_active = true;
   ```
7. **Matikan pendaftaran publik**: *Authentication → Sign In / Providers → Email* → nonaktifkan **Allow new users to sign up**.
8. Realtime: SQL sudah menambahkan `leaderboard_entries` ke publikasi `supabase_realtime`. Periksa di *Database → Publications*.

Guru lain: admin membuat akunnya di Authentication, lalu mendaftarkannya di **Panel Guru → Guru & log**.

---

## 4. Environment variables
| Variabel | Isi | Di mana |
|---|---|---|
| `SUPABASE_URL` | Project URL | Vercel → Settings → Environment Variables (Production & Preview) |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key / anon public key | idem |

Tidak ada variabel rahasia. Skrip build **menghentikan deployment** jika key yang dimasukkan ternyata secret/service_role.

Setelah mengubah variabel → **Redeploy** agar berlaku untuk semua pengunjung.

---

## 5. Menjalankan secara lokal
```bash
cp .env.example .env              # isi URL & publishable key
export $(grep -v '^#' .env | xargs)
npm run dev                       # membuat config.js lalu menyajikan di http://localhost:3000
```
Tanpa Node: isi `config.js` secara manual lalu buka dengan server statis apa pun (mis. ekstensi *Live Server*).
Tanpa konfigurasi sama sekali, website tetap berjalan dalam **mode belajar** (materi, kosakata, audio, permainan, latihan materi) — latihan soal resmi & peringkat menunggu database.

---

## 6. GitHub & Vercel
1. Buat repositori baru di GitHub, unggah semua file (`.env` sudah diabaikan oleh `.gitignore`).
2. Vercel → *Add New → Project* → impor repositori. Framework preset: **Other**. Build command & output sudah diatur di `vercel.json`.
3. Tambahkan `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY` → **Deploy**.
4. Opsional: Supabase → *Authentication → URL Configuration* → isi *Site URL* dengan domain Vercel.

---

## 7. Pengujian setelah deployment (checklist)
1. Buka website → indikator kanan atas: **Database terhubung**.
2. **Panel Guru → Supabase → Uji Koneksi**: semua baris hijau (RLS aktif, data internal terlindungi, Realtime siap).
3. Panel Guru → **Kelas**: tambah kelas. → **Kuis**: *Impor kuis contoh* → buka soal → **Terbitkan**.
4. Dari HP lain (tanpa login): **Latihan Soal** → kerjakan → kirim. Nilai muncul dari server.
5. Buka **Papan Peringkat** di perangkat ketiga sebelum langkah 4 — baris baru muncul otomatis tanpa memuat ulang.
6. Tekan kirim dua kali / muat ulang saat mengirim → tidak ada hasil ganda.
7. Panel Guru → **Hasil & statistik** → filter → **Ekspor CSV**.
8. Coba buka `https://<proyek>.supabase.co/rest/v1/questions?select=*` dengan publishable key → harus **ditolak (permission denied)**.
9. Coba buka `#/guru` di browser tanpa login → diminta login; login dengan akun yang bukan guru → ditolak.

---

## 8. Daftar fitur
### Selesai & berfungsi
- 16 menu, navigasi sidebar (laptop) + bottom nav & drawer (HP), responsif, mendukung keyboard, `prefers-reduced-motion`.
- Teks Arab RTL ter-isolasi per elemen (`lang="ar" dir="rtl"`), halaman tetap LTR; font Naskh dengan tinggi baris yang tidak memotong harakat; tampil benar saat dicetak.
- Peta Pembelajaran kelas X–XII × 6 keterampilan, status belum/sedang/selesai (lokal).
- 21 materi (10 tematik + 11 qawaid) lengkap 15 komponen per materi, navigasi sebelum/berikutnya.
- 105 kosakata berharakat: pencarian, filter kategori & kelas, kartu hafalan, 4 jenis kuis, penanda dipelajari; ikon ilustrasi atau placeholder jelas bila tidak ada gambar yang sesuai.
- Lab Audio: putar, ulangi, perlahan, sembunyikan terjemahan/teks; deteksi dukungan & suara Arab, pesan jika tidak tersedia, dukungan URL rekaman asli.
- 8 percakapan dengan audio, sembunyikan terjemahan, latihan melengkapi, menyusun, memilih respons.
- 6 permainan dengan aturan, skor, umpan balik, pembahasan, ulangi; permainan yang sedang berjalan tersimpan saat muat ulang.
- Latihan soal & ujian: 10 jenis soal (termasuk uraian manual), bobot, durasi, nilai maksimum, KKM, jadwal buka/tutup, batas percobaan, kode sesi, kode peserta, pembahasan opsional, jawaban tersimpan lokal, kirim otomatis saat waktu habis, coba ulang aman saat gagal.
- Papan peringkat publik real-time + fallback polling 30 detik, status koneksi, waktu pembaruan, filter kuis/kelas/periode, aturan seri konsisten.
- Panel Guru: login/logout, kelola materi (tambah/ubah/urutkan/terbitkan/sembunyikan/arsipkan/hapus), kosakata, percakapan, kuis & soal, kelas, guru, hasil (detail jawaban, nilai uraian, ubah nama, hapus), statistik, CSV (aman dari *formula injection*), kelola peringkat, log audit.
- Pengaturan Supabase: panduan, salin SQL, uji koneksi nyata (8 status), tampil/sembunyi key, deteksi secret key, generator `config.js`.
- Kamus Mini, Tantangan Berbicara (timer, contoh, rubrik mandiri, perekaman lokal opsional), Progres Belajar, Kebijakan Privasi.

### Membutuhkan konfigurasi manual
- Membuat proyek Supabase, menjalankan SQL, membuat akun admin, mematikan sign-up (§3).
- Mengisi environment variables di Vercel & deploy (§4, §6).
- Mengisi daftar kelas sesuai rombel, meninjau & menerbitkan kuis.
- Menyesuaikan materi dengan buku ajar/ATP/CP sekolah (materi bawaan = contoh, belum diverifikasi kurikulum).
- (Opsional) mengunggah rekaman audio penutur asli & gambar berlisensi (isi URL di Kelola Kosakata).
- (Opsional) mengisi kontak pengelola pada halaman Kebijakan Privasi.

---

## 9. Pengujian otomatis
```bash
npm install
npm test
```
Menjalankan `schema.sql` di PostgreSQL tertanam dengan tiruan role Supabase lalu menguji **40 skenario**: RLS untuk publik/guru/akun bukan guru, kunci jawaban tidak terkirim, penilaian berbobot, normalisasi harakat, anti-duplikat, token palsu, sesi kedaluwarsa, batas ukuran, batas percobaan, kode sesi & peserta, penilaian uraian, statistik, dan aturan peringkat.

Hasil terakhir saat pengembangan: **40 lulus, 0 gagal**.
Belum diuji: Supabase sungguhan di cloud (Realtime, Auth, rate limit berbasis IP dari header), perangkat fisik Android/iPhone, jaringan lambat. Lakukan checklist §7 setelah deployment.

---

## 10. Dokumentasi keamanan & batasan
**Yang dilindungi**
- Kunci jawaban (`questions.answer_key`) tidak dapat dibaca publik (tanpa GRANT + RLS); soal dikirim ke siswa melalui `start_quiz_session` tanpa kunci, dan kunci/pembahasan hanya dikembalikan **setelah** pengiriman (jika guru mengizinkan).
- Nilai dihitung di `submit_quiz` (server). Browser hanya mengirim jawaban.
- Token sesi 256-bit acak; database hanya menyimpan hash SHA-256.
- Satu sesi = satu hasil (`unique(session_id)` + penguncian baris) → anti-duplikat.
- Batas waktu diperiksa server (toleransi 30 detik jaringan). Kuis nonaktif/ditutup ditolak.
- Rate limit per IP (di-hash) 400 permintaan / 10 menit untuk mulai & kirim; payload jawaban maks. 64 KB.
- Publik tidak dapat INSERT/UPDATE/DELETE pada tabel apa pun; papan peringkat diisi hanya oleh fungsi server.
- Panel Guru: setiap baca/tulis diperiksa RLS `is_teacher()` di database — menyembunyikan tombol bukan satu-satunya perlindungan.
- Output selalu di-escape (template aman) → input berbahaya tidak dieksekusi. CSP melarang skrip inline.
- Tidak ada secret key di frontend, repo, localStorage, maupun Vercel.

**Batasan yang perlu diketahui (tanpa akun siswa)**
- Sistem **tidak dapat menjamin** satu orang hanya mengerjakan satu kali. Batas percobaan tanpa kode peserta dihitung per *nama + kelas* — dapat diakali dengan nama berbeda. Untuk ujian resmi gunakan **kode peserta** per siswa.
- Kode sesi bisa dibagikan antar-siswa; ia hanya membatasi siapa yang tahu kodenya.
- Siswa yang sedang mengerjakan dapat melihat teks soal (tidak ada pengawasan layar/anti-mencontek).
- Rate limit per IP: satu sekolah dengan satu IP publik berbagi kuota 400/10 menit per jenis permintaan; naikkan angka di `_rate_limit(...)` bila perlu.
- Suara otomatis (TTS) bergantung perangkat dan tidak selalu akurat; pelafalan tidak dinilai otomatis.
- Progres lokal tidak tersinkron antarperangkat.
