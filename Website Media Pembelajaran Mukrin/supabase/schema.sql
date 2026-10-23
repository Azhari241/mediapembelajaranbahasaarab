-- =====================================================================
-- ARABIYA EDU — Laboratorium Bahasa Arab Digital
-- Skema basis data Supabase (PostgreSQL) — versi skema: 1
--
-- CARA MENJALANKAN
--   1. Buka Supabase Dashboard → SQL Editor → New query.
--   2. Tempel SELURUH isi file ini, lalu klik "Run".
--   3. File ini AMAN dijalankan ulang (idempoten): tidak ada DROP TABLE,
--      tidak ada penghapusan data. Fungsi & kebijakan akan diperbarui.
--   4. (Opsional) Jalankan supabase/seed.sql untuk kelas & kuis contoh.
--
-- PRINSIP KEAMANAN
--   * Semua tabel memakai Row Level Security (RLS).
--   * Pengunjung publik (role anon) HANYA dapat:
--       - membaca materi/kosakata/percakapan/kelas yang diterbitkan,
--       - membaca papan peringkat (tabel leaderboard_entries),
--       - memanggil fungsi RPC: list_public_quizzes, start_quiz_session,
--         submit_quiz, arabiya_health.
--   * Tabel questions (berisi kunci jawaban), quiz_sessions, quiz_results,
--     participant_codes, teacher_profiles, audit_logs TIDAK dapat dibaca publik.
--   * Penilaian dilakukan di server (fungsi SECURITY DEFINER), bukan browser.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Tabel versi skema
-- ---------------------------------------------------------------------
create table if not exists public.app_meta (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
insert into public.app_meta(key, value) values ('schema_version', '1')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ---------------------------------------------------------------------
-- 1. Guru / administrator
-- ---------------------------------------------------------------------
create table if not exists public.teacher_profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '' check (char_length(full_name) <= 80),
  role       text not null default 'teacher' check (role in ('admin','teacher')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_teacher()
returns boolean language sql stable security definer
set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.teacher_profiles
    where user_id = auth.uid() and is_active
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer
set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.teacher_profiles
    where user_id = auth.uid() and is_active and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- 2. Kelas
-- ---------------------------------------------------------------------
create table if not exists public.classes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (char_length(btrim(name)) between 1 and 40),
  grade_level smallint not null check (grade_level in (10,11,12)),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. Konten pembelajaran
-- ---------------------------------------------------------------------
create table if not exists public.lessons (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  title        text not null check (char_length(title) between 2 and 120),
  title_ar     text not null default '' check (char_length(title_ar) <= 120),
  description  text not null default '' check (char_length(description) <= 600),
  grade_level  smallint not null check (grade_level in (10,11,12)),
  category     text not null default 'tema' check (category in ('tema','qawaid')),
  skill        text not null default 'mufradat'
               check (skill in ('istima','kalam','qiraah','kitabah','mufradat','qawaid')),
  difficulty   text not null default 'mudah' check (difficulty in ('mudah','sedang','sulit')),
  position     integer not null default 0,
  content      jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  is_archived  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists lessons_pub_idx on public.lessons (is_published, grade_level, position);

create table if not exists public.vocabulary (
  id           uuid primary key default gen_random_uuid(),
  arabic       text not null check (char_length(arabic) between 1 and 80),
  latin        text not null default '' check (char_length(latin) <= 80),
  meaning      text not null check (char_length(meaning) between 1 and 120),
  word_type    text not null default '' check (char_length(word_type) <= 40),
  category     text not null default 'umum' check (char_length(category) <= 40),
  grade_level  smallint not null default 10 check (grade_level in (10,11,12)),
  example_ar   text not null default '' check (char_length(example_ar) <= 300),
  example_id   text not null default '' check (char_length(example_id) <= 300),
  image_url    text not null default '' check (image_url = '' or image_url ~ '^https://'),
  audio_url    text not null default '' check (audio_url = '' or audio_url ~ '^https://'),
  icon         text not null default '' check (icon ~ '^[a-z0-9-]{0,40}$'),
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists vocabulary_cat_idx on public.vocabulary (category, grade_level);

create table if not exists public.conversations (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  title        text not null check (char_length(title) between 2 and 120),
  title_ar     text not null default '',
  grade_level  smallint not null default 10 check (grade_level in (10,11,12)),
  position     integer not null default 0,
  lines        jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. Kuis, soal, sesi, hasil
-- ---------------------------------------------------------------------
create table if not exists public.quizzes (
  id                       uuid primary key default gen_random_uuid(),
  lesson_id                uuid references public.lessons(id) on delete set null,
  title                    text not null check (char_length(title) between 2 and 120),
  description              text not null default '' check (char_length(description) <= 600),
  grade_level              smallint not null check (grade_level in (10,11,12)),
  kind                     text not null default 'latihan' check (kind in ('latihan','ujian')),
  duration_seconds         integer check (duration_seconds is null or duration_seconds between 60 and 14400),
  max_attempts             integer check (max_attempts is null or max_attempts between 1 and 50),
  passing_score            numeric(6,2) not null default 75 check (passing_score >= 0),
  max_score                numeric(6,2) not null default 100 check (max_score > 0 and max_score <= 1000),
  require_session_code     boolean not null default false,
  session_code_hash        text,
  require_participant_code boolean not null default false,
  show_on_leaderboard      boolean not null default true,
  show_explanations        boolean not null default true,
  opens_at                 timestamptz,
  closes_at                timestamptz,
  is_published             boolean not null default false,
  is_active                boolean not null default true,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  check (passing_score <= max_score)
);

create table if not exists public.questions (
  id            uuid primary key default gen_random_uuid(),
  quiz_id       uuid not null references public.quizzes(id) on delete cascade,
  question_type text not null check (question_type in
                 ('mcq','true_false','matching','fill_blank','arrange',
                  'choose_meaning','reading','listening','dialog','essay')),
  question_text text not null check (char_length(question_text) between 1 and 1000),
  question_ar   text not null default '' check (char_length(question_ar) <= 1000),
  passage       text not null default '' check (char_length(passage) <= 4000),
  audio_text    text not null default '' check (char_length(audio_text) <= 1000),
  options       jsonb not null default '[]'::jsonb,
  answer_key    jsonb not null default '{}'::jsonb,   -- RAHASIA: tidak pernah dikirim ke publik
  explanation   text not null default '' check (char_length(explanation) <= 2000),
  points        numeric(6,2) not null default 1 check (points > 0 and points <= 100),
  position      integer not null default 0,
  needs_manual  boolean generated always as (question_type = 'essay') stored,
  created_at    timestamptz not null default now()
);
create index if not exists questions_quiz_idx on public.questions (quiz_id, position);

create table if not exists public.participant_codes (
  id         uuid primary key default gen_random_uuid(),
  quiz_id    uuid not null references public.quizzes(id) on delete cascade,
  code_hash  text not null,
  label      text not null default '' check (char_length(label) <= 80),
  used_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (quiz_id, code_hash)
);

create table if not exists public.quiz_sessions (
  id                  uuid primary key default gen_random_uuid(),
  quiz_id             uuid not null references public.quizzes(id) on delete cascade,
  token_hash          text not null,           -- sha256 dari token; token asli hanya dipegang browser peserta
  display_name        text not null,
  name_key            text not null,           -- nama ternormalisasi untuk batas percobaan (best-effort)
  class_id            uuid references public.classes(id) on delete set null,
  consent_public      boolean not null default false,
  participant_code_id uuid references public.participant_codes(id) on delete set null,
  question_ids        uuid[] not null,
  started_at          timestamptz not null default now(),
  expires_at          timestamptz not null,
  submitted_at        timestamptz,
  status              text not null default 'active' check (status in ('active','submitted','expired','void'))
);
create index if not exists quiz_sessions_quiz_idx on public.quiz_sessions (quiz_id, status);

create table if not exists public.quiz_results (
  id                  uuid primary key default gen_random_uuid(),
  quiz_id             uuid not null references public.quizzes(id) on delete cascade,
  session_id          uuid not null unique references public.quiz_sessions(id) on delete cascade,
  display_name        text not null,
  name_key            text not null,
  class_id            uuid references public.classes(id) on delete set null,
  score               numeric(7,2) not null check (score >= 0),
  max_score           numeric(6,2) not null,
  percent             numeric(5,2) not null check (percent between 0 and 100),
  correct_count       integer not null default 0,
  graded_count        integer not null default 0,
  auto_points         numeric(8,2) not null default 0,
  auto_max_points     numeric(8,2) not null default 0,
  manual_points       numeric(8,2),
  manual_max_points   numeric(8,2) not null default 0,
  needs_manual_review boolean not null default false,
  passed              boolean not null default false,
  duration_seconds    integer not null default 0,
  answers             jsonb not null default '{}'::jsonb,
  consent_public      boolean not null default false,
  status              text not null default 'valid' check (status in ('valid','hidden','void')),
  submitted_at        timestamptz not null default now()
);
create index if not exists quiz_results_quiz_idx on public.quiz_results (quiz_id, submitted_at desc);
create index if not exists quiz_results_attempt_idx on public.quiz_results (quiz_id, name_key, class_id);

-- Tabel publik khusus papan peringkat (dipisah dari data internal).
create table if not exists public.leaderboard_entries (
  id               uuid primary key default gen_random_uuid(),
  result_id        uuid not null unique references public.quiz_results(id) on delete cascade,
  quiz_id          uuid not null references public.quizzes(id) on delete cascade,
  quiz_title       text not null,
  display_name     text not null,
  class_name       text not null default '',
  grade_level      smallint,
  score            numeric(7,2) not null,
  max_score        numeric(6,2) not null,
  percent          numeric(5,2) not null,
  duration_seconds integer not null default 0,
  submitted_at     timestamptz not null
);
-- Index pengurutan peringkat: nilai tertinggi, durasi tercepat, kirim lebih awal.
create index if not exists leaderboard_rank_idx
  on public.leaderboard_entries (percent desc, duration_seconds asc, submitted_at asc, id asc);
create index if not exists leaderboard_quiz_idx on public.leaderboard_entries (quiz_id, percent desc);

-- ---------------------------------------------------------------------
-- 5. Audit & rate limit (internal)
-- ---------------------------------------------------------------------
create table if not exists public.audit_logs (
  id         bigint generated always as identity primary key,
  actor_id   uuid,
  action     text not null,
  entity     text not null,
  entity_id  text,
  details    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);

create table if not exists public.rate_limits (
  bucket       text not null,
  window_start timestamptz not null,
  hits         integer not null default 0,
  primary key (bucket, window_start)
);

-- ---------------------------------------------------------------------
-- 6. Fungsi bantu internal
-- ---------------------------------------------------------------------
create or replace function public._touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

do $$
declare t text;
begin
  foreach t in array array['lessons','vocabulary','conversations','quizzes'] loop
    execute format('drop trigger if exists trg_touch_%1$s on public.%1$s', t);
    execute format('create trigger trg_touch_%1$s before update on public.%1$s
                    for each row execute function public._touch_updated_at()', t);
  end loop;
end $$;

create or replace function public._audit()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
declare rid text;
begin
  rid := coalesce(
    case when tg_op = 'DELETE' then to_jsonb(old)->>'id' else to_jsonb(new)->>'id' end,
    case when tg_op = 'DELETE' then to_jsonb(old)->>'user_id' else to_jsonb(new)->>'user_id' end);
  insert into public.audit_logs(actor_id, action, entity, entity_id, details)
  values (auth.uid(), lower(tg_op), tg_table_name, rid,
          jsonb_build_object('title',
            coalesce(case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end->>'title',
                     case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end->>'name', '')));
  return null;
end; $$;

do $$
declare t text;
begin
  foreach t in array array['lessons','vocabulary','conversations','quizzes','questions',
                           'classes','teacher_profiles','participant_codes'] loop
    execute format('drop trigger if exists trg_audit_%1$s on public.%1$s', t);
    execute format('create trigger trg_audit_%1$s after insert or update or delete on public.%1$s
                    for each row execute function public._audit()', t);
  end loop;
end $$;

-- Normalisasi teks jawaban isian: huruf kecil, spasi rapi, harakat & tatwil dihapus,
-- variasi alif disamakan, tanda baca di ujung dihapus.
create or replace function public._norm_text(t text)
returns text language sql immutable as $$
  select btrim(regexp_replace(
           regexp_replace(
             regexp_replace(
               regexp_replace(lower(coalesce(t,'')), '[\u064B-\u0652\u0670\u0640]', '', 'g'),
             '[\u0622\u0623\u0625\u0671]', '\u0627', 'g'),
           '[\s]+', ' ', 'g'),
         '[\s\.,!\?\u060C\u061F\u061B]+$', '', 'g'));
$$;

create or replace function public._norm_name(t text)
returns text language sql immutable as $$
  select regexp_replace(btrim(coalesce(t,'')), '\s+', ' ', 'g');
$$;

create or replace function public._hash(t text)
returns text language sql immutable as $$
  select encode(sha256(convert_to(t, 'UTF8')), 'hex');
$$;

create or replace function public._client_ip()
returns text language plpgsql stable as $$
declare h json; ip text;
begin
  begin
    h := nullif(current_setting('request.headers', true), '')::json;
  exception when others then h := null;
  end;
  ip := coalesce(h->>'cf-connecting-ip', split_part(coalesce(h->>'x-forwarded-for',''), ',', 1));
  return coalesce(nullif(btrim(ip), ''), 'unknown');
end; $$;

-- Batas permintaan per alamat IP (di-hash, tidak disimpan mentah).
create or replace function public._rate_limit(p_bucket text, p_max integer, p_window_seconds integer)
returns void language plpgsql security definer
set search_path = public, pg_temp as $$
declare
  w timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  k text := p_bucket || ':' || left(public._hash('ae-salt:' || public._client_ip()), 24);
  n integer;
begin
  insert into public.rate_limits(bucket, window_start, hits) values (k, w, 1)
  on conflict (bucket, window_start) do update set hits = public.rate_limits.hits + 1
  returning hits into n;
  if n > p_max then
    raise exception 'AE_RATE_LIMIT' using errcode = 'P0001';
  end if;
  -- bersihkan jendela lama sesekali
  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;
end; $$;

-- Penilaian satu soal. Mengembalikan true/false, atau NULL untuk soal manual (essay).
create or replace function public._grade_question(p_type text, p_key jsonb, p_answer jsonb)
returns boolean language plpgsql immutable as $$
declare
  acc jsonb; a text; k text; v text;
begin
  if p_type = 'essay' then return null; end if;
  if p_answer is null or p_answer = 'null'::jsonb then return false; end if;

  if p_type in ('mcq','choose_meaning','reading','listening','dialog') then
    return jsonb_typeof(p_answer) = 'string' and (p_answer #>> '{}') = (p_key->>'correct');

  elsif p_type = 'true_false' then
    return jsonb_typeof(p_answer) = 'boolean'
       and (p_answer)::text::boolean = (p_key->>'correct')::boolean;

  elsif p_type = 'fill_blank' then
    if jsonb_typeof(p_answer) <> 'string' then return false; end if;
    a := public._norm_text(p_answer #>> '{}');
    if a = '' then return false; end if;
    for acc in select * from jsonb_array_elements(coalesce(p_key->'accepted','[]'::jsonb)) loop
      if public._norm_text(acc #>> '{}') = a then return true; end if;
    end loop;
    return false;

  elsif p_type = 'arrange' then
    return jsonb_typeof(p_answer) = 'array' and p_answer = (p_key->'order');

  elsif p_type = 'matching' then
    if jsonb_typeof(p_answer) <> 'object' then return false; end if;
    if (select count(*) from jsonb_object_keys(p_key->'pairs'))
       <> (select count(*) from jsonb_object_keys(p_answer)) then return false; end if;
    for k, v in select * from jsonb_each_text(p_key->'pairs') loop
      if coalesce(p_answer->>k, '') <> v then return false; end if;
    end loop;
    return true;
  end if;
  return false;
end; $$;

-- ---------------------------------------------------------------------
-- 7. RPC PUBLIK
-- ---------------------------------------------------------------------

-- Pemeriksaan kesehatan untuk tombol "Uji Koneksi" (tidak membuka data sensitif).
create or replace function public.arabiya_health()
returns jsonb language sql stable security definer
set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'ok', true,
    'schema_version', (select value from public.app_meta where key = 'schema_version'),
    'realtime_leaderboard', exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public'
         and tablename = 'leaderboard_entries'),
    'rls_ok', not exists (
       select 1 from pg_tables
       where schemaname = 'public' and rowsecurity = false
         and tablename in ('questions','quiz_sessions','quiz_results','participant_codes',
                           'teacher_profiles','audit_logs','quizzes','leaderboard_entries',
                           'lessons','vocabulary','conversations','classes','rate_limits','app_meta')),
    'server_time', now()
  );
$$;

-- Daftar kuis yang diterbitkan (tanpa kunci jawaban / hash kode).
create or replace function public.list_public_quizzes()
returns table (
  id uuid, title text, description text, grade_level smallint, kind text,
  lesson_id uuid, duration_seconds integer, max_attempts integer,
  passing_score numeric, max_score numeric, require_session_code boolean,
  require_participant_code boolean, show_on_leaderboard boolean,
  opens_at timestamptz, closes_at timestamptz, question_count bigint, has_manual boolean
) language sql stable security definer
set search_path = public, pg_temp as $$
  select q.id, q.title, q.description, q.grade_level, q.kind, q.lesson_id,
         q.duration_seconds, q.max_attempts, q.passing_score, q.max_score,
         q.require_session_code, q.require_participant_code, q.show_on_leaderboard,
         q.opens_at, q.closes_at,
         (select count(*) from public.questions s where s.quiz_id = q.id),
         exists (select 1 from public.questions s where s.quiz_id = q.id and s.question_type = 'essay')
  from public.quizzes q
  where q.is_published and q.is_active
  order by q.grade_level, q.kind, q.title;
$$;

-- Memulai sesi pengerjaan. Mengembalikan token (sekali) + soal TANPA kunci jawaban.
create or replace function public.start_quiz_session(
  p_quiz_id uuid,
  p_display_name text,
  p_class_id uuid,
  p_consent_public boolean default false,
  p_session_code text default null,
  p_participant_code text default null
) returns jsonb language plpgsql volatile security definer
set search_path = public, pg_temp as $$
declare
  q public.quizzes%rowtype;
  v_name text := public._norm_name(p_display_name);
  v_key text;
  v_pc public.participant_codes%rowtype;
  v_token text;
  v_sid uuid;
  v_qids uuid[];
  v_expires timestamptz;
  v_attempts integer;
  v_questions jsonb;
begin
  perform public._rate_limit('start', 400, 600);

  select * into q from public.quizzes where id = p_quiz_id;
  if not found or not q.is_published then raise exception 'AE_QUIZ_NOT_FOUND' using errcode='P0001'; end if;
  if not q.is_active then raise exception 'AE_QUIZ_INACTIVE' using errcode='P0001'; end if;
  if q.opens_at is not null and now() < q.opens_at then raise exception 'AE_QUIZ_NOT_OPEN' using errcode='P0001'; end if;
  if q.closes_at is not null and now() > q.closes_at then raise exception 'AE_QUIZ_CLOSED' using errcode='P0001'; end if;

  -- Validasi nama tampilan
  if char_length(v_name) < 2 or char_length(v_name) > 40
     or v_name ~ '[<>{}\[\]\\/"`;=&$#@%^*+|~:]' or v_name ~ '[[:cntrl:]]' or v_name ~ '^[0-9 .''-]+$' then
    raise exception 'AE_INVALID_NAME' using errcode='P0001';
  end if;
  v_key := lower(v_name);

  -- Validasi kelas
  if p_class_id is null or not exists (select 1 from public.classes where id = p_class_id and is_active) then
    raise exception 'AE_INVALID_CLASS' using errcode='P0001';
  end if;

  -- Kode sesi dari guru
  if q.require_session_code then
    if p_session_code is null or q.session_code_hash is null
       or public._hash(q.id::text || ':' || upper(btrim(p_session_code))) <> q.session_code_hash then
      raise exception 'AE_INVALID_SESSION_CODE' using errcode='P0001';
    end if;
  end if;

  -- Kode peserta (opsional, untuk ujian resmi)
  if q.require_participant_code then
    select * into v_pc from public.participant_codes
     where quiz_id = q.id and code_hash = public._hash(q.id::text || ':' || upper(btrim(coalesce(p_participant_code,''))))
     for update;
    if not found then raise exception 'AE_INVALID_PARTICIPANT_CODE' using errcode='P0001'; end if;
    if v_pc.used_count >= coalesce(q.max_attempts, 1) then
      raise exception 'AE_ATTEMPTS_EXCEEDED' using errcode='P0001';
    end if;
  elsif q.max_attempts is not null then
    -- Batas percobaan best-effort berdasarkan nama + kelas (bukan jaminan identitas).
    select count(*) into v_attempts from public.quiz_results
     where quiz_id = q.id and name_key = v_key and class_id = p_class_id and status <> 'void';
    if v_attempts >= q.max_attempts then raise exception 'AE_ATTEMPTS_EXCEEDED' using errcode='P0001'; end if;
  end if;

  select array_agg(id order by position, created_at) into v_qids
    from public.questions where quiz_id = q.id;
  if v_qids is null or array_length(v_qids, 1) = 0 then
    raise exception 'AE_NO_QUESTIONS' using errcode='P0001';
  end if;

  v_token := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  v_expires := now() + make_interval(secs => coalesce(q.duration_seconds, 3 * 3600));

  insert into public.quiz_sessions(quiz_id, token_hash, display_name, name_key, class_id,
                                   consent_public, participant_code_id, question_ids, expires_at)
  values (q.id, public._hash(v_token), v_name, v_key, p_class_id,
          coalesce(p_consent_public, false), v_pc.id, v_qids, v_expires)
  returning id into v_sid;

  -- Soal tanpa answer_key & explanation. Token susun kata diacak di server.
  select jsonb_agg(jsonb_build_object(
           'id', s.id, 'type', s.question_type, 'text', s.question_text,
           'ar', s.question_ar, 'passage', s.passage, 'audio_text', s.audio_text,
           'points', s.points, 'manual', s.needs_manual,
           'options', case
              when s.question_type = 'arrange' then
                jsonb_build_object('tokens', coalesce((select jsonb_agg(t order by random())
                                     from jsonb_array_elements(s.options->'tokens') t), '[]'::jsonb))
              when s.question_type = 'matching' then
                jsonb_build_object('left', s.options->'left',
                  'right', coalesce((select jsonb_agg(t order by random())
                                     from jsonb_array_elements(s.options->'right') t), '[]'::jsonb))
              else s.options end
         ) order by s.position, s.created_at)
    into v_questions
    from public.questions s where s.quiz_id = q.id;

  return jsonb_build_object(
    'session_id', v_sid, 'token', v_token,
    'started_at', now(), 'expires_at', v_expires, 'server_time', now(),
    'duration_seconds', q.duration_seconds,
    'quiz', jsonb_build_object('id', q.id, 'title', q.title, 'kind', q.kind,
              'max_score', q.max_score, 'passing_score', q.passing_score),
    'questions', v_questions);
end; $$;

-- Mengumpulkan jawaban. Dinilai di server. Idempoten: pengiriman ulang
-- untuk sesi yang sama mengembalikan hasil yang sama, tidak membuat duplikat.
create or replace function public.submit_quiz(
  p_session_id uuid,
  p_token text,
  p_answers jsonb
) returns jsonb language plpgsql volatile security definer
set search_path = public, pg_temp as $$
declare
  s public.quiz_sessions%rowtype;
  q public.quizzes%rowtype;
  r public.quiz_results%rowtype;
  qs record;
  v_ok boolean;
  v_auto numeric := 0; v_auto_max numeric := 0; v_man_max numeric := 0;
  v_correct integer := 0; v_graded integer := 0;
  v_manual boolean := false;
  v_percent numeric; v_score numeric;
  v_review jsonb := '[]'::jsonb;
  v_class text; v_grade smallint;
  v_now timestamptz := now();
  v_onboard boolean := false;
begin
  perform public._rate_limit('submit', 400, 600);

  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'AE_INVALID_ANSWERS' using errcode='P0001';
  end if;
  if octet_length(p_answers::text) > 65536 then
    raise exception 'AE_PAYLOAD_TOO_LARGE' using errcode='P0001';
  end if;

  select * into s from public.quiz_sessions where id = p_session_id for update;
  if not found or p_token is null or public._hash(p_token) <> s.token_hash then
    raise exception 'AE_INVALID_SESSION' using errcode='P0001';
  end if;
  select * into q from public.quizzes where id = s.quiz_id;

  -- Pengiriman ganda → kembalikan hasil yang sudah ada.
  if s.status = 'submitted' then
    select * into r from public.quiz_results where session_id = s.id;
    return jsonb_build_object('result_id', r.id, 'duplicate', true,
      'score', r.score, 'max_score', r.max_score, 'percent', r.percent, 'passed', r.passed,
      'correct_count', r.correct_count, 'graded_count', r.graded_count,
      'needs_manual_review', r.needs_manual_review, 'duration_seconds', r.duration_seconds,
      'on_leaderboard', exists(select 1 from public.leaderboard_entries where result_id = r.id),
      'review', null);
  end if;
  if s.status <> 'active' then raise exception 'AE_SESSION_CLOSED' using errcode='P0001'; end if;

  -- Toleransi 30 detik untuk jeda jaringan.
  if v_now > s.expires_at + interval '30 seconds' then
    update public.quiz_sessions set status = 'expired' where id = s.id;
    raise exception 'AE_SESSION_EXPIRED' using errcode='P0001';
  end if;
  if not q.is_active then raise exception 'AE_QUIZ_INACTIVE' using errcode='P0001'; end if;

  for qs in select * from public.questions where id = any(s.question_ids) order by position, created_at loop
    v_ok := public._grade_question(qs.question_type, qs.answer_key, p_answers -> qs.id::text);
    if qs.question_type = 'essay' then
      v_manual := true; v_man_max := v_man_max + qs.points;
    else
      v_graded := v_graded + 1; v_auto_max := v_auto_max + qs.points;
      if v_ok then v_correct := v_correct + 1; v_auto := v_auto + qs.points; end if;
    end if;
    if q.show_explanations then
      v_review := v_review || jsonb_build_object(
        'question_id', qs.id, 'correct', v_ok, 'answer_key', qs.answer_key,
        'explanation', qs.explanation, 'points', qs.points);
    end if;
  end loop;

  if v_auto_max > 0 then
    v_percent := round(v_auto / v_auto_max * 100, 2);
  else
    v_percent := 0;
  end if;
  v_score := round(v_percent / 100 * q.max_score, 2);

  insert into public.quiz_results(quiz_id, session_id, display_name, name_key, class_id,
     score, max_score, percent, correct_count, graded_count, auto_points, auto_max_points,
     manual_max_points, needs_manual_review, passed, duration_seconds, answers,
     consent_public, submitted_at)
  values (q.id, s.id, s.display_name, s.name_key, s.class_id,
     v_score, q.max_score, v_percent, v_correct, v_graded, v_auto, v_auto_max,
     v_man_max, v_manual, (not v_manual and v_score >= q.passing_score),
     greatest(0, least(extract(epoch from (v_now - s.started_at))::integer,
                       coalesce(q.duration_seconds, 3*3600))),
     p_answers, s.consent_public, v_now)
  returning * into r;

  update public.quiz_sessions set status = 'submitted', submitted_at = v_now where id = s.id;
  if s.participant_code_id is not null then
    update public.participant_codes set used_count = used_count + 1 where id = s.participant_code_id;
  end if;

  -- Masuk papan peringkat hanya jika peserta setuju, kuis mengizinkan, dan nilai final.
  if s.consent_public and q.show_on_leaderboard and not v_manual then
    select c.name, c.grade_level into v_class, v_grade from public.classes c where c.id = s.class_id;
    insert into public.leaderboard_entries(result_id, quiz_id, quiz_title, display_name, class_name,
       grade_level, score, max_score, percent, duration_seconds, submitted_at)
    values (r.id, q.id, q.title, r.display_name, coalesce(v_class,''), v_grade,
       r.score, r.max_score, r.percent, r.duration_seconds, r.submitted_at);
    v_onboard := true;
  end if;

  return jsonb_build_object('result_id', r.id, 'duplicate', false,
    'score', r.score, 'max_score', r.max_score, 'percent', r.percent, 'passed', r.passed,
    'passing_score', q.passing_score,
    'correct_count', r.correct_count, 'graded_count', r.graded_count,
    'needs_manual_review', r.needs_manual_review, 'duration_seconds', r.duration_seconds,
    'on_leaderboard', v_onboard,
    'review', case when q.show_explanations then v_review else null end);
end; $$;

-- ---------------------------------------------------------------------
-- 8. RPC GURU (memeriksa is_teacher()/is_admin() di server)
-- ---------------------------------------------------------------------
create or replace function public.set_quiz_session_code(p_quiz_id uuid, p_code text)
returns void language plpgsql security definer
set search_path = public, pg_temp as $$
begin
  if not public.is_teacher() then raise exception 'AE_FORBIDDEN' using errcode='P0001'; end if;
  if p_code is null or btrim(p_code) = '' then
    update public.quizzes set session_code_hash = null, require_session_code = false where id = p_quiz_id;
  else
    if char_length(btrim(p_code)) < 4 or char_length(btrim(p_code)) > 20 then
      raise exception 'AE_INVALID_CODE' using errcode='P0001';
    end if;
    update public.quizzes
       set session_code_hash = public._hash(p_quiz_id::text || ':' || upper(btrim(p_code))),
           require_session_code = true
     where id = p_quiz_id;
  end if;
end; $$;

-- Membuat kode peserta acak. Kode asli hanya dikembalikan SEKALI ini (simpan/cetak).
create or replace function public.generate_participant_codes(p_quiz_id uuid, p_count integer, p_prefix text default '')
returns table (code text) language plpgsql security definer
set search_path = public, pg_temp as $$
declare i integer; c text; alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; j integer;
begin
  if not public.is_teacher() then raise exception 'AE_FORBIDDEN' using errcode='P0001'; end if;
  if p_count < 1 or p_count > 200 then raise exception 'AE_INVALID_COUNT' using errcode='P0001'; end if;
  for i in 1..p_count loop
    loop
      c := '';
      for j in 1..8 loop
        c := c || substr(alphabet, 1 + (('x' || substr(replace(gen_random_uuid()::text,'-',''), 1, 8))::bit(32)::bigint % 32)::int, 1);
      end loop;
      exit when not exists (select 1 from public.participant_codes
                            where quiz_id = p_quiz_id and code_hash = public._hash(p_quiz_id::text || ':' || c));
    end loop;
    insert into public.participant_codes(quiz_id, code_hash, label)
    values (p_quiz_id, public._hash(p_quiz_id::text || ':' || c), left(coalesce(p_prefix,''), 80));
    code := c; return next;
  end loop;
  update public.quizzes set require_participant_code = true where id = p_quiz_id;
end; $$;

-- Menampilkan/menyembunyikan hasil dari papan peringkat.
create or replace function public.set_result_visibility(p_result_id uuid, p_visible boolean)
returns void language plpgsql security definer
set search_path = public, pg_temp as $$
declare r public.quiz_results%rowtype; q public.quizzes%rowtype; c record;
begin
  if not public.is_teacher() then raise exception 'AE_FORBIDDEN' using errcode='P0001'; end if;
  select * into r from public.quiz_results where id = p_result_id;
  if not found then raise exception 'AE_NOT_FOUND' using errcode='P0001'; end if;
  if not p_visible then
    delete from public.leaderboard_entries where result_id = r.id;
    update public.quiz_results set status = 'hidden' where id = r.id and status = 'valid';
  else
    if not r.consent_public then raise exception 'AE_NO_CONSENT' using errcode='P0001'; end if;
    if r.needs_manual_review then raise exception 'AE_NEEDS_REVIEW' using errcode='P0001'; end if;
    select * into q from public.quizzes where id = r.quiz_id;
    select name, grade_level into c from public.classes where id = r.class_id;
    insert into public.leaderboard_entries(result_id, quiz_id, quiz_title, display_name, class_name,
       grade_level, score, max_score, percent, duration_seconds, submitted_at)
    values (r.id, r.quiz_id, q.title, r.display_name, coalesce(c.name,''), c.grade_level,
       r.score, r.max_score, r.percent, r.duration_seconds, r.submitted_at)
    on conflict (result_id) do update set display_name = excluded.display_name,
       score = excluded.score, percent = excluded.percent;
    update public.quiz_results set status = 'valid' where id = r.id;
  end if;
  insert into public.audit_logs(actor_id, action, entity, entity_id, details)
  values (auth.uid(), case when p_visible then 'show' else 'hide' end, 'leaderboard', r.id::text, '{}'::jsonb);
end; $$;

-- Memperbaiki nama tampilan yang keliru / tidak pantas.
create or replace function public.rename_result(p_result_id uuid, p_name text)
returns void language plpgsql security definer
set search_path = public, pg_temp as $$
declare v text := public._norm_name(p_name);
begin
  if not public.is_teacher() then raise exception 'AE_FORBIDDEN' using errcode='P0001'; end if;
  if char_length(v) < 2 or char_length(v) > 40 or v ~ '[<>{}\[\]\\/"`;=&$#@%^*+|~:]' then
    raise exception 'AE_INVALID_NAME' using errcode='P0001';
  end if;
  update public.quiz_results set display_name = v, name_key = lower(v) where id = p_result_id;
  update public.leaderboard_entries set display_name = v where result_id = p_result_id;
  insert into public.audit_logs(actor_id, action, entity, entity_id, details)
  values (auth.uid(), 'rename', 'quiz_results', p_result_id::text, '{}'::jsonb);
end; $$;

-- Nilai soal uraian (manual) → nilai akhir dihitung ulang di server.
create or replace function public.grade_manual(p_result_id uuid, p_manual_points numeric)
returns jsonb language plpgsql security definer
set search_path = public, pg_temp as $$
declare r public.quiz_results%rowtype; q public.quizzes%rowtype; v_pct numeric; v_score numeric; c record;
begin
  if not public.is_teacher() then raise exception 'AE_FORBIDDEN' using errcode='P0001'; end if;
  select * into r from public.quiz_results where id = p_result_id for update;
  if not found then raise exception 'AE_NOT_FOUND' using errcode='P0001'; end if;
  if p_manual_points < 0 or p_manual_points > r.manual_max_points then
    raise exception 'AE_INVALID_POINTS' using errcode='P0001';
  end if;
  select * into q from public.quizzes where id = r.quiz_id;
  v_pct := round((r.auto_points + p_manual_points) / nullif(r.auto_max_points + r.manual_max_points, 0) * 100, 2);
  v_score := round(coalesce(v_pct,0) / 100 * r.max_score, 2);
  update public.quiz_results
     set manual_points = p_manual_points, needs_manual_review = false,
         percent = coalesce(v_pct,0), score = v_score, passed = v_score >= q.passing_score
   where id = r.id returning * into r;
  if r.consent_public and q.show_on_leaderboard and r.status = 'valid' then
    select name, grade_level into c from public.classes where id = r.class_id;
    insert into public.leaderboard_entries(result_id, quiz_id, quiz_title, display_name, class_name,
       grade_level, score, max_score, percent, duration_seconds, submitted_at)
    values (r.id, r.quiz_id, q.title, r.display_name, coalesce(c.name,''), c.grade_level,
       r.score, r.max_score, r.percent, r.duration_seconds, r.submitted_at)
    on conflict (result_id) do update set score = excluded.score, percent = excluded.percent;
  end if;
  insert into public.audit_logs(actor_id, action, entity, entity_id, details)
  values (auth.uid(), 'grade_manual', 'quiz_results', r.id::text, jsonb_build_object('points', p_manual_points));
  return jsonb_build_object('score', r.score, 'percent', r.percent, 'passed', r.passed);
end; $$;

-- Statistik nilai (dihitung dari database, tanpa data contoh).
create or replace function public.teacher_result_stats(
  p_quiz_id uuid default null, p_class_id uuid default null,
  p_from timestamptz default null, p_to timestamptz default null)
returns jsonb language plpgsql stable security definer
set search_path = public, pg_temp as $$
declare out jsonb;
begin
  if not public.is_teacher() then raise exception 'AE_FORBIDDEN' using errcode='P0001'; end if;
  with f as (
    select r.*, q.passing_score from public.quiz_results r join public.quizzes q on q.id = r.quiz_id
    where r.status <> 'void'
      and (p_quiz_id is null or r.quiz_id = p_quiz_id)
      and (p_class_id is null or r.class_id = p_class_id)
      and (p_from is null or r.submitted_at >= p_from)
      and (p_to is null or r.submitted_at < p_to)
  )
  select jsonb_build_object(
    'count', (select count(*) from f),
    'avg_percent', (select round(avg(percent),2) from f),
    'max_percent', (select max(percent) from f),
    'min_percent', (select min(percent) from f),
    'passed', (select count(*) from f where passed),
    'pending_review', (select count(*) from f where needs_manual_review),
    'distribution', (select jsonb_agg(jsonb_build_object('bucket', b, 'n',
                        (select count(*) from f where least(floor(percent/10),9) = b)) order by b)
                     from generate_series(0,9) b),
    'by_class', (select coalesce(jsonb_agg(x order by x->>'name'), '[]'::jsonb) from (
                   select jsonb_build_object('name', coalesce(c.name,'(tanpa kelas)'), 'n', count(*),
                          'avg', round(avg(f.percent),2)) x
                   from f left join public.classes c on c.id = f.class_id group by c.name) t),
    'by_quiz', (select coalesce(jsonb_agg(x order by x->>'title'), '[]'::jsonb) from (
                   select jsonb_build_object('title', q.title, 'n', count(*), 'avg', round(avg(f.percent),2),
                          'passed', count(*) filter (where f.passed)) x
                   from f join public.quizzes q on q.id = f.quiz_id group by q.title) t),
    'by_week', (select coalesce(jsonb_agg(x order by x->>'week'), '[]'::jsonb) from (
                   select jsonb_build_object('week', to_char(date_trunc('week', f.submitted_at), 'YYYY-MM-DD'),
                          'n', count(*), 'avg', round(avg(f.percent),2)) x
                   from f group by date_trunc('week', f.submitted_at)) t)
  ) into out;
  return out;
end; $$;

-- Admin menambahkan guru (akun dibuat dulu di Supabase → Authentication → Users).
create or replace function public.grant_teacher_by_email(p_email text, p_role text default 'teacher', p_name text default '')
returns void language plpgsql security definer
set search_path = public, pg_temp as $$
declare v_uid uuid;
begin
  if not public.is_admin() then raise exception 'AE_FORBIDDEN' using errcode='P0001'; end if;
  if p_role not in ('admin','teacher') then raise exception 'AE_INVALID_ROLE' using errcode='P0001'; end if;
  select id into v_uid from auth.users where lower(email) = lower(btrim(p_email));
  if v_uid is null then raise exception 'AE_USER_NOT_FOUND' using errcode='P0001'; end if;
  insert into public.teacher_profiles(user_id, full_name, role, is_active)
  values (v_uid, left(coalesce(p_name,''),80), p_role, true)
  on conflict (user_id) do update set role = excluded.role, is_active = true,
     full_name = case when excluded.full_name = '' then public.teacher_profiles.full_name else excluded.full_name end;
end; $$;

create or replace function public.list_teachers()
returns table (user_id uuid, email text, full_name text, role text, is_active boolean)
language sql stable security definer set search_path = public, pg_temp as $$
  select t.user_id, u.email::text, t.full_name, t.role, t.is_active
  from public.teacher_profiles t join auth.users u on u.id = t.user_id
  where public.is_admin() order by t.created_at;
$$;

-- ---------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table public.app_meta            enable row level security;
alter table public.teacher_profiles    enable row level security;
alter table public.classes             enable row level security;
alter table public.lessons             enable row level security;
alter table public.vocabulary          enable row level security;
alter table public.conversations       enable row level security;
alter table public.quizzes             enable row level security;
alter table public.questions           enable row level security;
alter table public.participant_codes   enable row level security;
alter table public.quiz_sessions       enable row level security;
alter table public.quiz_results        enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.audit_logs          enable row level security;
alter table public.rate_limits         enable row level security;

-- Hapus kebijakan lama agar skrip dapat dijalankan ulang.
do $$
declare p record;
begin
  for p in select policyname, tablename from pg_policies
           where schemaname = 'public' and policyname like 'ae_%' loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- Konten publik: hanya yang diterbitkan.
create policy ae_classes_read     on public.classes       for select using (is_active or public.is_teacher());
create policy ae_lessons_read     on public.lessons       for select using ((is_published and not is_archived) or public.is_teacher());
create policy ae_vocab_read       on public.vocabulary    for select using (is_published or public.is_teacher());
create policy ae_conv_read        on public.conversations for select using (is_published or public.is_teacher());
create policy ae_leaderboard_read on public.leaderboard_entries for select using (true);
create policy ae_meta_read        on public.app_meta      for select using (true);

-- Guru: kelola konten & kuis.
create policy ae_classes_write  on public.classes       for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy ae_lessons_write  on public.lessons       for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy ae_vocab_write    on public.vocabulary    for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy ae_conv_write     on public.conversations for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy ae_quizzes_all    on public.quizzes       for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy ae_questions_all  on public.questions     for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy ae_pcodes_read    on public.participant_codes for select to authenticated using (public.is_teacher());
create policy ae_pcodes_delete  on public.participant_codes for delete to authenticated using (public.is_teacher());
create policy ae_sessions_read  on public.quiz_sessions for select to authenticated using (public.is_teacher());
create policy ae_results_read   on public.quiz_results  for select to authenticated using (public.is_teacher());
create policy ae_results_update on public.quiz_results  for update to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy ae_results_delete on public.quiz_results  for delete to authenticated using (public.is_teacher());
create policy ae_lb_delete      on public.leaderboard_entries for delete to authenticated using (public.is_teacher());
create policy ae_audit_read     on public.audit_logs    for select to authenticated using (public.is_admin());
create policy ae_teacher_self   on public.teacher_profiles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy ae_teacher_admin  on public.teacher_profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- Tidak ada kebijakan INSERT/UPDATE untuk publik pada quiz_results, quiz_sessions,
-- leaderboard_entries, questions → publik tidak dapat menulis/mengubah nilai.
-- rate_limits tidak memiliki kebijakan sama sekali (hanya fungsi internal).

-- ---------------------------------------------------------------------
-- 10. HAK EKSEKUSI FUNGSI (prinsip akses minimum)
-- ---------------------------------------------------------------------
revoke all on function public._audit() from public;
revoke all on function public._rate_limit(text, integer, integer) from public;
revoke all on function public._grade_question(text, jsonb, jsonb) from public;
revoke all on function public._client_ip() from public;

revoke all on function public.arabiya_health() from public;
revoke all on function public.list_public_quizzes() from public;
revoke all on function public.start_quiz_session(uuid, text, uuid, boolean, text, text) from public;
revoke all on function public.submit_quiz(uuid, text, jsonb) from public;
revoke all on function public.set_quiz_session_code(uuid, text) from public;
revoke all on function public.generate_participant_codes(uuid, integer, text) from public;
revoke all on function public.set_result_visibility(uuid, boolean) from public;
revoke all on function public.rename_result(uuid, text) from public;
revoke all on function public.grade_manual(uuid, numeric) from public;
revoke all on function public.teacher_result_stats(uuid, uuid, timestamptz, timestamptz) from public;
revoke all on function public.grant_teacher_by_email(text, text, text) from public;
revoke all on function public.list_teachers() from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public._audit() from anon, authenticated;
    revoke all on function public._rate_limit(text, integer, integer) from anon, authenticated;
    revoke all on function public._grade_question(text, jsonb, jsonb) from anon, authenticated;
    revoke all on function public._client_ip() from anon, authenticated;
    revoke all on function public.set_quiz_session_code(uuid, text) from anon;
    revoke all on function public.generate_participant_codes(uuid, integer, text) from anon;
    revoke all on function public.set_result_visibility(uuid, boolean) from anon;
    revoke all on function public.rename_result(uuid, text) from anon;
    revoke all on function public.grade_manual(uuid, numeric) from anon;
    revoke all on function public.teacher_result_stats(uuid, uuid, timestamptz, timestamptz) from anon;
    revoke all on function public.grant_teacher_by_email(text, text, text) from anon;
    revoke all on function public.list_teachers() from anon;

    grant execute on function public.arabiya_health() to anon, authenticated;
    grant execute on function public.list_public_quizzes() to anon, authenticated;
    grant execute on function public.start_quiz_session(uuid, text, uuid, boolean, text, text) to anon, authenticated;
    grant execute on function public.submit_quiz(uuid, text, jsonb) to anon, authenticated;
    grant execute on function public.is_teacher() to anon, authenticated;
    grant execute on function public.is_admin() to anon, authenticated;
    grant execute on function public.set_quiz_session_code(uuid, text) to authenticated;
    grant execute on function public.generate_participant_codes(uuid, integer, text) to authenticated;
    grant execute on function public.set_result_visibility(uuid, boolean) to authenticated;
    grant execute on function public.rename_result(uuid, text) to authenticated;
    grant execute on function public.grade_manual(uuid, numeric) to authenticated;
    grant execute on function public.teacher_result_stats(uuid, uuid, timestamptz, timestamptz) to authenticated;
    grant execute on function public.grant_teacher_by_email(text, text, text) to authenticated;
    grant execute on function public.list_teachers() to authenticated;

    -- Lapisan tambahan: publik tidak punya hak tabel pada data internal sama sekali.
    revoke all on public.questions, public.quiz_sessions, public.quiz_results,
                  public.participant_codes, public.audit_logs, public.rate_limits,
                  public.teacher_profiles, public.quizzes from anon;
    revoke insert, update, delete on public.leaderboard_entries, public.lessons, public.vocabulary,
                  public.conversations, public.classes, public.app_meta from anon;
    grant select on public.leaderboard_entries, public.lessons, public.vocabulary,
                  public.conversations, public.classes, public.app_meta to anon;
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 11. REALTIME — hanya tabel papan peringkat (bukan semua tabel)
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables
                     where pubname = 'supabase_realtime' and schemaname = 'public'
                       and tablename = 'leaderboard_entries') then
    alter publication supabase_realtime add table public.leaderboard_entries;
  end if;
end $$;

-- =====================================================================
-- LANGKAH TERAKHIR (manual, sekali saja): jadikan akun Anda administrator.
-- 1) Supabase → Authentication → Users → "Add user" (email + kata sandi kuat).
-- 2) Jalankan (ganti email):
--    insert into public.teacher_profiles(user_id, full_name, role)
--    select id, 'Nama Guru', 'admin' from auth.users where email = 'guru@contoh.sch.id'
--    on conflict (user_id) do update set role = 'admin', is_active = true;
-- 3) Supabase → Authentication → Providers → Email: matikan "Allow new users to sign up".
-- =====================================================================
