import { redirect } from "next/navigation";
import { auth } from "@/app/auth/auth";
import { prisma } from "@/app/utils/prisma";
import { ModerationTable } from "@/app/components/reviews/moderationTable";

export default async function ModerationPage() {
  const session = await auth();
  const allowedRoles = ["moderator", "admin"];
  if (!allowedRoles.includes(session?.user.role as string)) {
    redirect("/"); // или "/unauthorized"
  }

  const pendingReviews = await prisma.review.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      authorName: true,
      content: true,
      rating: true,
      createdAt: true,
      status: true,
      authorEmail: true,
      avatar: true,
    },
  });

  // 🔹 Сериализуем Date в строки
  const reviewsForClient = pendingReviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(), // ← Гарантируем строку
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Модерация отзывов</h1>
      {pendingReviews.length === 0 ? (
        <p className="text-gray-500">Нет отзывов на модерацию.</p>
      ) : (
        <ModerationTable initialReviews={reviewsForClient} />
      )}
    </div>
  );
}
