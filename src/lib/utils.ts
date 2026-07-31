import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRuntime(minutes: number, locale: string) {
  if (!minutes) return "";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  // Configuramos el formateador para horas y minutos
  const hourFormatter = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "hour",
    unitDisplay: "narrow",
  });

  const minFormatter = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "minute",
    unitDisplay: "narrow",
  });

  if (hours === 0) return minFormatter.format(mins);
  if (mins === 0) return hourFormatter.format(hours);

  return `${hourFormatter.format(hours)} ${minFormatter.format(mins)}`;
}

export function formatReleaseDate(dateString: string, locale: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatter.format(date);
}
