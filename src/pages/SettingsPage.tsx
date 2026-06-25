import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJournal } from '../data/BookJournalContext'

export default function SettingsPage() {
  const { user } = useJournal()
  const [sync, setSync] = useState(false)

  return (
    <section className="view">
      <div className="narrow">
        <Link className="back" to="/library">
          ‹ Библиотека
        </Link>
        <h1>Профиль и настройки</h1>

        <div className="profile">
          <span className="ava">{user ? user.name.charAt(0) : '·'}</span>
          <div style={{ flex: 1 }}>
            <b>{user ? user.name : 'Профиль не настроен'}</b>
            <small>{user ? user.email : 'Добавьте имя и почту'}</small>
          </div>
          <button className="link" type="button">
            {user ? 'Изменить' : 'Настроить'}
          </button>
        </div>

        <div className="rows">
          <div className="srow">
            <div>
              <div className="v">Приватность</div>
              <div className="d">записи хранятся локально, офлайн-first</div>
            </div>
            <span className="r">включено ›</span>
          </div>
          <div className="srow">
            <div>
              <div className="v">Синхронизация</div>
              <div className="d">между устройствами, зашифрованно</div>
            </div>
            <button
              className={sync ? 'toggle' : 'toggle off'}
              type="button"
              onClick={() => setSync((s) => !s)}
              aria-pressed={sync}
              aria-label="Синхронизация"
            />
          </div>
          <div className="srow" style={{ opacity: 0.55 }}>
            <div>
              <div className="v">Бэкап и экспорт</div>
              <div className="d">выгрузка дневника в файл</div>
            </div>
            <span
              className="r"
              style={{
                border: '1px solid rgba(44,34,24,.18)',
                padding: '3px 8px',
                borderRadius: 5,
              }}
            >
              позже
            </span>
          </div>
        </div>

        <Link className="bj-btn ghost wide" to="/library" style={{ color: 'var(--muted)' }}>
          {user ? 'Выйти из аккаунта' : 'Войти в аккаунт'}
        </Link>
      </div>
    </section>
  )
}
