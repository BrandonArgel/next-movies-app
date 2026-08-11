"use client";

import { useLocale } from "next-intl";
import { createContext, useContext, useEffect } from "react";
import { type Direction, getDirection } from "@/lib/locale-utils";

interface LocaleContextValue {
  locale: string;
  direction: Direction;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const direction = getDirection(locale);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [locale, direction]);

  return (
    <LocaleContext.Provider value={{ locale, direction }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useAppLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useAppLocale must be used within a LocaleProvider");
  }
  return context;
}
