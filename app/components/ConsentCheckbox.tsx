"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  consentType?: "registration" | "contact" | "newsletter" | "lesson_booking";
}

export function ConsentCheckbox({
  checked,
  onChange,
  error,
  consentType = "registration",
}: ConsentCheckboxProps) {
  const getText = () => {
    switch (consentType) {
      case "registration":
        return "Я согласен с Политикой конфиденциальности и даю согласие на обработку персональных данных";
      case "contact":
        return "Я согласен на обработку персональных данных для ответа на моё обращение";
      case "newsletter":
        return "Я согласен получать информационные письма и новости об образовательных программах";
      case "lesson_booking":
        return "Я согласен на обработку персональных данных для записи на занятие";
      default:
        return "Я согласен с Политикой конфиденциальности";
    }
  };

  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
        />
        <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors leading-relaxed">
          <Shield className="w-3.5 h-3.5 inline-block mr-1 text-emerald-600 -mt-0.5" />
          {getText()} (
          <Link
            href="/privacy"
            target="_blank"
            className="text-emerald-600 hover:text-emerald-700 underline"
          >
            Политика конфиденциальности
          </Link>
          )
        </span>
      </label>
      {error && <p className="text-xs text-red-500 ml-7">{error}</p>}
    </div>
  );
}
