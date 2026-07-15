import { MetadataRoute } from "next";
import myDomain from "./config/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account/", "/admin/", "/api/"],
      },
    ],
    sitemap: `${myDomain}/sitemap.ts`,
  };
}
