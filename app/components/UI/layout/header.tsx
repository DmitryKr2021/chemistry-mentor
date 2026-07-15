"use client";

import { siteConfig } from "@/app/config/site.config";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "@/app/forms/loginReg.form";
import { handleSignOut } from "@/app/actions/handleSignOut";
import { useAuthStore } from "@/app/store/auth.store";
import { useOpenAuthModal } from "@/app/store/useAuthModalStore";
import { UserCircle, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const { logoTitle, logoSubTitle, altLogo, navItems } = siteConfig;

export const Logo = () => {
  return (
    <Image
      src="/images/icons/Logo.jpg"
      alt={altLogo}
      width={170}
      height={170}
      priority
    />
  );
};

export default function Header() {
  const pathname = usePathname();
  const { isAuth, status, setAuthState, user } = useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Закрываем меню при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  {
    /* Блокировка прокрутки страницы при открытом меню */
  }
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const goOut = async () => {
    try {
      // Выполняем серверный action
      await handleSignOut();
      // Обновляем клиентское состояние
      setAuthState("unauthenticated", null);
      window.location.reload();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const { open } = useOpenAuthModal();
  const handleLoginClick = () => open("login");
  const handleRegisterClick = () => open("register");

  const isAdminRole = user?.role && ["moderator", "admin"].includes(user.role);
  const isUserRole = user?.role === "user";

  // Фильтруем пункты меню для обеих версий (десктоп и мобильная)
  const filteredNavItems = navItems.filter((item) => {
    if (item.href === "/account") {
      return isAuth && isUserRole;
    }
    if (item.href === "/admin") {
      return isAuth && isAdminRole;
    }
    return true;
  });

  return (
    <header className="bg-slate-800 text-white px-4 sm:px-8 sticky top-0 z-50 h-[70px]">
      <div className="max-w-8xl mx-auto flex justify-between items-stretch h-full">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2 py-2">
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
            <Logo />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{logoTitle}</h1>
            <p className="hidden min-[360px]:block text-[12px] text-slate-300">
              {logoSubTitle}
            </p>
          </div>
        </Link>

        {/* 🔹 Десктопная навигация (видна только на экранах >= 1500px) */}
        <NavigationMenu className="h-full">
          <NavigationMenuList className="hidden min-[1300px]:flex text-lm font-medium h-full">
            {filteredNavItems.map((item) => {
              const { href, label } = item;
              const isActive: boolean = pathname === href;
              return (
                <NavigationMenuItem key={href} className="h-full">
                  <Link
                    href={href}
                    className={`h-[70px] flex items-center px-8 text-sm font-medium transition-all ${
                      isActive
                        ? "text-[var(--button-yellow)] bg-slate-700 border-b-2 border-[var(--button-yellow)]"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                    onClick={() =>
                      sessionStorage.removeItem("blog_scroll_state")
                    }
                  >
                    {label}
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Правая часть: кнопки авторизации / пользователь */}
        <div className="flex items-center gap-2">
          {isAuth && (
            <UserCircle className="w-8 h-8 text-[var(--button-yellow)] hover:text-green-300 transition-colors cursor-pointer" />
          )}

          {/* 🔹 Десктопные кнопки (видны только на экранах >= 1500px) */}
          <div className="hidden min-[1500px]:flex items-center gap-2">
            {status === "loading" ? (
              <p>Загрузка...</p>
            ) : !isAuth ? (
              <div className="flex items-center border h-[42px]">
                <Button asChild variant="ghost" onClick={handleLoginClick}>
                  <Link href="#">Логин</Link>
                </Button>
                <Button asChild variant="ghost" onClick={handleRegisterClick}>
                  <Link href="#">Регистрация</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center h-[42px] border">
                <form action={goOut} className="">
                  <Button
                    variant="ghost"
                    color="secondary"
                    className="w-full justify-start text-slate-300 hover:bg-white hover:text-slate-700 cursor-pointer"
                  >
                    Выйти
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* 🔹 Гамбургер (виден только на экранах < 1500px) */}
          <button
            className="min-[1500px]:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-slate-700 rounded transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Открыть меню"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 🔹 Мобильное выпадающее меню */}
        <div
          ref={mobileMenuRef}
          className={`
            min-[1500px]:hidden 
            absolute top-[70px] left-0 right-0 
            bg-slate-800 border-t border-slate-700 shadow-lg
            transition-all duration-300 ease-in-out
            ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-4 invisible"
            }
          `}
        >
          <nav className="flex flex-col p-4 max-w-8xl mx-auto">
            {/* Навигационные ссылки */}
            {filteredNavItems.map((item) => {
              const { href, label } = item;
              const isActive: boolean = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    py-3 px-4 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "text-[var(--button-yellow)] bg-slate-700 border-l-4 border-[var(--button-yellow)]"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }
                  `}
                >
                  {label}
                </Link>
              );
            })}

            {/* Разделитель */}
            <div className="border-t border-slate-700 my-3" />

            {/* Кнопки авторизации в мобильной версии */}
            {status === "loading" ? (
              <p className="py-3 px-4 text-slate-300">Загрузка...</p>
            ) : !isAuth ? (
              <>
                <Button
                  variant="ghost"
                  className="justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => {
                    handleLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Логин
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => {
                    handleRegisterClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Регистрация
                </Button>
              </>
            ) : (
              <form action={goOut} className="w-full">
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Выйти
                </Button>
              </form>
            )}
          </nav>
        </div>

        <AuthModal />
      </div>
    </header>
  );
}
