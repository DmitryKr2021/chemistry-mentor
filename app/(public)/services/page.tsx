"use client";

import Image from "next/image";
import {
  ServiceCard,
  type ServiceItem,
} from "../../components/services/serviceCard";
import { AdvantageCard } from "./advantageCard";
import { FAQItem } from "./facItem";
import BookButton from "@/app/components/common/bookButton";

// ========== SEO-оптимизированные данные ==========

const advantages = [
  {
    id: 1,
    title: "Доктор химических наук",
    description:
      "20+ лет опыта преподавания. Глубокое понимание предмета, а не просто пересказ учебника.",
    icon: "🎓",
  },
  {
    id: 2,
    title: "Индивидуальный подход",
    description:
      "Персональная программа под ваши цели: ЕГЭ, олимпиада, вузовский курс или помощь с долгами.",
    icon: "🎯",
  },
  {
    id: 3,
    title: "Результат, а не процесс",
    description:
      "90% моих учеников сдают ЕГЭ на 80+ баллов. Студенты закрывают сессии без пересдач.",
    icon: "📈",
  },
  {
    id: 4,
    title: "Современные методы",
    description:
      "Онлайн-формат с показом презентаций или интерактивной доской, записи уроков, поддержка в Telegram между занятиями.",
    icon: "💻",
  },
];

