/** Русское склонение: plural(2, ['книга','книги','книг']) -> 'книги' */
export function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

export function countBooks(n: number): string {
  return `${n} ${plural(n, ['книга', 'книги', 'книг'])}`
}

export function countEntries(n: number): string {
  return `${n} ${plural(n, ['запись', 'записи', 'записей'])}`
}

const dateFmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : dateFmt.format(d)
}

/** Палитра обложек из исходного макета. */
export const COVERS = [
  'linear-gradient(135deg,#7c5a44,#5e4332)',
  'linear-gradient(135deg,#5a6b7c,#3f4d5e)',
  'linear-gradient(135deg,#6b5b6a,#4f4255)',
  'linear-gradient(135deg,#5a6b5f,#42514a)',
  'linear-gradient(135deg,#9a8454,#766440)',
  'linear-gradient(135deg,#7c4f4f,#5e3939)',
  'linear-gradient(135deg,#4f6b6b,#395252)',
  'linear-gradient(135deg,#8a6a4f,#665039)',
  'linear-gradient(135deg,#6e6256,#4f463c)',
  'linear-gradient(135deg,#566b6e,#3e4f52)',
  'linear-gradient(135deg,#7a5a6b,#5a4150)',
  'linear-gradient(135deg,#5f6b4f,#46513a)',
]

/** Детерминированный выбор обложки по строке (без случайностей). */
export function pickCover(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i)) % COVERS.length
  return COVERS[h]
}
