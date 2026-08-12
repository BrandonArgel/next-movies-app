// src/providers/app-provider.tsx
"use client";

import { NextIntlClientProvider, useTranslations } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProvider as AriaI18nProvider } from "react-aria";
import { NetworkNotifier } from "@/components/network-notifier";
import { type AccentColor } from "@/lib/colors";
import { ColorProvider } from "./color-provider";
import { LocaleProvider } from "./locale-provider";
import { ReactAriaProvider } from "./react-aria-provider";
import { ToastProvider } from "./toast-provider";
import { AuthProvider } from "./auth-provider";
import { formats } from "@/i18n/formats";

interface AppProviderProps {
  children: React.ReactNode;
  appColor: AccentColor;
  messages: AbstractIntlMessages;
  locale: string;
  isAuthenticated: boolean;
}

export function AppProvider({
  children,
  appColor,
  messages,
  locale,
  isAuthenticated,
}: AppProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      formats={formats}
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <AriaI18nProvider locale={locale}>
          <LocaleProvider>
            <ColorProvider initialColor={appColor}>
              <AuthProvider isAuthenticated={isAuthenticated}>
                <ReactAriaProvider>
                  <NetworkNotifierWrapper />
                  {children}
                  <ToastProvider />
                </ReactAriaProvider>
              </AuthProvider>
            </ColorProvider>
          </LocaleProvider>
        </AriaI18nProvider>
      </NextThemesProvider>
    </NextIntlClientProvider>
  );
}

function NetworkNotifierWrapper() {
  const t = useTranslations("global.network");

  return (
    <NetworkNotifier
      dictionary={{
        onlineTitle: t("online_title"),
        onlineDescription: t("online_description"),
        offlineTitle: t("offline_title"),
        offlineDescription: t("offline_description"),
      }}
    />
  );
}
