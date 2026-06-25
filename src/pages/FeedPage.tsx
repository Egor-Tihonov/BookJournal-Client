import { Link } from 'react-router-dom'
import { useJournal } from '../data/BookJournalContext'
import EmptyState from '../components/EmptyState'
import { countEntries, formatDate } from '../utils'

export default function FeedPage() {
  const { allEntries, getBook } = useJournal()
  const entries = allEntries()

  return (
    <section className="view">
      <div className="wrap">
        <div className="eyebrow">ЛЕНТА ДНЕВНИКА</div>
        <h1>{entries.length > 0 ? countEntries(entries.length) : 'Лента дневника'}</h1>

        {entries.length === 0 ? (
          <EmptyState
            icon="◷"
            title="Записей пока нет"
            text="Мысли и цитаты из всех книг будут собираться здесь — от свежих к старым."
            action={
              <Link className="bj-btn" to="/library">
                К библиотеке
              </Link>
            }
          />
        ) : (
          <div className="timeline" style={{ marginTop: 28 }}>
            {entries.map((e) => {
              const book = getBook(e.bookId)
              return (
                <div key={e.id} className={e.kind === 'quote' ? 'entry q' : 'entry'}>
                  <div className="h">
                    <span className="kind">{e.kind === 'quote' ? 'ЦИТАТА' : 'МЫСЛЬ'}</span>
                    <span className="when">
                      {book && (
                        <>
                          <Link className="link" to={`/book/${book.id}`}>
                            {book.title}
                          </Link>
                          {' · '}
                        </>
                      )}
                      {e.kind === 'quote' && e.page ? `стр. ${e.page} · ` : ''}
                      {formatDate(e.createdAt)}
                    </span>
                  </div>
                  <p>{e.text}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
