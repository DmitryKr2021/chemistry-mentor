// components/channel/ChannelHero.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ChannelHero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 opacity-70" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="relative max-w-5xl mx-auto text-center">
        <Badge
          variant="outline"
          className="mb-6 px-4 py-2 text-sm bg-white/80 backdrop-blur rounded-sm"
        >
          <Send className="w-4 h-4 mr-2 text-blue-500" />
          Telegram-канал
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Химия в твоём телефоне 📱
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
            Каждый день новое!
          </span>
        </h1>

        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Подпишись на канал, где химия становится понятной: разбор сложных тем,
          лайфхаки для экзаменов, интересные факты и поддержка 24/7
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="https://t.me/DmitryVK2021" target="_blank">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Send className="w-5 h-5 mr-2" />
              Подписаться на канал
            </Button>
          </Link>

          {/* <div className="flex items-center gap-2 text-slate-500">
            <Users className="w-5 h-5" />
            <span className="font-medium">Уже 5 000+ подписчиков</span>
          </div> */}
        </div>

        {/* Быстрые преимущества */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-slate-700">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Ежедневные посты</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-700">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span>Без воды и спама</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-700">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span>Поддержка в чате</span>
          </div>
        </div>
      </div>
    </section>
  );
}
