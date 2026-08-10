import { defineRouting } from "next-intl/routing";

const ENGLISH_LOCALES = ["en-US", "en-GB"] as const;
const SPANISH_LOCALES = ["es-MX", "es-ES"] as const;
const CHINESE_LOCALES = ["zh-CN", "zh-TW", "zh-HK", "zh-SG"] as const;
const FRENCH_LOCALES = ["fr-FR", "fr-CA"] as const;
const ARABIC_LOCALES = ["ar-SA", "ar-AE"] as const;
const PORTUGUESE_LOCALES = ["pt-BR", "pt-PT"] as const;
const HINDI_LOCALES = ["hi-IN"] as const;
const BENGALI_LOCALES = ["bn-BD"] as const;
const RUSSIAN_LOCALES = ["ru-RU"] as const;
const ITALIAN_LOCALES = ["it-IT"] as const;
const JAPANESE_LOCALES = ["ja-JP"] as const;

const ALL_LOCALES = [
  ...ENGLISH_LOCALES,
  ...SPANISH_LOCALES,
  ...CHINESE_LOCALES,
  ...FRENCH_LOCALES,
  ...ARABIC_LOCALES,
  ...PORTUGUESE_LOCALES,
  ...HINDI_LOCALES,
  ...BENGALI_LOCALES,
  ...RUSSIAN_LOCALES,
  ...ITALIAN_LOCALES,
  ...JAPANESE_LOCALES,
] as const;

export const LOCALES_SET = new Set(ALL_LOCALES);

export const routing = defineRouting({
  locales: ALL_LOCALES,
  defaultLocale: "en-US",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
