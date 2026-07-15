"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TestQuestion, useTestStore } from "../store/testStore";
import CommonButton from "../components/common/CommonButton";

interface Props {
  questions: TestQuestion[];
}

export function TestStartForm({ questions }: Props) {
  const router = useRouter();
  const { setQuestions, setStudentInfo } = useTestStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Пожалуйста, введите ваше имя");
      return;
    }

    if (questions.length === 0) {
      setError("Вопросы не найдены. Попробуйте позже.");
      return;
    }

    setLoading(true);
    setStudentInfo(name.trim(), email.trim());
    setQuestions(questions);

    // Небольшая задержка для сохранения состояния
    setTimeout(() => {
      router.push("/test/questions");
    }, 300);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Начать тестирование</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleStart} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="name">Ваше имя *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Иван"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email (необязательно)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              На этот адрес придут результаты теста
            </p>
          </div>

          <CommonButton
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Подготовка..." : "🚀 Начать тест"}
          </CommonButton>
        </form>
      </CardContent>
    </Card>
  );
}
