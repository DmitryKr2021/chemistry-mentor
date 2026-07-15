"use client";

import { JSX } from "react";
import FooterAbout from "../footer/footerAbout";
import FooterHome from "../footer/footerHome";
import { usePathname } from "next/navigation";

const FooterContent = () => {
  const pathname = usePathname();
  const footers: Record<string, JSX.Element | null> = {
    "/": <FooterHome />,
    "/about": <FooterAbout />,
    "/reviews": <></>,
    "/account": <></>,
  };
  return footers[pathname] || <FooterHome />;
};

export default FooterContent;
