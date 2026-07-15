import myDomain, { myEmail } from "@/app/config/site.config";

export function JsonLd() {
  // 🔹 Основная разметка сайта
  const mainJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Организация / Репетитор
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": `${myDomain}/#organization`,
        name: "Репетитор по химии — Дмитрий Крыльский",
        alternateName: "Chemistry Tutor",
        url: myDomain,
        logo: {
          "@type": "ImageObject",
          url: `${myDomain}/images/icons/Logo.jpg`,
          width: 512,
          height: 512,
        },
        image: `${myDomain}/images/about/foto_in_lab.png`,
        description:
          "Репетитор по химии с 20-летним опытом. Подготовка к ЕГЭ (85+ баллов), ОГЭ, олимпиадам и экзаменам в вуз.",
        founder: {
          "@type": "Person",
          "@id": `${myDomain}/#person`,
          name: "Дмитрий Крыльский",
          jobTitle: "Репетитор по химии, преподаватель",
          description:
            "Преподаватель химии с 20-летним стажем. Подготовка к ЕГЭ, ОГЭ, олимпиадам.",
          alumniOf: {
            "@type": "EducationalOrganization",
            name: "Химический факультет ВГУ",
          },
          knowsAbout: [
            "Органическая химия",
            "Неорганическая химия",
            "Физическая химия",
            "Химическая термодинамика",
            "Электрохимия",
            "Общая химия",
            "Подготовка к ЕГЭ",
            "Подготовка к ОГЭ",
            "Олимпиадная химия",
          ],
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "RU",
          addressRegion: "Московская область",
          addressLocality: "Дубна",
        },
        areaServed: [
          {
            "@type": "Country",
            name: "Россия",
          },
          {
            "@type": "City",
            name: "Москва",
          },
          {
            "@type": "City",
            name: "Дубна",
          },
        ],
        // 🔹 Контактная информация
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["Russian"],
          email: `${myEmail}`,
          telephone: "+7-985-248-14-18",
        },
        // 🔹 Режим работы
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "21:00",
        },
        // 🔹 Рейтинг (важно для звёзд в поиске!)
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "50", // Замените на реальное число
          bestRating: "5",
          worstRating: "1",
        },
        // 🔹 Цены
        priceRange: "1500-3000 ₽/час",
      },

      // 2. Веб-сайт
      {
        "@type": "WebSite",
        "@id": `${myDomain}/#website`,
        url: myDomain,
        name: "Репетитор по химии — Дмитрий Крыльский",
        description:
          "Подготовка к ЕГЭ и ОГЭ по химии. 20 лет опыта. Средний балл учеников — 85+.",
        publisher: {
          "@id": `${myDomain}/#organization`,
        },
        inLanguage: "ru-RU",
      },

      // 3. Веб-страница (главная)
      {
        "@type": "WebPage",
        "@id": `${myDomain}/#webpage`,
        url: myDomain,
        name: "Репетитор по химии | Подготовка к ЕГЭ и ОГЭ | 20 лет опыта",
        description:
          "Индивидуальные занятия по химии онлайн и очно. Подготовка к ЕГЭ, ОГЭ, олимпиадам.",
        isPartOf: {
          "@id": `${myDomain}/#website`,
        },
        about: {
          "@id": `${myDomain}/#organization`,
        },
        inLanguage: "ru-RU",
      },

      // 4. Услуги
      {
        "@type": "Service",
        "@id": `${myDomain}/#service-ege`,
        name: "Подготовка к ЕГЭ по химии",
        description:
          "Индивидуальная подготовка к ЕГЭ по химии. Средний балл учеников — 85+.",
        provider: {
          "@id": `${myDomain}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "Россия",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Услуги репетитора по химии",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Course",
                name: "Подготовка к ЕГЭ по химии",
                description:
                  "Полный курс подготовки к ЕГЭ: теория, практика, разбор заданий",
                numberOfCredits: "60+ занятий",
                educationalLevel: "11 класс",
              },
              price: "2000",
              priceCurrency: "RUB",
              unitText: "час",
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Course",
                name: "Подготовка к ОГЭ по химии",
                description: "Курс подготовки к ОГЭ по химии для 9 класса",
                educationalLevel: "9 класс",
              },
              price: "1500",
              priceCurrency: "RUB",
              unitText: "час",
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Course",
                name: "Олимпиадная химия",
                description: "Подготовка к олимпиадам по химии разного уровня",
                educationalLevel: "8-11 класс",
              },
              price: "2500",
              priceCurrency: "RUB",
              unitText: "час",
            },
          ],
        },
      },

      // 🔹 5. Услуги (LocalBusiness)
      {
        "@type": "LocalBusiness",
        "@id": `${myDomain}/#business`,
        name: "Репетитор по химии — Дмитрий Вильямович",
        image: `${myDomain}/images/foto_in_lab.png`,
        url: myDomain,
        telephone: "+7-985-248-14-18",
        priceRange: "1500 - 2500 ₽₽",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Дубна, Московская обл.",
          addressCountry: "RU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "55.7558", // 🔹 Ваши координаты
          longitude: "37.6173",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "21:00",
          },
        ],
        sameAs: [
          // 🔹 Ваши соцсети
          "https://vk.com/id446183970",
          "https://t.me/DmitryVK2021",
        ],
      },

      // 🔹 6. Часто задаваемые вопросы (FAQ) — очень важно!
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Сколько стоит занятие с репетитором по химии?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Стоимость занятия зависит от формата и уровня подготовки. Онлайн-занятие (60 минут) — от 1500 рублей. Первое пробное занятие — бесплатно.",
            },
          },
          {
            "@type": "Question",
            name: "Как проходят онлайн-занятия?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Занятия проходят в Zoom или Яндекс Телемост с использованием презентаций репетитора. Все материалы и записи остаются у ученика.",
            },
          },
          {
            "@type": "Question",
            name: "За какое время нужно начинать подготовку к ЕГЭ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Оптимально — за 1-2 года до экзамена. Но даже за 6 месяцев можно значительно поднять балл при интенсивной работе.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(mainJsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
