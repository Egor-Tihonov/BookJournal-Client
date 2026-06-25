# Book Journal — фронтенд

Дневник чтения. Перенос статического HTML/CSS-макета на **Vite + React + TypeScript + react-bootstrap**.
Дизайн сохранён один-в-один; демо-данные убраны — приложение работает на пустом
in-memory сторе, который рассчитан на замену реальным бэкендом.

---

## 1. Стек и запуск

| | |
|---|---|
| Сборщик | Vite 5 |
| UI | React 18 + TypeScript |
| Компоненты | react-bootstrap 2 (модалки) + кастомный CSS |
| Роутинг | react-router-dom 6 |

```bash
npm install
npm run dev      # дев-сервер: http://localhost:5173
npm run build    # прод-сборка: tsc --noEmit + vite build → dist/
npm run preview  # локальный предпросмотр прод-сборки
npm run lint     # только проверка типов (tsc --noEmit)
```

> ⚠️ Данные сейчас живут только в памяти и **сбрасываются при перезагрузке страницы** —
> это ожидаемо до подключения бэкенда (или localStorage). См. раздел 5.

---

## 2. Архитектура в двух словах

```
                       ┌─────────────────────────────┐
   UI-состояние   ───► │  ModalsContext  (ui/)        │  какие модалки открыты
   (модалки)           └─────────────────────────────┘
                                  ▲
   Экраны/компоненты ─────────────┤ читают данные и вызывают действия
   (pages/, components/)          ▼
                       ┌─────────────────────────────┐
   Данные         ───► │  BookJournalContext (data/)  │  ◄── ЕДИНСТВЕННАЯ точка
   (книги/записи)      │  книги, записи, профиль       │      интеграции с бэком
                       │  + действия add/update/get    │
                       └─────────────────────────────┘
```

Главный принцип: **компоненты не знают, откуда берутся данные**. Они только вызывают
методы из `useJournal()` (`addBook`, `addEntry`, `getBook`, …). Поэтому переезд с
in-memory на HTTP-бэкенд затрагивает **один файл** — `BookJournalContext.tsx` — а экраны
не меняются (см. раздел 5).

---

## 3. Карта файлов — что где лежит

```
web/
├── index.html              шаблон Vite + подключение Google Fonts (Spectral / IBM Plex Sans)
├── vite.config.ts           конфиг сборщика
├── tsconfig.json            конфиг TypeScript
└── src/
    ├── main.tsx             точка входа: импорт bootstrap.css → index.css → <App/>
    ├── App.tsx              провайдеры + роутинг (все маршруты здесь)
    ├── index.css            ВЕСЬ дизайн макета (токены, классы, адаптив)
    ├── vite-env.d.ts        типы Vite
    │
    ├── types.ts             доменная модель: Book, DiaryEntry, статусы, виды записей
    ├── utils.ts             склонения (countBooks/countEntries), дата, палитра обложек
    │
    ├── data/
    │   ├── BookJournalContext.tsx   ◄── СТОР: данные + действия. Здесь подключается бэкенд
    │   └── catalog.ts               заглушка внешнего поиска книг (экран «Добавить»)
    ├── ui/
    │   └── ModalsContext.tsx        состояние модалок (открыта/закрыта, для какой книги)
    │
    ├── components/
    │   ├── Layout.tsx        каркас: Sidebar + TopBar + <Outlet/> + модалки
    │   ├── Sidebar.tsx       левое меню: навигация, статусы со счётчиками, профиль
    │   ├── TopBar.tsx        верх: поиск, «Записать мысль», «Добавить книгу»
    │   ├── HomeRedirect.tsx  редирект «/» → текущая читаемая книга (или библиотека)
    │   ├── Cover.tsx         цветной «корешок» книги
    │   ├── EmptyState.tsx    единое оформление пустых состояний
    │   └── modals/
    │       ├── QuickNoteModal.tsx   «Записать мысль» (мысль/цитата)
    │       └── ReviewModal.tsx      «Впечатление» (отзыв + оценка)
    │
    └── pages/                ОДИН файл = ОДИН экран (маршрут)
        ├── LibraryPage.tsx   «/library»     библиотека (полки по статусам)
        ├── FeedPage.tsx      «/feed»        лента всех записей
        ├── BookPage.tsx      «/book/:id»    карточка книги + дневник + переключатель статуса
        ├── AddBookPage.tsx   «/add»         форма добавления (поиск по каталогу / вручную)
        └── SettingsPage.tsx  «/settings»    профиль и настройки
```

**Маршруты:** «/» — это `HomeRedirect`: открывает книгу, которую читаешь сейчас (где была
последняя запись), иначе — библиотеку `/library`. Сама библиотека живёт на `/library`,
ссылки «Библиотека» и логотип ведут туда / в текущую книгу.

