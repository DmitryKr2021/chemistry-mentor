import ReviewCard from "@/app/components/reviews/reviewCard";
import { getApprovedReviews } from "@/app/actions/getReviews";
import { ReviewsJsonLd } from "@/app/components/seo/ReviewsJsonLd";

// Тип для отзыва
export interface Review {
  id: string;
  authorName: string;
  avatar: string | null;
  rating: number;
  content: string;
  status?: string;
  createdAt: string | Date;
}

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews({
    // page: 1,
    // limit: 10,
    // status: "approved",
  });

  if (reviews.length === 0) {
    return (
      <p className="text-center text-white">Пока нет отзывов. Будьте первым!</p>
    );
  }

  return (
    <>
      <ReviewsJsonLd reviews={reviews} />
      {/* Grid отзывов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </>
  );
}
