import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import type { ReactNode } from "react";
import BookButton from "../common/bookButton";

export interface ServiceItem {
  id: number | string;
  title: string;
  price: string;
  description: string;
  icon: ReactNode; // ✅ Позволяет передавать JSX, компоненты, строки и null
}

export function ServiceCard({ title, price, description, icon }: ServiceItem) {
  return (
    <Card className="bg-slate-800 text-white border-0 flex flex-col h-full shadow-xl hover:shadow-2xl transition-shadow group">
      <CardHeader className="pb-2">
        {/* Обёртка для иконки с плавной анимацией при наведении */}
        <div className="mb-3 transition-transform duration-300 group-hover:scale-105 aspect-[5/4]">
          {icon}
        </div>
        <h3 className="text-xl font-bold leading-snug">{title}</h3>
        <p className="text-lime-400 text-2xl font-extrabold mt-1">{price}</p>
      </CardHeader>

      <CardContent className="flex-grow text-slate-300 text-sm leading-relaxed">
        {description}
      </CardContent>

      <CardFooter className="pt-4">
        <BookButton
          variant="default"
          size="lg"
          className="bg-[var(--button-yellow)] text-slate-900 px-8 py-3 rounded font-bold hover:bg-green-300 transition shadow-lg hover:shadow-green-400/50 hover:cursor-pointer"
        >
          <p className="w-full">Записаться</p>
        </BookButton>
      </CardFooter>
    </Card>
  );
}
