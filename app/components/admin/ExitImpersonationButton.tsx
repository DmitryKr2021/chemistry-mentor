"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { stopImpersonation } from "@/app/admin/impersonate/actions";

export function ExitImpersonationButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => stopImpersonation())}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-md transition-colors disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      Выйти из режима
    </button>
  );
}
