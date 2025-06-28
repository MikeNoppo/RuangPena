# 🚀 Quick Start - RuangPena Database

## Setup Database (Pertama Kali)

### 1. Setup PostgreSQL
Pastikan PostgreSQL sudah terinstall dan berjalan.

### 2. Buat Database
```sql
-- Connect ke PostgreSQL
psql -U postgres

-- Buat database baru
CREATE DATABASE ruangpena_db;

-- Buat user (opsional)
CREATE USER ruangpena_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ruangpena_db TO ruangpena_user;
```

### 3. Configure Environment
```bash
# Copy template environment
cp .env.example .env

# Edit .env dan update DATABASE_URL
# DATABASE_URL="postgresql://username:password@localhost:5432/ruangpena_db"
```

### 4. Setup Database Schema
```bash
# Cara otomatis dengan script helper
npm run db:setup

# Atau cara manual:
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema ke database
```

### 5. Seed Data (Opsional)
```bash
npm run db:seed
```

### 6. Jalankan Aplikasi
```bash
npm run dev
```

### 7. Monitor Database
```bash
npm run db:studio
```

## Login Demo Account
Jika sudah menjalankan seed:
- Email: `demo@ruangpena.com`
- Password: `password123`

## Troubleshooting

### Error: "database does not exist"
```bash
createdb ruangpena_db
```

### Error: "relation does not exist"
```bash
npm run db:push
```

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Reset Database
```bash
npm run db:reset
```
