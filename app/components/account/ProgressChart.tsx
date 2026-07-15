// components/account/ProgressChart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Пример данных (в реальности получать из БД)
const data = [
  { month: "Янв", score: 65 },
  { month: "Фев", score: 72 },
  { month: "Мар", score: 78 },
  { month: "Апр", score: 85 },
  { month: "Май", score: 82 },
  { month: "Июн", score: 90 },
];

export default function ProgressChart() {
  return (
    <Card>
      {/* 🔹 АДАПТИВНЫЙ ЗАГОЛОВОК */}
      <CardHeader className="flex flex-col items-start gap-4 min-[550px]:flex-row min-[550px]:items-center min-[550px]:justify-between min-[550px]:gap-0">
        <div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Прогресс обучения
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Динамика ваших результатов
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          // 1. Адаптивные отступы и размер текста
          className="w-full min-[550px]:w-auto px-2 py-1 text-xs min-[400px]:px-4 min-[400px]:py-2 min-[380px]:text-sm flex items-center justify-center gap-1 min-[400px]:gap-2"
        >
          {/* 2. Запрещаем иконке сжиматься */}
          <TrendingUp className="w-4 h-4 flex-shrink-0" />

          {/* 3. Показываем короткий текст только на экранах < 380px */}
          <span className="min-[400px]:hidden">Статистика</span>

          {/* 4. Показываем полный текст только на экранах >= 380px */}
          <span className="hidden min-[400px]:inline">
            Подробная статистика
          </span>
        </Button>
      </CardHeader>

      <CardContent>
        {/* 🔹 АДАПТИВНАЯ ВЫСОТА ГРАФИКА */}
        <div className="h-[250px] min-[550px]:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "14px",
                }}
                formatter={(value) => [`${value ?? 0} баллов`, "Результат"]}
              />
              <Bar
                dataKey="score"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={50} // Ограничивает ширину столбцов на очень узких экранах
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
