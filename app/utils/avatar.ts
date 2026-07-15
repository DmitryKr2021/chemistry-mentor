export type AvatarGender = "boy" | "girl";

/**
 * Определяет пол аватара по последней букве имени.
 * Гласные + мягкий знак → girl, остальное → boy
 */
export function getAvatarByLastLetter(name: string): AvatarGender {
  if (!name || typeof name !== "string") return "boy";

  // Ищем последний блок кириллицы (игнорируем пробелы, кавычки, точки)
  const match = name.trim().match(/[а-яёА-ЯЁ]+$/);
  if (!match) return "boy";

  const lastChar = match[0].slice(-1).toLowerCase();
  const femaleEndings = new Set([
    "а",
    "е",
    "ё",
    "и",
    "о",
    "у",
    "ы",
    "э",
    "ю",
    "я",
    "ь",
  ]);

  return femaleEndings.has(lastChar) ? "girl" : "boy";
}
