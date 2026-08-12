import { getTranslations } from "next-intl/server";
import CinemaIcon from "@/assets/icons/cinema";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

const NAV_LINKS = [
  { href: "/", labelKey: "home" as const },
  { href: "/movies/popular", labelKey: "popular" as const },
  { href: "/movies/upcoming", labelKey: "upcoming" as const },
  { href: "/movies/top-rated", labelKey: "top_rated" as const },
  { href: "/genres", labelKey: "genres" as const },
] as const;

export async function Footer() {
  const tGlobal = await getTranslations("global.branding");
  const tNav = await getTranslations("components.nav");
  const tFooter = await getTranslations("components.footer");

  const year = new Date().getFullYear();

  return (
    <footer className="border-border border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex w-fit items-end gap-2 font-semibold text-primary text-xl"
              aria-label={tGlobal("app_name")}
            >
              <CinemaIcon className="w-9" cupClassName="text-primary" />
              <span>{tGlobal("app_name")}</span>
            </Link>
            <p className="max-w-xs text-muted-foreground text-sm leading-relaxed">
              {tFooter("tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              {tFooter("links")}
            </h2>
            <nav aria-label={tNav("navigation")}>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map(({ href, labelKey }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-muted-foreground text-sm transition-colors hover:text-primary"
                    >
                      {tNav(labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              {tFooter("legal")}
            </h2>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-fit items-center gap-2"
                aria-label={tFooter("powered_by")}
              >
                <img
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                  alt="TMDB"
                  width={80}
                  height={20}
                  className="opacity-70 transition-opacity group-hover:opacity-100"
                />
              </a>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {tFooter("disclaimer")}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-muted-foreground text-xs sm:flex-row">
          <p>{tFooter("copyright", { year })}</p>
          <p>{tFooter("powered_by")}</p>
        </div>
      </div>
    </footer>
  );
}
