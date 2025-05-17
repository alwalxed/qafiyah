# Qafiyah Search – Reproducible Setup Guide

## Overview

This document outlines the implementation of a search feature for our website using PostgreSQL Full-Text Search (FTS). The search allows users to find poems by content or title, and poets by name, with appropriate filtering options.

## Data Structure

The database contains the following key entities:

- Poems (with content, title, and metadata)
- Poets (with biographical information)
- Supporting entities: Eras, Meters, Rhymes, Themes

Poems are stored with full diacritics, and verses are separated by asterisks (`*`). Each verse (bayt) consists of two hemistiches (shatar).

## Arabic Text Considerations

1. **Diacritics handling**: Poems are stored with diacritics, but searches are typically performed without them.
2. **Line separation**: Poems are made of verses, and verses are made of lines. Each line is separated by an asterisk (`*`). This is how we store them in the table.

## Sample

### 📝 Pomes Table

```sql
SELECT * FROM poems LIMIT 1;
```

| id  | title                  | meter_id | num_verses | theme_id | poet_id | filename        | content                                                                                                                                                      | rhyme_id | type_id |
| --- | ---------------------- | -------- | ---------- | -------- | ------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------- |
| 18  | من مبلغ عني المثلم آية | 19       | 2          | 12       | 3095    | poem103882.html | مَن مُبلِغٌ عَنّي المُثَلَّمَ آيَةً*وَسَهلاً فَقَد نَفَّرتُم الوَحشَ أَجمَعا*هُمُ إِخوَتي ديناً فَلا تَقرُبَنَّهُم\*أَبا حَشرَج وَأَفحَصَ لِجَنبَيكَ مَضجَعا | 36       | 2       |

### 🧑‍🎤 Poets Table

```sql
SELECT * from poets LIMIT 1;
```

| id   | name             | slug                | era_id | bio                                                        |
| ---- | ---------------- | ------------------- | ------ | ---------------------------------------------------------- |
| 2630 | أبو محمد الفقعسي | abu-mohammed-faqasi | 1      | عبد الله بن ربعي بن خالد الحذلمي الفقعسي الأسدي، أبو محمد. |

راجز إسلامي، عاصر حروب الردة في عهد الخليفة أبو بكر الصديق رضي الله عنه.
تردد اسمه كثيراً في كتب اللغة والمعاجم حيث كانت أراجيزه تستخدم كشواهد لغوية أو نحوية، فيما أهملته كتب الأدب. |

## Implementation Steps

### 1. Normalize Arabic Text

Removes diacritics and tatweel, and filters out non-Arabic characters. Optionally preserves `*`.

```sql
-- Normalize Arabic text:
-- 1. Strip diacritics and tatweel
-- 2. Keep only Arabic letters, spaces, and optionally '*'
CREATE OR REPLACE FUNCTION normalize_arabic_text(input_text TEXT, keep_asterisk BOOLEAN)
RETURNS TEXT AS $$
DECLARE
  pattern TEXT;
  cleaned TEXT;
BEGIN
  cleaned := regexp_replace(
    input_text,
    '[\u064B-\u0652\u0670\u06D6\u06DC\u06DF\u06E0\u06E1\u06E2\u06E3\u06E4\u06E5\u06E6\u06E7\u06E8\u06E9\u06EA\u06EB\u06EC\u06ED\u06EE\u06EF\u06F0-\u06FF]',
    '',
    'g'
  );

  IF keep_asterisk THEN
    pattern := '[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFء *]';
  ELSE
    pattern := '[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFء ]';
  END IF;

  RETURN regexp_replace(cleaned, pattern, '', 'g');
END;
$$
LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER;
```

### 2. Add Full-Text Search Columns (Generated)

#### 📝 Poems Table

```sql
ALTER TABLE poems
DROP COLUMN IF EXISTS search_vector;

-- Arabic text is normalized
-- diacritics are removed,
-- and only Arabic letters + spaces are kept
-- The '*' verse separator is explicitly replaced with a space
-- to prevent token merging. and 'simple' configuration is used
-- because PostgreSQL's default parser doesn't handle Arabic well
ALTER TABLE poems
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(
    to_tsvector('simple', replace(normalize_arabic_text(title, TRUE), '*', ' ')),
    'A'
  ) ||
  setweight(
    to_tsvector('simple', replace(normalize_arabic_text(content, TRUE), '*', ' ')),
    'B'
  )
) STORED;
```

#### 🧑‍🎤 Poets Table

```sql
ALTER TABLE poets
DROP COLUMN IF EXISTS search_vector;

ALTER TABLE poets
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', normalize_arabic_text(name, FALSE)), 'A')
) STORED;
```

### 3. Add GIN Indexes

```sql
DROP INDEX IF EXISTS poems_search_idx;
DROP INDEX IF EXISTS poets_search_idx;

CREATE INDEX poems_search_idx ON poems USING GIN (search_vector);
CREATE INDEX poets_search_idx ON poets USING GIN (search_vector);
```

### 4. Search Functions

#### 🔍 `search_poems`

