"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export type Review = {
  id: string;
  authorName: string;
  authorEmail: string;
  avatar: string | null;
  content: string;
  rating: number;
  status: string;
  createdAt: string | Date;
};

export function ModerationTable({
  initialReviews,
}: {
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatus = useCallback(
    async (id: string, status: "approved" | "rejected") => {
      setLoadingId(id);
      try {
        const res = await fetch(`/api/moderation/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Ошибка API");
        setReviews((prev) => prev.filter((r) => r.id !== id)); // Убираем из pending
      } catch (err) {
        alert(`Не удалось изменить статус ${err}`);
      } finally {
        setLoadingId(null);
      }
    },
    [],
  );

  const startEdit = (r: Review) => {
    setEditingId(r.id);
    setEditContent(r.content);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/moderation/${editingId}/content`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
        credentials: "include",
      });

      // 🔹 Читаем ответ даже при ошибке
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // 🔹 Показываем реальную ошибку от сервера
        console.error("❌ Server error:", data);
        throw new Error(data.error || data.message || `Ошибка ${res.status}`);
      }

      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, content: editContent } : r,
        ),
      );
      setEditingId(null);
      toast.success("Изменения сохранены");
    } catch (err) {
      alert(`Не удалось сохранить изменения ${err}`);
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-semibold">{r.authorName}</span>
              <span className="ml-2 text-sm text-gray-500">★ {r.rating}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>

          {editingId === r.id ? (
            <textarea
              className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          ) : (
            <p className="text-gray-700 text-sm mb-3">{r.content}</p>
          )}

          <div className="flex gap-2 mt-2">
            {editingId === r.id ? (
              <>
                <button
                  onClick={saveEdit}
                  disabled={loadingId === r.id}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Отмена
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startEdit(r)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleStatus(r.id, "approved")}
                  disabled={loadingId === r.id}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Одобрить
                </button>
                <button
                  onClick={() => handleStatus(r.id, "rejected")}
                  disabled={loadingId === r.id}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Отклонить
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
