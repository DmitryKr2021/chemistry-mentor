// components/channel/SubscribeCTA.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const benefits = [
  "📚 Доступ к архиву из 1200+ постов",
  "🎁 Бесплатные чек-листы и шпаргалки",
  "💬 Закрытый чат с поддержкой",
  "🔔 Уведомления о новых материалах",
  "🎥 Эксклюзивные видео-разборы",
  "📝 Регулярные тесты и ДЗ",
];

export default function SubscribeCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-emerald-600">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-blue-600" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Готов начать изучать химию?
            </h2>

            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Присоединяйся к 5000+ учеников, которые уже готовятся со мной
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://t.me/DmitryVK2021" target="_blank">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:text-green-600 transition-all cursor-pointer"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Подписаться сейчас
                </Button>
              </Link>

              <Link href="/blog">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg rounded-full cursor-pointer"
                >
                  Сначала посмотреть блог
                </Button>
              </Link>
            </div>

            <p className="text-blue-200 text-sm mt-6">
              Это бесплатно. Отписаться можно в любой момент.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
