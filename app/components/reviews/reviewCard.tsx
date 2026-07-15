"use client";

import { useState } from "react";
import { Review } from "@/app/(public)/reviews/page";
import { Star } from "lucide-react";
import { StudentAvatar } from "./studentAvatar";
import Image from "next/image";

// Количество слов для обрезки
const MAX_WORDS = 50;

// Функция для обрезки текста по словам
function truncateText(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

// Компонент звезды рейтинга
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 mb-3 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-300 text-gray-400"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewCard({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Определяем, нужно ли обрезать текст
  const words = review.content.split(/\s+/);
  const isLong = words.length > MAX_WORDS;
  const displayText =
    isExpanded || !isLong
      ? review.content
      : truncateText(review.content, MAX_WORDS);

  return (
    <article className="p-4 border rounded-lg shadow-sm bg-slate-50">
      <div className="flex items-center gap-3 mb-3">
        {review.avatar ? (
          <Image
            src={review.avatar}
            alt={review.authorName}
            width={60}
            height={60}
            sizes="60px"
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <StudentAvatar
            name={review.authorName}
            size={60}
            className="object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-black">{review.authorName}</p>
          <p className="text-sm text-gray-700">
            {new Date(review.createdAt).toLocaleDateString("ru-RU")}
          </p>
        </div>
      </div>
      <StarRating rating={review.rating} />

      <p className="text-black whitespace-pre-wrap">{displayText}</p>

      {/* Кнопка "Показать больше" / "Свернуть" */}
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors cursor-pointer"
        >
          {isExpanded ? "Свернуть" : "Показать полностью"}
        </button>
      )}
    </article>
  );
}
