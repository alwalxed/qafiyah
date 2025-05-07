# 🛠️ Database Restore Guide

This guide provides a step-by-step process to decompress a PostgreSQL SQL dump from split `.7z` files (if present), extract the `.sql`, and restore it into PostgreSQL.

## 📅 Data Freshness

Last updated: May 8, 2025

## 📦 Compression Reference

```bash
# Command used to create the compressed dump:
# Splits dump.sql into 30MB .7z chunks using maximum compression.

7z a -t7z -m0=lzma2 -mx=9 -mfb=273 -md=64m -ms=on -v30m dump.7z dump.sql
```

## ✅ Prerequisites

- 7-Zip installed

## ♻️ Restore Process

### 🔗 1. Merge Split Files (if split)

```bash
# Linux/macOS:
cat dump.7z.00* > dump.7z

# Windows:
copy /b dump.7z.00* dump.7z
```

### 📤 2. Extract SQL Dump

```bash
7z x dump.7z
```

### 🧱 3. Restore to PostgreSQL

```bash
psql -h hostname -U username -d database_name < dump.sql
```
