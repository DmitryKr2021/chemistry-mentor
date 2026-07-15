import { auth } from "@/app/auth/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/account/Sidebar";
import { ImpersonationBanner } from "@/app/components/admin/ImpersonationBanner";
import { getImpersonatedUserId } from "@/app/admin/impersonate/actions";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // 🔹 Проверяем режим имперсонации
  const impersonatedUserId = await getImpersonatedUserId();
  const isAdminImpersonating =
    session.user.role === "admin" && impersonatedUserId;

  // 🔹 Обычные ученики не должны видеть чужие кабинеты
  if (!isAdminImpersonating && session.user.role !== "user") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 min-[1000px]:grid-cols-[auto_1fr]">
      {isAdminImpersonating && (
        <div className="col-span-full fixed top-0 left-0 right-0 z-50">
          <ImpersonationBanner />
        </div>
      )}

      <Sidebar userName={session.user.name || "Ученик"} />

      <main className="p-4 sm:p-6 min-[1300px]:p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
