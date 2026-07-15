import { redirect } from "next/navigation";
import { auth } from "@/app/auth/auth";
import { AdminNav } from "./components/adminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const allowedRoles = ["moderator", "admin"];

  // Проверка авторизации и роли
  if (!session || !allowedRoles.includes(session?.user?.role as string)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AdminNav />
      <main className="p-6 mx-auto">{children}</main>
    </div>
  );
}
