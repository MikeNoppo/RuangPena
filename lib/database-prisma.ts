import { prisma } from './prisma'
import { User, JournalEntry, CreateJournalRequest, UpdateJournalRequest, getJournalTypeName } from './types'
import { JournalType } from '@prisma/client'

// User operations
export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id }
  })
}

export async function createUser(data: {
  email: string
  password: string
  name?: string
}): Promise<User> {
  return await prisma.user.create({
    data
  })
}

export async function updateUser(
  id: string, 
  data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data
  })
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: { id }
  })
}

// Journal operations
export async function getJournalsByUserId(userId: string): Promise<JournalEntry[]> {
  const journals = await prisma.journal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  return journals.map(journal => ({
    ...journal,
    typeName: getJournalTypeName(journal.type)
  }))
}

export async function getJournalById(id: string): Promise<JournalEntry | null> {
  const journal = await prisma.journal.findUnique({
    where: { id }
  })

  if (!journal) return null

  return {
    ...journal,
    typeName: getJournalTypeName(journal.type)
  }
}

export async function createJournal(data: CreateJournalRequest & { userId: string }): Promise<JournalEntry> {
  const journal = await prisma.journal.create({
    data
  })

  return {
    ...journal,
    typeName: getJournalTypeName(journal.type)
  }
}

export async function updateJournal(
  id: string, 
  data: UpdateJournalRequest
): Promise<JournalEntry | null> {
  const journal = await prisma.journal.update({
    where: { id },
    data
  })

  return {
    ...journal,
    typeName: getJournalTypeName(journal.type)
  }
}

export async function deleteJournal(id: string): Promise<void> {
  await prisma.journal.delete({
    where: { id }
  })
}

export async function deleteJournalsByUserId(userId: string): Promise<void> {
  await prisma.journal.deleteMany({
    where: { userId }
  })
}

// Utility functions
export async function getJournalStats(userId: string) {
  const stats = await prisma.journal.groupBy({
    by: ['type'],
    where: { userId },
    _count: {
      id: true
    }
  })

  const total = await prisma.journal.count({
    where: { userId }
  })

  return {
    total,
    byType: stats.reduce((acc, stat) => {
      acc[stat.type] = stat._count.id
      return acc
    }, {} as Record<JournalType, number>)
  }
}
