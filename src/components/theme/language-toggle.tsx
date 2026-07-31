"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GlobeIcon, CheckIcon, SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

import {
  DialogTrigger,
  Popover,
  Dialog,
  SearchField,
  Input,
  ListBox,
  ListBoxItem,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export const LOCALE_META: Record<Locale, { flag: string; nativeName: string }> =
  {
    "en-US": { flag: "🇺🇸", nativeName: "English (United States)" },
    "en-GB": { flag: "🇬🇧", nativeName: "English (United Kingdom)" },
    "en-CA": { flag: "🇨🇦", nativeName: "English (Canada)" },
    "en-AU": { flag: "🇦🇺", nativeName: "English (Australia)" },
    "en-IE": { flag: "🇮🇪", nativeName: "English (Ireland)" },
    "en-NZ": { flag: "🇳🇿", nativeName: "English (New Zealand)" },
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

export function LanguageToggle() {
  const t = useTranslations("language");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLocales = useMemo(() => {
    // Esparcimos la tupla en un nuevo arreglo para romper la referencia readonly
    let locales: Locale[] = [...routing.locales];

    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      locales = locales.filter((loc) => {
        const { nativeName } = LOCALE_META[loc];
        return (
          nativeName.toLowerCase().includes(search) ||
          loc.toLowerCase().includes(search)
        );
      });
    }

    const activeLocale = locales.filter((loc) => loc === locale);
    const otherLocales = locales.filter((loc) => loc !== locale);

    return [...activeLocale, ...otherLocales];
  }, [searchQuery, locale]);

  function switchLocale(next: Locale) {
    if (next === locale) {
      setIsOpen(false);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString() ? `?${params.toString()}` : "";

    startTransition(() => {
      router.replace(`${pathname}${query}`, { locale: next });
      setIsOpen(false);
      setSearchQuery("");
    });
  }

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="icon"
        aria-label={t("toggleLanguage")}
        isDisabled={isPending}
      >
        {isPending ? (
          <Spinner />
        ) : (
          <GlobeIcon
            className={`size-4 transition-opacity ${!mounted ? "opacity-50" : "opacity-100"}`}
          />
        )}
      </Button>

      <Popover
        placement="bottom end"
        className="w-70 rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-entering:animate-in data-exiting:animate-out data-entering:fade-in-0 data-exiting:fade-out-0 data-entering:zoom-in-95 data-exiting:zoom-out-95"
      >
        <Dialog
          className="p-0 outline-none flex flex-col"
          aria-label={t("languageSelector")}
        >
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            autoFocus
            className="flex items-center border-b px-3"
            aria-label={t("searchLanguage")}
          >
            <SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
            <Input
              placeholder={`${t("searchLanguage")}...`}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </SearchField>

          <ListBox
            aria-label={t("label")}
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([locale])}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as Locale;
              if (selectedKey) {
                switchLocale(selectedKey);
              }
            }}
            renderEmptyState={() => (
              <div className="text-center text-sm text-muted-foreground">
                {tCommon("noResultsFound")}
              </div>
            )}
            className="max-h-75 overflow-y-auto p-1 outline-none"
          >
            {filteredLocales.map((loc) => {
              const { flag, nativeName } = LOCALE_META[loc];
              const isSelected = locale === loc;

              return (
                <ListBoxItem
                  key={loc}
                  id={loc}
                  textValue={nativeName}
                  className="flex items-center gap-3 cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none data-focused:bg-accent data-focused:text-accent-foreground data-selected:font-medium"
                >
                  <span aria-hidden="true" className="text-xl shrink-0">
                    {flag}
                  </span>
                  <span className="truncate flex-1">{nativeName}</span>
                  {isSelected && (
                    <CheckIcon className="size-4 ml-auto shrink-0" />
                  )}
                </ListBoxItem>
              );
            })}
          </ListBox>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
