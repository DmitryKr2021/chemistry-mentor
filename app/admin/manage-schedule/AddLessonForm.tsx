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
import { Loader2, CalendarPlus } from "lucide-react";
import { createLesson } from "../actions";

const lessonSchema = z.object({
  userId: z.string().min(1, "Выберите ученика"),
  topic: z.string().optional(),
  startTime: z.string().min(1, "Укажите время начала"),
  endTime: z.string().min(1, "Укажите время окончания"),
  meetingLink: z.string().url("Неверный URL").optional().or(z.literal("")),
  homework: z.string().optional(),
  notes: z.string().optional(),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface Student {
  id: string;
  name: string | null;
  email: string;
}

interface AddLessonFormProps {
  students: Student[];
}

export function AddLessonForm({ students }: AddLessonFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      userId: "",
      topic: "",
      startTime: "",
      endTime: "",
      meetingLink: "",
      homework: "",
      notes: "",
    },
  });

  const watchedUserId = useWatch({
    control: form.control,
    name: "userId",
  });

  const onSubmit = (data: LessonFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const result = await createLesson(formData);
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
          <CalendarPlus className="w-5 h-5" />
          Добавить новый урок
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

          {/* Тема урока */}
          <div className="space-y-2">
            <Label htmlFor="topic">Тема урока</Label>
            <Input
              id="topic"
              {...form.register("topic")}
              placeholder="Например: Органическая химия"
            />
          </div>

          {/* Время начала и окончания */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Дата и время начала *</Label>
              <Input
                id="startTime"
                type="datetime-local"
                {...form.register("startTime")}
              />
              {form.formState.errors.startTime && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.startTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Дата и время окончания *</Label>
              <Input
                id="endTime"
                type="datetime-local"
                {...form.register("endTime")}
              />
              {form.formState.errors.endTime && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Домашнее задание */}
          <div className="space-y-2">
            <Label htmlFor="homework">Домашнее задание</Label>
            <Textarea
              id="homework"
              {...form.register("homework")}
              placeholder="Описание домашнего задания"
              rows={3}
            />
          </div>

          {/* Заметки */}
          <div className="space-y-2">
            <Label htmlFor="notes">Заметки</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Дополнительная информация для репетитора"
              rows={2}
            />
          </div>

          {/* Кнопка отправки */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Добавление...
              </>
            ) : (
              <>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Добавить урок
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