---

## 4. Куда добавлять клиентскую логику

| Что нужно сделать | Куда писать |
|---|---|
| Изменить вид экрана, вёрстку, тексты | соответствующий файл в `pages/` или `components/` |
| Локальное состояние одного экрана (поля формы, табы) | `useState` прямо в компоненте (как в `AddBookPage`) |
| Работа с данными (книги, записи, профиль) | `data/BookJournalContext.tsx` — добавить метод в `BookJournalState` |
| Открыть/закрыть модалку из любого места | `ui/ModalsContext.tsx` (`openNote`, `openReview`, …) |
| Новый тип/поле сущности | `types.ts` (затем форма + отображение) |
| Запросы на сервер | `data/BookJournalContext.tsx` + новый слой `src/api/` (раздел 5) |

**Правило:** любая операция над данными должна проходить через `useJournal()`, а не через
прямые `fetch` внутри экранов. Так бэкенд остаётся в одном месте, а компоненты тестируемы и
переиспользуемы.

Пример использования стора в компоненте:

```tsx
import { useJournal } from '../data/BookJournalContext'

function Example() {
  const { books, addBook, booksByStatus, totalBooks } = useJournal()
  // ...
}
```

---

## 5. Подключение бэкенда (главное)

Сейчас стор хранит данные в `useState` и генерирует id на клиенте (`newId()`).
Чтобы перейти на реальный API, нужно поменять **только** `BookJournalContext.tsx`.
Интерфейс `useJournal()` остаётся прежним → экраны не трогаем.

### Шаг 1. Завести слой API

Создайте `src/api/client.ts` — общий помощник запросов:

```ts
const BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.status === 204 ? (undefined as T) : res.json()
}
```

И `src/api/books.ts` — конкретные вызовы:

```ts
import { api } from './client'
import type { Book, DiaryEntry } from '../types'

export const listBooks   = () => api<Book[]>('/books')
export const listEntries = () => api<DiaryEntry[]>('/entries')
export const createBook  = (b: Omit<Book, 'id'>) =>
  api<Book>('/books', { method: 'POST', body: JSON.stringify(b) })
export const patchBook   = (id: string, patch: Partial<Book>) =>
  api<Book>(`/books/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
export const createEntry = (e: Omit<DiaryEntry, 'id' | 'createdAt'>) =>
  api<DiaryEntry>('/entries', { method: 'POST', body: JSON.stringify(e) })
```

> Базовый URL берётся из `VITE_API_URL` (положите в `web/.env`, напр. `VITE_API_URL=http://localhost:8080/api`).
> Если бэкенд на Go отдаётся с того же origin — оставьте `/api` и настройте `server.proxy` в `vite.config.ts` для дева.

### Шаг 2. Переписать провайдер на API

В [`data/BookJournalContext.tsx`](src/data/BookJournalContext.tsx) — загрузка при старте и
действия через сеть (id и `createdAt` теперь приходят с сервера, `newId()` удаляется):

```tsx
import { useEffect } from 'react'
import * as booksApi from '../api/books'

export function BookJournalProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([])
  const [entries, setEntries] = useState<DiaryEntry[]>([])

  // первичная загрузка
  useEffect(() => {
    booksApi.listBooks().then(setBooks).catch(console.error)
    booksApi.listEntries().then(setEntries).catch(console.error)
  }, [])

  const addBook = useCallback(async (input: NewBookInput) => {
    const book = await booksApi.createBook({ ...input, author: input.author ?? '' })
    setBooks((prev) => [book, ...prev])   // обновляем кэш в памяти
    return book
  }, [])

  const addEntry = useCallback(async (input: NewEntryInput) => {
    const entry = await booksApi.createEntry(input)
    setEntries((prev) => [entry, ...prev])
    return entry
  }, [])

  // updateBook — аналогично через booksApi.patchBook(...)
  // getBook / booksByStatus / entriesForBook / allEntries — без изменений (работают по кэшу)
}
```

### Шаг 3. Сделать вызовы в компонентах `await`

`addBook`/`addEntry`/`updateBook` станут асинхронными. Затронутые места:

- [`AddBookPage.tsx`](src/pages/AddBookPage.tsx) → `const submit = async () => { const book = await addBook(...); navigate(...) }`
- [`QuickNoteModal.tsx`](src/components/modals/QuickNoteModal.tsx), [`ReviewModal.tsx`](src/components/modals/ReviewModal.tsx) → `await addEntry(...)` / `await updateBook(...)` перед закрытием.

Тип в интерфейсе тоже поменяйте: `addBook: (input) => Promise<Book>` и т.д.

> Если backend медленный — добавьте оптимистичное обновление (сначала `setBooks`, потом запрос
> с откатом при ошибке) и состояние загрузки/ошибки в провайдере.

