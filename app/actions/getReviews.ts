import { prisma } from "../utils/prisma";

export async function getApprovedReviews({
  search = "",
  minRating = 0,
  sortBy = "newest",
}: {
  search?: string;
  minRating?: number;
  sortBy?: "newest" | "oldest" | "highest" | "lowest";
}) {
  const orderByMap = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    highest: { rating: "desc" },
    lowest: { rating: "asc" },
  } as const;

  return await prisma.review.findMany({
    where: {
      status: "approved",
      AND: [
        search
          ? {
              OR: [
                { authorName: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        minRating > 0 ? { rating: { gte: minRating } } : {},
      ],
    },
    orderBy: orderByMap[sortBy],
    select: {
      id: true,
      authorName: true,
      avatar: true,
      content: true,
      rating: true,
      createdAt: true,
    },
  });
}
