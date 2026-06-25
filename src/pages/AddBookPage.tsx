import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useJournal } from '../data/BookJournalContext'
import { STATUS_META, STATUS_SEG_ORDER, type BookStatus } from '../types'
import { searchCatalog, type CatalogBook } from '../data/catalog'
import { pickCover } from '../utils'
import Cover from '../components/Cover'

export default function AddBookPage() {
  const navigate = useNavigate()
  const { addBook } = useJournal()

  // Поиск по каталогу
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<CatalogBook | null>(null)

  // Ручной ввод
  const [manual, setManual] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')
  const [pages, setPages] = useState('')

  const [status, setStatus] = useState<BookStatus>('want')
  const [reason, setReason] = useState('')

  const results = useMemo(() => searchCatalog(query), [query])
  const canSubmit = manual ? title.trim().length > 0 : selected !== null

  const goManual = () => {
    setManual(true)
    setSelected(null)
    if (!title) setTitle(query)
  }

  const submit = () => {
    if (!canSubmit) return
    const base = manual
      ? {
          title,
          author,
          year: year ? Number(year) : undefined,
          pages: pages ? Number(pages) : undefined,
          cover: pickCover(title),
        }
      : {
          title: selected!.title,
          author: selected!.author,
          year: selected!.year,
          cover: selected!.cover,
        }
    const book = addBook({ ...base, status, reason })
    navigate(`/book/${book.id}`)
  }

  return (
    <section className="view">
      <div className="narrow">
        <Link className="back" to="/library">
          ‹ Библиотека
        </Link>
        <h1>Новая книга</h1>

        {!manual ? (
          <>
            <input
              className="field"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="⌕  Поиск по названию или ISBN…"
              autoFocus
            />

            {results.length > 0 && (
              <div className="results">
                {results.map((b) => {
                  const isSel =
                    selected != null &&
                    selected.title === b.title &&
                    selected.author === b.author
                  return (
                    <button
                      key={`${b.title}-${b.author}`}
                      type="button"
                      className={isSel ? 'res on' : 'res'}
                      onClick={() => setSelected(b)}
                    >
                      <Cover gradient={b.cover} />
                      <div>
                        <b>{b.title}</b>
                        <small>{[b.author, b.year, b.publisher].filter(Boolean).join(' · ')}</small>
                      </div>
                      {isSel && (
                        <span className="link" style={{ marginLeft: 'auto' }}>
                          выбрано ✓
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            <div className="center">
              <button className="link" type="button" onClick={goManual}>
                Нет в базе? Ввести вручную
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flabel">НАЗВАНИЕ</div>
            <input
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название книги…"
              autoFocus
            />

            <div className="flabel">АВТОР</div>
            <input
              className="field"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Имя автора"
            />

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div className="flabel">ГОД</div>
                <input
                  className="field"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="—"
                />
              </div>
              <div style={{ flex: 1 }}>
                <div className="flabel">СТРАНИЦ</div>
                <input
                  className="field"
                  type="number"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="—"
                />
              </div>
            </div>

            <div className="center">
              <button className="link" type="button" onClick={() => setManual(false)}>
                ‹ Вернуться к поиску
              </button>
            </div>
          </>
        )}

        <div className="flabel">СТАТУС</div>
        <div className="seg">
          {STATUS_SEG_ORDER.map((s) => (
            <div key={s} className={status === s ? 'on' : undefined} onClick={() => setStatus(s)}>
              {STATUS_META[s].label}
            </div>
          ))}
        </div>

        <div className="flabel">ПОЧЕМУ ДОБАВИЛ</div>
        <textarea
          placeholder="Пара слов на будущее — что зацепило, кто посоветовал…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button className="bj-btn wide" type="button" onClick={submit} disabled={!canSubmit}>
          Добавить в библиотеку
        </button>
      </div>
    </section>
  )
}
