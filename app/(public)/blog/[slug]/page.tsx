import { prisma } from "@/app/utils/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/app/components/blog/backButton";
import { BlogPostJsonLd } from "@/app/components/seo/BlogPostJsonLd";

export const revalidate = 36000;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  // 🔹 Увеличиваем счётчик просмотров
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  return (
    <>
      <BlogPostJsonLd
        title={post.title}
        slug={post.slug}
        excerpt={post.excerpt}
        contentHtml={post.contentHtml}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        imagePath={post.imagePath}
        rubric={post.rubric}
      />
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <BackButton />
      </div>
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600 transition">
            Главная
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-teal-600 transition">
            Блог
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-xs">{post.title}</span>
        </nav>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
          <span>{post.dayNumber}</span>
          <span>•</span>
          <span>{new Date(post.publishedAt).toLocaleDateString("ru-RU")}</span>
          <span>•</span>
          <span>👁 {post.views} просмотров</span>
        </div>
        {/* 🔹 Рендерим HTML из DOCX */}
        <div
          className="prose prose-slate max-w-none prose-headings:mt-8 prose-headings:mb-4"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {post.googleDriveLink && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <a
              href={post.googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              📎 Дополнительные материалы на Google Drive
            </a>
          </div>
        )}
      </article>
    </>
  );
}
