import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/app/globals.css";
import { Toaster } from "sonner";
import ClientProvider from "@/app/providers/ClientProvider";
import { auth } from "@/app/auth/auth";
import Header from "@/app/components/UI/layout/header";
import Footer from "@/app/components/UI/layout/footer";
import { JsonLd } from "./components/seo/JsonLd";
import myDomain from "./config/site.config";

export const metadata: Metadata = {
  metadataBase: new URL(myDomain),
  title: {
    default: "Репетитор по химии | Подготовка к ЕГЭ и ОГЭ | 20 лет опыта",
    template: "%s | Репетитор по химии",
  },
  description:
    "Репетитор по химии с 20-летним опытом. Подготовка к ЕГЭ (85+ баллов), ОГЭ, олимпиадам и экзаменам в вуз. Индивидуальный подход, онлайн и очно. Запишитесь на пробное занятие!",

  keywords: [
    "репетитор по химии",
    "подготовка к ЕГЭ по химии",
    "ОГЭ химия",
    "репетитор химия онлайн",
    "химия для школьников",
    "репетитор химфак",
    "занятия по химии",
  ],

  authors: [{ name: "Дмитрий Крыльский", url: myDomain }],
  creator: "Дмитрий Крыльский",
  publisher: "Chemistry Tutor",

  // 🔹 Геолокация (важно для локального SEO)
  other: {
    "geo.region": "RU",
    "geo.placename": "Москва, Дубна",
  },

  // 🔹 Open Graph (для соцсетей)
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: myDomain,
    siteName: "Репетитор по химии",
    title: "Репетитор по химии | Подготовка к ЕГЭ и ОГЭ",
    description:
      "20 лет опыта. Индивидуальные занятия онлайн и очно. Средний балл учеников на ЕГЭ — 85+",
    images: [
      {
        url: "public/images/about/foto_in_lab.png", // 🔹 Создайте картинку 1200×630px
        width: 1200,
        height: 630,
        alt: "Репетитор по химии",
      },
    ],
  },

  // 🔹 Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Репетитор по химии | ЕГЭ и ОГЭ",
    description:
      "20 лет опыта. Индивидуальный подход. Запишитесь на пробное занятие!",
    images: ["public/images/about/foto_in_lab.png"],
  },

  // 🔹 Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 🔹 Канонический URL
  alternates: {
    canonical: myDomain,
  },

  // 🔹 Верификация для поисковиков
  verification: {
    google: "ваш-google-код-верификации",
    yandex: "ваш-yandex-код-верификации",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ru">
      {/* 🔹 Next.js автоматически вынесёт этот <head> в настоящий head документа */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* 🔹 Добавьте сюда другие внешние ресурсы, если нужно */}
        {/* <link rel="preconnect" href="https://www.google-analytics.com" /> */}
        {/* <link rel="preconnect" href="https://mc.yandex.ru" /> */}
      </head>
      <body
        className={`${GeistSans.className} ${GeistMono.className} w-full m-0 p-0 min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <JsonLd />
        <Header />
        <ClientProvider session={session}>{children}</ClientProvider>
        <Footer />
        <Toaster
          richColors
          toastOptions={{
            className: "custom-toast",
          }}
        />
      </body>
    </html>
  );
}
