"use client";

import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { FaTelegram, FaVk } from "react-icons/fa";
import ContactForm from "@/app/forms/contact.form";
import MapWrapper from "@/app/components/map/mapWrapper";
import { myEmail, siteConfig } from "@/app/config/site.config";
import BookButton from "@/app/components/common/bookButton";

const socialLinks = [
  {
    name: "VK",
    icon: FaVk,
    href: "https://vk.com/id446183970",
    baseColor: "text-[#0077FF]", // Синий цвет иконки
    hoverBg: "hover:bg-[#0077FF]", // Синий фон при наведении
    hoverText: "hover:text-white", // Белый текст при наведении
  },
  {
    name: "Telegram",
    icon: FaTelegram,
    href: "https://t.me/DmitryVK2021",
    baseColor: "text-[#0088cc]", // Голубой цвет иконки
    hoverBg: "hover:bg-[#0088cc]",
    hoverText: "hover:text-white",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/89852481418",
    baseColor: "text-[#25D366]", // Зелёный цвет иконки
    hoverBg: "hover:bg-[#25D366]",
    hoverText: "hover:text-white",
  },
];

const { invitation } = siteConfig;

export default function ContactsPage() {
  const center: LatLngExpression = [56.74023, 37.22544];
  const markerPosition: LatLngExpression = [56.74023, 37.22544];
  return (
    <div className="min-h-screen bg-slate-200 w-full">
      {/* Hero Section */}
      <section className="bg-slate-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Контакты</h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Contact Info & CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column */}
          <div className="w-full bg-transparent border-0">
            <div className="w-full p-2">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Свяжитесь с репетитором!
              </h2>
              <p className="text-gray-600 mb-6">
                Готовы к успеху в химии? Запишитесь на пробный урок сегодня!
              </p>
              <BookButton
                variant="default"
                size="lg"
                className="w-fit min-w-max whitespace-nowrap bg-[var(--button-yellow)] text-slate-900 px-4 sm:px-8 py-3 rounded font-bold hover:bg-green-300 transition shadow-lg hover:shadow-green-400/50 hover:cursor-pointer"
              >
                {invitation}
              </BookButton>
            </div>
          </div>

          {/* Right Column - Contact Details */}
          <Card className="bg-white shadow-lg rounded-sm">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-800">Телефон:</p>
                    <a
                      href="tel:+79991234567"
                      className="text-gray-600 hover:text-emerald-600"
                    >
                      +7 (985) 248-14-18
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-800">Email:</p>
                    <a
                      href={`mailto:${myEmail}}`}
                      className="text-gray-600 hover:text-emerald-600"
                    >
                      {myEmail}
                    </a>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 mb-3">
                    Социальные сети:
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center transition-all hover:text-white ${social.hoverBg} ${social.hoverText}`}
                      >
                        <social.icon
                          className={`w-5 h-5 ${social.baseColor} group-hover:text-white`}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ContactForm />
          <div className="relative z-0 h-[500px] rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Мы на карте
            </h2>
            <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
              <MapWrapper
                center={center}
                markerPosition={markerPosition}
                popupText="Онлайн-занятия по химии. Подготовка к экзаменам в вузах, ЕГЭ и олимпиадам."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
