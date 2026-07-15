import { NextRequest, NextResponse } from "next/server";
import { trialLessonSchema } from "@/lib/schemas/trialLessonSchema";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = trialLessonSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Некорректные данные формы" },
        { status: 400 },
      );
    }

    const { name, phone, email, topic, comment } = validated.data;

    // Создаём транспортер
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

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

    // Отправляем письмо администратору
    await transporter.sendMail({
      from: `"Химия: путь к вершине" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `📚 Новая заявка на пробное занятие от ${name}`,
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
              <h2 style="margin: 0;">📚 Новая заявка на пробное занятие</h2>
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
                  <a href="tel:${phone.replace(/\D/g, "")}" style="color: #667eea; text-decoration: none;">${phone}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="label">Email</div>
                <div class="value">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="label">Тема занятия</div>
                <div class="badge">${topic}</div>
              </div>
              
              ${
                comment
                  ? `
              <div class="field">
                <div class="label">Комментарий</div>
                <div class="value">${comment.replace(/\n/g, "<br>")}</div>
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
Новая заявка на пробное занятие

Имя: ${name}
Телефон: ${phone}
Email: ${email}
Тема: ${topic}
${comment ? `\nКомментарий:\n${comment}` : ""}

Отправлено: ${formattedDate} в ${formattedTime}

Химия: путь к вершине
      `,
    });

    // Опционально: отправить подтверждение пользователю
    await transporter.sendMail({
      from: `"Химия: путь к вершине" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Ваша заявка на пробное занятие принята",
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
              <h1 style="margin: 0;">✅ Заявка принята!</h1>
              <p style="margin: 8px 0 0 0;">Спасибо за интерес к занятиям по химии</p>
            </div>
            <div class="content">
              <p>Здравствуйте, <strong>${name}</strong>!</p>
              <p>Ваша заявка на пробное занятие по теме <strong>"${topic}"</strong> успешно отправлена.</p>
              <p>Я свяжусь с вами по телефону <strong>${phone}</strong> в ближайшее время для согласования удобного времени.</p>
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Trial lesson error:", error);
    return NextResponse.json(
      { error: "Ошибка при отправке заявки" },
      { status: 500 },
    );
  }
}
