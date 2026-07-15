export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\sа-яё-]/gi, "") // Удаляем спецсимволы
    .replace(/\s+/g, "-") // Пробелы на дефисы
    .replace(/ё/g, "e"); // Ё на е
}
