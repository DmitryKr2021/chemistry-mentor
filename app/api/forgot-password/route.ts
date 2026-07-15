import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { prisma } from "@/app/utils/prisma";

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

    // Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Не раскрываем, существует ли пользователь
      return NextResponse.json({ success: true });
    }

    // Генерация нового пароля
    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновление пароля в БД
    await prisma.user.update({
      where: { id: user.id },
      data: { pwHash: hashedPassword },
    });

    // Отправка email с новым паролем
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Химия: путь к вершине" <${process.env.EMAIL_USER}>`,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Ошибка при восстановлении пароля" },
      { status: 500 },
    );
  }
}
