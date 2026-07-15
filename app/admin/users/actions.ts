"use server";

import { saltAndHashPassword } from "@/app/utils/password";
import { prisma } from "@/app/utils/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface UserUpdateData {
  email: string;
  name: string;
  role: string;
  pwHash?: string;
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Не удалось удалить пользователя");
  }
  redirect("/admin/users");
}

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  try {
    const pwHash = await saltAndHashPassword(password);
    await prisma.user.create({
      data: {
        name,
        email,
        role,
        pwHash,
      },
    });
    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Не удалось создать пользователя");
  }
  redirect("/admin/users");
}

export async function updateUser(userId: string, formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  console.log("Update data:", {
    userId,
    email,
    name,
    role,
    password: password ? "***" : "",
  });

  try {
    const updateData: UserUpdateData = {
      email,
      name,
      role,
    };

    if (password) {
      const pwHash = await saltAndHashPassword(password);
      updateData.pwHash = pwHash;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Error updating user:", error);
    const message =
      error instanceof Error ? error.message : "Неизвестная ошибка БД";
    throw new Error(`Не удалось обновить пользователя: ${message}`);
  }
  redirect("/admin/users");
}
