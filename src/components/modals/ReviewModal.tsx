import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useJournal } from '../../data/BookJournalContext'
import { useModals } from '../../ui/ModalsContext'

export default function ReviewModal() {
  const { reviewOpen, reviewBookId, closeReview } = useModals()
  const { getBook, updateBook } = useJournal()
  const book = reviewBookId ? getBook(reviewBookId) : undefined

  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (reviewOpen) {
      setText(book?.review ?? '')
      setRating(book?.rating ?? 0)
    }
  }, [reviewOpen, book])

  const save = () => {
    if (!book) return
    updateBook(book.id, { review: text.trim() || undefined, rating: rating || undefined })
    closeReview()
  }

  return (
    <Modal
      show={reviewOpen}
      onHide={closeReview}
      centered
      dialogClassName="bj-sheet-dialog"
      contentClassName="bj-sheet"
    >
      <button className="x" type="button" onClick={closeReview} aria-label="Закрыть">
        ×
      </button>
      <h3>Впечатление</h3>
      <div className="sub">
        Когда дочитаешь — оставь себе пару слов. Не для оценки, для памяти.
      </div>
      <textarea
        placeholder="Что осталось после книги…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="foot" style={{ border: 'none' }}>
        <div>
          <div className="flabel" style={{ margin: '0 0 9px' }}>
            ОЦЕНКА · ТОЛЬКО ДЛЯ ВАС
          </div>
          <div className="dots">
            {[1, 2, 3, 4, 5].map((n) => (
              <i
                key={n}
                className={n <= rating ? undefined : 'off'}
                onClick={() => setRating(n === rating ? 0 : n)}
                role="button"
                aria-label={`Оценка ${n}`}
              />
            ))}
          </div>
        </div>
        <button className="bj-btn" type="button" onClick={save} disabled={!book}>
          Сохранить
        </button>
      </div>
    </Modal>
  )
}
