"use client";

import { usePathname } from "next/navigation";
import FooterContent from "@/app/components/footer/footerContent";
import Link from "next/link";

const BottomBar = () => {
  return (
    <div className=" w-full mx-auto px-20 pt-8 pb-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 bg-slate-900 sticky bottom-0">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <span>📞 (985) 248 1418</span>
      </div>
      <div className="flex gap-4 mb-4 md:mb-0">
        <a
          href="https://t.me/DmitryVK2021"
          className="hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram
        </a>
        <a
          href="https://vk.com/id446183970"
          className="hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          VK
        </a>
        <a
          href="https://wa.me/89852481418"
          className="hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
      {/* 🔹 Копирайт + правовые ссылки */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center md:justify-end text-center md:text-right">
        <span>&copy; 2026 Химия: путь к вершине.</span>
        {/* Ссылка на Политику конфиденциальности */}
        <Link
          href="/privacy"
          className="hover:text-white transition underline underline-offset-2"
        >
          Политика конфиденциальности
        </Link>
      </div>
    </div>
  );
};

const noFooter = ["/reviews", "/account", "/admin"];

export default function Footer() {
  const pathname = usePathname();
  const isNoFooterPage = noFooter.some((path) => pathname.includes(path));
  const footerClasses = isNoFooterPage
    ? "bg-slate-900"
    : "bg-slate-800 text-white pt-16";

  return (
    <footer className={footerClasses}>
      {isNoFooterPage ? (
        <BottomBar />
      ) : (
        <>
          <FooterContent />
          <BottomBar />
        </>
      )}
    </footer>
  );
}
