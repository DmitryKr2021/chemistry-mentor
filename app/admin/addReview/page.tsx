import { AddReviewForm } from "./addReviewForm";

export default function AddReviewPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Добавление отзыва с другого сайта
      </h1>
      <AddReviewForm />
    </div>
  );
}
