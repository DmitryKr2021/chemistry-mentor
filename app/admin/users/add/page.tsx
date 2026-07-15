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
import { createUser } from "../actions";
import Link from "next/link";

export default function AddUserPage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Добавить пользователя
      </h1>

      <form
        action={createUser}
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm border"
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div>
          <Label htmlFor="name">Имя</Label>
          <Input id="name" name="name" type="text" />
        </div>

        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <div>
          <Label htmlFor="role">Роль</Label>
          <Select name="role" defaultValue="user">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Пользователь</SelectItem>
              <SelectItem value="moderator">Модератор</SelectItem>
              <SelectItem value="admin">Администратор</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-[var(--button-yellow)] text-slate-900 px-2 py-3 rounded-sm font-bold hover:bg-green-300 transition shadow-lg hover:shadow-green-400/50 hover:cursor-pointer mx-auto min-[600px]:mx-0"
          >
            Создать пользователя
          </Button>
          <Button
            type="button"
            variant="outline"
            asChild
            className="rounded-sm"
          >
            <Link href="/admin/users">Отмена</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
