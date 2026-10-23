// Membuat config.js dari environment variables saat build (Vercel / lokal).
// Hanya kunci PUBLIK yang boleh dipakai. Build GAGAL jika terdeteksi secret/service_role key.
import { writeFileSync } from 'node:fs';

const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const key = (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

function isSecret(k) {
  if (/^sb_secret_/i.test(k)) return true;
  const p = k.split('.');
  if (p.length === 3) {
    try { return JSON.parse(Buffer.from(p[1], 'base64url').toString()).role === 'service_role'; } catch { return false; }
  }
  return false;
}

if (key && isSecret(key)) {
  console.error('\n[ARABIYA] DITOLAK: SUPABASE_PUBLISHABLE_KEY berisi SECRET / service_role key.');
  console.error('Gunakan publishable key atau anon public key. Segera rotate key yang bocor di dashboard Supabase.\n');
  process.exit(1);
}
if (url && !/^https:\/\//.test(url)) { console.error('[ARABIYA] SUPABASE_URL harus diawali https://'); process.exit(1); }
if (!url || !key) console.warn('[ARABIYA] Peringatan: SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY belum diisi. Website berjalan dalam mode belajar tanpa database.');

const out = `// Dibuat otomatis oleh scripts/build-config.mjs — jangan diedit di server produksi.
window.ARABIYA_CONFIG = {
  supabaseUrl: ${JSON.stringify(url)},
  supabaseKey: ${JSON.stringify(key)}
};
`;
writeFileSync(new URL('../config.js', import.meta.url), out);
console.log('[ARABIYA] config.js dibuat. URL terisi:', !!url, '· key terisi:', !!key);
