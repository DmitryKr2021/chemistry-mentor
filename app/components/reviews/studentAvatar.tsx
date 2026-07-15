"use client"; // Только если используете интерактив. Для SSR/статичных отзывов можно убрать.

import { type AvatarGender, getAvatarByLastLetter } from "@/app/utils/avatar";
import Image from "next/image";

type StudentAvatarProps = {
  name: string;
  size?: number;
  className?: string;
};

export function StudentAvatar({
  name,
  size = 60,
  className = "",
}: StudentAvatarProps) {
  const gender: AvatarGender = getAvatarByLastLetter(name);
  const src = `/images/avatars/${gender}.png`;

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-gray-100 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={`Аватар ученика ${name}`}
        fill
        sizes={`${size * 3}px`}
        className="object-cover w-20 h-20"
      />
    </div>
  );
}
