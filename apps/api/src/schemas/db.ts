import {
  integer,
  pgMaterializedView,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

/*
-------------------------------------
-------- MATERIALIZED VIEWS:
-------------------------------------
*/

export const poemsMaterialized = pgMaterializedView("poem_full_data_mv", {
  slug: text("slug").notNull(),
  title: text("title"),
  content: text("content"),
  poet_name: text("poet_name"),
  poet_slug: text("poet_slug"),
  meter_name: text("meter_name"),
  theme_name: text("theme_name"),
  type_name: text("type_name"),
  era_name: text("era_name"),
  era_slug: text("era_slug"),
}).existing();

export const eraStatsMaterialized = pgMaterializedView("era_stats_mv", {
  id: integer("id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  poetsCount: integer("poets_count").notNull(),
  poemsCount: integer("poems_count").notNull(),
}).existing();

export const eraPoemsMaterialized = pgMaterializedView("era_poems_mv", {
  poemId: integer("poem_id").notNull(),
  poemTitle: text("poem_title").notNull(),
  poemSlug: uuid("poem_slug").notNull(),
  poetName: text("poet_name").notNull(),
  meterName: text("meter_name").notNull(),
  eraId: integer("era_id").notNull(),
  eraName: text("era_name").notNull(),
  eraSlug: text("era_slug").notNull(),
  totalPoemsInEra: integer("total_poems_in_era").notNull(),
}).existing();

export const meterStatsMaterialized = pgMaterializedView("meter_stats_mv", {
  id: integer("id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  poemsCount: integer("poems_count").notNull(),
  poetsCount: integer("poets_count").notNull(),
}).existing();

export const meterPoemsMaterialized = pgMaterializedView("meter_poems_mv", {
  poemId: integer("poem_id").notNull(),
  poemTitle: text("poem_title").notNull(),
  poemSlug: uuid("poem_slug").notNull(),
  poetName: text("poet_name").notNull(),
  meterId: integer("meter_id").notNull(),
  meterName: text("meter_name").notNull(),
  meterSlug: text("meter_slug").notNull(),
  totalPoemsInMeter: integer("total_poems_in_meter").notNull(),
}).existing();

export const poetStatsMaterialized = pgMaterializedView("poet_stats_mv", {
  id: integer("id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  eraId: integer("era_id").notNull(),
  poemsCount: integer("poems_count").notNull(),
}).existing();

export const poetPoemsMaterialized = pgMaterializedView("poet_poems_mv", {
  poemId: integer("poem_id").notNull(),
  poemTitle: text("poem_title").notNull(),
  poemSlug: uuid("poem_slug").notNull(),
  poetId: integer("poet_id").notNull(),
  poetName: text("poet_name").notNull(),
  numVerses: integer("num_verses").notNull(),
  poetSlug: text("poet_slug").notNull(),
  meterName: text("meter_name").notNull(),
  totalPoemsByPoet: integer("total_poems_by_poet").notNull(),
}).existing();

export const rhymeStatsMaterialized = pgMaterializedView("rhyme_stats_mv", {
  id: integer("id").notNull(),
  pattern: text("pattern").notNull(),
  slug: uuid("slug").notNull(),
  poemsCount: integer("poems_count").notNull(),
  poetsCount: integer("poets_count").notNull(),
}).existing();

export const rhymePoemsMaterialized = pgMaterializedView("rhyme_poems_mv", {
  poemId: integer("poem_id").notNull(),
  poemTitle: text("poem_title").notNull(),
  poemSlug: uuid("poem_slug").notNull(),
  rhymeId: integer("rhyme_id").notNull(),
  rhymePattern: text("rhyme_pattern").notNull(),
  rhymeSlug: uuid("rhyme_slug").notNull(),
  meterName: text("meter_name").notNull(),
  totalPoemsByRhyme: integer("total_poems_by_rhyme").notNull(),
}).existing();

export const themeStatsMaterialized = pgMaterializedView("theme_stats_mv", {
  id: integer("id").notNull(),
  name: text("name").notNull(),
  slug: uuid("slug").notNull(),
  poemsCount: integer("poems_count").notNull(),
  poetsCount: integer("poets_count").notNull(),
}).existing();

export const themePoemsMaterialized = pgMaterializedView("theme_poems_mv", {
  poemId: integer("poem_id").notNull(),
  poemTitle: text("poem_title").notNull(),
  poemSlug: uuid("poem_slug").notNull(),
  themeId: integer("theme_id").notNull(),
  themeName: text("theme_name").notNull(),
  themeSlug: uuid("theme_slug").notNull(),
  poetName: text("poet_name").notNull(),
  meterName: text("meter_name").notNull(),
  totalPoemsByTheme: integer("total_poems_by_theme").notNull(),
}).existing();

export const topPoetsMaterialized = pgMaterializedView("top_poets_mv", {
  id: integer("id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  poemsCount: integer("poems_count").notNull(),
}).existing();

export const poemsSearchMaterialized = pgMaterializedView("poems_search_mv", {
  id: integer("id").notNull(),
  title: text("title").notNull(),
  slug: uuid("slug").notNull(),
  content: text("content").notNull(),
  content_tsv: text("content_tsv"), // tsvector column for full-text search
  poet_id: integer("poet_id").notNull(),
  poet_name: text("poet_name").notNull(),
  poet_slug: text("poet_slug").notNull(),
  meter_name: text("meter_name"),
  era_name: text("era_name"),
  era_slug: text("era_slug"),
}).existing();

/*
-------------------------------------
-------- TABLES
-------------------------------------
*/

export const poetsTable = pgTable("poets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  era_id: integer("era_id")
    .references(() => erasTable.id)
    .notNull(),
  bio: text("bio"),
});

export const poemsTable = pgTable("poems", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  meter_id: integer("meter_id")
    .references(() => metersTable.id)
    .notNull(),
  num_verses: integer("num_verses").notNull(),
  theme_id: integer("theme_id")
    .references(() => themesTable.id)
    .notNull(),
  poet_id: integer("poet_id")
    .references(() => poetsTable.id)
    .notNull(),
  filename: text("filename").notNull(),
  slug: uuid("slug").notNull(),
  content: text("content").notNull(),
  rhyme_id: integer("rhyme_id").references(() => rhymesTable.id),
  type_id: integer("type_id").references(() => typesTable.id),
});

export const themesTable = pgTable("themes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").unique().notNull(),
  slug: uuid("slug").unique().notNull(),
});

export const rhymesTable = pgTable("rhymes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pattern: text("pattern").unique().notNull(),
  slug: uuid("slug").unique().notNull(),
});

export const metersTable = pgTable("meters", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
});

export const erasTable = pgTable("eras", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
});

export const typesTable = pgTable("types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
});
