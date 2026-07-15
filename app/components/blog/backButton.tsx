"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 hover:underline transition cursor-pointer"
    >
      <span>←</span>
      <span>Назад</span>
    </button>
  );
}
