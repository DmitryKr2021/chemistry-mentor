import { prisma } from "./prisma";

export async function getUserFromDb(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      image: true,
      pwHash: true,
      role: true, // ← Критически важно для проверки прав
    },
  });
}
