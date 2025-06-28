# 🗄️ Database Setup & Operations - RuangPena

Panduan lengkap untuk operasi database PostgreSQL dengan Prisma ORM di project RuangPena.

## 📋 **Daftar Isi**
1. [Setup Database](#setup-database)
2. [Operasi Database](#operasi-database)  
3. [Schema & Models](#schema--models)
4. [API Operations](#api-operations)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 **Setup Database**

### 1. **Prerequisites**
Pastikan Anda memiliki:
- PostgreSQL server yang berjalan
- Database yang sudah dibuat (nama: `ruangpena_db`)
- Kredensial database (username, password, host, port)

### 2. **Environment Variables**
Update file `.env` dengan kredensial database Anda:

```env
# Database URL untuk PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/ruangpena_db"

# JWT Secret untuk authentication
JWT_SECRET="your-super-secure-jwt-secret-key-change-this-in-production"

# Next.js URL
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

### 3. **Install Dependencies**
Dependencies sudah terinstall, tapi jika perlu:

```bash
npm install prisma @prisma/client
npm install bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken
```

### 4. **Generate Prisma Client**
```bash
npm run db:generate
# atau
npx prisma generate
```

### 5. **Setup Database Schema**
```bash
# Push schema ke database (development)
npm run db:push
# atau
npx prisma db push

# Untuk production, gunakan migrations:
npm run db:migrate
# atau
npx prisma migrate dev --name init
```

---

## 🔧 **Operasi Database**

### **Available Scripts:**
```json
{
  "db:generate": "prisma generate",      // Generate Prisma client
  "db:push": "prisma db push",           // Push schema ke DB (development)
  "db:migrate": "prisma migrate dev",    // Create & run migrations
  "db:reset": "prisma migrate reset",    // Reset database
  "db:studio": "prisma studio"           // Buka Prisma Studio
}
```

### **Development Workflow:**
1. **Update schema** di `prisma/schema.prisma`
2. **Generate client**: `npm run db:generate`
3. **Push ke database**: `npm run db:push` (development)
4. **Atau buat migration**: `npm run db:migrate` (production)

### **Prisma Studio (Database GUI):**
```bash
npm run db:studio
```
Akan membuka web interface di `http://localhost:5555` untuk melihat dan edit data.

---

## 📊 **Schema & Models**

### **User Model:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed password
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  journals  Journal[]
}
```

### **Journal Model:**
```prisma
model Journal {
  id        String      @id @default(cuid())
  title     String?
  content   String
  type      JournalType
  tags      String[]    @default([])
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  userId    String
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### **Journal Types:**
```prisma
enum JournalType {
  DAILY      // Jurnal Harian
  GRATITUDE  // Jurnal Syukur  
  DREAM      // Jurnal Mimpi
  BULLET     // Jurnal Bullet
}
```

---

## 🔌 **API Operations**

### **Database Service (`lib/database-prisma.ts`):**

#### **User Operations:**
```typescript
// Get user by email
await getUserByEmail(email: string): Promise<User | null>

// Get user by ID
await getUserById(id: string): Promise<User | null>

// Create new user
await createUser(data: {
  email: string
  password: string  // Already hashed
  name?: string
}): Promise<User>

// Update user
await updateUser(id: string, data: Partial<User>): Promise<User>

// Delete user
await deleteUser(id: string): Promise<void>
```

#### **Journal Operations:**
```typescript
// Get all journals for user
await getJournalsByUserId(userId: string): Promise<JournalEntry[]>

// Get journal by ID
await getJournalById(id: string): Promise<JournalEntry | null>

// Create new journal
await createJournal(data: CreateJournalRequest & { userId: string }): Promise<JournalEntry>

// Update journal
await updateJournal(id: string, data: UpdateJournalRequest): Promise<JournalEntry | null>

// Delete journal
await deleteJournal(id: string): Promise<void>
```

### **API Endpoints:**

#### **Authentication:**
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

#### **Journal Management:**
- `GET /api/journal` - Get semua journal user (dengan Bearer token)
- `POST /api/journal` - Create journal baru
- `GET /api/journal/[id]` - Get journal tertentu
- `PUT /api/journal/[id]` - Update journal
- `DELETE /api/journal/[id]` - Delete journal

### **Authentication:**
Semua API endpoint journal menggunakan JWT Bearer token:
```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## ⚡ **Quick Start Commands**

### **Setup Database Pertama Kali:**
```bash
# 1. Generate Prisma client
npm run db:generate

# 2. Push schema ke database
npm run db:push

# 3. (Opsional) Buka Prisma Studio
npm run db:studio
```

### **Development Workflow:**
```bash
# Jalankan development server
npm run dev

# Di terminal lain, buka Prisma Studio untuk monitoring data
npm run db:studio
```

### **Production Deployment:**
```bash
# 1. Generate client
npm run db:generate

# 2. Run migrations
npm run db:migrate

# 3. Build application
npm run build
```

---

## 🔍 **Troubleshooting**

### **Error: "Database does not exist"**
```bash
# Buat database baru di PostgreSQL
createdb ruangpena_db

# Atau via psql
psql -U postgres
CREATE DATABASE ruangpena_db;
```

### **Error: "Schema does not exist"**
```bash
# Reset dan setup ulang
npm run db:reset
npm run db:push
```

### **Error: "Prisma Client not generated"**
```bash
# Generate ulang client
npm run db:generate
```

### **Error: "Connection refused"**
- Pastikan PostgreSQL server berjalan
- Periksa kredensial di `.env`
- Test koneksi: `npx prisma db push`

### **Melihat Query SQL:**
Prisma client dikonfigurasi dengan logging query:
```typescript
// lib/prisma.ts
new PrismaClient({
  log: ['query'],  // Akan log semua query SQL
})
```

---

## 🔐 **Security Notes**

1. **Password Hashing:** Menggunakan `bcryptjs` untuk hash password
2. **JWT Token:** Untuk session management
3. **Environment Variables:** Jangan commit `.env` ke git
4. **Database URL:** Gunakan connection pooling untuk production
5. **CORS:** Setup CORS untuk production deployment

---

## 📚 **Resources**

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

*Last updated: ${new Date().toLocaleDateString('id-ID')}*
