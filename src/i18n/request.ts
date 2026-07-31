import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Called on every server-side request that renders a page.
 * Resolves the locale from the [locale] segment (set by middleware),
 * falls back to the defaultLocale if the segment is missing or invalid,
 * and loads the corresponding message dictionary.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  // Validate the locale; fall back to default if it's missing or unknown.
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
