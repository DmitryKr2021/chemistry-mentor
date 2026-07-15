import { prisma } from "@/app/utils/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { UsersTable } from "./usersTable";
import CommonButton from "@/app/components/common/CommonButton";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Модерация пользователей
        </h1>
        <CommonButton asChild>
          <Link
            href="/admin/users/add"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить пользователя
          </Link>
        </CommonButton>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
