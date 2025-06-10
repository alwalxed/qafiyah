import {
  integer,
  pgMaterializedView,
  pgView,
  text,
  uuid,
} from "drizzle-orm/pg-core";

export const eraPoems = pgView("era_poems", {
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

export const eraStats = pgView("era_stats", {
  id: integer("id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  poetsCount: integer("poets_count").notNull(),
  poemsCount: integer("poems_count").notNull(),
}).existing();

export const meterPoems = pgView("meter_poems", {
  poemId: integer("poem_id").notNull(),
  poemTitle: text("poem_title").notNull(),
  poemSlug: uuid("poem_slug").notNull(),
  poetName: text("poet_name").notNull(),
  meterId: integer("meter_id").notNull(),
  meterName: text("meter_name").notNull(),
  meterSlug: text("meter_slug").notNull(),
  totalPoemsInMeter: integer("total_poems_in_meter").notNull(),
}).existing();

export const meterStats = pgView("meter_stats", {
  id: integer("id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  poemsCount: integer("poems_count").notNull(),
  poetsCount: integer("poets_count").notNull(),
}).existing();

export const poetPoems = pgView("poet_poems", {
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

export const poetStats = pgView("poet_stats", {
  id: integer("id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  eraId: integer("era_id").notNull(),
  poemsCount: integer("poems_count").notNull(),
}).existing();

export const rhymePoems = pgView("rhyme_poems", {
  poemId: integer("poem_id").notNull(),
  poemTitle: text("poem_title").notNull(),
  poemSlug: uuid("poem_slug").notNull(),
  rhymeId: integer("rhyme_id").notNull(),
  rhymePattern: text("rhyme_pattern").notNull(),
  rhymeSlug: uuid("rhyme_slug").notNull(),
  meterName: text("meter_name").notNull(),
  totalPoemsByRhyme: integer("total_poems_by_rhyme").notNull(),
}).existing();

export const rhymeStats = pgView("rhyme_stats", {
  id: integer("id").notNull(),
  pattern: text("pattern").notNull(),
  slug: uuid("slug").notNull(),
  poemsCount: integer("poems_count").notNull(),
  poetsCount: integer("poets_count").notNull(),
}).existing();

export const themePoems = pgView("theme_poems", {
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

export const themeStats = pgView("theme_stats", {
  id: integer("id").notNull(),
  name: text("name").notNull(),
  slug: uuid("slug").notNull(),
  poemsCount: integer("poems_count").notNull(),
  poetsCount: integer("poets_count").notNull(),
}).existing();

export const poemsFullData = pgMaterializedView("poem_full_data", {
  slug: text("slug").notNull(),
  title: text("title"),
  content: text("content"),
  poet_name: text("poet_name"),
  poet_slug: text("poet_slug"),
  meter_name: text("meter_name"),
  theme_name: text("theme_name"),
  era_name: text("era_name"),
  era_slug: text("era_slug"),
}).existing();
