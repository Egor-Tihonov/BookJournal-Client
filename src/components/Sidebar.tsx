import { Link, NavLink } from 'react-router-dom'
import { useJournal } from '../data/BookJournalContext'
import { STATUS_META, STATUS_ORDER } from '../types'

const navLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'on' : undefined)

export default function Sidebar() {
  const { booksByStatus, user } = useJournal()

  return (
    <aside className="side">
      <Link to="/" className="brand">
        <span className="logo" />
        <span>
          <b>Book Journal</b>
          <small>дневник чтения</small>
        </span>
      </Link>

      <nav className="bj-nav">
        <NavLink to="/library" end className={navLinkClass}>
          <span
            style={{
              width: 16,
              height: 16,
              border: '1.6px solid currentColor',
              borderRadius: '2px 3px 3px 2px',
            }}
          />
          Библиотека
        </NavLink>
        <NavLink to="/feed" className={navLinkClass}>
          <span
            style={{
              width: 16,
              height: 16,
              border: '1.6px solid currentColor',
              borderRadius: '50%',
            }}
          />
          Лента дневника
        </NavLink>
      </nav>

      <div className="label">СТАТУСЫ</div>
      {STATUS_ORDER.map((status) => (
        <Link key={status} to="/library" className="stat">
          <span className="l">
            <span className="dot" style={{ background: STATUS_META[status].color }} />
            {STATUS_META[status].label}
          </span>
          <span className="n">{booksByStatus(status).length}</span>
        </Link>
      ))}

      <div className="grow" />
      <Link to="/settings" className="me">
        <span className="ava">{user ? user.name.charAt(0) : '·'}</span>
        <span>
          <b>{user ? user.name : 'Профиль'}</b>
          <small>{user ? user.email : 'Войти или создать'}</small>
        </span>
        <span style={{ color: 'var(--faint)' }}>›</span>
      </Link>
    </aside>
  )
}
