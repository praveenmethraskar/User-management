// src/services/userService.ts
import { readDB, writeDB } from './dbService'
import { User } from '../model/user'
import { v4 as uuidv4 } from 'uuid'

// small deep merge helper for PATCH
function deepMerge(target: any, source: any) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      target[key] = deepMerge(target[key] ?? {}, source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

export async function listUsers(params: {
  _page?: number
  _limit?: number
  _sort?: string
  _order?: 'asc' | 'desc'
  q?: string
  role?: string
  isActive?: string | boolean
}) {
  const db = await readDB()
  const users: User[] = db.users ?? []

  let filtered = users

  const q = params.q?.toString().toLowerCase()
  if (q) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
    )
  }

  if (params.role) {
    filtered = filtered.filter((u) => u.role === params.role)
  }

  if (typeof params.isActive !== 'undefined') {
    const bool = params.isActive === 'true' || params.isActive === true
    filtered = filtered.filter((u) => u.isActive === bool)
  }

  if (params._sort) {
    const s = params._sort
    const order = params._order === 'desc' ? -1 : 1
    filtered = filtered.sort((a: any, b: any) => {
      const av = a[s] ?? ''
      const bv = b[s] ?? ''
      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * order
      }
      if (av > bv) return 1 * order
      if (av < bv) return -1 * order
      return 0
    })
  }

  const total = filtered.length
  const page = Number(params._page ?? 1)
  const limit = Number(params._limit ?? 10)
  const start = (page - 1) * limit
  const paginated = filtered.slice(start, start + limit)

  return { data: paginated, total }
}

export async function getUserById(id: string) {
  const db = await readDB()
  const users: User[] = db.users ?? []
  return users.find((u) => u.id === id) ?? null
}

export async function createUser(payload: Partial<User>) {
  const db = await readDB()
  db.users = db.users ?? []
  const now = new Date().toISOString()
  const newUser: User = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    ...payload,
  } as User

  db.users.push(newUser)
  await writeDB(db)
  return newUser
}

export async function updateUser(id: string, patch: any) {
  const db = await readDB()
  db.users = db.users ?? []
  const idx = db.users.findIndex((u: User) => u.id === id)
  if (idx === -1) return null
  const existing = db.users[idx]
  const updated = deepMerge({ ...existing }, patch)
  updated.updatedAt = new Date().toISOString()
  db.users[idx] = updated
  await writeDB(db)
  return updated
}

export async function deleteUser(id: string) {
  const db = await readDB()
  db.users = db.users ?? []
  const before = db.users.length
  db.users = db.users.filter((u: User) => u.id !== id)
  if (db.users.length === before) return false
  await writeDB(db)
  return true
}