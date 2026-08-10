import { Building2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import type { ProductionCompany } from "@/types/common";

interface TvProductionCompaniesProps {
  companies: ProductionCompany[];
}

export async function TvProductionCompanies({
  companies,
}: TvProductionCompaniesProps) {
  if (!companies || companies.length === 0) return null;

  const t = await getTranslations("domains.tv");

  return (
    <section
      aria-labelledby="production-companies-heading"
      className="flex flex-col gap-6"
    >
      <h2
        id="production-companies-heading"
        className="font-bold text-xl md:text-2xl"
      >
        {t("production_companies")}
      </h2>

      <div className="flex flex-wrap items-center gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="group flex flex-col items-center gap-2"
            title={company.name}
          >
            <div className="relative flex h-14 w-28 items-center justify-center overflow-hidden rounded-xl border border-border transition-colors">
              {company.logo_path ? (
                <div className="relative h-full w-full p-1">
                  <ImageWithSkeleton
                    src={`https://image.tmdb.org/t/p/w185${company.logo_path}`}
                    alt={company.name}
                    fill
                    className="object-contain dark:invert"
                    sizes="112px"
                  />
                </div>
              ) : (
                <Building2 className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <p className="line-clamp-2 max-w-28 text-center text-muted-foreground text-xs leading-tight">
              {company.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
