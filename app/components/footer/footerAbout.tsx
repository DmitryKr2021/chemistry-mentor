import { Award, Beaker, CheckCircle2, Users } from "lucide-react";

const FooterAbout = () => {
  return (
    <section className="py-16 md:py-24 px-8 bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Мой подход к обучению
        </h2>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <p className="text-slate-300 leading-relaxed">
              Основа — глубокие знания в области химии. Использую современные
              методики преподавания и индивидуальный подход к каждому ученику.
            </p>

            <ul className="space-y-4">
              {[
                "Обучение по индивидуальной программе, учитывающей уровень подготовки и цели ученика",
                "Использование интерактивных материалов и визуализации сложных тем",
                "Регулярная проверка знаний и коррекция программы обучения",
                "Поддержка учеников между занятиями, помощь с домашними заданиями",
                "Подготовка к олимпиадам и конкурсным экзаменам",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Right Column - Illustrations & Text */}
          <div className="space-y-8">
            {/* Block 1 */}
            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-green-400/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Beaker className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Индивидуальный подход
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Каждая программа обучения составляется с учётом особенностей
                  ученика, его целей и уровня подготовки. Использую разные
                  методы объяснения сложных тем.
                </p>
              </div>
            </div>

            {/* Block 2 */}
            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-blue-400/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Современные методики
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Применяю интерактивные доски, 3D-модели молекул, виртуальные
                  лаборатории и другие современные образовательные технологии.
                </p>
              </div>
            </div>

            {/* Block 3 */}
            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-purple-400/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-10 h-10 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Гарантированный результат
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  95% моих учеников поступают в выбранные вузы. Средний балл ЕГЭ
                  по химии — 82. Регулярно отслеживаю прогресс и корректирую
                  программу.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterAbout;
