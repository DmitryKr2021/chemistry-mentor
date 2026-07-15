"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "../../actions";
import Link from "next/link";

// Описываем тип пропсов
interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export default function EditUserForm({ user }: { user: User }) {
  // Теперь user гарантированно существует, ошибка не возникнет
  const [selectedRole, setSelectedRole] = useState(user.role);

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Редактировать пользователя
      </h1>

      {/* Передаем ID пользователя в action */}
      <form
        action={updateUser.bind(null, user.id)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm border"
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            required
          />
        </div>

        <div>
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name || ""}
          />
        </div>

        <div>
          <Label htmlFor="password">
            Новый пароль (оставьте пустым, чтобы не менять)
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div>
          <Label htmlFor="role">Роль</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Пользователь</SelectItem>
              <SelectItem value="moderator">Модератор</SelectItem>
              <SelectItem value="admin">Администратор</SelectItem>
            </SelectContent>
          </Select>

          {/* Скрытое поле, которое реально отправляет значение role на сервер */}
          <input type="hidden" name="role" value={selectedRole} />
        </div>

        <div className="flex gap-4">
          <Button type="submit">Сохранить изменения</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/users">Отмена</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