### Поиск книг в форме добавления

Экран «Добавить книгу» ищет по внешнему каталогу через [`data/catalog.ts`](src/data/catalog.ts)
(`searchCatalog`) — сейчас это локальная заглушка. Замените на запрос к бэкенду
(`GET /search?q=…`), сделав функцию асинхронной и вызвав её с debounce в `AddBookPage`.
Это **не** библиотека пользователя, а внешняя база книг (Google Books / ISBN-сервис).

### Аутентификация / профиль

Поле `user` сейчас всегда `null` (заглушка профиля). Когда появится авторизация:
добавьте в провайдер `login()/logout()` и `setUser`, грузите профиль в том же `useEffect`,
а в [`SettingsPage.tsx`](src/pages/SettingsPage.tsx) / [`Sidebar.tsx`](src/components/Sidebar.tsx)
ветки `user ? … : …` уже готовы.

### Промежуточный вариант без бэкенда

Чтобы данные не пропадали между перезагрузками до появления API — сохраняйте `books`/`entries`
в `localStorage` (`useEffect(() => localStorage.setItem(...), [books])` + чтение в инициализаторе
`useState`). Менять снова только `BookJournalContext.tsx`.

---

## 6. Рецепты

### Добавить новое поле книге (например `isbn`)
1. `types.ts` → добавить поле в `interface Book` (и в `NewBookInput` в сторе, если задаётся при создании).
2. `AddBookPage.tsx` → поле ввода + прокинуть в `addBook({ … })`.
3. `BookPage.tsx` → отобразить.
4. (с бэком) убедиться, что API возвращает/принимает поле.

### Добавить новый экран
1. Создать `pages/NewPage.tsx`.
2. `App.tsx` → `<Route path="/new" element={<NewPage />} />` внутри маршрута с `<Layout/>`.
3. (если нужен пункт меню) `Sidebar.tsx` → `<NavLink to="/new">…`.

### Добавить новую модалку
1. `ui/ModalsContext.tsx` → состояние `xxxOpen` + `openXxx/closeXxx`.
2. `components/modals/XxxModal.tsx` → разметка на `<Modal … contentClassName="bj-sheet" dialogClassName="bj-sheet-dialog">`.
3. `components/Layout.tsx` → отрендерить `<XxxModal />`.

### Добавить статус книги
`types.ts` → расширить `BookStatus`, `STATUS_META` (подпись + цвет) и при необходимости `STATUS_ORDER`.
Сайдбар, фильтры и сегмент-контрол на форме подхватят автоматически.

### Сессии чтения
Статус книги в карточке меняется через `setStatus(id, status)` из стора (НЕ `updateBook`):
«Читаю» открывает новую `ReadingSession` (`startedAt`), любой другой статус — включая ссылку
«Завершить» (= `setStatus(id, 'read')`) — закрывает текущую (`endedAt`). Открытая сессия = «идёт
сейчас», последняя закрытая = «прошлый раз». Модель — `Book.sessions` в [`types.ts`](src/types.ts).

**Записи привязаны к чтению:** кнопка «+ Записать мысль» в карточке видна только при статусе
«Читаю»; глобальная «Записать мысль» (верхняя панель) предлагает выбрать книгу из читаемых
сейчас (`booksByStatus('reading')`), а не добавить новую. При добавлении книги статус по
умолчанию — «Хочу читать».

---

## 7. Соглашения по стилям

- **Весь дизайн** — в [`src/index.css`](src/index.css). Дизайн-токены (цвета, шрифты) — в `:root`
  (`--paper`, `--ink`, `--accent`, `--serif`, `--sans`, …). Меняйте палитру там.
- Bootstrap подключён ради `Modal` и базового reset. Имена классов, конфликтующие с Bootstrap,
  переименованы: **`.btn` → `.bj-btn`**, **`.nav` → `.bj-nav`**; модалки оформляются классами
  **`.bj-sheet` / `.bj-sheet-dialog`**. Не вводите классы `btn`/`nav`/`modal` в кастомном CSS.
- Кнопки — нативный `<button className="bj-btn">` (вариант `ghost`, `wide`). react-bootstrap
  `Button`/`Form` намеренно не используются, чтобы не тащить бутстраповский вид поверх макета.
- Ссылки-карточки (`.bookrow`, `.tile`, `.recall`, навигация) — это `<Link>` из роутера;
  подчёркивание ссаок из Bootstrap сброшено глобально (`a { text-decoration: none; color: inherit }`).

> Известное ограничение, унаследованное от исходного макета: сайдбар (268px) не сворачивается
> на узких экранах — адаптив в оригинале был только для полок/сеток. При необходимости мобильного
> меню — выносится отдельной задачей (бургер / `Offcanvas`).
