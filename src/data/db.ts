const DB_NAME = 'gojuon-db'
const DB_VERSION = 1

export interface KanaStat {
  attempts: number
  correct: number
  totalTime: number
}

export interface Session {
  id?: number
  date: string
  mode: 'count' | 'time' | 'infinite'
  selectedKana: string[]
  total: number
  correct: number
  avgTime: number
}

export interface AppSettings {
  selectedKana: string[]
  selectedScript: 'hiragana' | 'katakana' | 'both'
  practiceMode: 'count' | 'time' | 'infinite'
  questionCount: number
  timeLimit: number
  weightedRandom: boolean
  autoAdvance: boolean
  showHint: boolean
  romajiVariants: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  selectedKana: [],
  selectedScript: 'hiragana',
  practiceMode: 'count',
  questionCount: 20,
  timeLimit: 60,
  weightedRandom: true,
  autoAdvance: true,
  showHint: false,
  romajiVariants: true,
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings')
      }
      if (!db.objectStoreNames.contains('kanaStats')) {
        db.createObjectStore('kanaStats')
      }
      if (!db.objectStoreNames.contains('sessions')) {
        db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function get<T>(store: string, key: string): Promise<T | undefined> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).get(key)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function put(store: string, key: string, value: unknown): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    const req = tx.objectStore(store).put(value, key)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

async function getAll<T>(store: string): Promise<T[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function add(store: string, value: unknown): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    const req = tx.objectStore(store).add(value)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

async function clearStore(store: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    const req = tx.objectStore(store).clear()
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export const db = {
  async loadSettings(): Promise<AppSettings> {
    const saved = await get<AppSettings>('settings', 'main')
    return { ...DEFAULT_SETTINGS, ...saved }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await put('settings', 'main', settings)
  },

  async loadKanaStats(): Promise<Record<string, KanaStat>> {
    const saved = await get<Record<string, KanaStat>>('kanaStats', 'all')
    return saved ?? {}
  },

  async saveKanaStats(stats: Record<string, KanaStat>): Promise<void> {
    await put('kanaStats', 'all', stats)
  },

  async addSession(session: Omit<Session, 'id'>): Promise<void> {
    await add('sessions', session)
  },

  async loadSessions(): Promise<Session[]> {
    return getAll<Session>('sessions')
  },

  async clearAll(): Promise<void> {
    await clearStore('settings')
    await clearStore('kanaStats')
    await clearStore('sessions')
  },

  async exportJSON(): Promise<string> {
    const settings = await this.loadSettings()
    const kanaStats = await this.loadKanaStats()
    const sessions = await this.loadSessions()
    return JSON.stringify({ settings, kanaStats, sessions }, null, 2)
  },
}
