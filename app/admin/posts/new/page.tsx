"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

export default function NewPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    dayNumber: "",
    rubric: "",
  });

  const [files, setFiles] = useState<{
    docx: File | null;
    image: File | null;
  }>({
    docx: null,
    image: null,
  });

  const [preview, setPreview] = useState<{
    title: string;
    contentHtml: string;
    excerpt: string;
    imagePath: string | null;
  } | null>(null);

  // Загрузка файлов на сервер
  const handleUpload = async () => {
    if (!files.docx || !formData.dayNumber || !formData.rubric) {
      setError("Заполните все обязательные поля");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("docx", files.docx);
      if (files.image) {
        uploadFormData.append("image", files.image);
      }
      uploadFormData.append("dayNumber", formData.dayNumber);
      uploadFormData.append("rubric", formData.rubric);

      const response = await fetch("/api/admin/posts/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка загрузки");
      }

      setPreview(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  // Создание поста в БД
  const handleCreatePost = async () => {
    if (!preview) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: preview.title,
          contentHtml: preview.contentHtml,
          excerpt: preview.excerpt,
          imagePath: preview.imagePath,
          dayNumber: formData.dayNumber,
          rubric: formData.rubric,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка создания поста");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/posts");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Загрузить новый пост</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            ✅ Пост успешно создан! Перенаправление...
          </AlertDescription>
        </Alert>
      )}

      {!preview ? (
        <Card>
          <CardHeader>
            <CardTitle>Шаг 1: Загрузка файлов</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* День и рубрика */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dayNumber">День *</Label>
                <Input
                  id="dayNumber"
                  value={formData.dayNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, dayNumber: e.target.value })
                  }
                  placeholder="Day 01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rubric">Рубрика *</Label>
                <Input
                  id="rubric"
                  value={formData.rubric}
                  onChange={(e) =>
                    setFormData({ ...formData, rubric: e.target.value })
                  }
                  placeholder="Задача дня"
                  required
                />
              </div>
            </div>

            {/* Загрузка DOCX */}
            <div>
              <Label>DOCX файл *</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  {files.docx
                    ? files.docx.name
                    : "Нажмите для выбора DOCX файла"}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                onChange={(e) =>
                  setFiles({ ...files, docx: e.target.files?.[0] || null })
                }
                className="hidden"
              />
            </div>

            {/* Загрузка изображения */}
            <div>
              <Label>Изображение (опционально)</Label>
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  {files.image
                    ? files.image.name
                    : "Нажмите для выбора изображения"}
                </p>
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFiles({ ...files, image: e.target.files?.[0] || null })
                }
                className="hidden"
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={
                uploading ||
                !files.docx ||
                !formData.dayNumber ||
                !formData.rubric
              }
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Загрузить и конвертировать
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Шаг 2: Предпросмотр и сохранение</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Заголовок</Label>
              <p className="text-lg font-semibold">{preview.title}</p>
            </div>

            <div>
              <Label>Краткое описание</Label>
              <p className="text-sm text-muted-foreground">{preview.excerpt}</p>
            </div>

            {preview.imagePath && (
              <div>
                <Label>Изображение</Label>
                <Image
                  src={preview.imagePath}
                  alt="Preview"
                  width={800}
                  height={256}
                  className="mt-2 rounded-lg max-h-64 w-full object-cover"
                  unoptimized
                />
              </div>
            )}

            <div>
              <Label>Контент (HTML)</Label>
              <div
                className="mt-2 p-4 border rounded-lg bg-muted max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: preview.contentHtml }}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleCreatePost}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  "✅ Создать пост"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPreview(null);
                  setFiles({ docx: null, image: null });
                }}
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
