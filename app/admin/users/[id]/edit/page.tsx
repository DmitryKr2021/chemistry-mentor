import { prisma } from "@/app/utils/prisma";
import { notFound } from "next/navigation";
import EditUserForm from "./editUserForm"; // Импортируем клиентский компонент

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Получаем пользователя
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  // Если пользователя нет, показываем 404
  if (!user) {
    notFound();
  }

  // Передаем гарантированно существующего пользователя в клиентский компонент
  return <EditUserForm user={user} />;
}
