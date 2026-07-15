"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useTestStore } from "@/app/store/testStore";

export default function TestQuestionsPage() {
  const router = useRouter();
  const {
    questions,
    currentIndex,
    answers,
    studentName,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    finishTest,
    getCurrentQuestion,
    getProgress,
  } = useTestStore();

  const [showConfirm, setShowConfirm] = useState(false);

  // Редирект, если тест не начат
  useEffect(() => {
    if (questions.length === 0) {
      router.push("/test");
    }
  }, [questions.length, router]);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const answeredCount = Object.keys(answers).length;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const selectedOption = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  const handleOptionSelect = (option: number) => {
    selectAnswer(currentQuestion.id, option);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowConfirm(true);
    } else {
      nextQuestion();
    }
  };

  const handleFinish = () => {
    finishTest();
    router.push("/test/result");
  };

  const getOptionLabel = (num: number) => {
    return ["", "А", "Б", "В", "Г"][num] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Шапка с прогрессом */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{studentName}</span>
              <span className="mx-2">•</span>
              Вопрос {currentIndex + 1} из {questions.length}
            </div>
            <div className="text-sm font-medium text-indigo-600">
              {answeredCount} / {questions.length} отвечено
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Карточка вопроса */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6 md:p-8">
            {/* Категория */}
            {currentQuestion.category && (
              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full mb-4">
                {currentQuestion.category}
              </div>
            )}

            {/* Вопрос */}
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Варианты ответов */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((optionNum) => {
                const optionText = currentQuestion[
                  `option${optionNum}` as keyof typeof currentQuestion
                ] as string;
                const isSelected = selectedOption === optionNum;

                return (
                  <button
                    key={optionNum}
                    onClick={() => handleOptionSelect(optionNum)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all",
                      "flex items-start gap-3 group",
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                        isSelected
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600",
                      )}
                    >
                      {getOptionLabel(optionNum)}
                    </div>
                    <span
                      className={cn(
                        "flex-1 pt-1",
                        isSelected
                          ? "text-indigo-900 font-medium"
                          : "text-gray-700",
                      )}
                    >
                      {optionText}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-indigo-500 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Навигация */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={isFirstQuestion}
            className="gap-2 rounded-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Назад
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedOption === undefined}
            className="gap-2 rounded-sm cursor-pointer"
          >
            {isLastQuestion ? "Завершить тест" : "Далее"}
            {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        {/* Навигация по вопросам */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={cn(
                      "w-10 h-10 rounded-lg font-medium text-sm transition-all",
                      "flex items-center justify-center",
                      isCurrent
                        ? "bg-indigo-500 text-white shadow-md scale-110"
                        : isAnswered
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    )}
                    title={`Вопрос ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Модальное окно подтверждения */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Завершить тест?
                    </h3>
                    <p className="text-sm text-gray-600">
                      {answeredCount === questions.length
                        ? "Вы ответили на все вопросы."
                        : `Вы ответили на ${answeredCount} из ${questions.length} вопросов. Неотвеченные вопросы будут засчитаны как неправильные.`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded-sm cursor-pointer"
                  >
                    Продолжить тест
                  </Button>
                  <Button
                    onClick={handleFinish}
                    className="flex-1 rounded-sm cursor-pointer"
                  >
                    Завершить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
