import type { CSSProperties, ReactNode } from 'react'

interface CoverProps {
  /** CSS-градиент/цвет обложки */
  gradient?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Цветной корешок-обложка книги (`.cover .c`). */
export default function Cover({ gradient, className, style, children }: CoverProps) {
  return (
    <span
      className={`cover c${className ? ` ${className}` : ''}`}
      style={{ ...(gradient ? { background: gradient } : null), ...style }}
    >
      {children}
    </span>
  )
}
