# Restore Guide

This guide restores the database dump into your local PostgreSQL instance. The dump was created with **PostgreSQL 15.8**. Check your version: `pg_restore --version`. And update if it's lower.

## 1. Create a new database

```bash
createdb -U postgres qafiyah
```

## 2. Restore the dump

```bash
pg_restore \
  -U postgres \
  -d qafiyah \
  -F c \
  --no-owner \
  --no-acl \
  /path/to/qafiyah_public_YYYYMMDD_HHMM.dump
```

> Note: You can ignore the harmless `schema "public" already exists` warning.

## Dump creation command

```bash
PGSSLMODE=require pg_dump \
  -h aws-0-us-east-2.pooler.supabase.com \
  -p 5432 \
  -U postgres.<secret> \
  -d postgres \
  --schema=public \
  --no-owner \
  --no-acl \
  -F c \
  -f qafiyah_public_$(date +%Y%m%d_%H%M).dump
```
