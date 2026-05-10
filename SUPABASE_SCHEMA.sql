-- Run this in your Supabase SQL editor (Database > SQL Editor)

create table if not exists survey_responses (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null unique,
  answers       jsonb not null,
  raw_scores    jsonb not null,
  normalized_scores jsonb not null,
  archetype_id  text not null,
  completed_at  timestamptz not null,
  user_agent    text,
  referrer      text,
  created_at    timestamptz default now()
);

-- Index for fast archetype analytics
create index if not exists idx_archetype_id on survey_responses (archetype_id);
create index if not exists idx_completed_at on survey_responses (completed_at desc);

-- Row-level security: allow anonymous inserts, no reads from client
alter table survey_responses enable row level security;

create policy "allow_anon_insert" on survey_responses
  for insert to anon with check (true);

-- Analytics view: archetype distribution
create or replace view archetype_stats as
select
  archetype_id,
  count(*) as total,
  round(count(*) * 100.0 / sum(count(*)) over (), 1) as pct
from survey_responses
group by archetype_id
order by total desc;

-- Analytics view: daily completions
create or replace view daily_completions as
select
  date_trunc('day', completed_at) as day,
  count(*) as completions
from survey_responses
group by 1
order by 1 desc;
