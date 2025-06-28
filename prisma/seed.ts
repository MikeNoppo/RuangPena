import { PrismaClient, JournalType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@ruangpena.com' },
    update: {},
    create: {
      email: 'demo@ruangpena.com',
      password: hashedPassword,
      name: 'Demo User'
    }
  })

  console.log('✅ Demo user created:', demoUser.email)

  // Create sample journal entries
  const sampleJournals = [
    {
      title: 'Jurnal Harian Pertama',
      content: 'Hari ini adalah hari yang baik. Saya belajar banyak hal baru tentang pengembangan web dengan Next.js dan Prisma. Sangat menarik bagaimana teknologi ini bisa membantu membangun aplikasi yang powerful.',
      type: JournalType.DAILY,
      tags: ['belajar', 'teknologi', 'web-development'],
      userId: demoUser.id
    },
    {
      title: 'Hal-hal yang Disyukuri',
      content: 'Hari ini saya bersyukur untuk:\n1. Kesehatan yang baik\n2. Keluarga yang mendukung\n3. Kesempatan belajar teknologi baru\n4. Teman-teman yang selalu membantu\n5. Makanan yang lezat',
      type: JournalType.GRATITUDE,
      tags: ['syukur', 'keluarga', 'kesehatan'],
      userId: demoUser.id
    },
    {
      title: 'Mimpi Malam Ini',
      content: 'Malam ini saya bermimpi tentang masa depan. Dalam mimpi itu, saya melihat diri saya sebagai developer yang sukses, bekerja di perusahaan teknologi terbaik, dan berkontribusi pada proyek-proyek yang mengubah dunia.',
      type: JournalType.DREAM,
      tags: ['mimpi', 'masa-depan', 'karier'],
      userId: demoUser.id
    },
    {
      title: null,
      content: '• Bangun pagi jam 6\n• Olahraga 30 menit\n• Sarapan sehat\n• Meeting tim jam 9\n• Code review PR teman\n• Lunch break\n• Lanjut development fitur baru\n• Belajar Prisma 2 jam\n• Tidur jam 10',
      type: JournalType.BULLET,
      tags: ['rutinitas', 'produktivitas', 'planning'],
      userId: demoUser.id
    },
    {
      title: 'Refleksi Mingguan',
      content: 'Minggu ini sudah berhasil menyelesaikan beberapa task penting:\n\n✅ Setup database dengan Prisma\n✅ Implementasi authentication\n✅ Buat API endpoints\n✅ UI improvements\n\nMinggu depan fokus pada:\n- Testing & debugging\n- Performance optimization\n- Documentation\n- Deployment preparation',
      type: JournalType.DAILY,
      tags: ['refleksi', 'mingguan', 'progress', 'planning'],
      userId: demoUser.id
    }
  ]

  for (const journal of sampleJournals) {
    const created = await prisma.journal.create({
      data: journal
    })
    console.log(`✅ Journal created: ${created.type} - ${created.title || 'Untitled'}`)
  }

  console.log('🎉 Seeding completed!')
  console.log('\n📝 Demo account:')
  console.log('Email: demo@ruangpena.com')
  console.log('Password: password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
