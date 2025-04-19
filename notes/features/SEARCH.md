# Our Search Implementation Guide

## Overview

This document outlines the implementation of a search feature for our website using PostgreSQL Full Text Search (FTS). The search allows users to find poems by content or title, and poets by name, with appropriate filtering options.

## Data Structure

The database contains the following key entities:

- Poems (with content, title, and metadata)
- Poets (with biographical information)
- Supporting entities: Eras, Meters, Rhymes, Themes

Poems are stored with full diacritics, with verses separated by asterisks (`*`). Each verse (bayt) consists of two hemistiches (shatar).

## Arabic Text Considerations

1. **Diacritics handling**: Poems are stored with diacritics, but searches will typically be performed without them
2. **Character normalization**: Arabic letters with different forms (أ/إ/آ, ه/ة, و/ؤ, ي/ئ/ى) must be normalized to base forms (ا, ه, و, ي)
3. **Text processing**: Both client and server must process text consistently before querying

## Implementation Steps

### 1. Create Text Processing Functions

First, create a PostgreSQL function to strip diacritics and normalize Arabic characters:

```sql
CREATE OR REPLACE FUNCTION strip_arabic_diacritics(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  normalized_text TEXT;
BEGIN
  normalized_text := input_text;

  -- Normalize character variants
  normalized_text := regexp_replace(normalized_text, '[أإآ]', 'ا', 'g');
  normalized_text := regexp_replace(normalized_text, '[يئى]', 'ي', 'g');
  normalized_text := regexp_replace(normalized_text, 'ة', 'ه', 'g');
  normalized_text := regexp_replace(normalized_text, 'ؤ', 'و', 'g');

  -- Strip diacritics (more comprehensive)
  normalized_text := regexp_replace(normalized_text, '[ًٌٍَُِّْٰٓٔـ]', '', 'g');

  -- Handle tatweel (kashida) character
  normalized_text := regexp_replace(normalized_text, 'ـ', '', 'g');

  -- Keep only Arabic letters, spaces, and asterisks
  normalized_text := regexp_replace(normalized_text, '[^ابتثجحخدذرزسشصضطظعغفقكلمنهويء *]', '', 'g');

  RETURN normalized_text;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### 2. Add Full-Text Search Columns (Generated)

#### 📝 Poems

```sql
ALTER TABLE poems
  DROP COLUMN IF EXISTS search_vector;

ALTER TABLE poems
  ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', strip_arabic_diacritics(title)), 'A') ||
      setweight(to_tsvector('simple', strip_arabic_diacritics(content)), 'B')
    ) STORED;
```

#### 🧑‍🎤 Poets

```sql
ALTER TABLE poets
  DROP COLUMN IF EXISTS search_vector;

ALTER TABLE poets
  ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', strip_arabic_diacritics(name)), 'A') ||
      setweight(to_tsvector('simple', strip_arabic_diacritics(bio)), 'B')
    ) STORED;
```

### 3. Add GIN Indexes

```sql
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
  theme_ids INTEGER[] DEFAULT NULL
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
) AS $$
DECLARE
  processed_query TEXT;
  tsquery_obj tsquery;
  results_per_page INTEGER := 5;
  total_results BIGINT;
BEGIN
  processed_query := strip_arabic_diacritics(query_text);

  -- Create appropriate tsquery based on match_type
  IF match_type = 'exact' THEN
    tsquery_obj := phraseto_tsquery('simple', processed_query);
  ELSIF match_type = 'all' THEN
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' & ', 'g'));
  ELSIF match_type = 'any' THEN
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' | ', 'g'));
  ELSE
    -- Default to 'all' if invalid match_type is provided
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' & ', 'g'));
  END IF;

  -- Get total count for pagination
  SELECT COUNT(*) INTO total_results
  FROM poems p
  JOIN poets pt ON p.poet_id = pt.id
  JOIN meters m ON p.meter_id = m.id
  JOIN eras e ON pt.era_id = e.id
  WHERE p.search_vector @@ tsquery_obj
    AND (meter_ids IS NULL OR p.meter_id = ANY(meter_ids))
    AND (era_ids IS NULL OR pt.era_id = ANY(era_ids))
    AND (theme_ids IS NULL OR p.theme_id = ANY(theme_ids));

  -- Return search results
  RETURN QUERY
  SELECT
    pt.name,
    e.name,
    pt.slug,
    p.title,
    ts_headline('simple', strip_arabic_diacritics(p.content), tsquery_obj,
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
  ORDER BY relevance DESC
  LIMIT results_per_page
  OFFSET (page_number - 1) * results_per_page;
END;
$$ LANGUAGE plpgsql;
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
) AS $$
DECLARE
  processed_query TEXT;
  tsquery_obj tsquery;
  results_per_page INTEGER := 10;
  total_results BIGINT;
  -- Weight configuration: {D-weight, C-weight, B-weight, A-weight}
  weight_config REAL[] := ARRAY[0.1, 0.2, 0.4, 1.0];
BEGIN
  processed_query := strip_arabic_diacritics(query_text);

  -- Create appropriate tsquery based on match_type
  IF match_type = 'exact' THEN
    tsquery_obj := phraseto_tsquery('simple', processed_query);
  ELSIF match_type = 'all' THEN
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' & ', 'g'));
  ELSIF match_type = 'any' THEN
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' | ', 'g'));
  ELSE
    -- Default to 'all' if invalid match_type is provided
    tsquery_obj := to_tsquery('simple', regexp_replace(processed_query, '\s+', ' & ', 'g'));
  END IF;

  -- Get total count for pagination
  SELECT COUNT(*) INTO total_results
  FROM poets p
  JOIN eras e ON p.era_id = e.id
  WHERE p.search_vector @@ tsquery_obj
    AND (era_ids IS NULL OR p.era_id = ANY(era_ids));

  -- Return search results with enhanced ranking
  RETURN QUERY
  SELECT
    p.name,
    e.name,
    p.slug,
    ts_headline('simple', strip_arabic_diacritics(p.bio), tsquery_obj,
                'StartSel=<mark>, StopSel=</mark>, MaxFragments=1, MaxWords=50'),
    -- Calculate relevance score
    CASE
      WHEN strip_arabic_diacritics(p.name) = processed_query THEN 10.0
      WHEN strip_arabic_diacritics(p.name) ILIKE '%' || processed_query || '%' THEN 5.0 + ts_rank_cd(weight_config, p.search_vector, tsquery_obj)
      ELSE ts_rank_cd(weight_config, p.search_vector, tsquery_obj)
    END,
    total_results
  FROM poets p
  JOIN eras e ON p.era_id = e.id
  WHERE p.search_vector @@ tsquery_obj
    AND (era_ids IS NULL OR p.era_id = ANY(era_ids))
  -- Multi-level ordering: first by exact match, then by contains match, then by score
  ORDER BY
    strip_arabic_diacritics(p.name) = processed_query DESC,
    strip_arabic_diacritics(p.name) ILIKE '%' || processed_query || '%' DESC,
    relevance DESC
  LIMIT results_per_page
  OFFSET (page_number - 1) * results_per_page;
END;
$$ LANGUAGE plpgsql;
```

### 5. Client-Side Normalization

Normalize the input before sending to the server (to support live preview or local filtering):

```javascript
function normalizeArabicText(text) {
  return text
    .replace(/[أإآ]/g, "ا")
    .replace(/[يئى]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/[ًٌٍَُِّْ]/g, "");
}
```
