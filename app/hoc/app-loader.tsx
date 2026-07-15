"use client";

//Версия ИИ
import { useAuthStore } from "../store/auth.store";
import { useEffect } from "react";
import { Session } from "next-auth";

interface IProps {
  children: React.ReactNode;
  serverSession: Session | null; // 🔹 Новый проп
}

const AppLoader = ({ children, serverSession }: IProps) => {
  const { setAuthState } = useAuthStore();

  useEffect(() => {
    // 🔹 Синхронизируем стор с серверной сессией напрямую
    const status = serverSession ? "authenticated" : "unauthenticated";
    setAuthState(status, serverSession);
  }, [serverSession, setAuthState]);

  return <>{children}</>;
};
export default AppLoader;
