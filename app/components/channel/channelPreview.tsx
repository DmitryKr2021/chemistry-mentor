// components/channel/ChannelPreview.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, MessageSquare } from "lucide-react";
import Link from "next/link";

const previewPosts = [
  {
    category: "Теория",
    title: "Почему листья зеленые?",
    excerpt:
      "Объясняю на основе спектра поглощения хлорофилла и как это используется на практике...",
    views: "12.5K",
    likes: "856",
    comments: "43",
    color: "bg-blue-500",
  },
  {
    category: "Разбор задачи",
    title: "ЕГЭ 2025: задача на органику с подвохом",
    excerpt:
      "Разбираем задание №34 из демоверсии. Многие допускают эту ошибку...",
    views: "18.2K",
    likes: "1.2K",
    comments: "87",
    color: "bg-emerald-500",
  },
  {
    category: "Лайфхак",
    title:
      "Как быстро определить степени окисления элементов в солях и атомов углерода в органических соединениях",
    excerpt: "Простые приемы, быстро дающие результат...",
    views: "25.1K",
    likes: "2.1K",
    comments: "156",
    color: "bg-amber-500",
  },
];

export default function ChannelPreview() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Что публикую в канале
          </h2>
          <p className="text-lg text-slate-600">Примеры популярных постов</p>
        </div>

        <div className="space-y-6">
          {previewPosts.map((post, index) => (
            <Card
              key={index}
              className="border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${post.color} text-white`}>
                        {post.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-slate-500 mb-4">
            И это только малая часть контента...
          </p>
          <Link href="/blog">
            <Button variant="outline" size="lg">
              Смотреть все посты в блоге
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
