# Qafiyah (قافية)

Open-source. Non-profit. Accessible. Arabic poetry, beautifully archived.

## 📑 Table of Contents

- [📋 Project Overview](#-project-overview)
- [🏗️ Architecture](#️-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📊 Data Statistics](#-data-statistics)
- [🗄️ Data Schema](#️-data-schema)
- [⚡ Performance Optimizations](#-performance-optimizations)
- [🚀 Development Setup](#-development-setup)
- [📚 Terminology](#-terminology)
- [❓ FAQ](#-faq)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 📋 Project Overview

Our main channels:

- **Website**: [qafiyah.com](https://qafiyah.com)
- **API**: [api.qafiyah.com](https://api.qafiyah.com)
- **Random Poem Endpoint**: [api.qafiyah.com/poems/random](https://api.qafiyah.com/poems/random)
- **Twitter**: [@qafiyahdotcom](https://twitter.com/qafiyahdotcom)
- **DB Dumps**: [database_dump.sql](https://github.com/alwalxed/qafiyah/tree/main/.db_dumps)

> **Important**: No need to scrape the website or API. All data is freely available in the [database dumps](https://github.com/alwalxed/qafiyah/tree/main/.db_dumps).

## 🏗️ Architecture

This monorepo contains:

- **Web**: Next.js app running on Cloudflare Pages (Edge)
- **API**: Hono-based Cloudflare Worker
- **Bot**: Twitter bot posting poems every 30 minutes
- **Packages**: Shared Zod schemas, ESLint configs, and TypeScript configs

## 💻 Tech Stack

| Component    | Technologies                                                                 |
| ------------ | ---------------------------------------------------------------------------- |
| **Frontend** | Next.js, React Query, Tailwind CSS, Zustand, Zod                             |
| **Backend**  | Hono, Cloudflare Workers, Zod                                                |
| **Database** | Supabase PostgreSQL with Drizzle ORM                                         |
| **Search**   | AWS EC2 instance with materialized views ([Why is search separated?](#-faq)) |

## 📊 Data Statistics

_Last updated: April 17, 2025_

- 📝 **Total Verses:** 944,844
- 📚 **Total Poems:** 85,342
- 🧑‍🎤 **Unique Poets:** 932
- 🕰️ **Historical Eras:** 10
- 🪶 **Distinct Meters:** 44
- 🎭 **Rhyme Schemes:** 47
- 🎨 **Themes Covered:** 27
- 🧾 **Poem Types:** 3

_For latest data, use our [DB dumps](https://github.com/alwalxed/qafiyah/tree/main/.db_dumps) (updated with every change) instead of scraping._

## 🗄️ Data Schema

### 📚 `poems`

| Column     | Type    | Nullable | Description           |
| ---------- | ------- | -------- | --------------------- |
| id         | integer | NO       | Primary key           |
| title      | text    | NO       | Poem title            |
| meter_id   | integer | NO       | FK to `meters(id)`    |
| num_verses | integer | NO       | Number of verses      |
| theme_id   | integer | NO       | FK to `themes(id)`    |
| poet_id    | integer | NO       | FK to `poets(id)`     |
| filename   | text    | NO       | File source name      |
| slug       | uuid    | NO       | Unique URL identifier |
| content    | text    | NO       | Full poem content     |
| rhyme_id   | integer | YES      | FK to `rhymes(id)`    |
| type_id    | integer | YES      | FK to `types(id)`     |

### 🧑‍🎤 `poets`

| Column | Type    | Nullable | Description          |
| ------ | ------- | -------- | -------------------- |
| id     | integer | NO       | Primary key          |
| name   | text    | NO       | Poet's name          |
| slug   | text    | NO       | URL identifier       |
| era_id | integer | NO       | FK to `eras(id)`     |
| bio    | text    | YES      | Biography (optional) |

### 🕰️ `eras`

| Column | Type    | Nullable | Description    |
| ------ | ------- | -------- | -------------- |
| id     | integer | NO       | Primary key    |
| name   | text    | NO       | Era name       |
| slug   | text    | NO       | URL identifier |

### 🪶 `meters`

| Column | Type    | Nullable | Description    |
| ------ | ------- | -------- | -------------- |
| id     | integer | NO       | Primary key    |
| name   | text    | NO       | Meter name     |
| slug   | text    | NO       | URL identifier |

### 🎭 `rhymes`

| Column  | Type    | Nullable | Description    |
| ------- | ------- | -------- | -------------- |
| id      | integer | NO       | Primary key    |
| pattern | text    | NO       | Rhyme pattern  |
| slug    | uuid    | NO       | URL identifier |

### 🎨 `themes`

| Column | Type    | Nullable | Description    |
| ------ | ------- | -------- | -------------- |
| id     | integer | NO       | Primary key    |
| name   | text    | NO       | Theme name     |
| slug   | uuid    | NO       | URL identifier |

### 📝 `types`

| Column | Type    | Nullable | Description  |
| ------ | ------- | -------- | ------------ |
| id     | integer | NO       | Primary key  |
| name   | text    | NO       | Type of poem |

### 🔁 `poem_cycle`

Used to ensure random verse selection for the Twitter bot's PostgreSQL function

| Column          | Type                        | Nullable | Default                        | Description             |
| --------------- | --------------------------- | -------- | ------------------------------ | ----------------------- |
| id              | integer                     | NO       | `nextval('poem_cycle_id_seq')` | Primary key             |
| remaining_poems | ARRAY                       | YES      |                                | Poems left in the cycle |
| cycle_start     | timestamp without time zone | YES      | `now()`                        | When the cycle started  |

### 🐦 `poem_tweets`

Stores verses to prevent reposting

| Column     | Type                     | Nullable | Default | Description                  |
| ---------- | ------------------------ | -------- | ------- | ---------------------------- |
| id         | bigint                   | NO       |         | Tweet ID                     |
| created_at | timestamp with time zone | NO       | `now()` | When the tweet was posted    |
| content    | character varying        | NO       |         | Tweet content                |
| poem_id    | integer                  | YES      |         | FK to `poems(id)` (optional) |

## ⚡ Performance Optimizations

We rely on materialized views for performance and security. Here are the commands to recreate them:

### Materialized Views @ Supabase

```sql
create materialized view public.era_poems_mv as
select
  p.id as poem_id,
  p.title as poem_title,
  p.slug as poem_slug,
  pt.name as poet_name,
  m.name as meter_name,
  e.id as era_id,
  e.name as era_name,
  e.slug as era_slug,
  count(*) over (
    partition by
      e.id
  ) as total_poems_in_era
from
  poems p
  join poets pt on p.poet_id = pt.id
  join meters m on p.meter_id = m.id
  join eras e on pt.era_id = e.id
order by
  p.id;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.era_stats_mv as
select
  e.id,
  e.name,
  e.slug,
  COALESCE(poet_counts.count, 0::bigint) as poets_count,
  COALESCE(poem_counts.count, 0::bigint) as poems_count
from
  eras e
  left join (
    select
      poets.era_id,
      count(*) as count
    from
      poets
    group by
      poets.era_id
  ) poet_counts on e.id = poet_counts.era_id
  left join (
    select
      p.era_id,
      count(*) as count
    from
      poems pm
      join poets p on pm.poet_id = p.id
    group by
      p.era_id
  ) poem_counts on e.id = poem_counts.era_id;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.meter_poems_mv as
select
  p.id as poem_id,
  p.title as poem_title,
  p.slug as poem_slug,
  pt.name as poet_name,
  m.id as meter_id,
  m.name as meter_name,
  m.slug as meter_slug,
  count(*) over (
    partition by
      m.id
  ) as total_poems_in_meter
from
  poems p
  join poets pt on p.poet_id = pt.id
  join meters m on p.meter_id = m.id
order by
  p.id;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.meter_stats_mv as
select
  m.id,
  m.name,
  m.slug,
  count(distinct p.id) as poems_count,
  count(distinct p.poet_id) as poets_count
from
  meters m
  left join poems p on m.id = p.meter_id
group by
  m.id,
  m.name,
  m.slug;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.poem_full_data_mv as
select
  p.slug,
  p.title,
  p.content,
  po.name as poet_name,
  po.slug as poet_slug,
  m.name as meter_name,
  t.name as theme_name,
  ty.name as type_name,
  e.name as era_name,
  e.slug as era_slug
from
  poems p
  join poets po on p.poet_id = po.id
  join meters m on p.meter_id = m.id
  join themes t on p.theme_id = t.id
  left join types ty on p.type_id = ty.id
  join eras e on po.era_id = e.id;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.poet_poems_mv as
select
  p.id as poem_id,
  p.title as poem_title,
  p.slug as poem_slug,
  pt.id as poet_id,
  pt.name as poet_name,
  pt.slug as poet_slug,
  m.name as meter_name,
  count(*) over (
    partition by
      pt.id
  ) as total_poems_by_poet
from
  poems p
  join poets pt on p.poet_id = pt.id
  join meters m on p.meter_id = m.id
order by
  p.id;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.poet_stats_mv as
select
  p.id,
  p.name,
  p.slug,
  p.era_id,
  count(pm.id) as poems_count
from
  poets p
  left join poems pm on p.id = pm.poet_id
group by
  p.id,
  p.name,
  p.slug,
  p.era_id
order by
  p.name;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.rhyme_poems_mv as
select
  p.id as poem_id,
  p.title as poem_title,
  p.slug as poem_slug,
  r.id as rhyme_id,
  r.pattern as rhyme_pattern,
  r.slug as rhyme_slug,
  m.name as meter_name,
  count(*) over (
    partition by
      r.id
  ) as total_poems_by_rhyme
from
  poems p
  join rhymes r on p.rhyme_id = r.id
  join meters m on p.meter_id = m.id
order by
  p.id;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.rhyme_stats_mv as
select
  r.id,
  r.pattern,
  r.slug,
  count(distinct p.id) as poems_count,
  count(distinct pt.id) as poets_count
from
  rhymes r
  left join poems p on r.id = p.rhyme_id
  left join poets pt on p.poet_id = pt.id
group by
  r.id,
  r.pattern,
  r.slug;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.theme_poems_mv as
select
  p.id as poem_id,
  p.title as poem_title,
  p.slug as poem_slug,
  t.id as theme_id,
  t.name as theme_name,
  t.slug as theme_slug,
  pt.name as poet_name,
  m.name as meter_name,
  count(*) over (
    partition by
      t.id
  ) as total_poems_by_theme
from
  poems p
  join themes t on p.theme_id = t.id
  join poets pt on p.poet_id = pt.id
  join meters m on p.meter_id = m.id
order by
  p.id;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.theme_stats_mv as
select
  t.id,
  t.name,
  t.slug,
  count(distinct p.id) as poems_count,
  count(distinct pt.id) as poets_count
from
  themes t
  left join poems p on t.id = p.theme_id
  left join poets pt on p.poet_id = pt.id
group by
  t.id,
  t.name,
  t.slug;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create materialized view public.top_poets_mv as
select
  p.id,
  p.name,
  p.slug,
  count(pm.id) as poems_count
from
  poets p
  left join poems pm on p.id = pm.poet_id
  left join eras e on p.era_id = e.id
where
  e.name <> 'متأخر'::text
group by
  p.id,
  p.name,
  p.slug
having
  count(pm.id) > 150
order by
  (count(pm.id)) desc;
```

### Materialized Views @ EC2

```sql
create materialized view public.poem_search_view as
select
    p.id as poem_id,
    p.slug as poem_slug,
    p.title as poem_title,
    p.content as poem_content,
    strip_diacritics(p.title) as title_no_diacritics,
    strip_diacritics(p.content) as content_no_diacritics,
    regexp_replace(regexp_replace(p.content, '[^ء-يؐ-ًْٰٓ-ٕ\s\*]'::text, ''::text, 'g'::text), '\n'::text, '*'::text, 'g'::text) as poem_content_clean,
    regexp_replace(regexp_replace(strip_diacritics(p.content), '[^ء-ي\s\*]'::text, ''::text, 'g'::text), '\n'::text, '*'::text, 'g'::text) as poem_content_clean_no_diacritics,
    m.name as poem_meter,
    pt.name as poet_name,
    e.name as poet_era,
    to_tsvector('simple'::regconfig, ((p.title || ' '::text) || p.content)) as content_search_vector,
    to_tsvector('simple'::regconfig, ((strip_diacritics(p.title) || ' '::text) || strip_diacritics(p.content))) as content_search_vector_no_diacritics
from
    poems p
join
    poets pt on pt.id = p.poet_id
join
    meters m on m.id = p.meter_id
join
    eras e on pt.era_id = e.id;
```

### Functions @ Supabase

```sql
create or replace function public.get_a_random_poem()
returns json
language plpgsql
as $function$
declare
    excluded_era_ids int[];
    poem_count int;
    poem_row record;
begin
    -- get era ids to exclude based on slugs
    select array_agg(id) into excluded_era_ids
    from public.eras
    where slug in ('late', 'ottoman');

    if excluded_era_ids is null or array_length(excluded_era_ids, 1) < 2 then
        raise exception 'one or more excluded eras not found.';
    end if;

    -- count eligible poems (whose poets are not from the excluded eras)
    select count(*) into poem_count
    from public.poems p
    join public.poets pt on pt.id = p.poet_id
    where pt.era_id != all (excluded_era_ids);

    if poem_count = 0 then
        return json_build_object('error', 'no eligible poems found');
    end if;

    -- select one random eligible poem
    select p.*, pt.name as poet_name
    into poem_row
    from public.poems p
    join public.poets pt on pt.id = p.poet_id
    where pt.era_id != all (excluded_era_ids)
    order by random()
    limit 1;

    -- return poem info as json
    return json_build_object(
        'poem_id', poem_row.id,
        'poet_name', poem_row.poet_name,
        'content', poem_row.content
    );
end;
$function$;
```

### Functions @ EC2

```sql
create or replace function public.search_poems(
    search_query text,
    page_number integer default 1,
    exact_match boolean default false
)
returns table(
    poet_name text,
    poet_era text,
    poem_title text,
    poem_snippet text,
    poem_meter text,
    poem_slug uuid,
    relevance_score real,
    total_result_count bigint
)
language plpgsql
as $function$
declare
    results_per_page constant integer := 5;
    offset_value integer;
    search_tokens text;
    stripped_query text;
    total_count bigint;
begin
    offset_value := (page_number - 1) * results_per_page;
    stripped_query := strip_diacritics(search_query);

    if exact_match then
        search_tokens := '''' || stripped_query || '''';
    else
        search_tokens := regexp_replace(stripped_query, '\s+', '&', 'g');
    end if;

    begin
        select count(*) into total_count
        from poem_search_view
        where content_search_vector_no_diacritics @@ to_tsquery('simple', search_tokens);
    exception when others then
        total_count := 0;
    end;

    return query
    with matched_poems as (
        select
            p.poem_id,
            p.poet_name,
            p.poet_era,
            p.poem_title,
            p.poem_slug,
            p.poem_meter,
            p.poem_content,
            p.content_no_diacritics,
            ts_rank(p.content_search_vector_no_diacritics, to_tsquery('simple', search_tokens)) as relevance_score
        from poem_search_view p
        where p.content_search_vector_no_diacritics @@ to_tsquery('simple', search_tokens)
        order by relevance_score desc
        limit results_per_page offset offset_value
    ),
    line_extraction as (
        select
            mp.*,
            position(lower(stripped_query) in lower(mp.content_no_diacritics)) as match_pos,
            string_to_array(mp.poem_content, '*') as content_lines,
            string_to_array(mp.content_no_diacritics, '*') as content_lines_no_diacritics
        from matched_poems mp
    ),
    line_identification as (
        select
            le.*,
            (
                select idx
                from unnest(le.content_lines_no_diacritics) with ordinality as t(line, idx)
                where position(lower(stripped_query) in lower(t.line)) > 0
                order by idx
                limit 1
            ) as matching_line_idx
        from line_extraction le
    )
    select
        li.poet_name,
        li.poet_era,
        li.poem_title,
        case
            when li.matching_line_idx is not null then
                coalesce(
                    case when li.matching_line_idx > 1
                         then li.content_lines[li.matching_line_idx - 1] || '*'
                         else '' end,
                    ''
                ) ||
                regexp_replace(
                    li.content_lines[li.matching_line_idx],
                    '(' || regexp_replace(stripped_query, '([^ء-ي\s])', '', 'g') || ')',
                    '<b>\1</b>',
                    'i'
                ) ||
                coalesce(
                    case when li.matching_line_idx < array_length(li.content_lines, 1)
                         then '*' || li.content_lines[li.matching_line_idx + 1]
                         else '' end,
                    ''
                )
            else
                ts_headline(
                    'simple',
                    li.poem_content,
                    to_tsquery('simple', search_tokens),
                    'maxwords=50, minwords=10, maxfragments=1, startsel=<b>, stopsel=</b>'
                )
        end as poem_snippet,
        li.poem_meter,
        li.poem_slug,
        li.relevance_score,
        total_count
    from line_identification li;

exception when others then
    return;
end;
$function$;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
create or replace function public.strip_diacritics(text_with_diacritics text)
returns text
language plpgsql
immutable
as $function$
begin
    return regexp_replace(
        text_with_diacritics,
        '[ًٌٍَُِّْٰٓٔـٕۖۗۘۙۚۛۜۤۥۦۧۨ]',
        '',
        'g'
    );
end;
$function$;
```

### Indexes @ Supabase

```sql
-- indexes on poems table
create index idx_poems_content_tsv
    on public.poems
    using gin (to_tsvector('arabic'::regconfig, substring(content, 1, 1000)));

create index idx_poems_content_tsvector
    on public.poems
    using gin (to_tsvector('arabic'::regconfig, substring(content, 1, 1000)));

create index idx_poems_meter_id
    on public.poems
    using btree (meter_id);

create index idx_poems_poet_id
    on public.poems
    using btree (poet_id);

create index idx_poems_poet_meter
    on public.poems
    using btree (poet_id, meter_id);

create index idx_poems_rhyme_id
    on public.poems
    using btree (rhyme_id);

create index idx_poems_theme_id
    on public.poems
    using btree (theme_id);

create index idx_poems_theme_meter
    on public.poems
    using btree (theme_id, meter_id);

create index idx_poems_title_tsv
    on public.poems
    using gin (to_tsvector('arabic'::regconfig, title));

create index idx_poems_title_tsvector
    on public.poems
    using gin (to_tsvector('arabic'::regconfig, title));

create index idx_poems_type_id
    on public.poems
    using btree (type_id);

-- indexes on poets table
create index idx_poets_era_id
    on public.poets
    using btree (era_id);

create index idx_poets_name_tsv
    on public.poets
    using gin (to_tsvector('arabic'::regconfig, name));

create index idx_poets_name_tsvector
    on public.poets
    using gin (to_tsvector('arabic'::regconfig, name));
```

### Indexes @ EC2

```sql
-- indexes on poems table
create index idx_poems_content_tsv
    on public.poems
    using gin (to_tsvector('arabic'::regconfig, substring(content, 1, 1000)));

create index idx_poems_content_tsvector
    on public.poems
    using gin (to_tsvector('arabic'::regconfig, substring(content, 1, 1000)));

create index idx_poems_meter_id
    on public.poems
    using btree (meter_id);

create index idx_poems_poet_id
    on public.poems
    using btree (poet_id);

create index idx_poems_poet_meter
    on public.poems
    using btree (poet_id, meter_id);

create index idx_poems_rhyme_id
    on public.poems
    using btree (rhyme_id);

create index idx_poems_theme_id
    on public.poems
    using btree (theme_id);

create index idx_poems_theme_meter
    on public.poems
    using btree (theme_id, meter_id);

create index idx_poems_title_tsv
    on public.poems
    using gin (to_tsvector('arabic'::regconfig, title));

create index idx_poems_title_tsvector
    on public.poems
    using gin (to_tsvector('arabic'::regconfig, title));

create index idx_poems_type_id
    on public.poems
    using btree (type_id);

-- indexes on poets table
create index idx_poets_era_id
    on public.poets
    using btree (era_id);

create index idx_poets_name_tsv
    on public.poets
    using gin (to_tsvector('arabic'::regconfig, name));

create index idx_poets_name_tsvector
    on public.poets
    using gin (to_tsvector('arabic'::regconfig, name));
```

## 🚀 Development Setup

```bash
# 1. Create environment variables file for Cloudflare Worker
touch ./apps/api/.dev.vars

# 2. Set up your database connections
Add DATABASE_URL and SEARCH_DATABASE_URL to your .dev.vars file

# 3. Import database dump
Download and restore from https://github.com/alwalxed/qafiyah/tree/main/.db_dumps

# 4. Recreate views and functions
Run the materialized views and functions SQL from the Performance Optimizations section

# 5. Install dependencies
pnpm install

# 6. Start development server
pnpm dev

# 7. Build for production
pnpm build
```

## 📚 Terminology

- **Meter (بحر)**: Rhythmic pattern of syllables that structures a poem. Arabic poetry has 16 classical meters.
- **Rhyme (قافية)**: Repeating sound pattern at the end of verses, based on the final letter and vowel patterns.
- **Verse (بيت)**: Single line of poetry, typically composed of two hemistichs in classical Arabic poetry.

## ❓ FAQ

### Why is the search endpoint separated from the main API?

We moved search to AWS EC2 because Supabase's free tier couldn't handle our specialized Arabic text search requirements. This separation lets us:

- Keep the main API within Supabase's free tier limits
- Optimize Arabic text search with dedicated resources
- Scale search independently from other API functions
- Maintain Supabase's benefits (free unlimited API calls) for non-search operations

## 🤝 Contributing

Contributions are welcomed via PRs. Feel free to help improve the project.

## 📄 License

This project is open source under the [MIT License](https://github.com/alwalxed/qafiyah/blob/main/LICENSE).
