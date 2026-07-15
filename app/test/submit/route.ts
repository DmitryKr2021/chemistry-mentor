import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const submitSchema = z.object({
  studentName: z.string().min(1),
  studentEmail: z.string().email().nullable(),
  score: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  percentage: z.number().min(0).max(100),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOption: z.number().nullable(),
      isCorrect: z.boolean(),
    }),
  ),
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      correctOption: z.number(),
      explanation: z.string().nullable(),
      category: z.string().nullable(),
    }),
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = submitSchema.parse(body);

    // Сохраняем результат
    const result = await prisma.testResult.create({
      data: {
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        score: data.score,
        totalQuestions: data.totalQuestions,
        percentage: data.percentage,
        answers: data.answers,
      },
    });

    // TODO: Отправка email с результатами (опционально)
    // if (data.studentEmail) {
    //   await sendTestResultsEmail(data);
    // }

    return NextResponse.json(
      {
        success: true,
        resultId: result.id,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Ошибка валидации", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Submit test error:", error);
    return NextResponse.json(
      { error: "Ошибка сохранения результатов" },
      { status: 500 },
    );
  }
}
