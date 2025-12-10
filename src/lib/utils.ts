import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== "string") return "??";

  const words = name.trim().split(/\s+/);

  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

export function formatCurrencyBRL(
  value: number | string | null | undefined
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (num === null || num === undefined || isNaN(num)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}
