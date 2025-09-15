// src/services/dbService.ts
import fs from 'fs/promises'
import path from 'path'

const DB_FILE = process.env.DB_FILE || path.resolve(process.cwd(), 'db.json')

export async function readDB(): Promise<any> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8')
    return JSON.parse(raw || '{}')
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return {}
    }
    throw err
  }
}

export async function writeDB(data: any): Promise<void> {
  // atomic write: write tmp then rename
  const tmp = DB_FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, DB_FILE)
}