## Database Dump Creation

**Note:** This file is for dump creation only. For restoration instructions, please see the [restore documentation](https://github.com/alwalxed/qafiyah/blob/main/.db_dumps/README.md).

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
