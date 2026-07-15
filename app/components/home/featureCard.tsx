import { type ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  className?: string;
  text: string;
}

export default function FeatureCard({
  icon,
  title,
  text = "",
}: FeatureCardProps) {
  return (
    <Card className="bg-slate-800 text-white border-0 flex flex-col h-full shadow-xl hover:shadow-2xl transition-shadow group">
      <CardHeader className="pb-2">
        <div className="mb-3 transition-transform duration-300 group-hover:scale-105 aspect-[6/4]">
          {icon}
        </div>
        <p className="text-lime-400 text-2xl font-extrabold mt-1">{title}</p>
      </CardHeader>

      <CardContent className="flex-grow text-slate-300 text-sm leading-relaxed">
        {text}
      </CardContent>
    </Card>
  );
}
