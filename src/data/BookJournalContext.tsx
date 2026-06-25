import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Book, BookStatus, DiaryEntry, EntryKind, UserProfile } from '../types'

interface NewBookInput {
  title: string
  author?: string
  year?: number
  pages?: number
  cover?: string
  status: BookStatus
  reason?: string
}

interface NewEntryInput {
  bookId: string
  kind: EntryKind
  text: string
  page?: number
}

interface BookJournalState {
  books: Book[]
  entries: DiaryEntry[]
  user: UserProfile | null

  getBook: (id: string) => Book | undefined
  booksByStatus: (status: BookStatus) => Book[]
  entriesForBook: (bookId: string) => DiaryEntry[]
  /** Все записи в обратном хронологическом порядке (для ленты дневника) */
  allEntries: () => DiaryEntry[]

  addBook: (input: NewBookInput) => Book
  updateBook: (id: string, patch: Partial<Book>) => void
  /** Смена статуса с управлением сессиями чтения */
  setStatus: (id: string, status: BookStatus) => void
  addEntry: (input: NewEntryInput) => DiaryEntry

  totalBooks: number
  totalEntries: number
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`

const nowIso = () => new Date().toISOString()

const BookJournalContext = createContext<BookJournalState | null>(null)

/**
 * In-memory хранилище. Намеренно начинается пустым (без демо-данных) —
 * место, куда позже подключается реальный API/бэкенд.
 */
export function BookJournalProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([])
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [user] = useState<UserProfile | null>(null)

  const getBook = useCallback((id: string) => books.find((b) => b.id === id), [books])

  const booksByStatus = useCallback(
    (status: BookStatus) => books.filter((b) => b.status === status),
    [books],
  )

  const entriesForBook = useCallback(
    (bookId: string) =>
      entries
        .filter((e) => e.bookId === bookId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [entries],
  )

  const allEntries = useCallback(
    () => [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [entries],
  )

  const addBook = useCallback((input: NewBookInput) => {
    const book: Book = {
      id: newId(),
      title: input.title.trim(),
      author: (input.author ?? '').trim(),
      year: input.year,
      pages: input.pages,
      cover: input.cover,
      status: input.status,
      reason: input.reason?.trim() || undefined,
      // если книга добавлена как «Читаю» — сразу открываем сессию чтения
      sessions: input.status === 'reading' ? [{ id: newId(), startedAt: nowIso() }] : [],
    }
    setBooks((prev) => [book, ...prev])
    return book
  }, [])

  const updateBook = useCallback((id: string, patch: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }, [])

  // Смена статуса с учётом сессий чтения:
  // «Читаю» открывает новую сессию (если нет открытой),
  // любой другой статус («Прочитал»/«Хочу читать», в т.ч. «Завершить») закрывает текущую.
  const setStatus = useCallback((id: string, status: BookStatus) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== id || b.status === status) return b
        let sessions = b.sessions ?? []
        const ongoing = sessions.find((s) => !s.endedAt)
        if (status === 'reading') {
          if (!ongoing) sessions = [...sessions, { id: newId(), startedAt: nowIso() }]
        } else if (ongoing) {
          sessions = sessions.map((s) => (s.id === ongoing.id ? { ...s, endedAt: nowIso() } : s))
        }
        return { ...b, status, sessions }
      }),
    )
  }, [])

  const addEntry = useCallback((input: NewEntryInput) => {
    const entry: DiaryEntry = {
      id: newId(),
      bookId: input.bookId,
      kind: input.kind,
      text: input.text.trim(),
      page: input.page,
      createdAt: new Date().toISOString(),
    }
    setEntries((prev) => [entry, ...prev])
    return entry
  }, [])

  const value = useMemo<BookJournalState>(
    () => ({
      books,
      entries,
      user,
      getBook,
      booksByStatus,
      entriesForBook,
      allEntries,
      addBook,
      updateBook,
      setStatus,
      addEntry,
      totalBooks: books.length,
      totalEntries: entries.length,
    }),
    [
      books,
      entries,
      user,
      getBook,
      booksByStatus,
      entriesForBook,
      allEntries,
      addBook,
      updateBook,
      setStatus,
      addEntry,
    ],
  )

  return <BookJournalContext.Provider value={value}>{children}</BookJournalContext.Provider>
}

export function useJournal() {
  const ctx = useContext(BookJournalContext)
  if (!ctx) throw new Error('useJournal must be used within BookJournalProvider')
  return ctx
}
