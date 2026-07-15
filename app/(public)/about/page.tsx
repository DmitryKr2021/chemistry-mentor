import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BadgeCheck, GraduationCap, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-screen bg-slate-700 overflow-x-hidden -ml-4">
      {/* Hero Section - About Me */}
      <section className="relative bg-slate-900 py-10 px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/images/about/about.png')] bg-cover bg-center opacity-90"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12">
            Обо мне
          </h1>

          {/* Profile Card */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl opacity-90">
            <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12">
              {/* Photo */}
              <div className="relative">
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl relative">
                  <Image
                    src="/images/about/foto_in_lab.png"
                    alt="Dmitry - репетитор по химии"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Info */}
              <div className="text-white space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    Дмитрий Вильямович
                  </h2>
                  <p className="text-slate-100 leading-relaxed">
                    Профессиональный онлайн-репетитор с многолетним опытом
                    преподавания химии. Помогаю школьникам и студентам понять
                    сложные темы, подготовиться к экзаменам и полюбить химию.
                    Индивидуальный подход к каждому ученику, современные
                    методики обучения и гарантированный результат.
                  </p>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-400" />
                    Образование
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Воронежский государственный университет (ВГУ), Химический
                    факультет. Диплом с отличием. Специальность: органическая
                    химия. Дополнительное педагогическое образование.
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-400" />
                    Опыт
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Более 20 лет преподаю химию студентам вузов. Основные
                    дисциплины: органическая, физическая, фармацевтическая
                    химия, ряд спецкурсов. Более 10 лет преподаю химию онлайн.
                    Подготовил более 700 учеников к зачетам и экзаменам, ЕГЭ и
                    ОГЭ. Использую современные образовательные технологии и
                    интерактивные материалы.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 md:py-24 px-8 bg-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
            Мои достижения
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Achievement 0 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Призер всесоюзной олимпиады по химии
                </h3>
                <p className="text-sm text-slate-600">1981 г.</p>
              </CardContent>
            </Card>

            {/* Achievement 1 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Доктор химических наук
                </h3>
                <p className="text-sm text-slate-600">
                  Специальность - органическая химия
                </p>
              </CardContent>
            </Card>

            {/* Achievement 2 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Повышение квалификации
                </h3>
                <p className="text-sm text-slate-600">
                  - Электрохромные материалы
                </p>
                <p className="text-sm text-slate-600">
                  - Компьютерные технологии в химии
                </p>
              </CardContent>
            </Card>

            {/* Achievement 3 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Публикации
                </h3>
                <p className="text-sm text-slate-600">- Монография</p>
                <p className="text-sm text-slate-600">- более 100 статей</p>
                <p className="text-sm text-slate-600">- 3 патента</p>
              </CardContent>
            </Card>

            {/* Achievement 4 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Более 700 студентов и школьников
                </h3>
                <p className="text-sm text-slate-600">Прошли обучение</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
