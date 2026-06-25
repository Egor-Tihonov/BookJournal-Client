import { COVERS } from '../utils'

export interface CatalogBook {
  title: string
  author: string
  year: number
  publisher?: string
  cover: string
}

/**
 * ЗАГЛУШКА внешнего каталога книг для поиска при добавлении.
 * Это НЕ библиотека пользователя — это внешняя база (как Google Books / ISBN-сервис).
 *
 * Подключение бэкенда: замените `searchCatalog` на запрос, например
 *   export const searchCatalog = (q: string) => api<CatalogBook[]>(`/search?q=${encodeURIComponent(q)}`)
 * сделав функцию асинхронной и вызвав её в AddBookPage (useEffect/debounce).
 */
const CATALOG: CatalogBook[] = [
  { title: 'Стоунер', author: 'Джон Уильямс', year: 1965, publisher: 'АСТ', cover: COVERS[0] },
  { title: 'Облачный атлас', author: 'Дэвид Митчелл', year: 2004, publisher: 'Эксмо', cover: COVERS[1] },
  { title: 'Маятник Фуко', author: 'Умберто Эко', year: 1988, publisher: 'Corpus', cover: COVERS[2] },
  { title: 'Дорога', author: 'Кормак Маккарти', year: 2006, publisher: 'Азбука', cover: COVERS[3] },
  { title: 'Шум и ярость', author: 'Уильям Фолкнер', year: 1929, publisher: 'АСТ', cover: COVERS[4] },
  {
    title: 'Невыносимая лёгкость бытия',
    author: 'Милан Кундера',
    year: 1984,
    publisher: 'Азбука',
    cover: COVERS[5],
  },
  {
    title: 'Сто лет одиночества',
    author: 'Габриэль Гарсиа Маркес',
    year: 1967,
    publisher: 'АСТ',
    cover: COVERS[6],
  },
  { title: '1984', author: 'Джордж Оруэлл', year: 1949, publisher: 'АСТ', cover: COVERS[9] },
  {
    title: 'Великий Гэтсби',
    author: 'Фрэнсис Скотт Фицджеральд',
    year: 1925,
    publisher: 'Эксмо',
    cover: COVERS[8],
  },
  { title: 'Лолита', author: 'Владимир Набоков', year: 1955, publisher: 'Азбука', cover: COVERS[10] },
]

/** Поиск по названию/автору. Пустой запрос → несколько подсказок. */
export function searchCatalog(query: string): CatalogBook[] {
  const q = query.trim().toLowerCase()
  if (!q) return CATALOG.slice(0, 5)
  return CATALOG.filter(
    (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
  ).slice(0, 8)
}
