import fs from 'fs/promises'
import path from 'path'
import { User, JournalEntry } from './types'

// Simple file-based database for development
// In production, you would replace this with a proper database

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const JOURNALS_FILE = path.join(DATA_DIR, 'journals.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

// Initialize database files if they don't exist
async function initializeDatabase() {
  await ensureDataDir()
  
  try {
    await fs.access(USERS_FILE)
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2))
  }
  
  try {
    await fs.access(JOURNALS_FILE)
  } catch {
    await fs.writeFile(JOURNALS_FILE, JSON.stringify([], null, 2))
  }
}

// User operations
export async function getAllUsers(): Promise<User[]> {
  await initializeDatabase()
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers()
  return users.find(user => user.email === email) || null
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getAllUsers()
  return users.find(user => user.id === id) || null
}

export async function createUser(user: User): Promise<void> {
  const users = await getAllUsers()
  users.push(user)
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

export async function updateUser(id: string, updates: Partial<User>): Promise<void> {
  const users = await getAllUsers()
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
  }
}

export async function deleteUser(id: string): Promise<void> {
  const users = await getAllUsers()
  const filteredUsers = users.filter(user => user.id !== id)
  await fs.writeFile(USERS_FILE, JSON.stringify(filteredUsers, null, 2))
}

// Journal operations
export async function getAllJournals(): Promise<JournalEntry[]> {
  await initializeDatabase()
  try {
    const data = await fs.readFile(JOURNALS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function getJournalsByUserId(userId: string): Promise<JournalEntry[]> {
  const journals = await getAllJournals()
  return journals.filter(journal => journal.userId === userId)
}

export async function getJournalById(id: string): Promise<JournalEntry | null> {
  const journals = await getAllJournals()
  return journals.find(journal => journal.id === id) || null
}

export async function createJournal(journal: JournalEntry): Promise<void> {
  const journals = await getAllJournals()
  journals.push(journal)
  await fs.writeFile(JOURNALS_FILE, JSON.stringify(journals, null, 2))
}

export async function updateJournal(id: string, updates: Partial<JournalEntry>): Promise<void> {
  const journals = await getAllJournals()
  const index = journals.findIndex(journal => journal.id === id)
  if (index !== -1) {
    journals[index] = { ...journals[index], ...updates, updatedAt: new Date().toISOString() }
    await fs.writeFile(JOURNALS_FILE, JSON.stringify(journals, null, 2))
  }
}

export async function deleteJournal(id: string): Promise<void> {
  const journals = await getAllJournals()
  const filteredJournals = journals.filter(journal => journal.id !== id)
  await fs.writeFile(JOURNALS_FILE, JSON.stringify(filteredJournals, null, 2))
}

export async function deleteJournalsByUserId(userId: string): Promise<void> {
  const journals = await getAllJournals()
  const filteredJournals = journals.filter(journal => journal.userId !== userId)
  await fs.writeFile(JOURNALS_FILE, JSON.stringify(filteredJournals, null, 2))
}
