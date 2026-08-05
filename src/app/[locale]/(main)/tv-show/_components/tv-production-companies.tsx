import { getTranslations } from "next-intl/server";
import { type ProductionCompany } from "@/types/common";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Building2 } from "lucide-react";

interface TvProductionCompaniesProps {
  companies: ProductionCompany[];
}

export async function TvProductionCompanies({
  companies,
}: TvProductionCompaniesProps) {
  if (!companies || companies.length === 0) return null;

  const t = await getTranslations("tv");

  return (
    <section
      aria-labelledby="production-companies-heading"
      className="flex flex-col gap-6"
    >
      <h2
        id="production-companies-heading"
        className="text-xl md:text-2xl font-bold"
      >
        {t("production_companies")}
      </h2>

      <div className="flex flex-wrap items-center gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex flex-col items-center gap-2 group"
            title={company.name}
          >
            <div className="relative h-14 w-28 flex items-center justify-center rounded-xl border border-border transition-colors overflow-hidden">
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
                <Building2 className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-28 line-clamp-2 leading-tight">
              {company.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
