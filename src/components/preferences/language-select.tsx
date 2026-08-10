"use client";

import { GlobeIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";
import { Autocomplete, useFilter } from "react-aria-components";

import {
  Select,
  SelectEmpty,
  SelectGroup,
  SelectInput,
  SelectItem,
  SelectList,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { LOCALE_META } from "./locale-meta";

export function LanguageSelect() {
  const { contains } = useFilter({ sensitivity: "base" });
  const tGlobal = useTranslations("global.states");

  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Transformar LOCALE_META en un array compatible con SelectGroup
  const localesList = useMemo(() => {
    return routing.locales.map((loc) => ({
      code: loc,
      nativeName: LOCALE_META[loc].nativeName,
      flag: LOCALE_META[loc].flag,
    }));
  }, []);

  function switchLocale(next: Locale) {
    if (next === locale) return;

    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString() ? `?${params.toString()}` : "";

    startTransition(() => {
      router.replace(`${pathname}${query}`, { locale: next });
    });
  }

  return (
    <Select
      aria-label="Seleccionar idioma"
      value={locale}
      onChange={(key) => switchLocale(key as Locale)}
      isDisabled={isPending}
      className="w-10 md:w-auto"
    >
      <SelectTrigger className="border-none bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground px-2">
        {/* En móvil mostramos solo el ícono/bandera, en desktop el SelectValue */}
        <GlobeIcon className="size-4 md:hidden" />
        <div className="hidden md:block">
          <SelectValue />
        </div>
      </SelectTrigger>

      <Autocomplete filter={contains}>
        <SelectPopover className="w-64">
          <SelectInput />
          <SelectList
            renderEmptyState={() => (
              <SelectEmpty>{tGlobal("no_results")}</SelectEmpty>
            )}
          >
            <SelectGroup items={localesList}>
              {(item) => (
                <SelectItem id={item.code} textValue={item.nativeName}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span>{item.nativeName}</span>
                  </div>
                </SelectItem>
              )}
            </SelectGroup>
          </SelectList>
        </SelectPopover>
      </Autocomplete>
    </Select>
  );
}
