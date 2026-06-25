import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface ModalsState {
  noteOpen: boolean
  noteBookId: string | null
  reviewOpen: boolean
  reviewBookId: string | null
  /** bookId опционален: «Записать мысль» из верхней панели может открываться без выбранной книги */
  openNote: (bookId?: string | null) => void
  openReview: (bookId?: string | null) => void
  closeNote: () => void
  closeReview: () => void
}

const ModalsContext = createContext<ModalsState | null>(null)

export function ModalsProvider({ children }: { children: ReactNode }) {
  const [noteBookId, setNoteBookId] = useState<string | null>(null)
  const [noteOpen, setNoteOpen] = useState(false)
  const [reviewBookId, setReviewBookId] = useState<string | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)

  const value = useMemo<ModalsState>(
    () => ({
      noteOpen,
      noteBookId,
      reviewOpen,
      reviewBookId,
      openNote: (bookId = null) => {
        setNoteBookId(bookId)
        setNoteOpen(true)
      },
      openReview: (bookId = null) => {
        setReviewBookId(bookId)
        setReviewOpen(true)
      },
      closeNote: () => setNoteOpen(false),
      closeReview: () => setReviewOpen(false),
    }),
    [noteOpen, noteBookId, reviewOpen, reviewBookId],
  )

  return <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>
}

export function useModals() {
  const ctx = useContext(ModalsContext)
  if (!ctx) throw new Error('useModals must be used within ModalsProvider')
  return ctx
}
