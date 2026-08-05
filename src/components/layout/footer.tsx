import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CinemaIcon from "@/assets/icons/cinema";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { href: "/", labelKey: "home" as const },
  { href: "/trending", labelKey: "trending_movies" as const },
  { href: "/categories", labelKey: "categories" as const },
  { href: "/popular", labelKey: "popular" as const },
  { href: "/upcoming", labelKey: "upcoming" as const },
] as const;

export async function Footer() {
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-end gap-2 font-semibold text-primary text-xl w-fit"
              aria-label={tCommon("app_name")}
            >
              <CinemaIcon className="w-9" cupClassName="text-primary" />
              <span>{tCommon("app_name")}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {tFooter("tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              {tFooter("links")}
            </h2>
            <nav aria-label={tNav("navigation")}>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map(({ href, labelKey }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {tNav(labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              {tFooter("legal")}
            </h2>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-fit group"
                aria-label={tFooter("powered_by")}
              >
                <img
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                  alt="TMDB"
                  width={80}
                  height={20}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tFooter("disclaimer")}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>{tFooter("copyright", { year })}</p>
          <p>{tFooter("powered_by")}</p>
        </div>
      </div>
    </footer>
  );
}
