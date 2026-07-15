import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/utils/prisma";
import { auth } from "@/app/auth/auth";

const StatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  // 🔹 ДЕТАЛЬНОЕ ЛОГИРОВАНИЕ
  console.log("🔍 STATUS DEBUG 1414141414:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    role: session?.user?.role,
    roleType: typeof session?.user?.role,
    userId: session?.user?.id,
    cookieHeader: req.headers.get("cookie")?.includes("next-auth")
      ? "present"
      : "missing",
  });

  const allowedRoles = ["moderator", "admin"] as const;
  const userRole = session?.user?.role as string | undefined;

  if (
    !session?.user?.role ||
    !allowedRoles.includes(userRole as "moderator" | "admin")
  ) {
    console.warn("🚫 Access denied for role:", userRole);
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = StatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Неверные данные", details: parsed.error.format() },
      { status: 400 },
    );
  }

  const review = await prisma.review.update({
    where: { id },
    data: {
      status: parsed.data.status,
    },
  });

  return NextResponse.json(review);
}
