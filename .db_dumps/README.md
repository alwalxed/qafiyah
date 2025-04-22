# Database Restore Guide

## Prerequisites

- 7-Zip installed

## Compression Command

```bash
7z a -t7z -m0=lzma2 -mx=9 -mfb=273 -md=64m -ms=on -v30m dump.7z dump.sql
```

## Restore Process

### 1. Merge Split Files

#### Linux/macOS:

```bash
cat dump.7z.00\* > dump.7z
```

#### Windows:

```bash
copy /b dump.7z.00\* dump.7z
```

### 2. Extract SQL Dump

```bash
7z x dump.7z
```

### 3. Restore to Database

```bash
psql -h hostname -U username -d database_name < dump.sql
```