const services_school: ServiceItem[] = [
  {
    id: 1,
    title: "Подготовка к ЕГЭ по химии",
    price: "от 1500 ₽/час",
    description:
      "Системная подготовка к ЕГЭ по химии с опытным репетитором. Разбор всех 34 заданий, стратегия сдачи, тренировка на реальных вариантах прошлых лет. Индивидуальный план под ваш целевой балл.",
    icon: (
      <Image
        src="/images/services/img01.jpg"
        alt="Подготовка к ЕГЭ по химии онлайн"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 2,
    title: "Подготовка к ОГЭ по химии",
    price: "от 1500 ₽/час",
    description:
      "Подготовка к ОГЭ по химии для 9 класса. Понятное объяснение базовых тем, решение типовых заданий, работа над ошибками. Помогу сдать экзамен на высокий балл без стресса.",
    icon: (
      <Image
        src="/images/services/img02.jpg"
        alt="Подготовка к ОГЭ по химии онлайн"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 3,
    title: "Повышение успеваемости",
    price: "от 1500 ₽/час",
    description:
      "Индивидуальные занятия по химии для школьников 8-11 классов. Восполнение пробелов, помощь с домашними заданиями, подготовка к контрольным. Работа в комфортном темпе.",
    icon: (
      <Image
        src="/images/services/img03.jpg"
        alt="Репетитор по химии для школьников"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 4,
    title: "Подготовка к олимпиадам",
    price: "от 2500 ₽/час",
    description:
      "Углублённая подготовка к олимпиадам по химии. Нестандартные задачи, олимпиадная органическая и неорганическая химия.",
    icon: (
      <Image
        src="/images/services/img04.jpg"
        alt="Подготовка к олимпиадам по химии"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
];

const services_students: ServiceItem[] = [
  {
    id: 1,
    title: "Подготовка к сессии",
    price: "от 2000 ₽/час",
    description:
      "Экспресс-подготовка к зачётам и экзаменам по химии в вузе. Общая, органическая, физическая, коллоидная химия. Разбор билетов, решение типовых задач, устранение пробелов.",
    icon: (
      <Image
        src="/images/services/img08.png"
        alt="Репетитор по химии для студентов"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 2,
    title: "Разбор сложных тем",
    price: "от 2000 ₽/час",
    description:
      "Индивидуальный разбор сложных разделов: термодинамика, кинетика, электрохимия, растворы, стереохимия, механизмы реакций. Понятные объяснения с нуля, без воды и лишней теории.",
    icon: (
      <Image
        src="/images/services/img05.png"
        alt="Репетитор по физической химии"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 3,
    title: "Решение задач по химии",
    price: "от 2000 ₽/час",
    description:
      "Обучение решению расчётных и теоретических задач по всем разделам химии. Разбор методов, тренировка на ваших заданиях, формирование навыка самостоятельного решения.",
    icon: (
      <Image
        src="/images/services/img06.png"
        alt="Решение задач по химии с репетитором"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 4,
    title: "Помощь с курсовыми и дипломами",
    price: "от 3000 ₽/консультация",
    description:
      "Консультации по написанию курсовых и дипломных работ по химии. Подбор литературы, помощь с литобзором, оформление по ГОСТ, подготовка к защите. Без написания 'под ключ'.",
    icon: (
      <Image
        src="/images/services/img07.jpg"
        alt="Помощь с курсовыми по химии"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
];

const faqItems = [
  {
    question: "Как проходят онлайн-занятия по химии?",
    answer:
      "Занятия проходят в Zoom или Яндекс-телемосте с демонстрацией презентаций по теме урока или использованием интерактивной доски Miro. Я объясняю теорию, рисую схемы, решаю задачи в реальном времени. Все презентации я высылаю ученику — вы можете пересматривать их в любое время. Между занятиями я на связи в Telegram для оперативных вопросов.",
  },
  {
    question: "Сколько занятий нужно для подготовки к ЕГЭ по химии?",
    answer:
      "Для системной подготовки к ЕГЭ по химии с нуля обычно требуется от 80 до 120 занятий (2-3 раза в неделю в течение одного-полутора учебных лет). Если у вас уже есть база, достаточно 30-40 занятий для шлифовки навыков и тренировки вариантов. Точный план составляем после диагностического занятия.",
  },
  {
    question:
      "Можно ли заниматься с репетитором по химии для поступления в медицинский вуз?",
    answer:
      "Да, я специализируюсь на подготовке абитуриентов медицинских и химических вузов. Программа включает углублённое изучение органической и общей химии, решение задач повышенной сложности, разбор заданий ДВИ МГУ и других престижных вузов.",
  },
  {
    question: "Помогаете ли вы студентам с долгами по химии?",
    answer:
      "Да, это одно из моих направлений. Помогаю студентам химических, технологических, медицинских и фармацевтических вузов разобраться с задолженностями по общей, органической, физической и коллоидной химии. Работаю интенсивно — обычно хватает 5-10 занятий для закрытия долга.",
  },
  {
    question: "Какая стоимость занятий с репетитором по химии?",
    answer:
      "Стоимость зависит от уровня и целей. Для школьников подготовка к ЕГЭ/ОГЭ — от 1500 ₽/час, олимпиады — от 2500 ₽/час. Для студентов — от 2000 ₽/час. Консультации по курсовым и дипломам — от 3000 ₽. Точную цену обсуждаем после знакомства и определения программы.",
  },
  {
    question: "Есть ли пробное занятие?",
    answer:
      "Да, первое пробное занятие (45 минут) — бесплатное. На нём мы знакомимся, определяем ваш уровень, обсуждаем цели и составляем предварительный план обучения. Это ни к чему вас не обязывает — вы решаете, подходим ли мы друг другу.",
  },
];

const steps = [
  {
    number: "01",
    title: "Заявка и знакомство",
    description:
      "Вы оставляете заявку, мы созваниваемся на 15 минут, обсуждаем ваши цели и текущий уровень.",
  },
  {
    number: "02",
    title: "Бесплатный пробный урок",
    description:
      "Проводим диагностическое занятие, определяем пробелы и составляем индивидуальный план.",
  },
  {
    number: "03",
    title: "Систематические занятия",
    description:
      "Регулярные уроки 2-3 раза в неделю с домашними заданиями и поддержкой между занятиями.",
  },
  {
    number: "04",
    title: "Достижение результата",
    description:
      "Сдача экзамена на высокий балл, закрытие сессии или победа на олимпиаде — цель достигнута!",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-200 overflow-x-hidden">
      <main className="flex-grow">
        {/* ========== 1. HERO-СЕКЦИЯ ========== */}
        <section className="px-4 sm:px-6 lg:px-[50px] w-full pt-[30px] pb-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">
              Репетитор по химии онлайн — подготовка к ЕГЭ, ОГЭ и вузовским
              экзаменам
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              Индивидуальные занятия по химии с доктором химических наук.
              Понятные объяснения сложных тем, системная подготовка к экзаменам,
              помощь студентам с долгами и курсовыми. Онлайн-формат с записью
              уроков.
            </p>
            <BookButton
              variant="default"
              size="lg"
              className="bg-[var(--button-yellow)] text-slate-900 px-8 py-3 rounded font-bold hover:bg-green-300 transition shadow-lg hover:shadow-green-400/50 hover:cursor-pointer"
            >
              <p className="w-full">Записаться на пробный урок</p>
            </BookButton>
          </div>
        </section>

        {/* ========== 2. БЛОК ПРЕИМУЩЕСТВ ========== */}
        <section className="px-4 sm:px-6 lg:px-[50px] w-full py-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 text-center">
              Почему выбирают меня как репетитора по химии
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((adv) => (
                <AdvantageCard key={adv.id} {...adv} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== 3. УСЛУГИ ДЛЯ ШКОЛЬНИКОВ ========== */}
        <section className="px-4 sm:px-6 lg:px-[50px] w-full py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 text-center">
              Услуги для школьников: подготовка к ЕГЭ, ОГЭ и олимпиадам
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Индивидуальные занятия по химии для учеников 8-11 классов. Работаю
              с любым уровнем — от подтягивания школьной программы до подготовки
              к олимпиадам
            </p>
            <div className="grid grid-cols-1 min-[550px]:grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4 gap-6">
              {services_school.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== 4. УСЛУГИ ДЛЯ СТУДЕНТОВ ========== */}
        <section className="px-4 sm:px-6 lg:px-[50px] w-full py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 text-center">
              Репетитор по химии для студентов вузов
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Помощь студентам химических, технологических, медицинских и
              фармацевтических вузов. Подготовка к сессии, разбор сложных тем,
              решение задач, консультации по курсовым и дипломам.
            </p>
            <div className="grid grid-cols-1 min-[550px]:grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4 gap-6">
              {services_students.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== 5. КАК ПРОХОДЯТ ЗАНЯТИЯ ========== */}
        <section className="px-4 sm:px-6 lg:px-[50px] w-full py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-12 text-center">
              Как проходят онлайн-занятия по химии
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="text-4xl font-bold text-emerald-600 mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== 6. FAQ-СЕКЦИЯ ========== */}
        <section className="px-4 sm:px-6 lg:px-[50px] w-full py-16 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 text-center">
              Частые вопросы о занятиях с репетитором по химии
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <FAQItem
                  key={idx}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ========== 7. CTA-БЛОК ========== */}
        <section className="px-4 sm:px-6 lg:px-[50px] w-full py-16 bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Запишитесь на бесплатный пробный урок
            </h2>
            <p className="text-emerald-50 mb-8 text-lg">
              Познакомимся, определим ваш уровень и составим план подготовки.
              Без обязательств — вы сами решите, продолжать ли занятия.
            </p>
            <BookButton
              variant="default"
              size="lg"
              className="bg-[var(--button-yellow)] text-slate-900 px-8 py-3 rounded font-bold hover:bg-green-300 transition shadow-lg hover:shadow-green-400/50 hover:cursor-pointer"
            >
              <p className="w-full">Записаться на пробный урок</p>
            </BookButton>
          </div>
        </section>
      </main>
    </div>
  );
}
