"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  slug: string;
  title: string;
  rubric: string;
  excerpt?: string | null; // ✅ Теперь может быть null
  imagePath?: string | null; // ✅ И imagePath тоже
  publishedAt?: string | Date | null;
  dayNumber?: string;
  contentHtml?: string;
  sourcePath?: string;
  googleDriveLink?: string | null;
  views?: number;
  // Добавьте другие поля из вашей схемы, если нужно
}

interface BlogInfiniteScrollProps {
  initialPosts: Post[];
  initialPage: number;
  hasMore: boolean;
  rubric?: string;
}

const SCROLL_STORAGE_KEY = "blog_scroll_state";

export default function BlogInfiniteScroll({
  initialPosts,
  initialPage,
  hasMore: initialHasMore,
  rubric,
}: BlogInfiniteScrollProps) {
  // 1. Ленивая инициализация - функция вызывается ТОЛЬКО ОДИН РАЗ при первом рендере
  const getSavedState = () => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem(SCROLL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Проверяем только рубрику (без Date.now() чтобы избежать impure function)
        if (parsed.rubric !== rubric) {
          sessionStorage.removeItem(SCROLL_STORAGE_KEY);
          return null;
        }
        return parsed;
      }
    } catch (e) {
      console.log("error=", e);
    }
    return null;
  };

  // 2. Используем useState с функцией для ленивой инициализации
  const [savedState] = useState(() => getSavedState());

  // 3. Инициализируем состояние из кэша или пропсов
  const [posts, setPosts] = useState<Post[]>(savedState?.posts || initialPosts);
  const [page, setPage] = useState(savedState?.page || initialPage);
  const [hasMore, setHasMore] = useState(savedState?.hasMore ?? initialHasMore);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 4. Для scrollY используем useState вместо useRef
  const [scrollY, setScrollY] = useState(savedState?.scrollY || 0);

  // 5. Восстановление скролла при монтировании
  useEffect(() => {
    if (savedState) {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: savedState.scrollY || 0,
          behavior: "auto",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [savedState]);

  // 6. Функция сохранения состояния
  const saveState = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        SCROLL_STORAGE_KEY,
        JSON.stringify({
          posts,
          page,
          hasMore,
          rubric,
          scrollY,
          timestamp: Date.now(),
        }),
      );
    }
  }, [posts, page, hasMore, rubric, scrollY]);

  // 7. Отслеживание скролла и сохранение при уходе со страницы
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveState();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Сохраняем состояние при размонтировании
      saveState();
    };
  }, [saveState]);

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: nextPage.toString(),
        limit: "6",
      });
      if (rubric) params.append("rubric", rubric);

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();

      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.pagination.hasNextPage);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, rubric]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadPosts();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadPosts, hasMore, loading]);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.id}
            className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100"
          >
            <div className="relative w-full aspect-video overflow-hidden bg-slate-200">
              <Image
                src={
                  post.imagePath
                    ? `/api/image?path=${encodeURIComponent(post.imagePath)}`
                    : "/images/blog/banner.png"
                }
                alt={post.title || "Изображение по умолчанию"}
                fill
                unoptimized={true}
                className={`object-cover ${
                  post.imagePath
                    ? "group-hover:scale-105 transition-transform duration-500"
                    : ""
                }`}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="p-5">
              <Badge variant="secondary" className="mb-3 text-xs font-medium">
                {post.rubric}
              </Badge>
              <h2 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              )}

              <span className="inline-flex items-center text-teal-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                Читать далее →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div ref={observerTarget} className="py-8 text-center">
        {loading && (
          <div className="flex justify-center items-center space-x-2">
            <div
              className="w-3 h-3 bg-teal-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-3 h-3 bg-teal-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-3 h-3 bg-teal-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="text-gray-500">Все посты загружены</p>
        )}
      </div>
    </>
  );
}
