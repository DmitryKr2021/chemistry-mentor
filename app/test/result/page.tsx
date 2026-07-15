"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Award,
  Target,
  TrendingUp,
  BookOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTestStore } from "@/app/store/testStore";

export default function TestResultPage() {
  const router = useRouter();
  const {
    questions,
    studentName,
    studentEmail,
    isFinished,
    getAnswers,
    getScore,
    resetTest,
  } = useTestStore();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Редирект, если тест не завершён
  useEffect(() => {
    if (!isFinished || questions.length === 0) {
      router.push("/test");
    }
  }, [isFinished, questions.length, router]);

  // Отправка результатов на сервер
  useEffect(() => {
    const submitResults = async () => {
      if (!isFinished || submitted) return;

      setSubmitting(true);
      try {
        const userAnswers = getAnswers();
        const score = getScore();

        await fetch("/api/test/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName,
            studentEmail: studentEmail || null,
            score: score.correct,
            totalQuestions: score.total,
            percentage: score.percentage,
            answers: userAnswers,
            questions: questions.map((q) => ({
              id: q.id,
              question: q.question,
              correctOption: q.correctOption,
              explanation: q.explanation,
              category: q.category,
            })),
          }),
        });
        setSubmitted(true);
      } catch (error) {
        console.error("Failed to submit results:", error);
      } finally {
        setSubmitting(false);
      }
    };

    submitResults();
  }, [
    isFinished,
    submitted,
    studentName,
    studentEmail,
    questions,
    getAnswers,
    getScore,
  ]);

  if (!isFinished || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const score = getScore();
  const userAnswers = getAnswers();

  // Определяем уровень
  const getLevel = () => {
    if (score.percentage >= 80)
      return {
        label: "Продвинутый",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: Award,
        message: "Отличный результат! У вас крепкая база по химии.",
      };
    if (score.percentage >= 50)
      return {
        label: "Средний",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: Target,
        message: "Хороший результат! Есть над чем работать.",
      };
    return {
      label: "Начинающий",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: TrendingUp,
      message: "Не переживайте! Мы поможем вам освоить химию с нуля.",
    };
  };

  const level = getLevel();
  const LevelIcon = level.icon;

  // Группировка ошибок по категориям
  const mistakesByCategory = userAnswers
    .filter((a) => !a.isCorrect)
    .reduce(
      (acc, answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        const category = question?.category || "Другое";
        if (!acc[category]) acc[category] = 0;
        acc[category]++;
        return acc;
      },
      {} as Record<string, number>,
    );

  const handleRestart = () => {
    resetTest();
    router.push("/test");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Индикатор отправки */}
        {submitting && (
          <Card className="mb-6 border-2 border-indigo-200 bg-indigo-50">
            <CardContent className="p-6 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              <div>
                <p className="font-medium text-gray-900">
                  Сохраняем ваши результаты...
                </p>
                <p className="text-sm text-gray-600">
                  Это займёт несколько секунд
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Главный результат */}
        <Card className={cn("mb-6 shadow-lg border-2", level.border)}>
          <CardContent className="p-8 text-center">
            <div
              className={cn(
                "inline-flex items-center justify-center w-20 h-20 rounded-full mb-4",
                level.bg,
              )}
            >
              <LevelIcon className={cn("w-10 h-10", level.color)} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {studentName}, тест завершён!
            </h1>
            <p className="text-lg text-gray-600 mb-6">{level.message}</p>

            {/* Счёт */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div>
                <div className="text-3xl font-bold text-indigo-600">
                  {score.correct}/{score.total}
                </div>
                <div className="text-sm text-gray-500">Правильных</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">
                  {score.percentage}%
                </div>
                <div className="text-sm text-gray-500">Результат</div>
              </div>
              <div>
                <div className={cn("text-3xl font-bold", level.color)}>
                  {level.label}
                </div>
                <div className="text-sm text-gray-500">Уровень</div>
              </div>
            </div>

            {/* Прогресс-бар */}
            <div className="max-w-md mx-auto">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    score.percentage >= 80
                      ? "bg-green-500"
                      : score.percentage >= 50
                        ? "bg-amber-500"
                        : "bg-blue-500",
                  )}
                  style={{ width: `${score.percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Анализ ошибок */}
        {Object.keys(mistakesByCategory).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Над чем стоит поработать
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(mistakesByCategory).map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">
                      {category}
                    </span>
                    <span className="text-sm text-amber-700">
                      {count}{" "}
                      {count === 1 ? "ошибка" : count < 5 ? "ошибки" : "ошибок"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                💡 На пробном занятии мы уделим особое внимание этим темам
              </p>
            </CardContent>
          </Card>
        )}

        {/* Детальный разбор */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Разбор ответов</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, idx) => {
              const userAnswer = userAnswers.find(
                (a) => a.questionId === question.id,
              );
              const isCorrect = userAnswer?.isCorrect;
              const selectedOption = userAnswer?.selectedOption;

              return (
                <div
                  key={question.id}
                  className={cn(
                    "p-5 rounded-xl border-2",
                    isCorrect
                      ? "border-green-200 bg-green-50/50"
                      : "border-red-200 bg-red-50/50",
                  )}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        isCorrect ? "bg-green-500" : "bg-red-500",
                      )}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">
                        Вопрос {idx + 1} • {question.category}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {question.question}
                      </div>
                    </div>
                  </div>

                  <div className="ml-11 space-y-2">
                    {[1, 2, 3, 4].map((optNum) => {
                      const optText = question[
                        `option${optNum}` as keyof typeof question
                      ] as string;
                      const isUserChoice = selectedOption === optNum;
                      const isCorrectAnswer = question.correctOption === optNum;

                      return (
                        <div
                          key={optNum}
                          className={cn(
                            "p-2 rounded-lg text-sm flex items-center gap-2",
                            isCorrectAnswer &&
                              "bg-green-100 text-green-900 font-medium",
                            isUserChoice &&
                              !isCorrectAnswer &&
                              "bg-red-100 text-red-900 line-through",
                            !isCorrectAnswer &&
                              !isUserChoice &&
                              "text-gray-600",
                          )}
                        >
                          <span className="font-semibold">
                            {["", "А", "Б", "В", "Г"][optNum]}.
                          </span>
                          <span>{optText}</span>
                          {isCorrectAnswer && (
                            <CheckCircle2 className="w-4 h-4 ml-auto text-green-600" />
                          )}
                          {isUserChoice && !isCorrectAnswer && (
                            <XCircle className="w-4 h-4 ml-auto text-red-600" />
                          )}
                        </div>
                      );
                    })}

                    {question.explanation && !isCorrect && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-xs font-semibold text-blue-700 mb-1">
                          💡 Пояснение:
                        </div>
                        <div className="text-sm text-blue-900">
                          {question.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Готовы улучшить свой результат?
            </h2>
            <p className="text-indigo-100 mb-6">
              Запишитесь на пробное занятие, и мы составим индивидуальный план
              подготовки
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-sm cursor-pointer"
                onClick={() => router.push("/contacts")}
                disabled={submitting}
              >
                Записаться на занятие
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-sm cursor-pointer"
                onClick={handleRestart}
                disabled={submitting}
              >
                Пройти тест ещё раз
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
