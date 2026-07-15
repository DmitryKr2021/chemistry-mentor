import { prisma } from "@/app/utils/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import { getActualUserId } from "@/app/utils/getActualUserId";

export const revalidate = 0;

export default async function ProfilePage() {
  const userId = await getActualUserId();

  // Получаем актуальные данные пользователя
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <ProfileClient user={user} />
    </div>
  );
}
