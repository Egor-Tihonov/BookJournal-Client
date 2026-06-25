export type BookStatus = 'want' | 'reading' | 'read'

/** Сессия чтения. Открытая (endedAt отсутствует) = «идёт сейчас». */
export interface ReadingSession {
  id: string
  startedAt: string
  endedAt?: string
}

export interface Book {
  id: string
  title: string
  author: string
  year?: number
  pages?: number
  /** CSS-градиент обложки, например 'linear-gradient(135deg,#7c5a44,#5e4332)' */
  cover?: string
  status: BookStatus
  /** «Почему добавил» */
  reason?: string
  /** Финальный отзыв */
  review?: string
  /** Оценка для себя, 1–5 */
  rating?: number
  /** Сессии чтения, от старых к новым */
  sessions?: ReadingSession[]
}

export type EntryKind = 'thought' | 'quote'

export interface DiaryEntry {
  id: string
  bookId: string
  kind: EntryKind
  text: string
  /** Номер страницы (для цитат) */
  page?: number
  /** ISO-дата создания */
  createdAt: string
}

export interface UserProfile {
  name: string
  email: string
}

export const STATUS_META: Record<BookStatus, { label: string; color: string }> = {
  reading: { label: 'Читаю', color: '#9c5a3c' },
  want: { label: 'Хочу читать', color: '#c7bba6' },
  read: { label: 'Прочитал', color: '#7c8b76' },
}

export const STATUS_ORDER: BookStatus[] = ['reading', 'want', 'read']

/** Порядок для сегмент-контролов (форма добавления, переключатель статуса в книге). */
export const STATUS_SEG_ORDER: BookStatus[] = ['want', 'reading', 'read']
