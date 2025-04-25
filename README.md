# Qafiyah | قافية

A free open-source Arabic poetry platform with 944K+ verses from 932 poets across 10 eras. Built with Nextjs, Hono, and Supabase. Provides full data dumps with no need for scraping. Supports advanced Arabic search. A Twitter bot posts a verse every 30 minutes.

## 📑 Table of Contents

- [📋 Project Overview](#-project-overview)
- [🏗️ Architecture](#️-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📊 Data Statistics](#-data-statistics)
- [🗄️ Data Schema](#️-data-schema)
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

- **Web**: Nextjs app running on Cloudflare Pages (Edge)
- **API**: Hono-based Cloudflare Worker
- **Bot**: Twitter bot posting poems every 30 minutes
- **Packages**: Shared Zod schemas, ESLint configs, and TypeScript configs

## 💻 Tech Stack

| Component    | Technologies                                    |
| ------------ | ----------------------------------------------- |
| **Frontend** | Nextjs, React Query, Tailwind CSS, Zustand, Zod |
| **Backend**  | Hono, Cloudflare Workers, Zod                   |
| **Database** | Supabase PostgreSQL with Drizzle ORM            |

## 📊 Data Statistics

_Last updated: April 22, 2025_

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

## 🤝 Contributing

Contributions are welcomed via PRs. Feel free to help improve the project.

## 📄 License

This project is open source under the [MIT License](https://github.com/alwalxed/qafiyah/blob/main/LICENSE).
