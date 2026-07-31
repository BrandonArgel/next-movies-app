export type Direction = "ltr" | "rtl";

export function getDirection(locale: string): Direction {
  const rtlLocales = ["ar", "he", "fa", "ur"];
  const prefix = locale.split("-")[0];

  return rtlLocales.includes(prefix) ? "rtl" : "ltr";
}
