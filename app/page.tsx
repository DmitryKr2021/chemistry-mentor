import Image from "next/image";
import { siteConfig } from "./config/site.config";
import BookButton from "./components/common/bookButton";
import FeatureCard from "./components/home/featureCard";
import Link from "next/link";

const { description, heroTitle, invitation } = siteConfig;

const features = [
  {
    id: 1,
    icon: (
      <Image
        src="/images/home/card01.png"
        alt="Экспертный уровень преподавания химии — доктор химических наук"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
    title: "Экспертный уровень",
    text: "Я не просто учу «решать задачи по шаблону». Я помогаю понять саму суть химических процессов. Когда ученик видит логику и причинно-следственные связи, химия перестает быть набором непонятных формул и превращается в увлекательную систему.",
  },
  {
    id: 2,
    icon: (
      <Image
        src="/images/home/card02.png"
        alt="20 лет опыта подготовки к ЕГЭ и ОГЭ по химии"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
    title: "Опыт, который экономит ваше время",
    text: "За 20 лет практики я изучил тысячи типичных ошибок и «подводных камней». Я точно знаю, где школьник споткнется, и заранее подстелю соломку. Мы не тратим время на методы, которые не работают — только эффективные алгоритмы, проверенные на сотнях успешных учеников",
  },
  {
    id: 3,
    icon: (
      <Image
        src="/images/home/card03.png"
        alt="Связь теории химии с реальной жизнью на занятиях"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
    title: "Химия в жизни: от учебника до реальной практики",
    text: "Я связываю теорию с реальным миром: объясняю, как работают лекарства, почему одни вещества растворяются, а другие — нет, с какими веществами мы сталкиваемся каждый день, что используем в повседневной жизни. Ученики видят практическую ценность предмета, и это мощно мотивирует учиться",
  },
  {
    id: 4,
    icon: (
      <Image
        src="/images/home/card04.png"
        alt="Индивидуальный подход к каждому ученику по химии"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
    title: "Индивидуальный подход: от «не понимаю ничего» до «хочу на химфак»",
    text: "Я работаю и с теми, кто пытается подтянуть оценки в школе, и с абитуриентами, готовящимися к олимпиадам и поступлению в вуз, со студентами, испытывающими сложности при подготовке к зачетам и экзаменам. Для каждого выстраиваю персональную траекторию: от ликвидации пробелов до углублённого изучения тем, которые нужны именно вам",
  },
  {
    id: 5,
    icon: (
      <Image
        src="/images/home/card05.png"
        alt="Развитие научного мышления на занятиях химией"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
    title: "Развитие научного мышления, а не просто натаскивание",
    text: "Моя цель — научить ученика думать как учёный: анализировать условия, выдвигать гипотезы, проверять решения. Я стараюсь максимально вовлечь ученика в решение любых задач, не давая ему сразу готовый ответ. Этот навык пригодится не только на экзамене, но и в университете, и в любой интеллектуальной профессии. Химия становится тренажёром для ума",
  },
  {
    id: 6,
    icon: (
      <Image
        src="/images/home/card06.png"
        alt="Поддержка учеников без стресса на занятиях по химии"
        width={300}
        height={160}
        className="w-full h-full object-cover border"
      />
    ),
    title: "Поддержка и атмосфера без стресса",
    text: "Понимаю, что химия часто пугает. На моих занятиях не страшно задать «глупый» вопрос или ошибиться. Мы разбираем сложные темы спокойно, шаг за шагом. Я не просто преподаватель, а наставник, который верит в успех ученика и помогает этот успех достичь",
  },
];

export default function Home() {
  return (
    <main className="w-full flex-col items-center justify-between dark:bg-black sm:items-start">
      {/* ============ HERO SECTION ============ */}
      <section className="relative h-[500px] flex items-center bg-slate-900 overflow-hidden">
        <Image
          src="/images/home/hero.jpg"
          alt="Репетитор по химии проводит занятие с учеником"
          fill
          priority // 🔹 LCP-изображение — загружается первым
          className="object-cover opacity-80"
          sizes="100vw"
        />
        <div className="relative max-w-7xl mx-auto px-4 min-[600px]:px-8 min-[600px]:ml-[15vw] z-10 text-white text-center min-[600px]:text-left">
          <h1 className="max-[410px]:text-2xl text-4xl md:text-5xl font-extrabold max-w-2xl mx-auto min-[600px]:mx-0 mb-4 leading-snug [word-spacing:0.2em]">
            {heroTitle}
          </h1>
          <p className="text-lg text-slate-200 mb-8 max-w-xl mx-auto min-[600px]:mx-0 [word-spacing:0.2em]">
            {description}
          </p>
          <BookButton variant="default" size="lg" className="rounded-xl">
            {invitation}
          </BookButton>

          <Link
            href="/test"
            className="block mt-6 p-6 max-[410px]:mt-4 max-[410px]:p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white hover:shadow-xl transition-shadow cursor-pointer z-500"
          >
            <div className="flex items-center gap-4 max-[410px]:gap-3">
              <div className="text-4xl max-[410px]:text-3xl">🧪</div>
              <div>
                <h3 className="text-xl font-bold max-[410px]:text-lg">
                  Пройдите тест по химии
                </h3>
                <p className="text-indigo-100 text-sm max-[410px]:hidden">
                  10 вопросов • 15 минут • Определите свой уровень
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
      {/* ======= FEATURES (ПОЧЕМУ ВЫБРАЛИ МЕНЯ) ======= */}
      <section className="py-16 bg-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <h3 className="text-2xl font-bold text-center mb-12 text-slate-800">
            Что вы получаете, выбирая меня?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <article key={feature.id}>
                {" "}
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  text={feature.text}
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
