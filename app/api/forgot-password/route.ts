import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { prisma } from "@/app/utils/prisma";

// // 🔹 Инициализация Resend
// const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ СТАЛО (ленивая инициализация):
let resendInstance: Resend | null = null;
function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY не установлен");
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

// 🔹 Адрес отправителя (используем тот же, что и в других файлах)
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "noreply@chemistry-mentor.ru";
const FROM_NAME = "Химия: путь к вершине";

// Генерация случайного пароля
function generatePassword(length: number = 10): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // 1. Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 🔹 Защита от перебора email: всегда возвращаем успех, даже если пользователя нет
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // 2. Генерация и хеширование нового пароля
    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Обновление пароля в БД
    await prisma.user.update({
      where: { id: user.id },
      data: { pwHash: hashedPassword },
    });
    const resend = getResendClient(); // 🔹 Вызов только при реальном запросе
    // 4. Отправка email с новым паролем через Resend
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: "🔑 Ваш новый пароль",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #84cc16; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
            .password-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #84cc16; margin: 20px 0; }
            .password { font-size: 24px; font-weight: bold; color: #84cc16; letter-spacing: 2px; }
            .warning { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Восстановление пароля</h2>
            </div>
            <div class="content">
              <p>Здравствуйте!</p>
              <p>Вы запросили восстановление пароля для аккаунта <strong>${email}</strong></p>
              
              <div class="password-box">
                <p style="margin: 0 0 10px 0; color: #64748b;">Ваш новый пароль:</p>
                <div class="password">${newPassword}</div>
              </div>

              <p>Рекомендуем изменить пароль после входа в систему.</p>

              <div class="warning">
                <strong>⚠️ Важно:</strong> Если вы не запрашивали восстановление пароля, 
                пожалуйста, свяжитесь с нами немедленно.
              </div>

              <p style="margin-top: 30px; color: #94a3b8; font-size: 12px;">
                С уважением,<br>
                Команда Химия: путь к вершине
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Ваш новый пароль: ${newPassword}

Рекомендуем изменить пароль после входа в систему.

Если вы не запрашивали восстановление пароля, пожалуйста, свяжитесь с нами.

Химия: путь к вершине
      `,
    });

    // 5. Обработка ошибок отправки
    if (error) {
      console.error("❌ Resend error (forgot password):", error);
      // ⚠️ ВАЖНО: Пароль в БД уже изменен, но письмо не ушло.
      // Возвращаем 500, чтобы фронтенд показал пользователю сообщение
      // о необходимости связаться с поддержкой, иначе он потеряет доступ.
      return NextResponse.json(
        {
          error:
            "Пароль изменен, но не удалось отправить письмо. Пожалуйста, свяжитесь с поддержкой.",
        },
        { status: 500 },
      );
    }

    console.log("✅ Email с новым паролем отправлен. Message ID:", data?.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Forgot password API error:", error);
    return NextResponse.json(
      { error: "Ошибка при восстановлении пароля" },
      { status: 500 },
    );
  }
}
