import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// 🔹 Инициализация Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 🔹 Адрес отправителя (консистентный с другими файлами)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const FROM_NAME = "Химия: путь к вершине";
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, text, rating } = body;

    // 🔍 Базовая серверная валидация
    if (!name?.trim() || !email?.trim() || !text?.trim() || !rating) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 },
      );
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Некорректная оценка" },
        { status: 400 },
      );
    }

    // 💾 1. Сохранение в БД
    const review = await prisma.review.create({
      data: {
        authorName: name.trim(),
        authorEmail: email.trim().toLowerCase(),
        content: text.trim(),
        rating: Number(rating),
        status: "pending",
      },
    });

    // 📧 2. Отправка уведомления администратору через Resend
    const stars = "⭐".repeat(review.rating);

    // Базовая защита от XSS в HTML-письме (отличная практика, оставляем!)
    const safeText = text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to:
        process.env.CONTACT_EMAIL ||
        process.env.RESEND_FROM_EMAIL ||
        "onboarding@resend.dev",
      subject: `🆕 Новый отзыв: ${name} (${review.rating}/5)`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #059669; margin-top: 0;">Поступил новый отзыв</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #334155;">Имя:</td>
              <td>${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #334155;">Email:</td>
              <td><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #334155;">Оценка:</td>
              <td>${stars} <span style="color: #64748b;">(${review.rating}/5)</span></td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 12px; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; line-height: 1.6;">
            <strong>Текст отзыва:</strong><br/>${safeText}
          </div>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${NEXT_PUBLIC_URL}/admin/reviews" style="display: inline-block; padding: 10px 20px; background: #059669; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 500;">Управление отзывами</a>
          </div>
        </div>
      `,
    });

    // 3. Обработка ошибок отправки
    if (error) {
      console.error("❌ Resend error (new review notification):", error);
      // Не прерываем процесс: отзыв уже сохранен в БД, просто уведомление не ушло.
      // Возвращаем успех клиенту, но логируем ошибку для админа.
    } else {
      console.log(
        "✅ Уведомление о новом отзыве отправлено. Message ID:",
        data?.id,
      );
    }

    return NextResponse.json(
      { success: true, reviewId: review.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Ошибка при создании отзыва:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
