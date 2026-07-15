import { transliterate } from "transliteration";

export function slugify(text: string): string {
  return transliterate(text) // "Химфакт" → "Himfakt"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // всё не-латиница → дефис
    .replace(/^-+|-+$/g, ""); // убрать дефисы по краям
}
