import { Navigate } from 'react-router-dom'
import { useJournal } from '../data/BookJournalContext'

/**
 * Точка входа «/»: открываем книгу, которую читаем сейчас —
 * ту, где была сделана последняя запись (иначе первую «Читаю», иначе любую).
 * Если книг нет — ведём в библиотеку.
 */
export default function HomeRedirect() {
  const { allEntries, getBook, booksByStatus, books } = useJournal()
  const latest = allEntries()[0]
  const current =
    (latest && getBook(latest.bookId)) || booksByStatus('reading')[0] || books[0]
  return <Navigate to={current ? `/book/${current.id}` : '/library'} replace />
}
