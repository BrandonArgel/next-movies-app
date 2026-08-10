import { Locale } from "next-intl";

export const LOCALE_META: Record<Locale, { flag: string; nativeName: string }> =
  {
    "en-US": { flag: "🇺🇸", nativeName: "English (United States)" },
    "en-GB": { flag: "🇬🇧", nativeName: "English (United Kingdom)" },
    "es-MX": { flag: "🇲🇽", nativeName: "Español (México)" },
    "es-ES": { flag: "🇪🇸", nativeName: "Español (España)" },
    "zh-CN": { flag: "🇨🇳", nativeName: "简体中文 (中国)" },
    "zh-TW": { flag: "🇹🇼", nativeName: "繁體中文 (台灣)" },
    "zh-HK": { flag: "🇭🇰", nativeName: "繁體中文 (香港)" },
    "zh-SG": { flag: "🇸🇬", nativeName: "简体中文 (新加坡)" },
    "fr-FR": { flag: "🇫🇷", nativeName: "Français (France)" },
    "fr-CA": { flag: "🇨🇦", nativeName: "Français (Canada)" },
    "ar-SA": { flag: "🇸🇦", nativeName: "العربية (السعودية)" },
    "ar-AE": { flag: "🇦🇪", nativeName: "العربية (الإمارات)" },
    "pt-BR": { flag: "🇧🇷", nativeName: "Português (Brasil)" },
    "pt-PT": { flag: "🇵🇹", nativeName: "Português (Portugal)" },
    "hi-IN": { flag: "🇮🇳", nativeName: "हिन्दी" },
    "bn-BD": { flag: "🇧🇩", nativeName: "বাংলা" },
    "ru-RU": { flag: "🇷🇺", nativeName: "Русский" },
    "it-IT": { flag: "🇮🇹", nativeName: "Italiano" },
    "ja-JP": { flag: "🇯🇵", nativeName: "日本語" },
  };
