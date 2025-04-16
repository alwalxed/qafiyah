# Qafiyah Database Restore

## Prerequisites

- 7zip installed

## Restore Steps

1. **Merge split files:**

   ```
   cat qafiyah-db-dump.7z.part*\* > qafiyah-db-dump.7z
   ```

   Windows: `copy /b qafiyah-db-dump.7z.part*\* qafiyah-db-dump.7z`

2. **Extract SQL dump:**

   ```
   7z x qafiyah-db-dump.7z
   ```

3. **Restore to database:**
   ```
   psql -h hostname -U username -d database_name < qafiyah-db-dump.sql
   ```
