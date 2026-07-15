// app/components/seo/BlogPostJsonLd.tsx
import myDomain from "@/app/config/site.config";

interface Props {
  title: string;
  slug: string;
  excerpt?: string | null;
  contentHtml: string;
  publishedAt: string | Date;
  updatedAt?: string | Date;
  imagePath?: string | null;
  rubric?: string | null;
  authorName?: string;
}

export function BlogPostJsonLd({
  title,
  slug,
  excerpt,
  publishedAt,
  updatedAt,
  imagePath,
  rubric,
  authorName = "Дмитрий Крыльский",
}: Props) {
  const url = `${myDomain}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: imagePath
      ? `${myDomain}${imagePath}`
      : `${myDomain}/images/blog/default.jpg`,
    datePublished: new Date(publishedAt).toISOString(),
    dateModified: updatedAt
      ? new Date(updatedAt).toISOString()
      : new Date(publishedAt).toISOString(),
    author: {
      "@type": "Person",
      name: authorName,
      url: myDomain,
    },
    publisher: {
      "@type": "Organization",
      name: "Репетитор по химии — Дмитрий Крыльский",
      logo: {
        "@type": "ImageObject",
        url: `${myDomain}/images/logo.png`,
      },
    },
    url: url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: rubric || "химия, ЕГЭ, ОГЭ, репетитор",
    inLanguage: "ru-RU",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
