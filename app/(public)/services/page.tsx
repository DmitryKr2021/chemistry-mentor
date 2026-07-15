"use client";

import Image from "next/image";
import {
  ServiceCard,
  type ServiceItem,
} from "../../components/services/serviceCard";

const services_school: ServiceItem[] = [
  {
    id: 1,
    title: "Подготовка к ЕГЭ/ОГЭ",
    price: "от 1500 ₽",
    description:
      "Подготовка к ЕГЭ/ОГЭ с опытным репетитором. Понятные объяснения сложных тем, разбор заданий с экспертом, индивидуальные планы обучения.",
    icon: (
      <Image
        src="/images/services/img01.jpg"
        alt="Подготовка к ЕГЭ/ОГЭ"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 2,
    title: "Повышение успеваемости",
    price: "от 1500 ₽",
    description:
      "Восполнение пробелов в знаниях, подготовка к контрольным и олимпиадам. Работа с текущей программой школы в комфортном темпе.",
    icon: (
      <Image
        src="/images/services/img02.jpg"
        alt="Повышение успеваемости"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 3,
    title: "Индивидуальные занятия",
    price: "2000 ₽",
    description:
      "Персональные уроки для студентов и старшеклассников. Глубокое погружение в органическую/неорганическую химию, гибкий график.",
    icon: (
      <Image
        src="/images/services/img03.jpg"
        alt="Индивидуальные занятия"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 4,
    title: "Подготовка к олимпиадам",
    price: "2500 ₽",
    description:
      "Персональные уроки для студентов и старшеклассников. Глубокое погружение в органическую/неорганическую химию, гибкий график.",
    icon: (
      <Image
        src="/images/services/img04.jpg"
        alt="Подготовка к олимпиадам"
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
    title: "Подготовка к зачетам/экзаменам",
    price: "от 2000 ₽",
    description:
      "Подготовка к зачетам/экзаменам по общей, органической, физической, коллоидной химии. Разбор лабораторных и практических занятий, индивидуальные программы.",
    icon: (
      <Image
        src="/images/services/img08.png"
        alt="Подготовка к зачетам/экзаменам"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 2,
    title: "Разбор сложных тем",
    price: "от 2000 ₽",
    description:
      "Разбор сложных тем по общей, органической, физической, коллоидной химии. Восполнение пробелов в знаниях. Работа в индивидуальном темпе.",
    icon: (
      <Image
        src="/images/services/img05.png"
        alt="Разбор сложных тем"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 3,
    title: "Решение задач",
    price: "2000 ₽",
    description:
      "Решение задач с полным объяснением. Тренировка на индивидуальных заданиях. Гибкий график.",
    icon: (
      <Image
        src="/images/services/img06.png"
        alt="Решение задач"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
  {
    id: 4,
    title: "Курсовые и дипломные работы",
    price: "3000 ₽",
    description:
      "Помощь с оформлением курсовых и дипломных работ. Подбор литературы, подготовка литобзора. ",
    icon: (
      <Image
        src="/images/services/img07.jpg"
        alt="Курсовые и дипломные работы"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-200 overflow-x-hidden">
      <main className="flex-grow">
        {/* =========== SERVICES SECTION ========== */}
        <section className="px-4 sm:px-6 lg:px-[50px] w-full pt-[30px] pb-16 min-[1100px]:py-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-[30px] min-[1100px]:mb-12 text-center">
              Что я предлагаю
            </h1>
            <div className="mt-[30px] min-[1100px]:mt-[50px]">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-[30px] min-[1100px]:mb-12 text-center">
                Для школьников
              </h2>
              {/* Адаптивная сетка: 1 -> 2 -> 3 -> 4 колонки */}
              <div className="grid grid-cols-1 min-[550px]:grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4 gap-6">
                {services_school.map((service) => (
                  <ServiceCard key={service.id} {...service} />
                ))}
              </div>
            </div>

            <div className="mt-[50px]">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-12 text-center">
                Для студентов
              </h2>

              {/* Та же адаптивная сетка */}
              <div className="grid grid-cols-1 min-[550px]:grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4 gap-6">
                {services_students.map((service) => (
                  <ServiceCard key={service.id} {...service} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
