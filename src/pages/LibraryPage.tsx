import { Link } from 'react-router-dom'
import { useJournal } from '../data/BookJournalContext'
import { STATUS_META, type Book } from '../types'
import Cover from '../components/Cover'
import EmptyState from '../components/EmptyState'
import { countBooks, countEntries, formatDate } from '../utils'

function Shelf({ title, books }: { title: string; books: Book[] }) {
  return (
    <>
      <div className="sec">
        <h2>{title}</h2>
        <span>{books.length}</span>
      </div>
      <div className="shelf">
        {books.map((b) => (
          <Link key={b.id} className="tile" to={`/book/${b.id}`}>
            <Cover gradient={b.cover} />
            <b>{b.title}</b>
          </Link>
        ))}
        <Link className="tile add" to="/add">
          <Cover>+</Cover>
          <b>добавить</b>
        </Link>
      </div>
    </>
  )
}

export default function LibraryPage() {
  const { books, booksByStatus, entriesForBook, allEntries, totalBooks, totalEntries } = useJournal()

  if (totalBooks === 0) {
    return (
      <section className="view">
        <div className="wrap">
          <div className="eyebrow">МОЯ БИБЛИОТЕКА</div>
          <h1>Здесь будут ваши книги</h1>
          <EmptyState
            title="Библиотека пуста"
            text="Добавьте первую книгу — и ведите по ней дневник чтения: мысли, цитаты, впечатления."
            action={
              <Link className="bj-btn" to="/add">
                + Добавить книгу
              </Link>
            }
          />
        </div>
      </section>
    )
  }

  const reading = booksByStatus('reading')
  const want = booksByStatus('want')
  const read = booksByStatus('read')

  const latestQuote = allEntries().find((e) => e.kind === 'quote')
  const recallBook = latestQuote ? books.find((b) => b.id === latestQuote.bookId) : undefined

  return (
    <section className="view">
      <div className="wrap">
        <div className="eyebrow">МОЯ БИБЛИОТЕКА</div>
        <h1>
          {countBooks(totalBooks)}, {countEntries(totalEntries)}
        </h1>

        {latestQuote && recallBook && (
          <Link className="recall" to={`/book/${recallBook.id}`}>
            <Cover gradient={recallBook.cover} />
            <div>
              <div className="tag">
                <span className="dot" style={{ background: STATUS_META.reading.color }} />
                ОДНАЖДЫ ТЫ ЗАПИСАЛ
              </div>
              <q>{latestQuote.text}</q>
              <div className="meta">
                {recallBook.title} · {recallBook.author} · {formatDate(latestQuote.createdAt)}
              </div>
            </div>
          </Link>
        )}

        {reading.length > 0 && (
          <>
            <div className="sec">
              <h2>ЧИТАЮ</h2>
              <span>{reading.length}</span>
            </div>
            <div className="reading">
              {reading.map((b) => {
                const n = entriesForBook(b.id).length
                return (
                  <Link key={b.id} className="bookrow" to={`/book/${b.id}`}>
                    <Cover gradient={b.cover} />
                    <div className="info">
                      <b>{b.title}</b>
                      {b.author && <div className="au">{b.author}</div>}
                      <div className="st">{n > 0 ? countEntries(n) : 'нет записей'}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {want.length > 0 && <Shelf title="ХОЧУ ЧИТАТЬ" books={want} />}
        {read.length > 0 && <Shelf title="ПРОЧИТАЛ" books={read} />}
      </div>
    </section>
  )
}
