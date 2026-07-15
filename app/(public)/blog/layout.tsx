import Image from "next/image";
import { CategoryFilter } from "./category-filter";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-200 w-full">
      {/* Hero Section */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0 z-10" />
        <Image
          src="/images/home/hero.jpg"
          alt="Chemistry lab background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white">БЛОГ</h1>
        </div>
      </section>
      {/* Фильтры категорий */}
      <CategoryFilter />
      <div className="content-wrapper">{children}</div>
    </div>
  );
}
