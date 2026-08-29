// lib/email.ts
import nodemailer from "nodemailer";

// 🔹 Создаём переиспользуемый transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,

  logger: true,
  debug: true,
});

// 🔹 Проверка подключения (вызвать один раз при старте)
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("✅ SMTP подключение работает");
    return true;
  } catch (error) {
    console.error("❌ SMTP ошибка:", error);
    return false;
  }
}

// 🔹 Отправка ссылки на урок ученику
export async function sendMeetingLinkEmail({
  studentEmail,
  studentName,
  lessonDate,
  lessonTime,
  meetingLink,
  topic,
}: {
  studentEmail: string;
  studentName: string;
  lessonDate: string;
  lessonTime: string;
  meetingLink: string;
  topic?: string | null;
}) {
  const subject = `🔗 Ссылка на занятие по химии — ${lessonDate} в ${lessonTime}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 25px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #6366f1; }
    .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🧪 Занятие по химии</h1>
    </div>
    <div class="content">
      <p>Здравствуйте, <b>${studentName}</b>!</p>
      <p>Напоминаю о предстоящем занятии:</p>
      
      <div class="info-box">
        <p style="margin: 5px 0;"><b>📅 Дата:</b> ${lessonDate}</p>
        <p style="margin: 5px 0;"><b>⏰ Время:</b> ${lessonTime}</p>
        ${topic ? `<p style="margin: 5px 0;"><b>📚 Тема:</b> ${topic}</p>` : ""}
      </div>
      
      <p>Ссылка для подключения к занятию:</p>
      <p style="text-align: center;">
        <a href="${meetingLink}" class="button">🔗 Подключиться к уроку</a>
      </p>
      <p style="text-align: center; font-size: 12px; color: #6b7280;">
        Или скопируйте ссылку: <br/>
        <a href="${meetingLink}">${meetingLink}</a>
      </p>
      
      <p>💡 <b>Рекомендации:</b></p>
      <ul>
        <li>Подключитесь за 2-3 минуты до начала</li>
        <li>Проверьте микрофон и камеру</li>
        <li>Подготовьте тетрадь и ручку</li>
      </ul>
      
      <p>До встречи! 🧪</p>
    </div>
    <div class="footer">
      <p>Репетитор по химии — Дмитрий Крыльский</p>
      <p>Если у вас возникли вопросы, ответьте на это письмо</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const result = await transporter.sendMail({
      from: `"Дмитрий Крыльский | Репетитор по химии" <${process.env.SMTP_USER}>`,
      to: studentEmail,
      subject,
      html,
    });

    console.log(
      `✅ Email отправлен: ${studentEmail} (messageId: ${result.messageId})`,
    );
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`❌ Ошибка отправки email на ${studentEmail}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * 🔹 Отправка приветственного письма после регистрации
 */
export async function sendWelcomeEmail({
  studentEmail,
  studentName,
  siteUrl,
}: {
  studentEmail: string;
  studentName: string;
  siteUrl: string;
}) {
  console.log("📧 Отправка приветственного email на:", studentEmail);

  try {
    const result = await transporter.sendMail({
      from: `"Дмитрий Крыльский | Репетитор по химии" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`,
      to: studentEmail,
      subject: `🎉 Добро пожаловать! Ваш аккаунт создан`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f9fafb; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .info-box { background: #f3f4f6; border-left: 4px solid #6366f1; padding: 15px 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #6366f1; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; padding: 20px; border-top: 1px solid #e5e7eb; }
            .login-info { background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .login-info code { background: white; padding: 2px 8px; border-radius: 4px; font-family: monospace; color: #065f46; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧪 Добро пожаловать!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Ваш аккаунт успешно создан</p>
            </div>
            
            <div class="content">
              <p>Здравствуйте, <b>${studentName}</b>!</p>
              
              <p>Благодарим за регистрацию на сайте репетитора по химии. Теперь вам доступны:</p>
              
              <ul style="line-height: 1.8;">
                <li>📅 Личное расписание занятий</li>
                <li>📚 Домашние задания и материалы</li>
                <li>🔗 Ссылки на онлайн-встречи</li>
                <li>📊 Отслеживание прогресса</li>
              </ul>
              
              <div class="login-info">
                <p style="margin: 0 0 10px 0;"><b>🔑 Ваши данные для входа:</b></p>
                <p style="margin: 5px 0;">
                  <b>Email (логин):</b> <code>${studentEmail}</code>
                </p>
                <p style="margin: 5px 0;">
                  <b>Пароль:</b> тот, который вы указали при регистрации
                </p>
              </div>
              
              <div class="warning">
                <p style="margin: 0;">
                  💡 <b>Важно:</b> В целях безопасности мы <b>не отправляем пароль</b> в письме. 
                  Если вы забыли пароль, используйте функцию 
                  <a href="${siteUrl}" style="color: #b45309;">"Забыли пароль?"</a> на странице входа.
                </p>
              </div>
              
              <p style="text-align: center;">
               <a href="${siteUrl}" class="button">Войти в личный кабинет</a>
              </p>
              
              <p>Если у вас возникли вопросы, просто ответьте на это письмо — я помогу!</p>
              
              <p>До встречи на занятиях! 🧪<br/>
              <b>Дмитрий Крыльский</b><br/>
              <i>Репетитор по химии</i></p>
            </div>
            
            <div class="footer">
              <p>Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
              <p>© ${new Date().getFullYear()} Репетитор по химии | ${siteUrl}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(
      "✅ Приветственный email отправлен! Message ID:",
      result.messageId,
    );
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Ошибка отправки приветственного email:", error);
    return { success: false, error: String(error) };
  }
}
