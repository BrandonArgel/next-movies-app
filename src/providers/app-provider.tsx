"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useLocale } from "next-intl";
import { I18nProvider as AriaI18nProvider } from "react-aria";
import { ColorProvider } from "./color-provider";
import { ReactAriaProvider } from "./react-aria-provider";
import { ToastProvider } from "./toast-provider";
import { LocaleProvider } from "./locale-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <AriaI18nProvider locale={locale}>
        <LocaleProvider>
          <ColorProvider>
            <ReactAriaProvider>
              {children}
              <ToastProvider />
            </ReactAriaProvider>
          </ColorProvider>
        </LocaleProvider>
      </AriaI18nProvider>
    </NextThemesProvider>
  );
}
