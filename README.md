# Qafiyah (قافية)

A non-profit open-source platform for Arabic poetry preservation and accessibility.

## Project Overview

- **Website**: [qafiyah.com](https://qafiyah.com)
- **API**: [api.qafiyah.com](https://api.qafiyah.com)
- **Twitter**: [qafiyahdotcom](https://twitter.com/qafiyahdotcom)
- **DB Dumps**: [github.com/alwalxed/qafiyah/.db_dumps](https://github.com/alwalxed/qafiyah/.db_dumps)

> **Important**: No need to scrape the website or API. All data is freely available in the database dumps.

## Architecture

This monorepo contains:

- **Web**: Nextjs app running on Cloudflare Pages (Edge)
- **API**: Hono-based Cloudflare Worker
- **Bot**: Twitter bot posting poems every 30 minutes
- **Packages**: Shared Zod schemas, ESLint configs, and TypeScript configs

## Tech Stack

- **Frontend**: Nextjs, React Query
- **Backend**: Hono, Cloudflare Workers
- **Database**: Supabase PostgreSQL with Drizzle ORM
- **Search-Endpoint**: AWS EC2 instance with materialized views

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build all packages and apps
pnpm build
```

## Database Structure

### Poems Table

| Column   | Type    | Description           |
| -------- | ------- | --------------------- |
| id       | integer | Primary key           |
| title    | text    | Poem title            |
| content  | text    | Full poem text        |
| slug     | uuid    | URL identifier        |
| poet_id  | integer | Foreign key to poets  |
| meter_id | integer | Foreign key to meters |
| theme_id | integer | Foreign key to themes |
| rhyme_id | integer | Foreign key to rhymes |
| type_id  | integer | Foreign key to types  |

### Poets Table

| Column | Type    | Description         |
| ------ | ------- | ------------------- |
| id     | integer | Primary key         |
| name   | text    | Poet name           |
| slug   | text    | URL identifier      |
| era_id | integer | Foreign key to eras |
| bio    | text    | Poet biography      |

### Other Tables

- **Themes**: Poetry themes categorization
- **Meters**: Arabic poetry meters
- **Eras**: Historical periods
- **Rhymes**: Rhyming patterns
- **Types**: Poetry types

Materialized views are used for performance optimization and search functionality.

## Contributing

Contributions are welcomed via pull requests. Feel free to help improve the project.

## License

Open source
