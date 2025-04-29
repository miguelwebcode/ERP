import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencySymbol(
  currencyCode: string,
  locale = "en-US"
): string {
  // Formatea el valor 0 con estilo de moneda
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0);

  // Extrae todo lo que no sean dígitos, puntos o comas
  // Esto deja el símbolo (por ejemplo, "€ 0" → "€ ")
  const symbol = formatted.replace(/[\d\s.,]/g, "").trim();
  return symbol;
}
