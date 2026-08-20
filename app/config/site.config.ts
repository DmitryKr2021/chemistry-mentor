type NavItem = {
  href: string;
  label: string;
};

type SiteConfig = {
  logoTitle: string;
  logoSubTitle: string;
  heroTitle: string;
  altLogo: string;
  description: string;
  invitation: string;
  navItems: NavItem[];
};

export const siteConfig: SiteConfig = {
  logoTitle: "ХИМИЯ: путь к вершине",
  logoSubTitle: "Раскрой секреты Вселенной",
  altLogo: "Logo",
  heroTitle: "ВАШ ПУТЬ К УСПЕХУ В ХИМИИ НАЧИНАЕТСЯ ЗДЕСЬ!",
  description: "Поймите химию, полюбите химию с лучшим репетитором!",
  invitation: "Записаться на пробное занятие",
  navItems: [
    { href: "/", label: "Главная" },
    { href: "/about", label: "Обо мне" },
    { href: "/services", label: "Услуги" },
    { href: "/blog", label: "Блог" },
    { href: "/reviews", label: "Отзывы" },
    { href: "/contacts", label: "Контакты" },
    { href: "/TG-channel", label: "ТГ-канал" },
    { href: "/account", label: "Личный кабинет" },
    { href: "/admin", label: "Администратор" },
  ],
};

const myDomain = "https://chemistry-mentor.ru";
export default myDomain;

const myEmail = "krdvmail@mail.ru";
export { myEmail };
