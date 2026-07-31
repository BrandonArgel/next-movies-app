import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation helpers created from the routing config.
 * Import these instead of the plain next/navigation equivalents
 * so that locale prefixes are automatically included.
 *
 * Usage (client):
 *   import { Link, usePathname, useRouter } from "@/i18n/navigation";
 *
 * Usage (server):
 *   import { redirect } from "@/i18n/navigation";
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
