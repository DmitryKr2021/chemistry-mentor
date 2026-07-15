// components/channel/ChannelStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, BookOpen, Award, Clock } from "lucide-react";

const stats = [
  {
    icon: MessageSquare,
    value: "250+",
    label: "Постов опубликовано",
    color: "bg-blue-500",
  },
  {
    icon: BookOpen,
    value: "50+",
    label: "Разобранных тем",
    color: "bg-emerald-500",
  },
  {
    icon: Award,
    value: "95%",
    label: "Сдали ЕГЭ на 80+",
    color: "bg-amber-500",
  },
  {
    icon: Clock,
    value: "1 год",
    label: "Ведём канал",
    color: "bg-purple-500",
  },
];

export default function ChannelStats() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl ${stat.color} bg-opacity-10 flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon
                      className={`w-7 h-7 ${stat.color.replace("bg-", "text-")}`}
                    />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
