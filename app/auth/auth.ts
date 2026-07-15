import NextAuth from "next-auth";
import { ZodError } from "zod";
import bcryptjs from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "../schema/zod";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserFromDb } from "../utils/user";
import { prisma } from "../utils/prisma";
import type { AdapterUser } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<AdapterUser | null> => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email и пароль обязательны");
          }

          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const user = await getUserFromDb(email);

          if (!user || !user.pwHash) {
            throw new Error("Неверный email или пароль");
          }

          const isPasswordValid = await bcryptjs.compare(password, user.pwHash);

          if (!isPasswordValid) {
            throw new Error("Неверный ввод данных");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified,
            image: user.image,
            role: user.role, // ← Пробиваем роль дальше в сессию
          } as AdapterUser; // type assertion для успокоения TS, если нужно
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 🔹 При signIn/signUp: user содержит данные из authorize()
      if (trigger === "signIn" || trigger === "signUp") {
        if (user?.id) {
          token.id = user.id;
        }
        // Безопасно приводим роль только если она есть и валидна
        if (user?.role && ["user", "moderator", "admin"].includes(user.role)) {
          token.role = user.role as "user" | "moderator" | "admin";
        }
      }

      // 🔹 При обновлении сессии (например, смена роли в админке)
      if (trigger === "update" && session?.user?.role) {
        if (["user", "moderator", "admin"].includes(session.user.role)) {
          token.role = session.user.role as "user" | "moderator" | "admin";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        if (token.role) session.user.role = token.role;
      }
      return session;
    },
  },
});
