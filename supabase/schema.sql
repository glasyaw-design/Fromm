-- 《족보 없는 집》 클라우드 저장 테이블
-- Supabase 대시보드 → SQL Editor 에 붙여 넣고 Run 한다. 여러 번 돌려도 안전하다.

create table if not exists public.saves (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  slot       smallint    not null check (slot between 0 and 3),   -- 0: 자동 저장, 1~3: 직접 저장
  data       jsonb       not null,                                 -- 게임 상태 전체
  year       integer,
  summary    text,
  updated_at timestamptz not null default now(),
  primary key (user_id, slot)
);

-- 행 단위 보안: 각자 자기 저장만 보고 쓸 수 있다
alter table public.saves enable row level security;

drop policy if exists "saves_select_own" on public.saves;
drop policy if exists "saves_insert_own" on public.saves;
drop policy if exists "saves_update_own" on public.saves;
drop policy if exists "saves_delete_own" on public.saves;

create policy "saves_select_own" on public.saves
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "saves_insert_own" on public.saves
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "saves_update_own" on public.saves
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "saves_delete_own" on public.saves
  for delete to authenticated using ((select auth.uid()) = user_id);
