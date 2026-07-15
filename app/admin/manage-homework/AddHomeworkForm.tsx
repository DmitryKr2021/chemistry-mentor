"use client";

import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FilePlus } from "lucide-react";
import { createHomework } from "../actions";

const homeworkSchema = z.object({
  userId: z.string().min(1, "Выберите ученика"),
  title: z.string().min(1, "Введите название задания"),
  topic: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Укажите срок выполнения"),
  fileUrl: z.string().url("Неверный URL").optional().or(z.literal("")),
});

type HomeworkFormValues = z.infer<typeof homeworkSchema>;

interface Student {
  id: string;
  name: string | null;
  email: string;
}

interface AddHomeworkFormProps {
  students: Student[];
}

export function AddHomeworkForm({ students }: AddHomeworkFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<HomeworkFormValues>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      userId: "",
      title: "",
      topic: "",
      description: "",
      dueDate: "",
      fileUrl: "",
    },
  });

  const watchedUserId = useWatch({
    control: form.control,
    name: "userId",
  });

  const onSubmit = (data: HomeworkFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const result = await createHomework(formData);
      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilePlus className="w-5 h-5" />
          Добавить домашнее задание
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Выбор ученика */}
          <div className="space-y-2">
            <Label htmlFor="userId">Ученик *</Label>
            <Select
              onValueChange={(value) => form.setValue("userId", value)}
              value={watchedUserId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите ученика" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name || student.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.userId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.userId.message}
              </p>
            )}
          </div>

          {/* Название задания */}
          <div className="space-y-2">
            <Label htmlFor="title">Название задания *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Например: Решение задач по органической химии"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Тема */}
          <div className="space-y-2">
            <Label htmlFor="topic">Тема</Label>
            <Input
              id="topic"
              {...form.register("topic")}
              placeholder="Например: Алканы и циклоалканы"
            />
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание задания</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Подробное описание того, что нужно сделать"
              rows={4}
            />
          </div>

          {/* Срок выполнения */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Срок выполнения *</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              {...form.register("dueDate")}
            />
            {form.formState.errors.dueDate && (
              <p className="text-sm text-red-500">
                {form.formState.errors.dueDate.message}
              </p>
            )}
          </div>

          {/* Ссылка на файл */}
          <div className="space-y-2">
            <Label htmlFor="fileUrl">Ссылка на файл задания</Label>
            <Input
              id="fileUrl"
              type="url"
              {...form.register("fileUrl")}
              placeholder="https://drive.google.com/..."
            />
            {form.formState.errors.fileUrl && (
              <p className="text-sm text-red-500">
                {form.formState.errors.fileUrl.message}
              </p>
            )}
          </div>

          {/* Кнопка отправки */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Добавление...
              </>
            ) : (
              <>
                <FilePlus className="mr-2 h-4 w-4" />
                Назначить задание
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
