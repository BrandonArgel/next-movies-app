"use client";

import { useLocale, useTranslations } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProvider as AriaI18nProvider } from "react-aria";
import { NetworkNotifier } from "@/components/network-notifier";
import { ColorProvider } from "./color-provider";
import { type AccentColor } from "@/lib/colors";
import { LocaleProvider } from "./locale-provider";
import { ReactAriaProvider } from "./react-aria-provider";
import { ToastProvider } from "./toast-provider";

interface AppProviderProps {
  children: React.ReactNode;
  appColor: AccentColor;
}

export function AppProvider({ children, appColor }: AppProviderProps) {
  const t = useTranslations("global.network");
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
          <ColorProvider initialColor={appColor}>
            <ReactAriaProvider>
              <NetworkNotifier
                dictionary={{
                  onlineTitle: t("online_title"),
                  onlineDescription: t("online_description"),
                  offlineTitle: t("offline_title"),
                  offlineDescription: t("offline_description"),
                }}
              />
              {children}
              <ToastProvider />
            </ReactAriaProvider>
          </ColorProvider>
        </LocaleProvider>
      </AriaI18nProvider>
    </NextThemesProvider>
  );
}
