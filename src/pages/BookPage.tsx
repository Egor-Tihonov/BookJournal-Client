import { Link, useParams } from 'react-router-dom'
import { useJournal } from '../data/BookJournalContext'
import { useModals } from '../ui/ModalsContext'
import Cover from '../components/Cover'
import StatusSelect from '../components/StatusSelect'
import EmptyState from '../components/EmptyState'
import { countEntries, formatDate } from '../utils'

export default function BookPage() {
  const { id } = useParams<{ id: string }>()
  const { getBook, entriesForBook, setStatus } = useJournal()
  const { openNote, openReview } = useModals()
  const book = id ? getBook(id) : undefined

  if (!book) {
    return (
      <section className="view">
        <div className="wrap">
          <Link className="back" to="/library">
            ‹ Библиотека
          </Link>
          <EmptyState
            title="Книга не найдена"
            text="Возможно, она ещё не добавлена в библиотеку."
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

  const entries = entriesForBook(book.id)
  const yearLine = [book.year, book.pages ? `${book.pages} стр.` : null]
    .filter(Boolean)
    .join(' · ')

  const sessions = book.sessions ?? []
  const ongoing = sessions.find((s) => !s.endedAt)
  const lastCompleted = sessions
    .filter((s) => s.endedAt)
    .sort((a, b) => (b.endedAt ?? '').localeCompare(a.endedAt ?? ''))[0]

  return (
    <section className="view">
      <div className="wrap">
        <Link className="back" to="/library">
          ‹ Библиотека
        </Link>
        <div className="book">
          <div className="left">
            <div className="head">
              <Cover gradient={book.cover} />
              <div>
                <h2>{book.title}</h2>
                {book.author && <div className="au">{book.author}</div>}
                {yearLine && <div className="yr">{yearLine}</div>}

                {/* Переключатель статуса (выпадающий список) */}
                <StatusSelect status={book.status} onChange={(s) => setStatus(book.id, s)} />
              </div>
            </div>

            {book.reason && (
              <div className="note">
                <div className="t">ПОЧЕМУ ДОБАВИЛ</div>
                <p>{book.reason}</p>
              </div>
            )}

            {book.review && (
              <div className="note">
                <div className="t">ВПЕЧАТЛЕНИЕ</div>
                <p>{book.review}</p>
              </div>
            )}

            {(ongoing || lastCompleted) && (
              <>
                <div className="sessions">
                  <b>СЕССИИ ЧТЕНИЯ</b>
                  {ongoing && (
                    <button className="link" type="button" onClick={() => setStatus(book.id, 'read')}>
                      ● Завершить
                    </button>
                  )}
                </div>
                <div className="scards">
                  {ongoing && (
                    <div className="scard live">
                      <div className="k">идёт сейчас</div>
                      <div className="v">с {formatDate(ongoing.startedAt)}</div>
                    </div>
                  )}
                  {lastCompleted && (
                    <div className="scard">
                      <div className="k">
                        {book.status === 'read' && !ongoing ? 'прочитано' : 'прошлый раз'}
                      </div>
                      <div className="v">{formatDate(lastCompleted.endedAt ?? lastCompleted.startedAt)}</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Записывать мысли можно только пока книга читается */}
            {book.status === 'reading' && (
              <button className="bj-btn" type="button" onClick={() => openNote(book.id)}>
                + Записать мысль
              </button>
            )}
            <button className="bj-btn ghost" type="button" onClick={() => openReview(book.id)}>
              Финальный отзыв
            </button>
          </div>

          <div className="diary">
            <div className="sec">
              <h2>ДНЕВНИК</h2>
              <span>{countEntries(entries.length)}</span>
            </div>
            {entries.length === 0 ? (
              <EmptyState
                icon="✎"
                title="Дневник пуст"
                text="Здесь будут ваши мысли и цитаты по этой книге — в хронологическом порядке."
              />
            ) : (
              <div className="timeline">
                {entries.map((e) => (
                  <div key={e.id} className={e.kind === 'quote' ? 'entry q' : 'entry'}>
                    <div className="h">
                      <span className="kind">{e.kind === 'quote' ? 'ЦИТАТА' : 'МЫСЛЬ'}</span>
                      <span className="when">
                        {e.kind === 'quote' && e.page ? `стр. ${e.page} · ` : ''}
                        {formatDate(e.createdAt)}
                      </span>
                    </div>
                    <p>{e.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
