import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useModals } from '../ui/ModalsContext'

export default function TopBar() {
  const { openNote } = useModals()
  const [query, setQuery] = useState('')

  return (
    <div className="top">
      <input
        className="search"
        type="search"
        placeholder="⌕  Поиск по библиотеке…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Поиск по библиотеке"
      />
      <div className="spacer" />
      <button className="bj-btn ghost" type="button" onClick={() => openNote()}>
        ✎ Записать мысль
      </button>
      <Link className="bj-btn" to="/add">
        + Добавить книгу
      </Link>
    </div>
  )
}
