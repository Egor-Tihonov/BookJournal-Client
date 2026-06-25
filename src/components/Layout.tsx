import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import QuickNoteModal from './modals/QuickNoteModal'
import ReviewModal from './modals/ReviewModal'

export default function Layout() {
  const location = useLocation()
  const bodyRef = useRef<HTMLDivElement>(null)

  // Сброс прокрутки контента при смене экрана (как в исходном макете).
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <>
      <Sidebar />
      <main className="main">
        <TopBar />
        <div className="body" ref={bodyRef}>
          <Outlet />
        </div>
      </main>

      <QuickNoteModal />
      <ReviewModal />
    </>
  )
}
