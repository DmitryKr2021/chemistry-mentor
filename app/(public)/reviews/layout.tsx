"use client";

import ReviewAction from "./reviewAction";

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-600 to-emerald-900 w-full">
      <main className="container mx-auto px-4 py-12 w-[80%]">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Отзывы
          </h1>
          <p className="text-gray-300 text-lg">
            Что говорят мои ученики и их родители
          </p>
        </div>
        {children}
        {/* Кнопка с условной логикой */}
        <section className="mt-12">
          <ReviewAction />
        </section>
      </main>
    </section>
  );
}
