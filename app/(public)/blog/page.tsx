import { prisma } from "@/app/utils/prisma";
import type { Metadata } from "next";
import BlogInfiniteScroll from "@/app/components/blog/blogInfiniteScroll";

export const metadata: Metadata = {
  title: "Блог | Репетитор по химии",
};

// Чтобы страница пересобиралась при смене URL-параметров
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ rubric?: string }>;
}) {
  const { rubric } = await searchParams;

  const where = rubric && rubric !== "all" ? { rubric } : {};

  // Загружаем только первую страницу
  const limit = 6;
  const [posts, totalPosts] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "asc" },
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const totalPages = Math.ceil(totalPosts / limit);
  const hasMore = totalPages > 1;

  return (
    <div className="container mx-auto px-4 py-8">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-12">
          Постов в этой рубрике пока нет.
        </p>
      ) : (
        <BlogInfiniteScroll
          key={rubric || "all"}
          initialPosts={posts}
          initialPage={1}
          hasMore={hasMore}
          rubric={rubric}
        />
      )}
    </div>
  );
}
