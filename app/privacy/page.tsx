import { Metadata } from "next";
import { auth } from "@/app/auth/auth";
import { prisma } from "@/app/utils/prisma";
import { ConsentManagement } from "./ConsentManagement";
import { Shield, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Consent } from "@/types/consent";
import myDomain, { myEmail } from "../config/site.config";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | Репетитор по химии",
  description:
    "Политика в отношении обработки персональных данных сайта репетитора по химии",
  robots: { index: true, follow: true },
};

// 🔹 Получаем данные оператора (можно вынести в .env)
const operatorInfo = {
  fullName: "Крыльский Дмитрий Вильямович",
  inn: "366316004016",
  email: `${myEmail}`,
  phone: "+7 (985) 248-14-18",
  siteUrl: myDomain,
};

export default async function PrivacyPage() {
  const session = await auth();

  // Получаем согласия пользователя (если авторизован)
  let userConsents: Consent[] = [];
  if (session?.user?.id) {
    userConsents = await prisma.consent.findMany({
      where: { userId: session.user.id },
      orderBy: { consentDate: "desc" },
    });
  }

  return (
    <main
      id="top" // 🔹 Якорь для кнопки "Наверх"
      className="min-h-screen bg-slate-50 py-6 sm:py-12 overflow-x-hidden"
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* 🔹 Заголовок */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-8 mb-6">
          <div className="flex items-start sm:items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-800 break-words">
                Политика конфиденциальности
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 break-words">
                В отношении обработки персональных данных
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 pt-4 border-t border-slate-100">
            <span>
              <strong>Дата вступления в силу:</strong> 1 июля 2026 г.
            </span>
            <span>
              <strong>Версия:</strong> 1.0
            </span>
          </div>
        </div>

        {/* 🔹 Навигация по разделам */}
        <nav className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">
            Содержание
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
            {[
              { id: "section-1", label: "1. Общие положения" },
              { id: "section-2", label: "2. Обрабатываемые данные" },
              { id: "section-3", label: "3. Цели обработки" },
              { id: "section-4", label: "4. Правовые основания" },
              { id: "section-5", label: "5. Порядок обработки" },
              { id: "section-6", label: "6. Файлы cookie" },
              { id: "section-7", label: "7. Ваши права" },
              { id: "section-8", label: "8. Сроки обработки" },
              { id: "section-9", label: "9. Трансграничная передача" },
              { id: "section-10", label: "10. Заключительные положения" },
              { id: "section-11", label: "11. Контакты" },
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors break-words"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 🔹 Управление согласиями (для авторизованных) */}
        {session?.user?.id && <ConsentManagement userConsents={userConsents} />}

        {/* 🔹 Текст Политики */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-8 space-y-8 text-slate-700 leading-relaxed">
          {/* Раздел 1 */}
          <section id="section-1">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              1. Общие положения
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>
                1.1. Настоящая Политика в отношении обработки персональных
                данных (далее — «Политика») разработана в соответствии с
                Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных
                данных» и определяет порядок обработки персональных данных и
                меры по обеспечению их безопасности.
              </p>
              <p>1.2. Оператором персональных данных является:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 my-3 break-words">
                <p className="font-semibold text-slate-800 break-words">
                  {operatorInfo.fullName}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 break-words">
                  ИНН: {operatorInfo.inn}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 break-words">
                  Email: {operatorInfo.email}
                </p>
              </div>
              <p>
                1.3. Настоящая Политика применяется к информации, которую
                Оператор может получить о пользователях при использовании
                веб-сайта{" "}
                <a
                  href={operatorInfo.siteUrl}
                  className="text-emerald-600 hover:underline break-all"
                >
                  {operatorInfo.siteUrl}
                </a>
                .
              </p>
              <p>
                1.4. Использование Сайта означает безоговорочное согласие
                Пользователя с настоящей Политикой. В случае несогласия
                Пользователь должен воздержаться от использования Сайта.
              </p>
            </div>
          </section>

          {/* Раздел 2 */}
          <section id="section-2">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              2. Персональные данные, обрабатываемые Оператором
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>
                2.1. Оператор может обрабатывать следующие категории
                персональных данных:
              </p>
              <h3 className="font-semibold text-slate-800 mt-4">
                2.1.1. Данные, предоставляемые при регистрации:
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>Фамилия, имя, отчество</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Пароль (в хэшированном виде)</li>
                <li>Дата регистрации</li>
              </ul>
              <h3 className="font-semibold text-slate-800 mt-4">
                2.1.2. Данные, связанные с образовательным процессом:
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>Класс обучения / уровень подготовки</li>
                <li>Цели обучения (ЕГЭ, ОГЭ, олимпиады)</li>
                <li>Расписание занятий</li>
                <li>Информация об успеваемости</li>
                <li>Домашние задания и результаты</li>
                <li>Отзывы и обратная связь</li>
              </ul>
              <h3 className="font-semibold text-slate-800 mt-4">
                2.1.3. Данные, собираемые автоматически:
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>IP-адрес</li>
                <li>Сведения о браузере и ОС</li>
                <li>Время доступа к Сайту</li>
                <li>Данные файлов cookie</li>
              </ul>
              <p className="mt-4">
                2.2. Оператор не обрабатывает специальные категории персональных
                данных, за исключением случаев, предусмотренных
                законодательством.
              </p>
              <p>
                2.3. Обработка данных несовершеннолетних до 14 лет
                осуществляется только с согласия законных представителей.
              </p>
            </div>
          </section>

          {/* Раздел 3 */}
          <section id="section-3">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              3. Цели обработки персональных данных
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>3.1. Оператор обрабатывает данные в следующих целях:</p>
              <h3 className="font-semibold text-slate-800 mt-4">
                Идентификация и коммуникация:
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>Идентификация Пользователя</li>
                <li>Связь по вопросам обучения и оплаты</li>
                <li>Направление уведомлений и материалов</li>
                <li>Техническая поддержка</li>
              </ul>
              <h3 className="font-semibold text-slate-800 mt-4">
                Оказание образовательных услуг:
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>Организация занятий по химии</li>
                <li>Формирование расписания</li>
                <li>Назначение и проверка домашних заданий</li>
                <li>Отслеживание прогресса</li>
              </ul>
              <h3 className="font-semibold text-slate-800 mt-4">
                Обеспечение безопасности:
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>Защита от несанкционированного доступа</li>
                <li>Предотвращение мошенничества</li>
                <li>Соблюдение требований законодательства</li>
              </ul>
            </div>
          </section>

          {/* Раздел 4 */}
          <section id="section-4">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              4. Правовые основания обработки
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>4.1. Обработка осуществляется на основании:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>
                  Согласия субъекта персональных данных (ст. 6 ч. 1 п. 1 ФЗ-152)
                </li>
                <li>
                  Договора, стороной которого является субъект (ст. 6 ч. 1 п. 5
                  ФЗ-152)
                </li>
                <li>Законных интересов Оператора (ст. 6 ч. 1 п. 7 ФЗ-152)</li>
              </ul>
            </div>
          </section>

          {/* Раздел 5 */}
          <section id="section-5">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              5. Порядок и условия обработки
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>
                5.1. Оператор принимает необходимые меры для защиты данных от
                неправомерного доступа, включая:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>Шифрование при передаче (HTTPS)</li>
                <li>Хранение паролей в хэшированном виде</li>
                <li>Ограничение доступа сотрудников</li>
                <li>Регулярное обновление ПО</li>
                <li>Резервное копирование</li>
              </ul>
              <p>
                5.2. Оператор не передаёт данные третьим лицам, за исключением
                случаев, предусмотренных законодательством или необходимых для
                исполнения договора (например, платёжным системам).
              </p>
            </div>
          </section>

          {/* Раздел 6 */}
          <section id="section-6">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              6. Файлы cookie
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>
                6.1. Сайт использует файлы cookie для аутентификации, сохранения
                настроек и анализа посещаемости.
              </p>
              <p>
                6.2. Пользователь может отключить cookie в настройках браузера,
                но это может ограничить функциональность Сайта.
              </p>
              <p>6.3. Используются следующие аналитические сервисы:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>Яндекс.Метрика (ООО «ЯНДЕКС», Россия)</li>
                <li>Google Analytics (Google LLC, США)</li>
              </ul>
            </div>
          </section>

          {/* Раздел 7 */}
          <section id="section-7">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              7. Права субъекта персональных данных
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>7.1. Пользователь имеет право:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 sm:pl-4 text-slate-600">
                <li>Получать информацию об обработке своих данных</li>
                <li>
                  Требовать уточнения, блокирования или уничтожения данных
                </li>
                <li>Отозвать согласие на обработку</li>
                <li>Обжаловать действия Оператора в Роскомнадзор или суд</li>
                <li>На возмещение убытков и компенсацию морального вреда</li>
              </ul>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4 mt-4 break-words">
                <p className="text-xs sm:text-sm">
                  💡 <strong>Управлять согласиями:</strong> Если вы
                  зарегистрированы на сайте, вы можете просмотреть и отозвать
                  свои согласия в{" "}
                  <Link
                    href="/account/settings"
                    className="text-emerald-700 font-semibold hover:underline break-words"
                  >
                    настройках личного кабинета
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Раздел 8 */}
          <section id="section-8">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              8. Сроки обработки
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>
                8.1. Данные обрабатываются в течение всего срока использования
                Сайта и 3 года после прекращения использования.
              </p>
              <p>
                8.2. После истечения срока или отзыва согласия данные
                уничтожаются в течение 30 дней.
              </p>
            </div>
          </section>

          {/* Раздел 9 */}
          <section id="section-9">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              9. Трансграничная передача
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>
                9.1. При использовании аналитических сервисов возможна
                трансграничная передача данных на территории иностранных
                государств.
              </p>
              <p>
                9.2. Оператор обеспечивает соблюдение требований
                законодательства при такой передаче.
              </p>
            </div>
          </section>

          {/* Раздел 10 */}
          <section id="section-10">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              10. Заключительные положения
            </h2>
            <div className="space-y-3 text-xs sm:text-base">
              <p>
                10.1. Оператор вправе вносить изменения в Политику. Новая
                редакция вступает в силу с момента размещения на Сайте.
              </p>
              <p>
                10.2. Политика составлена в соответствии с ФЗ-152 «О
                персональных данных».
              </p>
            </div>
          </section>

          {/* 🔹 Раздел 11 — САМЫЙ ПРОБЛЕМНЫЙ из-за длинных email */}
          <section id="section-11">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4">
              11. Контактная информация
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-6 space-y-3">
              {/* 🔹 Блок оператора: на мобильных вертикально, иконка сверху */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0 break-words">
                  <p className="font-semibold text-slate-800 break-words">
                    Оператор персональных данных
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 break-words">
                    {operatorInfo.fullName}
                  </p>
                  <p className="text-xs text-slate-500 break-words">
                    ИНН: {operatorInfo.inn}
                  </p>
                </div>
              </div>

              {/* 🔹 Email: иконка сверху на мобильных */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <a
                  href={`mailto:${operatorInfo.email}`}
                  className="text-emerald-600 hover:underline break-all text-xs sm:text-sm"
                >
                  {operatorInfo.email}
                </a>
              </div>

              {/* 🔹 Телефон: иконка сверху на мобильных */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <a
                  href={`tel:${operatorInfo.phone.replace(/\s/g, "")}`}
                  className="text-emerald-600 hover:underline break-words text-xs sm:text-sm"
                >
                  {operatorInfo.phone}
                </a>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-600 break-words">
              По всем вопросам обработки персональных данных обращайтесь по
              указанному email с пометкой{" "}
              <strong>«Вопросы обработки персональных данных»</strong>.
            </p>
          </section>
        </div>

        {/* 🔹 Кнопка "Наверх" */}
        <div className="mt-6 text-center">
          <a
            href="#top"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >
            ↑ Вернуться к началу
          </a>
        </div>
      </div>
    </main>
  );
}