```sql
CREATE OR REPLACE FUNCTION search_poems(
  query_text TEXT,
  page_number INTEGER,
  match_type TEXT, -- 'exact', 'all', or 'any'
  meter_ids INTEGER[] DEFAULT NULL,
  era_ids INTEGER[] DEFAULT NULL,
  theme_ids INTEGER[] DEFAULT NULL,
  rhyme_ids INTEGER[] DEFAULT NULL
) RETURNS TABLE (
  poet_name TEXT,
  poet_era TEXT,
  poet_slug TEXT,
  poem_title TEXT,
  poem_snippet TEXT,
  poem_meter TEXT,
  poem_slug UUID,
  relevance REAL,
  total_count BIGINT
) AS
$$
DECLARE
  processed_query TEXT;
  tsquery_obj tsquery;
  results_per_page INTEGER := 5;
  total_results BIGINT;
BEGIN
  processed_query := normalize_arabic_text(query_text, FALSE);

  IF match_type = 'exact' THEN
    tsquery_obj := phraseto_tsquery('simple', processed_query);
  ELSIF match_type = 'all' THEN
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' & ', 'g'));
  ELSIF match_type = 'any' THEN
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' | ', 'g'));
  ELSE
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' & ', 'g'));
  END IF;

  SELECT COUNT(*) INTO total_results
  FROM poems p
  JOIN poets pt ON p.poet_id = pt.id
  JOIN meters m ON p.meter_id = m.id
  JOIN eras e ON pt.era_id = e.id
  WHERE p.search_vector @@ tsquery_obj
  AND (meter_ids IS NULL OR p.meter_id = ANY(meter_ids))
  AND (era_ids IS NULL OR pt.era_id = ANY(era_ids))
  AND (theme_ids IS NULL OR p.theme_id = ANY(theme_ids))
  AND (rhyme_ids IS NULL OR p.rhyme_id = ANY(rhyme_ids));

  RETURN QUERY
  SELECT
    pt.name,
    e.name,
    pt.slug,
    p.title,
    ts_headline('simple', normalize_arabic_text(p.content, TRUE), tsquery_obj,
      'StartSel=<mark>, StopSel=</mark>, MaxFragments=1, MaxWords=30'),
    m.name,
    p.slug,
    ts_rank(p.search_vector, tsquery_obj),
    total_results
  FROM poems p
  JOIN poets pt ON p.poet_id = pt.id
  JOIN meters m ON p.meter_id = m.id
  JOIN eras e ON pt.era_id = e.id
  WHERE p.search_vector @@ tsquery_obj
  AND (meter_ids IS NULL OR p.meter_id = ANY(meter_ids))
  AND (era_ids IS NULL OR pt.era_id = ANY(era_ids))
  AND (theme_ids IS NULL OR p.theme_id = ANY(theme_ids))
  AND (rhyme_ids IS NULL OR p.rhyme_id = ANY(rhyme_ids))
  ORDER BY relevance DESC
  LIMIT results_per_page
  OFFSET (page_number - 1) * results_per_page;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;
```

#### 🔍 `search_poets`

```sql
CREATE OR REPLACE FUNCTION search_poets(
  query_text TEXT,
  page_number INTEGER,
  match_type TEXT, -- 'exact', 'all', or 'any'
  era_ids INTEGER[] DEFAULT NULL
) RETURNS TABLE (
  poet_name TEXT,
  poet_era TEXT,
  poet_slug TEXT,
  poet_bio TEXT,
  relevance DOUBLE PRECISION,
  total_count BIGINT
) AS
$$
DECLARE
  processed_query TEXT;
  tsquery_obj tsquery;
  results_per_page INTEGER := 10;
  total_results BIGINT;
  weight_config REAL[] := ARRAY[0.1, 0.2, 0.4, 1.0];
BEGIN
  -- Process the query text (normalize Arabic text)
  processed_query := normalize_arabic_text(query_text, FALSE);

  -- Determine the tsquery based on the match type
  IF match_type = 'exact' THEN
    tsquery_obj := phraseto_tsquery('simple', processed_query);
  ELSIF match_type = 'all' THEN
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' & ', 'g'));
  ELSIF match_type = 'any' THEN
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' | ', 'g'));
  ELSE
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' & ', 'g'));
  END IF;

  -- Count the total number of results
  SELECT COUNT(*) INTO total_results
  FROM poets p
  JOIN eras e ON p.era_id = e.id
  WHERE p.search_vector @@ tsquery_obj
    AND (era_ids IS NULL OR p.era_id = ANY(era_ids));

  -- Return the query results, ordering by relevance and poet name
  RETURN QUERY
  SELECT
    p.name,
    e.name,
    p.slug,
    ts_headline('simple', normalize_arabic_text(p.bio, FALSE), tsquery_obj,
                'StartSel=<mark>, StopSel=</mark>, MaxFragments=1, MaxWords=50'),
    CASE
      WHEN normalize_arabic_text(p.name, FALSE) = processed_query THEN 10.0
      WHEN normalize_arabic_text(p.name, FALSE) ILIKE '%' || processed_query || '%' THEN
        5.0 + ts_rank_cd(weight_config, p.search_vector, tsquery_obj)
      ELSE
        ts_rank_cd(weight_config, p.search_vector, tsquery_obj)
    END,
    total_results
  FROM poets p
  JOIN eras e ON p.era_id = e.id
  WHERE p.search_vector @@ tsquery_obj
    AND (era_ids IS NULL OR p.era_id = ANY(era_ids))
  ORDER BY
    normalize_arabic_text(p.name, FALSE) = processed_query DESC,
    normalize_arabic_text(p.name, FALSE) ILIKE '%' || processed_query || '%' DESC,
    relevance DESC
  LIMIT results_per_page
  OFFSET (page_number - 1) * results_per_page;

END;
$$
LANGUAGE plpgsql SECURITY DEFINER;
```
