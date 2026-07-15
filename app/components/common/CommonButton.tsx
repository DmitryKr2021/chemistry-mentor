"use client";

import { Button } from "@/components/ui/button";

interface CommonButtonProps {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
  type?: "submit";
  disabled?: boolean;
  asChild?: boolean;
}

export default function CommonButton({
  variant = "default",
  children,
  size = "default",
}: CommonButtonProps & { className?: string }) {
  return (
    <Button
      variant={variant}
      size={size}
      className={`min-w-fit whitespace-nowrap bg-[var(--button-yellow)] text-slate-900 px-4 sm:px-8 py-3 rounded-lg font-bold hover:bg-green-300 transition shadow-lg hover:shadow-green-400/50 cursor-pointer`}
    >
      {children}
    </Button>
  );
}
