import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BookJournalProvider } from './data/BookJournalContext'
import { ModalsProvider } from './ui/ModalsContext'
import Layout from './components/Layout'
import HomeRedirect from './components/HomeRedirect'
import LibraryPage from './pages/LibraryPage'
import FeedPage from './pages/FeedPage'
import BookPage from './pages/BookPage'
import AddBookPage from './pages/AddBookPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BookJournalProvider>
      <ModalsProvider>
        <BrowserRouter>
          <Routes>
            {/* «/» открывает текущую читаемую книгу (или библиотеку, если книг нет) */}
            <Route path="/" element={<HomeRedirect />} />
            <Route element={<Layout />}>
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/book/:id" element={<BookPage />} />
              <Route path="/add" element={<AddBookPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ModalsProvider>
    </BookJournalProvider>
  )
}
