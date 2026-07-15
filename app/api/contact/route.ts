"use server";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов" })
    .max(50, { message: "Имя не должно превышать 50 символов" }),

  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Некорректный формат email",
  }),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d\s()+-]{10,}$/.test(val), {
      message: "Некорректный формат телефона",
    }),

  message: z
    .string()
    .min(10, { message: "Сообщение должно содержать не менее 10 символов" })
    .max(1000, { message: "Сообщение не должно превышать 1000 символов" }),
});

export async function POST(request: NextRequest) {
  // 1. Валидация данных
  const body = await request.json();
  const validated = contactSchema.safeParse(body);

  if (!validated.success) {
    console.warn("⚠️ Validation failed:", validated.error.issues);
    const fieldErrors = validated.error.issues.reduce(
      (acc, issue) => {
        const field = issue.path.join(".");
        if (!acc[field]) acc[field] = [];
        acc[field].push(issue.message);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return NextResponse.json(
      {
        error: "Некорректные данные формы",
        details: fieldErrors,
      },
      { status: 400 },
    );
  }

  // Форматируем дату и время
  const now = new Date();
  const formattedDate = now.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const { name, email, phone, message } = validated.data;

  // 2. Простая защита от спама (можно заменить на полноценный rate-limit)
  // const ip = request.headers.get("x-forwarded-for") || "unknown";
  // Здесь можно добавить проверку: если с этого IP было много запросов за минуту — отклонить

  // 3. Отправка письма
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    console.log("📤 Sending email...");

    // Отправляем письмо администратору
    await transporter.sendMail({
      from: `"Химия: путь к вершине" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `📚 Новое сообщение от ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2c3e50; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .field { margin: 16px 0; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #a4e747; }
            .label { font-weight: 600; color: #64748b; font-size: 14px; margin-bottom: 4px; }
            .value { font-size: 16px; color: #1e293b; }
            .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
            .badge { display: inline-block; padding: 4px 12px; background: #a4e747; color: #1e293b; border-radius: 20px; font-weight: 600; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📚 Новое сообщение</h2>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">${formattedDate} в ${formattedTime}</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Имя</div>
                <div class="value">${name}</div>
              </div>

                <div class="field">
                <div class="label">Телефон</div>
                <div class="value">
                  <a href="tel:${phone?.replace(/\D/g, "")}" style="color: #667eea; text-decoration: none;">${phone}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="label">Email</div>
                <div class="value">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </div>
              </div>
                    
              ${
                message
                  ? `
              <div class="field">
                <div class="label">Комментарий</div>
                <div class="value">${message.replace(/\n/g, "<br>")}</div>
              </div>
              `
                  : ""
              }
              
              <div class="footer">
                <strong>Химия: путь к вершине</strong><br>
                Разблокируйте секреты вселенной вместе с нами! ⚛️
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Новое сообщение

Имя: ${name}
Телефон: ${phone}
Email: ${email}
${message ? `\nСообщение:\n${message}` : ""}

Отправлено: ${formattedDate} в ${formattedTime}

Химия: путь к вершине
      `,
    });

    // Опционально: отправить подтверждение пользователю
    await transporter.sendMail({
      from: `"Химия: путь к вершине" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Ваше сообщение принято",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2c3e50; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #a4e747 0%, #667eea 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #a4e747; color: #1e293b; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .button2 { display: inline-block; padding: 12px 24px; background: #6E8CD4; color: #1e293b; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          </style>
        </head>
  <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✅ Сообщение принято!</h1>
              <p style="margin: 8px 0 0 0;">Спасибо за интерес к занятиям по химии</p>
            </div>
            <div class="content">
              <p>Здравствуйте, <strong>${name}</strong>!</p>
              <p>Ваше сообщение успешно отправлено.</p>
              <p>Я свяжусь с вами в ближайшее время.</p>
              <p>Если у вас есть срочные вопросы, напишите мне на email или в мессенджеры.</p>
              <a href="https://t.me/DmitryVK2021" class="button">Написать в Telegram</a>
              <a href="https://vk.me/id446183970" class="button2">Написать в VK</a>
              <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
                С уважением,<br>
                <strong>Дмитрий Крыльский</strong><br>
                Репетитор по химии
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Email sent successfully");

    return NextResponse.json(
      { success: true, message: "Сообщение отправлено" },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ API Error:", error);
    // Понятное сообщение для пользователя
    let userMessage = "Ошибка при отправке сообщения";
    if (error instanceof Error) {
      // Можно логировать детали, но не показывать пользователю
      if (error.message.includes("535")) {
        userMessage = "Ошибка аутентификации почты";
      } else if (error.message.includes("ETIMEDOUT")) {
        userMessage = "Сервер не отвечает, попробуйте позже";
      }
    }
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
