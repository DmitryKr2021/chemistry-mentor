"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Eye, Loader2 } from "lucide-react";
import { startImpersonation } from "../impersonate/actions";

interface ImpersonateButtonProps {
  userId: string;
}

export function ImpersonateButton({ userId }: ImpersonateButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleImpersonate = () => {
    startTransition(async () => {
      try {
        await startImpersonation(userId);
        // Редирект произойдёт автоматически в Server Action
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Не удалось войти в кабинет",
        );
      }
    });
  };

  return (
    <button
      onClick={handleImpersonate}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline">Открытие...</span>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Смотреть</span>
        </>
      )}
    </button>
  );
}
