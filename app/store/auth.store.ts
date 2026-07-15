import { create } from "zustand";
import { Session } from "next-auth";

type SessionStatus = "authenticated" | "unauthenticated" | "loading";

interface AuthState {
  isAuth: boolean;
  status: SessionStatus;
  session: Session | null;
  user: { id?: string; email?: string; role?: string } | null;
  setAuthState: (status: SessionStatus, session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  status: "loading",
  session: null,
  user: null,
  setAuthState: (status: SessionStatus, session: Session | null) =>
    set({
      isAuth: status === "authenticated",
      status,
      session,
      // user,
      user: session?.user
        ? {
            id: session.user.id,
            email: session.user.email ?? undefined,
            role: session.user.role ?? "user",
          }
        : null,
    }),
}));
