"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import TrialLessonModal from "../common/trialLessonModal";

interface BookButtonProps {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export default function BookButton({
  variant = "default",
  size = "default",
  children,
  className = "",
}: BookButtonProps & { className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={`w-full min-w-fit whitespace-nowrap bg-[var(--button-yellow)] text-slate-900 px-4 sm:px-8 py-3 rounded font-bold hover:bg-green-300 transition shadow-lg hover:shadow-green-400/50 cursor-pointer ${className}`}
      >
        {children}
      </Button>
      <TrialLessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
