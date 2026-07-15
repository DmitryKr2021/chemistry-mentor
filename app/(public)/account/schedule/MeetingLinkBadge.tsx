import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  link: string;
  isSoon?: boolean;
}

export function MeetingLinkBadge({ link, isSoon }: Props) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
        isSoon
          ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
          : "bg-green-600 text-white hover:bg-green-700",
      )}
    >
      <ExternalLink className="w-4 h-4" />
      {isSoon ? "🔗 Подключиться к уроку" : "🔗 Ссылка на встречу"}
    </a>
  );
}
