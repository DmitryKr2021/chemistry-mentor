"use client";

// import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import AppLoader from "@/app/hoc/app-loader";

export default function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <>
      <AppLoader serverSession={session}>
        <div className="flex min-h-screen flex-col max-w-8xl">
          <main className="flex flex-col w-full flex-1 mx-auto justify-start items-center">
            {children}
          </main>
        </div>
      </AppLoader>
    </>
  );
}
