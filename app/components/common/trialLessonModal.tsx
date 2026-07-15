"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TrialLessonForm from "../../forms/trialLesson.form";
import { siteConfig } from "@/app/config/site.config";

interface TrialLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const { invitation } = siteConfig;

export default function TrialLessonModal({
  isOpen,
  onClose,
}: TrialLessonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#2c3e50] rounded-2xl border border-slate-500">
        <div className="bg-[#2c3e50]">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>
              <p className="text-2xl font-bold text-white mb-6">{invitation}</p>
            </DialogTitle>
          </DialogHeader>
          <TrialLessonForm onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
