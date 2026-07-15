import { getImpersonatedUserData } from "@/app/admin/impersonate/actions";
import { ExitImpersonationButton } from "./ExitImpersonationButton";
import { Eye, User } from "lucide-react";

export async function ImpersonationBanner() {
  const user = await getImpersonatedUserData();
  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Eye className="w-4 h-4" />
          <span className="font-semibold">Режим просмотра:</span>
          <User className="w-4 h-4" />
          <span>
            {user.name || user.email} ({user.email})
          </span>
        </div>
        <ExitImpersonationButton />
      </div>
    </div>
  );
}
