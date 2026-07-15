"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link as LinkIcon, Trash2, Loader2 } from "lucide-react";

interface Props {
  lessonId: string;
  initialLink: string | null;
}

export function MeetingLinkManager({ lessonId, initialLink }: Props) {
  const [link, setLink] = useState(initialLink || "");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!initialLink);

  const handleSave = async () => {
    if (!link.trim()) {
      toast.error("Введите ссылку");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/admin/lessons/meeting-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, meetingLink: link }),
      });

      // 🔹 ВАЖНО: смотрим, что реально пришло
      const contentType = response.headers.get("content-type");

      const text = await response.text();

      // 🔹 Проверяем, JSON ли это
      if (!contentType?.includes("application/json")) {
        throw new Error(
          `Сервер вернул HTML вместо JSON (статус ${response.status}). ` +
            `Возможно, middleware перенаправил на страницу логина.`,
        );
      }

      const data = JSON.parse(text);

      if (!response.ok) throw new Error(data.error || "Ошибка сохранения");

      toast.success("Ссылка сохранена", {
        description: "Ученик получил уведомление на email",
      });

      setIsEditing(false);
    } catch (error) {
      toast.error("Ошибка", {
        description:
          error instanceof Error ? error.message : "Не удалось сохранить",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm("Удалить ссылку? Ученик больше не сможет подключиться по ней.")
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/lessons/meeting-link?lessonId=${lessonId}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error("Ошибка удаления");

      setLink("");
      setIsEditing(true);

      toast.success("Ссылка удалена");
    } catch (error) {
      toast.error("Ошибка", {
        description: "Не удалось удалить ссылку",
      });
      console.log("error=", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 min-w-[300px]">
      {isEditing ? (
        <>
          <div className="flex gap-2">
            <Input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://telesco.pe/..."
              className="flex-1"
            />
            <Button
              onClick={handleSave}
              disabled={loading || !link.trim()}
              size="sm"
              className="cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LinkIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            💡 Ссылка отправится ученику на email автоматически
          </p>
        </>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
          >
            ✏️ Изменить
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
