"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Save,
  Loader2,
  LogOut,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateProfile, changePassword } from "./actions";
import { handleSignOut } from "@/app/actions/handleSignOut";

const profileSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль"),
    newPassword: z
      .string()
      .min(6, "Новый пароль должен содержать минимум 6 символов"),
    confirmPassword: z.string().min(6, "Подтвердите новый пароль"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface UserProps {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

export default function ProfileClient({ user }: { user: UserProps }) {
  const [isPendingProfile, startTransitionProfile] = useTransition();
  const [isPendingPassword, startTransitionPassword] = useTransition();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name || "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    startTransitionProfile(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      const result = await updateProfile(user.id, formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    startTransitionPassword(async () => {
      const result = await changePassword(
        user.id,
        data.currentPassword,
        data.newPassword,
      );
      if (result.success) {
        toast.success(result.message);
        passwordForm.reset();
      } else {
        toast.error(result.message);
      }
    });
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.charAt(0).toUpperCase();
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="max-[400px]:w-min max-[500px]:w-2xs max-[700px]:w-sm max-[1000px]:w-xl w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Мой профиль</h1>
        <p className="text-slate-500 mt-1">
          Управляйте своими личными данными и настройками безопасности.
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full space-y-6">
        <TabsList className="bg-slate-50/50  p-3 flex flex-col w-full h-auto gap-3 min-[500px]:bg-slate-100 min-[500px]:flex-row min-[500px]:w-auto min-[500px]:h-10 min-[500px]:p-1 min-[500px]:gap-0 min-[500px]:border-0">
          <TabsTrigger
            value="personal"
            className="gap-2 w-full justify-center h-12 border border-slate-200 rounded-lg bg-white shadow-sm transition-all data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 min-[500px]:w-auto min-[500px]:justify-start min-[500px]:h-9 min-[500px]:border-0 min-[500px]:rounded-md min-[500px]:shadow-none min-[500px]:bg-transparent"
          >
            <User className="w-4 h-4 flex-shrink-0" />
            Личные данные
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="gap-2 w-full justify-center h-12 border border-slate-200 rounded-lg bg-white shadow-sm transition-all data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 min-[500px]:w-auto min-[500px]:justify-start min-[500px]:h-9 min-[500px]:border-0 min-[500px]:rounded-md min-[500px]:shadow-none min-[500px]:bg-transparent"
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            Безопасность
          </TabsTrigger>
        </TabsList>

        {/* 👇 3. mt-0 убирает стандартный отступ shadcn, w-full растягивает контент вкладки */}
        <TabsContent value="personal" className="mt-0 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Личная информация</CardTitle>
              <CardDescription>
                Обновите свое имя и другие личные данные.
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="w-full"
            >
              <CardContent className="space-y-6 w-full">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-emerald-100">
                    <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700 font-bold">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {user.name || "Пользователь"}
                    </h3>
                    <p className="text-sm text-slate-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid w-full gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      {...profileForm.register("name")}
                      placeholder="Введите ваше имя"
                      className="w-full"
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative w-full">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="w-full pl-9 bg-slate-50 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Email используется для входа и не может быть изменен
                      здесь.
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Дата регистрации
                    </Label>
                    <p className="text-sm text-slate-700 font-medium">
                      {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50/50 px-6 py-4">
                <Button
                  type="submit"
                  disabled={isPendingProfile || !profileForm.formState.isDirty}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isPendingProfile ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Сохранить изменения
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-0 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Смена пароля</CardTitle>
              <CardDescription>
                Убедитесь, что ваш аккаунт защищен надежным паролем.
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="w-full"
            >
              <CardContent className="space-y-4 w-full">
                <div className="space-y-2 w-full">
                  <Label htmlFor="currentPassword">Текущий пароль</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    className="w-full"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2 w-full">
                  <Label htmlFor="newPassword">Новый пароль</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                    className="w-full"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="confirmPassword">
                    Подтвердите новый пароль
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    className="w-full"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50/50 px-4 sm:px-6 py-4 flex flex-col gap-3 min-[700px]:flex-row min-[700px]:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full justify-center min-[700px]:w-auto min-[700px]:justify-start"
                  onClick={async () => {
                    await handleSignOut();
                    window.location.href = "/login";
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                  Выйти из аккаунта
                </Button>

                <Button
                  type="submit"
                  disabled={isPendingPassword}
                  className="bg-emerald-600 hover:bg-emerald-700 w-full justify-center min-[700px]:w-auto min-[700px]:justify-start rounded-sm"
                >
                  {isPendingPassword ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
                  ) : (
                    <Shield className="mr-2 h-4 w-4 flex-shrink-0" />
                  )}
                  Обновить пароль
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
