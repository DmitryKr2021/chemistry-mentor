import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");
  const rubric = searchParams.get("rubric");

  const where = rubric && rubric !== "all" ? { rubric } : {};

  const totalPosts = await prisma.blogPost.count({ where });
  const totalPages = Math.ceil(totalPosts / limit);

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { publishedAt: "asc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}
