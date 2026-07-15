"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// 👇 Импортируем стор и селекторы
import {
  useAuthModalStore,
  useAuthModalOpen,
  useAuthModalTab,
  useAuthModalActions,
  AuthTab,
} from "../store/useAuthModalStore";
import { siteConfig } from "../config/site.config";
import { Logo } from "@/app/components/UI/layout/header";
import { registerUser } from "../actions/register";
import { signInWithCredentials } from "../actions/login";
import { ConsentCheckbox } from "@/app/components/ConsentCheckbox";

// Схемы валидации
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен для заполнения")
    .regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Введите корректный email адрес",
    ),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

const registerSchema = z
  .object({
    name: z
      .string({ message: "Имя обязательно" })
      .trim()
      .min(1, "Имя обязательно")
      .min(2, "Имя должно содержать не менее 2 символов")
      .max(50, "Имя не должно превышать 50 символов")
      .regex(
        /^[\p{L}\s'-]+$/u,
        "Имя может содержать только буквы, пробелы, дефисы и апострофы",
      ),

    email: z
      .string()
      .min(1, "Email обязателен для заполнения")
      .regex(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Введите корректный email адрес",
      ),
    password: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
      .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
    confirmPassword: z.string(),

    consent: z.boolean().refine((val) => val === true, {
      message:
        "Необходимо согласие на обработку персональных данных для регистрации",
    }),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен для заполнения")
    .regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Введите корректный email адрес",
    ),
});

const { logoTitle, logoSubTitle } = siteConfig;

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function AuthModal() {
  const isOpen = useAuthModalOpen();
  const activeTab = useAuthModalTab();
  const { close, reset, setTab } = useAuthModalActions();

  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = `${String(date.getDate()).padStart(2, "0")} ${new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(date)} ${date.getFullYear()}`;

  const handleClose = () => {
    setMessage(null);
    loginForm.reset();
    registerForm.reset();
    forgotForm.reset();
    reset(); // Сбрасываем таб на дефолтный в сторе
    close(); // Закрываем модалку
  };

  // Форма входа
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Форма регистрации
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      consent: false,
    },
  });

  // Форма восстановления пароля
  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Обработка входа
  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const { email, password } = data;
      await signInWithCredentials(email, password);
      window.location.reload();
      toast.success("Авторизация успешна!", {
        description: `${formattedDate}`,
      });
    } catch (error) {
      console.error("Ошибка логина:", error);
      toast.error("Ошибка логина", {
        description: `${formattedDate}`,
      });
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  // Обработка регистрации
  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await registerUser(data);
      if (!result.success) {
        console.error(result.error);
        handleClose();
        throw new Error(result.error);
      }
      console.log("registration form result==", result);
      // Если успех — закрываем модальное окно
      handleClose();
      // Здесь можно добавить toast уведомление об успехе
      toast.success("Регистрация успешна!", {
        description: `${formattedDate}`,
      });
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      // Здесь можно добавить toast уведомление об ошибке
      toast.error("Ошибка регистрации", {
        description: `${formattedDate}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка восстановления пароля
  const onForgotSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Новый пароль отправлен на ваш email",
        });
        forgotForm.reset();
      } else {
        setMessage({ type: "error", text: result.error || "Email не найден" });
      }
    } catch (error) {
      console.error("Auth request failed:", error);
      setMessage({ type: "error", text: "Ошибка соединения с сервером" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
            <Logo />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{logoTitle}</h1>
            <p className="text-[12px] text-slate-300">{logoSubTitle}</p>
          </div>
        </div>

        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {activeTab === "login" && "Вход"}
              {activeTab === "register" && "Регистрация"}
              {activeTab === "forgot" && "Восстановление пароля"}
            </DialogTitle>

            <DialogDescription className="sr-only">
              {activeTab === "login" &&
                "Форма входа в личный кабинет репетитора по химии"}
              {activeTab === "register" && "Форма регистрации нового ученика"}
              {activeTab === "forgot" && "Форма восстановления забытого пароля"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Сообщения об успехе/ошибке */}
        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Табы только для входа/регистрации */}
        {activeTab !== "forgot" && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => setTab(value as AuthTab)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-sm">
              <TabsTrigger value="login" className="cursor-pointer">
                Вход
              </TabsTrigger>
              <TabsTrigger value="register" className="cursor-pointer">
                Регистрация
              </TabsTrigger>
            </TabsList>

            {/* Форма входа */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  {/* Email */}
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="bg-slate-50 px-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Password */}
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="bg-slate-50 px-4"
                              disabled={isLoading}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Скрыть пароль"
                                  : "Показать пароль"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm text-slate-600 cursor-pointer"
                    onClick={() => setTab("forgot")}
                  >
                    Забыли пароль?
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[var(--button-yellow)] hover:bg-green-300 shadow-lg hover:shadow-green-400/50 text-slate-900 font-bold cursor-pointer rounded-sm"
                  >
                    {isLoading ? "Вход..." : "Войти"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Форма регистрации */}
            <TabsContent value="register">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="space-y-4"
                >
                  {/* Имя */}
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ваше имя</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ваше имя"
                            className="bg-slate-50 rounded-sm px-4 mt-1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="bg-slate-50 px-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Пароль */}
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="bg-slate-50 px-4"
                              disabled={isLoading}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Скрыть пароль"
                                  : "Показать пароль"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Подтверждение пароля */}
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подтвердите пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="bg-slate-50 px-4"
                              disabled={isLoading}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Скрыть пароль"
                                  : "Показать пароль"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Чекбокс согласия на обработку персональных данных */}
                  <FormField
                    control={registerForm.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ConsentCheckbox
                            checked={field.value}
                            onChange={field.onChange}
                            error={
                              registerForm.formState.errors.consent?.message
                            }
                            consentType="registration"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading || !registerForm.watch("consent")}
                    className="w-full bg-[var(--button-yellow)] hover:bg-green-300 shadow-lg hover:shadow-green-400/50 text-slate-900 font-bold cursor-pointer rounded-sm"
                  >
                    {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        )}

        {/* Форма восстановления пароля */}
        {activeTab === "forgot" && (
          <Form {...forgotForm}>
            <form
              onSubmit={forgotForm.handleSubmit(onForgotSubmit)}
              className="space-y-4"
            >
              <div className="text-sm text-slate-600 mb-4">
                Введите ваш email, и мы отправим новый пароль
              </div>

              <FormField
                control={forgotForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="bg-slate-50 px-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => useAuthModalStore.getState().setTab("login")}
                  className="flex-1 cursor-pointer rounded-sm"
                >
                  Назад
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[var(--button-yellow)] hover:bg-green-300 shadow-lg hover:shadow-green-400/50 text-slate-900 font-bold cursor-pointer rounded-sm"
                >
                  {isLoading ? "Отправка..." : "Отправить"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
