import type { useFormatter } from "next-intl";

type Formatter = ReturnType<typeof useFormatter>;

export function formatRuntime(minutes: number, format: Formatter): string {
  if (!minutes) return "";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const formattedHours = format.number(hours, {
    style: "unit",
    unit: "hour",
    unitDisplay: "narrow",
  });
  const formattedMins = format.number(mins, {
    style: "unit",
    unit: "minute",
    unitDisplay: "narrow",
  });

  if (hours === 0) return formattedMins;
  if (mins === 0) return formattedHours;

  return `${formattedHours} ${formattedMins}`;
}
