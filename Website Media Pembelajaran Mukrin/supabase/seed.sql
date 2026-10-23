-- ARABIYA EDU — data awal OPSIONAL (jalankan setelah schema.sql).
-- Hanya membuat daftar kelas umum. Ubah/ganti sesuai rombel SMA GUPPI Samata.
-- Tidak ada data siswa atau nilai contoh. Kuis contoh dapat diimpor dari Panel Guru → Kuis.
insert into public.classes (name, grade_level) values
  ('X', 10), ('XI', 11), ('XII', 12)
on conflict (name) do nothing;
