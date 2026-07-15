"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { categories } from "./categories";

export function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeRubric = searchParams.get("rubric") ?? "all";

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("rubric");
    } else {
      params.set("rubric", id);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8 mt-8 px-4 md:px-20 justify-center">
      {categories.map((category) => {
        const isActive = activeRubric === category.id;
        return (
          <Badge
            key={category.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => handleSelect(category.id)}
            className={`cursor-pointer px-4 py-2 text-sm transition-all ${
              isActive
                ? "bg-teal-300"
                : "bg-white hover:bg-teal-100 text-gray-700"
            } rounded-sm`}
          >
            {category.name}
          </Badge>
        );
      })}
    </div>
  );
}
