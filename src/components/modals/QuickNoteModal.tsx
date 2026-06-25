import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useJournal } from '../../data/BookJournalContext'
import { useModals } from '../../ui/ModalsContext'
import type { EntryKind } from '../../types'
import Cover from '../Cover'

export default function QuickNoteModal() {
  const { noteOpen, noteBookId, closeNote } = useModals()
  const { getBook, addEntry, booksByStatus } = useJournal()

  // Книга выбирается либо снаружи (из карточки), либо тут — из читаемых.
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [kind, setKind] = useState<EntryKind>('thought')
  const [text, setText] = useState('')
  const [page, setPage] = useState('')

  const activeId = noteBookId ?? pickedId
  const book = activeId ? getBook(activeId) : undefined
  const readingBooks = booksByStatus('reading')

  // Сброс полей при каждом открытии.
  useEffect(() => {
    if (noteOpen) {
      setPickedId(null)
      setKind('thought')
      setText('')
      setPage('')
    }
  }, [noteOpen])

  const save = () => {
    if (!book || !text.trim()) return
    addEntry({
      bookId: book.id,
      kind,
      text,
      page: kind === 'quote' && page ? Number(page) : undefined,
    })
    closeNote()
  }

  return (
    <Modal
      show={noteOpen}
      onHide={closeNote}
      centered
      dialogClassName="bj-sheet-dialog"
      contentClassName="bj-sheet"
    >
      <button className="x" type="button" onClick={closeNote} aria-label="Закрыть">
        ×
      </button>

      {!book ? (
        readingBooks.length > 0 ? (
          // Выбор книги из тех, что читаются сейчас
          <>
            <h3>Записать мысль</h3>
            <div className="sub">Выберите книгу, которую читаете сейчас.</div>
            <div className="results">
              {readingBooks.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="res"
                  onClick={() => setPickedId(b.id)}
                >
                  <Cover gradient={b.cover} />
                  <div>
                    <b>{b.title}</b>
                    {b.author && <small>{b.author}</small>}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          // Нет книг в процессе чтения
          <div className="empty" style={{ padding: '28px 8px 8px' }}>
            <div className="ic">✎</div>
            <h3>Сейчас вы ничего не читаете</h3>
            <p>
              Записи можно делать только для книги в процессе чтения. Откройте книгу и переключите
              статус на «Читаю».
            </p>
            <Link className="bj-btn" to="/library" onClick={closeNote}>
              К библиотеке
            </Link>
          </div>
        )
      ) : (
        // Редактор записи для выбранной книги
        <>
          <div className="bk">
            <Cover gradient={book.cover} />
            {book.title}&nbsp;›
          </div>

          <div className="seg" style={{ marginBottom: 16 }}>
            <div className={kind === 'thought' ? 'on' : undefined} onClick={() => setKind('thought')}>
              Мысль
            </div>
            <div className={kind === 'quote' ? 'on' : undefined} onClick={() => setKind('quote')}>
              Цитата
            </div>
          </div>

          <textarea
            placeholder={kind === 'quote' ? 'Перепиши цитату…' : 'Запиши, пока не выветрилось…'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />

          <div className="foot">
            <label className="page">
              стр.&nbsp;
              <input
                type="number"
                min={1}
                value={page}
                onChange={(e) => setPage(e.target.value)}
                placeholder="—"
                disabled={kind !== 'quote'}
                style={{
                  width: 48,
                  border: 'none',
                  background: 'transparent',
                  color: 'inherit',
                  font: 'inherit',
                }}
              />
            </label>
            <button className="bj-btn" type="button" onClick={save} disabled={!text.trim()}>
              Сохранить в дневник
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
