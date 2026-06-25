import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { Dropdown } from 'react-bootstrap'
import { STATUS_META, STATUS_SEG_ORDER, type BookStatus } from '../types'

// Кастомный «триггер» дропдауна — без бутстраповских классов кнопки.
const Toggle = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ children, onClick }, ref) => (
    <button type="button" ref={ref} className="statusdd-toggle" onClick={onClick}>
      {children}
    </button>
  ),
)
Toggle.displayName = 'StatusToggle'

interface Props {
  status: BookStatus
  onChange: (status: BookStatus) => void
}

/** Выпадающий список статуса книги. */
export default function StatusSelect({ status, onChange }: Props) {
  const current = STATUS_META[status]
  return (
    <Dropdown className="statusdd">
      <Dropdown.Toggle as={Toggle}>
        <span className="dot" style={{ background: current.color }} />
        {current.label}
        <span className="caret">▾</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="statusdd-menu">
        {STATUS_SEG_ORDER.map((s) => (
          <Dropdown.Item key={s} active={s === status} onClick={() => onChange(s)}>
            <span className="dot" style={{ background: STATUS_META[s].color }} />
            {STATUS_META[s].label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
