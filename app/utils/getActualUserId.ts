import { auth } from "@/app/auth/auth";
import { getImpersonatedUserId } from "@/app/admin/impersonate/actions";

/**
 * Возвращает ID пользователя, чей кабинет нужно показывать.
 * - Если админ в режиме просмотра → ID просматриваемого ученика
 * - Иначе → ID текущего пользователя
 */
export async function getActualUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Не авторизован");
  }

  if (session.user.role === "admin") {
    const impersonatedId = await getImpersonatedUserId();
    if (impersonatedId) return impersonatedId;
  }

  return session.user.id;
}
