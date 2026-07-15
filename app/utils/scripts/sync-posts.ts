import path from "path";
import fs from "fs/promises";
import mammoth from "mammoth";
import { prisma } from "../prisma";
import { slugify } from "../slugify";

const POSTS_ROOT =
  process.env.BLOG_CONTENT_PATH ||
  "d:/React_Apps/Chemistry-tutor/chemistry-tutor/posts/Day 01-50";

// 🔹 Конвертация DOCX → HTML
async function convertDocxToHtml(filePath: string): Promise<string> {
  const result = await mammoth.convertToHtml({ path: filePath });
  let html = result.value;
  // 🔹 Оборачиваем первый <p> в <h2>
  html = html.replace(
    /^<p>(.*?)<\/p>/,
    '<h2 class="text-3xl font-bold mb-6">$1</h2>',
  );

  return html;
}

// 🔹 Извлечение метаданных из пути
function extractMetadataFromPath(filePath: string) {
  const relative = path.relative(POSTS_ROOT, filePath);
  const parts = relative.split(path.sep);

  console.log(`🔍 Path parts:`, parts); // 🔹 Отладка

  return {
    dayNumber: parts[0] || "Неизвестно",
    rubric: parts[1] || "Общее",
    fileName: path.basename(filePath, path.extname(filePath)),
  };
}

// 🔹 Поиск изображения в папке рубрики
async function findImage(docxPath: string): Promise<string | null> {
  const dir = path.dirname(docxPath);
  const baseName = path.basename(docxPath, path.extname(docxPath));

  try {
    const files = await fs.readdir(dir);

    // 1. Сначала ищем точное совпадение имени (напр., "Статья.docx" -> "Статья.jpg")
    let image = files.find((f) => {
      const ext = path.extname(f).toLowerCase();
      return (
        f.startsWith(baseName) &&
        [".jpg", ".jpeg", ".png", ".webp"].includes(ext)
      );
    });

    // 2. Если точного совпадения нет, берем первый попавшийся рисунок в папке
    if (!image) {
      image = files.find((f) => {
        const ext = path.extname(f).toLowerCase();
        return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
      });
    }

    return image ? path.join(dir, image) : null;
  } catch {
    return null;
  }
}

// 🔹 Основная функция синхронизации
async function syncPosts() {
  console.log("🔄 Starting posts synchronization...");
  console.log(`📂 Source: ${POSTS_ROOT}`);

  // 🔹 Проверяем, существует ли папка
  try {
    await fs.access(POSTS_ROOT);
    console.log(`✅ Directory exists`);
  } catch {
    console.error(`❌ Directory not found: ${POSTS_ROOT}`);
    return;
  }

  // 🔹 Читаем содержимое корневой папки
  const rootEntries = await fs.readdir(POSTS_ROOT, { withFileTypes: true });
  console.log(
    `📁 Root entries:`,
    rootEntries.map((e) => e.name),
  );

  let synced = 0;
  let updated = 0;
  let errors = 0;

  // 🔹 Ищем папки "Day XXX" в корне
  for (const entry of rootEntries) {
    if (!entry.isDirectory()) continue;

    // 🔹 Проверяем, соответствует ли имя паттерну "Day XXX"
    if (!/Day\s*\d+/i.test(entry.name)) {
      console.log(`⏭️  Skipping (not a day folder): ${entry.name}`);
      continue;
    }

    const dayPath = path.join(POSTS_ROOT, entry.name);
    console.log(`\n📦 Processing: ${entry.name}`);

    // 🔹 Читаем рубрики внутри дня
    const rubricEntries = await fs.readdir(dayPath, { withFileTypes: true });
    console.log(
      `📚 Rubrics in ${entry.name}:`,
      rubricEntries.filter((e) => e.isDirectory()).map((e) => e.name),
    );

    for (const rubricEntry of rubricEntries) {
      if (!rubricEntry.isDirectory()) continue;

      const rubricPath = path.join(dayPath, rubricEntry.name);
      console.log(`  📂 Scanning rubric: ${rubricEntry.name}`);

      // 🔹 Читаем файлы в рубрике
      const files = await fs.readdir(rubricPath);
      console.log(`  📄 Files:`, files);

      for (const file of files) {
        if (!file.toLowerCase().endsWith(".docx")) {
          console.log(`    ⏭️  Skipping (not docx): ${file}`);
          continue;
        }

        const filePath = path.join(rubricPath, file);
        console.log(`    📝 Processing: ${file}`);

        try {
          // 🔹 Конвертируем DOCX → HTML
          const html = await convertDocxToHtml(filePath);
          const imagePath = await findImage(filePath);
          const meta = extractMetadataFromPath(filePath);

          console.log(`    📋 Metadata:`, meta);

          // ✅ Генерируем slug из рубрики и заголовка
          const title = meta.fileName;
          const slug = slugify(`${meta.rubric}-${title}`);
          // Например: "Химфакт" + "Самое вонючее вещество" → "himfakt-samoe-vonjuchee-veshchestvo"

          // 🔹 Проверяем, есть ли уже пост с таким путём
          const existing = await prisma.blogPost.findUnique({
            where: { sourcePath: filePath },
          });

          if (existing) {
            // 🔹 Обновляем, если файл изменился
            const fileStat = await fs.stat(filePath);
            if (fileStat.mtime > existing.updatedAt) {
              await prisma.blogPost.update({
                where: { id: existing.id },
                data: {
                  contentHtml: html,
                  //   contentHtml: processedHtml,
                  imagePath,
                  updatedAt: new Date(),
                },
              });
              console.log(`    🔄 Updated: ${file}`);
              updated++;
            } else {
              console.log(`    ⏭️  Skipped (unchanged): ${file}`);
            }
          } else {
            // 🔹 Создаём новый пост
            await prisma.blogPost.create({
              data: {
                slug,
                title: meta.fileName,
                rubric: meta.rubric,
                dayNumber: meta.dayNumber,
                contentHtml: html,
                excerpt: html
                  .replace(/<\/(p|h[1-6]|div|li)>/gi, " ") // закрывающий блок-тег → пробел
                  .replace(/<[^>]*>/g, "") // остальные теги удаляем
                  .replace(/\s+/g, " ") // несколько пробелов → один
                  .trim()
                  .slice(0, 160),

                sourcePath: filePath,
                imagePath,
                tags: [meta.dayNumber, meta.rubric],
              },
            });
            console.log(`    ✅ Created: ${file}`);
            synced++;
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : String(error);
          console.error(`    ❌ Error with ${file}:`, message);
          errors++;
        }
      }
    }
  }

  console.log(`\n🎉 Sync complete!`);
  console.log(`✅ New: ${synced}`);
  console.log(`🔄 Updated: ${updated}`);
  console.log(`❌ Errors: ${errors}`);

  await prisma.$disconnect();
}

syncPosts().catch(console.error);
