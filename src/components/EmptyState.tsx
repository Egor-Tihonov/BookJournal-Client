import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  text?: string
  action?: ReactNode
}

/** Единое оформление пустых состояний (нет данных — место под реальный контент). */
export default function EmptyState({ icon = '✦', title, text, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="ic">{icon}</div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}
