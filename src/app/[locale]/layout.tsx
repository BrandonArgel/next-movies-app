import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { AppProvider } from "@/providers/app-provider";
import { routing, type Locale } from "@/i18n/routing";
import "../globals.css";
import { getDirection } from "@/lib/locale-utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "Next Movies",
    template: "%s | Next Movies",
  },
  description:
    "A modern, fully internationalized movie app built with Next.js.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const validLocale = locale as Locale;
  setRequestLocale(validLocale);
  const direction = getDirection(validLocale);
  const messages = await getMessages();

  return (
    <html
      lang={validLocale}
      dir={direction}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=localStorage.getItem("app-color");if(c)document.documentElement.setAttribute("data-color",c)}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppProvider>{children}</AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
