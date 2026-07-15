// app/components/seo/ReviewsJsonLd.tsx
import myDomain from "@/app/config/site.config";

interface Review {
  id: string;
  authorName: string;
  avatar?: string | null;
  content: string;
  rating: number;
  createdAt: string | Date;
}

interface Props {
  reviews: Review[];
}

export function ReviewsJsonLd({ reviews }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${myDomain}/#organization`,
    name: "Репетитор по химии — Дмитрий Крыльский",
    url: myDomain,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1),
      reviewCount: String(reviews.length),
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      datePublished: new Date(review.createdAt).toISOString().split("T")[0],
      reviewBody: review.content,
      name: `Отзыв от ${review.authorName}`,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(review.rating),
        bestRating: "5",
        worstRating: "1",
      },
      author: {
        "@type": "Person",
        name: review.authorName,
      },
    })),
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
