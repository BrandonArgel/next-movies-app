// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { type Locale, routing } from "@/i18n/routing";
import { AppProvider } from "@/providers/app-provider";
import { ACCENT_COLORS_VALUES, type AccentColor } from "@/lib/colors";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cookieStore = await cookies();
  const appColor = (cookieStore.get("app-color")?.value ||
    "blue") as AccentColor;
  const rawColorHex = ACCENT_COLORS_VALUES[appColor];

  const t = await getTranslations({ locale, namespace: "global.branding" });
  const appName = t("app_name");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const languagesMap = routing.locales.reduce(
    (acc, locale) => {
      acc[locale] = `/${locale}`;
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    description:
      "A modern, fully internationalized movie app built with Next.js.",
    icons: {
      icon: `/api/favicon?color=${encodeURIComponent(rawColorHex)}`,
    },
    openGraph: {
      title: {
        default: appName,
        template: `%s | ${appName}`,
      },
      description:
        "A modern, fully internationalized movie app built with Next.js.",
      url: baseUrl,
      siteName: appName,
      locale: locale,
      type: "website",
      images: [
        {
          url: `${baseUrl}/og.png`,
          width: 1200,
          height: 630,
          alt: `${appName} Open Graph Image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: {
        default: appName,
        template: `%s | ${appName}`,
      },
      description:
        "A modern, fully internationalized movie app built with Next.js.",
      images: [`${baseUrl}/og.png`],
    },
    alternates: {
      canonical: "./",
      languages: {
        ...languagesMap,
        "x-default": "/en-US",
      },
    },
  };
}

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

  const cookieStore = await cookies();
  const appColor = (cookieStore.get("app-color")?.value ||
    "blue") as AccentColor;

  return (
    <html
      lang={validLocale}
      dir={direction}
      data-color={appColor}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppProvider appColor={appColor}>{children}</AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
