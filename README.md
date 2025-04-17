# Qafiyah (قافية)

A non-profit open-source platform dedicated to Arabic poetry preservation and accessibility.

## 📋 Project Overview

Our main channels:

- **Website**: [qafiyah.com](https://qafiyah.com)
- **API**: [api.qafiyah.com](https://api.qafiyah.com)
- **Random Poem Endpoint**: [api.qafiyah.com/poems/random](https://api.qafiyah.com/poems/random)
- **Twitter/X**: [x.com/qafiyahdotcom](https://twitter.com/qafiyahdotcom)
- **DB Dumps**: [github.com/alwalxed/qafiyah/tree/main/.db_dumps](https://github.com/alwalxed/qafiyah/tree/main/.db_dumps)

> **Important**: No need to scrape the website or API. All data is freely available in the [database dumps](https://github.com/alwalxed/qafiyah/tree/main/.db_dumps).

## 🏗️ Architecture

This monorepo contains:

- **Web**: Next.js app running on Cloudflare Pages (Edge)
- **API**: Hono-based Cloudflare Worker
- **Bot**: Twitter bot posting poems every 30 minutes
- **Packages**: Shared Zod schemas, ESLint configs, and TypeScript configs

## 💻 Tech Stack

| Component    | Technologies                                                                         |
| ------------ | ------------------------------------------------------------------------------------ |
| **Frontend** | Next.js, React Query, Tailwind CSS, Zustand, Zod                                     |
| **Backend**  | Hono, Cloudflare Workers, Zod                                                        |
| **Database** | Supabase PostgreSQL with Drizzle ORM                                                 |
| **Search**   | AWS EC2 instance with materialized views ([Why is search separated?](#-limitations)) |

## 📊 Database Statistics

- 📝 **Total Verses:** 944,844
- 📚 **Total Poems:** 85,342
- 🧑‍🎤 **Unique Poets:** 932
- 🕰️ **Historical Eras:** 10
- 🪶 **Distinct Meters:** 44
- 🎭 **Rhyme Schemes:** 47
- 🎨 **Themes Covered:** 27
- 🧾 **Poem Types:** 3

## 🗄️ Database Schema

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

## ⚡ Database Optimizations

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
CREATE MATERIALIZED VIEW public.poem_search_view AS
SELECT
    p.id AS poem_id,
    p.slug AS poem_slug,
    p.title AS poem_title,
    p.content AS poem_content,
    strip_diacritics(p.title) AS title_no_diacritics,
    strip_diacritics(p.content) AS content_no_diacritics,
    regexp_replace(regexp_replace(p.content, '[^ء-يؐ-ًْٰٓ-ٕ\s\*]'::text, ''::text, 'g'::text), '\n'::text, '*'::text, 'g'::text) AS poem_content_clean,
    regexp_replace(regexp_replace(strip_diacritics(p.content), '[^ء-ي\s\*]'::text, ''::text, 'g'::text), '\n'::text, '*'::text, 'g'::text) AS poem_content_clean_no_diacritics,
    m.name AS poem_meter,
    pt.name AS poet_name,
    e.name AS poet_era,
    to_tsvector('simple'::regconfig, ((p.title || ' '::text) || p.content)) AS content_search_vector,
    to_tsvector('simple'::regconfig, ((strip_diacritics(p.title) || ' '::text) || strip_diacritics(p.content))) AS content_search_vector_no_diacritics
FROM
    poems p
JOIN
    poets pt ON pt.id = p.poet_id
JOIN
    meters m ON m.id = p.meter_id
JOIN
    eras e ON pt.era_id = e.id;
```

### Functions @ Supabase

```sql
CREATE OR REPLACE FUNCTION public.get_a_random_poem()
RETURNS json
LANGUAGE plpgsql
AS $function$
DECLARE
    excluded_era_ids int[];
    poem_count int;
    poem_row record;
BEGIN
    -- Get era IDs to exclude based on slugs
    SELECT array_agg(id) INTO excluded_era_ids
    FROM public.eras
    WHERE slug IN ('late', 'ottoman');

    IF excluded_era_ids IS NULL OR array_length(excluded_era_ids, 1) < 2 THEN
        RAISE EXCEPTION 'One or more excluded eras not found.';
    END IF;

    -- Count eligible poems (whose poets are not from the excluded eras)
    SELECT count(*) INTO poem_count
    FROM public.poems p
    JOIN public.poets pt ON pt.id = p.poet_id
    WHERE pt.era_id != ALL (excluded_era_ids);

    IF poem_count = 0 THEN
        RETURN json_build_object('error', 'No eligible poems found');
    END IF;

    -- Select one random eligible poem
    SELECT p.*, pt.name AS poet_name
    INTO poem_row
    FROM public.poems p
    JOIN public.poets pt ON pt.id = p.poet_id
    WHERE pt.era_id != ALL (excluded_era_ids)
    ORDER BY random()
    LIMIT 1;

    -- Return poem info as JSON
    RETURN json_build_object(
        'poem_id', poem_row.id,
        'poet_name', poem_row.poet_name,
        'content', poem_row.content
    );
END;
$function$;
```

### Functions @ EC2

```sql
CREATE OR REPLACE FUNCTION public.search_poems(
    search_query text,
    page_number integer DEFAULT 1,
    exact_match boolean DEFAULT false
)
RETURNS TABLE(
    poet_name text,
    poet_era text,
    poem_title text,
    poem_snippet text,
    poem_meter text,
    poem_slug uuid,
    relevance_score real,
    total_result_count bigint
)
LANGUAGE plpgsql
AS $function$
DECLARE
    results_per_page CONSTANT INTEGER := 5;
    offset_value INTEGER;
    search_tokens TEXT;
    stripped_query TEXT;
    total_count BIGINT;
BEGIN
    offset_value := (page_number - 1) * results_per_page;
    stripped_query := strip_diacritics(search_query);

    IF exact_match THEN
        search_tokens := '''' || stripped_query || '''';
    ELSE
        search_tokens := regexp_replace(stripped_query, '\s+', '&', 'g');
    END IF;

    BEGIN
        SELECT COUNT(*) INTO total_count
        FROM poem_search_view
        WHERE content_search_vector_no_diacritics @@ to_tsquery('simple', search_tokens);
    EXCEPTION WHEN OTHERS THEN
        total_count := 0;
    END;

    RETURN QUERY
    WITH matched_poems AS (
        SELECT
            p.poem_id,
            p.poet_name,
            p.poet_era,
            p.poem_title,
            p.poem_slug,
            p.poem_meter,
            p.poem_content,
            p.content_no_diacritics,
            ts_rank(p.content_search_vector_no_diacritics, to_tsquery('simple', search_tokens)) AS relevance_score
        FROM poem_search_view p
        WHERE p.content_search_vector_no_diacritics @@ to_tsquery('simple', search_tokens)
        ORDER BY relevance_score DESC
        LIMIT results_per_page OFFSET offset_value
    ),
    line_extraction AS (
        SELECT
            mp.*,
            position(lower(stripped_query) in lower(mp.content_no_diacritics)) AS match_pos,
            string_to_array(mp.poem_content, '*') AS content_lines,
            string_to_array(mp.content_no_diacritics, '*') AS content_lines_no_diacritics
        FROM matched_poems mp
    ),
    line_identification AS (
        SELECT
            le.*,
            (
                SELECT idx
                FROM unnest(le.content_lines_no_diacritics) WITH ORDINALITY AS t(line, idx)
                WHERE position(lower(stripped_query) in lower(t.line)) > 0
                ORDER BY idx
                LIMIT 1
            ) AS matching_line_idx
        FROM line_extraction le
    )
    SELECT
        li.poet_name,
        li.poet_era,
        li.poem_title,
        CASE
            WHEN li.matching_line_idx IS NOT NULL THEN
                COALESCE(
                    CASE WHEN li.matching_line_idx > 1
                         THEN li.content_lines[li.matching_line_idx - 1] || '*'
                         ELSE '' END,
                    ''
                ) ||
                regexp_replace(
                    li.content_lines[li.matching_line_idx],
                    '(' || regexp_replace(stripped_query, '([^ء-ي\s])', '', 'g') || ')',
                    '<b>\1</b>',
                    'i'
                ) ||
                COALESCE(
                    CASE WHEN li.matching_line_idx < array_length(li.content_lines, 1)
                         THEN '*' || li.content_lines[li.matching_line_idx + 1]
                         ELSE '' END,
                    ''
                )
            ELSE
                ts_headline(
                    'simple',
                    li.poem_content,
                    to_tsquery('simple', search_tokens),
                    'MaxWords=50, MinWords=10, MaxFragments=1, StartSel=<b>, StopSel=</b>'
                )
        END AS poem_snippet,
        li.poem_meter,
        li.poem_slug,
        li.relevance_score,
        total_count
    FROM line_identification li;

EXCEPTION WHEN OTHERS THEN
    RETURN;
END;
$function$;
-----------------------------------------------
-----------------------------------------------
-----------------------------------------------
CREATE OR REPLACE FUNCTION public.strip_diacritics(text_with_diacritics text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $function$
BEGIN
    RETURN regexp_replace(
        text_with_diacritics,
        '[ًٌٍَُِّْٰٓٔـٕۖۗۘۙۚۛۜۤۥۦۧۨ]',
        '',
        'g'
    );
END;
$function$;
```

## 🚧 Limitations

The search endpoint was moved to AWS EC2 because Supabase's free tier limits were exceeded when creating optimized search views and indexes. While Supabase provides free and fast unlimited API calls, the search functionality required setting up a VPS with PostgreSQL that connects to Supabase and synchronizes data.

## 🚀 Development

```bash
# 1. Create environment variables file for Cloudflare Worker
touch ./apps/api/.dev.vars

# 2. Set up your database connections
Add DATABASE_URL and SEARCH_DATABASE_URL to your .dev.vars file

# 3. Import database dump
Download and restore from https://github.com/alwalxed/qafiyah/tree/main/.db_dumps

# 4. Recreate views and functions
Run the materialized views and functions SQL from the Database Optimizations section

# 5. Install dependencies
pnpm install

# 6. Start development server
pnpm dev

# 7. Build for production
pnpm build
```

## 🤝 Contributing

Contributions are welcomed via pull requests. Feel free to help improve the project.

## 📄 License

This project is open source.

## ❓ FAQ

### Why is the search endpoint separated from the main API?

As mentioned in the [Limitations](#-limitations) section, we had to move the search functionality to a separate AWS EC2 instance because:

1. Supabase's free tier has limits on database size and resources
2. Creating optimized search views and indexes for Arabic text search exceeded these limits
3. We wanted to maintain the benefits of Supabase for the rest of the API (free unlimited API calls, easy management)
4. The search functionality requires specialized PostgreSQL configurations for Arabic text search

This separation allows us to:

- Keep the main API on Supabase's free tier
- Optimize the search experience with dedicated resources
- Scale each component independently based on usage patterns
