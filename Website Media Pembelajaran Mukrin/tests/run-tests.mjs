// ARABIYA EDU — pengujian otomatis.
// Menjalankan supabase/schema.sql di PostgreSQL tertanam (PGlite) dengan tiruan role Supabase
// (anon, authenticated, auth.uid()) lalu menguji: RLS, penilaian server, bobot, anti-duplikat,
// sesi kedaluwarsa, batas percobaan, kode sesi/peserta, validasi input, dan aturan peringkat.
// Jalankan:  npm install  &&  npm test
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) { pass++; console.log('  ✓', name); } else { fail++; console.log('  ✗', name); } };
const denied = async (p) => { try { await p; return false; } catch { return true; } };
const errCode = async (p) => { try { await p; return null; } catch (e) { return (String(e.message).match(/AE_[A-Z_]+|permission denied/) || [e.message])[0]; } };

const db = new PGlite();
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
  grant usage on schema auth to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;
  grant usage on schema public to anon, authenticated;
  create publication supabase_realtime;`);
const schema = readFileSync(new URL('../supabase/schema.sql', import.meta.url), 'utf8');

console.log('\nSkema');
await db.exec(schema); ok(true, 'schema.sql berjalan');
await db.exec(schema); ok(true, 'schema.sql idempoten (dijalankan ulang tanpa error)');
await db.exec(`grant select, insert, update, delete on all tables in schema public to authenticated;`); // seperti default Supabase

const uid = (await db.query(`insert into auth.users(email) values ('guru@contoh.id') returning id`)).rows[0].id;
await db.query(`insert into teacher_profiles(user_id, role) values ($1, 'admin')`, [uid]);
const cid = (await db.query(`insert into classes(name, grade_level) values ('X IPA 1', 10) returning id`)).rows[0].id;
const qid = (await db.query(`insert into quizzes(title, grade_level, is_published, duration_seconds, max_attempts, max_score, passing_score) values ('Uji', 10, true, 600, 2, 100, 75) returning id`)).rows[0].id;
const addQ = async (quiz, type, options, key, points = 1) => (await db.query(`insert into questions(quiz_id, question_type, question_text, options, answer_key, points, position) values ($1,$2,'soal',$3,$4,$5,(select count(*) from questions where quiz_id=$1)) returning id`, [quiz, type, JSON.stringify(options), JSON.stringify(key), points])).rows[0].id;
const q1 = await addQ(qid, 'mcq', [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], { correct: 'b' }, 2);
const q2 = await addQ(qid, 'true_false', [], { correct: true });
const q3 = await addQ(qid, 'fill_blank', [], { accepted: ['مَدْرَسَةٌ'] });
const q4 = await addQ(qid, 'arrange', { tokens: ['أَنَا', 'طَالِبٌ'] }, { order: ['أَنَا', 'طَالِبٌ'] });
const q5 = await addQ(qid, 'matching', { left: [{ id: 'l1', text: 'x' }, { id: 'l2', text: 'y' }], right: [{ id: 'r1', text: '1' }, { id: 'r2', text: '2' }] }, { pairs: { l1: 'r1', l2: 'r2' } });

const asAnon = () => db.exec(`reset role; select set_config('request.jwt.claim.sub','',false); set role anon;`);
const asTeacher = () => db.exec(`reset role; select set_config('request.jwt.claim.sub','${uid}',false); set role authenticated;`);
const asStranger = () => db.exec(`reset role; select set_config('request.jwt.claim.sub','${'00000000-0000-0000-0000-000000000001'}',false); set role authenticated;`);
const start = async (name, consent = true, code = null, pcode = null, quiz = qid) => (await db.query(`select start_quiz_session($1,$2,$3,$4,$5,$6) r`, [quiz, name, cid, consent, code, pcode])).rows[0].r;
const submit = async (s, answers) => (await db.query(`select submit_quiz($1,$2,$3) r`, [s.session_id, s.token, JSON.stringify(answers)])).rows[0].r;

console.log('\nKeamanan publik (role anon)');
await asAnon();
ok(await denied(db.query('select * from questions')), 'publik tidak dapat membaca soal & kunci jawaban');
ok(await denied(db.query('select * from quiz_results')), 'publik tidak dapat membaca hasil internal');
ok(await denied(db.query('select * from quiz_sessions')), 'publik tidak dapat membaca data sesi');
ok(await denied(db.query('select * from participant_codes')), 'publik tidak dapat membaca kode peserta');
ok(await denied(db.query(`insert into leaderboard_entries(result_id,quiz_id,quiz_title,display_name,score,max_score,percent,submitted_at) values (gen_random_uuid(),'${qid}','x','x',100,100,100,now())`)), 'publik tidak dapat menulis papan peringkat');
ok(await denied(db.query(`update quizzes set passing_score = 0`)), 'publik tidak dapat mengubah konfigurasi kuis');
ok(await denied(db.query(`select set_quiz_session_code('${qid}','ABCD')`)), 'publik tidak dapat memanggil fungsi guru');
ok(await denied(db.query(`select teacher_result_stats()`)), 'publik tidak dapat membaca statistik');
ok(await denied(db.query(`select _grade_question('mcq','{}'::jsonb,'"a"'::jsonb)`)), 'fungsi internal tidak dapat dipanggil publik');
const h = (await db.query('select arabiya_health() h')).rows[0].h;
ok(h.ok && h.rls_ok && h.realtime_leaderboard && h.schema_version === '1', 'arabiya_health: RLS aktif & realtime leaderboard terdaftar');

console.log('\nValidasi input');
ok(await errCode(start('<script>')) === 'AE_INVALID_NAME', 'nama berisi HTML ditolak');
ok(await errCode(start('a')) === 'AE_INVALID_NAME', 'nama terlalu pendek ditolak');
ok(await errCode(start('12345')) === 'AE_INVALID_NAME', 'nama tanpa huruf ditolak');
ok(await errCode(db.query(`select start_quiz_session($1,'Budi',gen_random_uuid(),true)`, [qid])) === 'AE_INVALID_CLASS', 'kelas tidak dikenal ditolak');

console.log('\nPenilaian server & bobot');
const s1 = await start('  Mukrim   ');
ok(!JSON.stringify(s1).includes('answer_key') && !JSON.stringify(s1).includes('accepted'), 'soal dikirim TANPA kunci jawaban');
const r1 = await submit(s1, { [q1]: 'b', [q2]: true, [q3]: 'مدرسة', [q4]: ['أَنَا', 'طَالِبٌ'], [q5]: { l1: 'r1', l2: 'r1' } });
// bobot: q1=2 benar, q2=1 benar, q3=1 benar (tanpa harakat), q4=1 benar, q5=1 salah → 5/6
ok(Math.abs(+r1.percent - 83.33) < 0.01 && r1.correct_count === 4 && r1.graded_count === 5, 'nilai berbobot = 5/6 × 100 = 83,33');
ok(r1.on_leaderboard === true, 'hasil dengan persetujuan masuk papan peringkat');
const r1b = await submit(s1, { [q1]: 'b', [q2]: true, [q3]: 'x', [q4]: [], [q5]: {} });
ok(r1b.duplicate === true && +r1b.score === +r1.score, 'pengiriman ulang tidak membuat hasil ganda & tidak mengubah nilai');
ok(await errCode(db.query(`select submit_quiz($1,'tokenpalsu','{}')`, [s1.session_id])) === 'AE_INVALID_SESSION', 'token sesi palsu ditolak');
ok(await errCode(db.query(`select submit_quiz($1,$2,'[]')`, [s1.session_id, s1.token])) === 'AE_INVALID_ANSWERS', 'format jawaban tidak valid ditolak');
const lbRows = (await db.query('select display_name from leaderboard_entries')).rows;
ok(lbRows.length === 1 && lbRows[0].display_name === 'Mukrim', 'nama tampilan dirapikan (spasi berlebih dihapus)');

console.log('\nBatas percobaan, kedaluwarsa, persetujuan');
const s2 = await start('mukrim', false); const r2 = await submit(s2, {});
ok(+r2.percent === 0 && r2.on_leaderboard === false, 'jawaban kosong = 0 & tanpa persetujuan tidak tampil di peringkat');
ok(await errCode(start('MUKRIM')) === 'AE_ATTEMPTS_EXCEEDED', 'batas percobaan (nama+kelas) ditegakkan');
const s3 = await start('Rahmat');
await db.exec('reset role');
await db.query(`update quiz_sessions set started_at = now() - interval '20 minutes', expires_at = now() - interval '5 minutes' where id = $1`, [s3.session_id]);
await asAnon();
ok(await errCode(submit(s3, {})) === 'AE_SESSION_EXPIRED', 'sesi kedaluwarsa ditolak');
await db.exec('reset role');
const big = 'x'.repeat(70000);
await asAnon();
const s4 = await start('Aisyah');
ok(await errCode(submit(s4, { [q3]: big })) === 'AE_PAYLOAD_TOO_LARGE', 'ukuran jawaban dibatasi');

console.log('\nKode sesi & kode peserta');
await asTeacher();
await db.query(`select set_quiz_session_code($1,'kode10a')`, [qid]);
const codes = (await db.query(`select code from generate_participant_codes($1, 2)`, [qid])).rows.map((r) => r.code);
ok(codes.length === 2 && /^[A-Z2-9]{8}$/.test(codes[0]), 'guru membuat kode peserta acak');
await db.exec('reset role'); await db.query(`update quizzes set max_attempts = 1 where id=$1`, [qid]);
await asAnon();
ok(await errCode(start('Budi', true)) === 'AE_INVALID_SESSION_CODE', 'tanpa kode sesi ditolak');
ok(await errCode(start('Budi', true, 'KODE10A', 'SALAH123')) === 'AE_INVALID_PARTICIPANT_CODE', 'kode peserta salah ditolak');
const s5 = await start('Budi', true, ' kode10a ', codes[0].toLowerCase());
await submit(s5, { [q1]: 'b' });
ok(await errCode(start('Nama Lain', true, 'KODE10A', codes[0])) === 'AE_ATTEMPTS_EXCEEDED', 'kode peserta tidak dapat dipakai melebihi batas');

console.log('\nAkses guru');
await asTeacher();
ok((await db.query('select id from quiz_results')).rows.length >= 3, 'guru dapat membaca hasil');
const stats = (await db.query('select teacher_result_stats() s')).rows[0].s;
ok(stats.count >= 3 && Array.isArray(stats.distribution) && stats.distribution.length === 10, 'statistik dihitung dari database');
await asStranger();
ok((await db.query('select id from quiz_results')).rows.length === 0, 'akun login yang BUKAN guru tidak melihat hasil');
ok(await errCode(db.query(`select set_quiz_session_code('${qid}','ABCD')`)) === 'AE_FORBIDDEN', 'akun bukan guru tidak dapat memakai fungsi guru');

console.log('\nSoal uraian (penilaian manual)');
await db.exec('reset role');
const qid2 = (await db.query(`insert into quizzes(title, grade_level, is_published) values ('Uraian', 10, true) returning id`)).rows[0].id;
const e1 = await addQ(qid2, 'mcq', [{ id: 'a', text: 'A' }], { correct: 'a' }, 4);
await addQ(qid2, 'essay', [], {}, 6);
await asAnon();
const s6 = await start('Fatimah', true, null, null, qid2);
const r6 = await submit(s6, { [e1]: 'a' });
ok(r6.needs_manual_review === true && r6.on_leaderboard === false, 'hasil dengan uraian menunggu penilaian & belum tampil');
await asTeacher();
const g = (await db.query(`select grade_manual($1, 3) g`, [r6.result_id])).rows[0].g;
ok(Math.abs(+g.percent - 70) < 0.01, 'nilai akhir dihitung ulang server: (4+3)/10 = 70');
ok((await db.query(`select 1 from leaderboard_entries where result_id=$1`, [r6.result_id])).rows.length === 1, 'setelah dinilai, hasil tampil di peringkat');

console.log('\nAturan peringkat (frontend)');
const ctx = { window: {}, console };
ctx.window.AE = {}; vm.createContext(ctx);
vm.runInContext('var window = this.window; var AE = window.AE;' + readFileSync(new URL('../js/data.js', import.meta.url), 'utf8').replace(/^\(function \(\) \{/, '(function () {'), ctx);
const AEx = ctx.window.AE;
const rows = [
  { id: 'c', percent: 90, duration_seconds: 300, submitted_at: '2026-01-01T10:00:00Z' },
  { id: 'a', percent: 93, duration_seconds: 500, submitted_at: '2026-01-01T10:05:00Z' },
  { id: 'b', percent: 90, duration_seconds: 200, submitted_at: '2026-01-01T10:09:00Z' },
  { id: 'd', percent: 90, duration_seconds: 200, submitted_at: '2026-01-01T10:09:00Z' },
];
const ranked = AEx.rankRows(rows);
ok(ranked.map((r) => r.id).join('') === 'abdc', 'urutan: nilai ↓, durasi ↑, waktu kirim ↑, id');
ok(ranked.map((r) => r.rank).join(',') === '1,2,2,4', 'seri persis mendapat peringkat sama (1,2,2,4)');

console.log(`\n${pass} lulus, ${fail} gagal\n`);
process.exit(fail ? 1 : 0);
