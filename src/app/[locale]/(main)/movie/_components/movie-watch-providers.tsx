import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { getTMDBImageUrl } from "@/lib/get-tmdb-image-url";
import type { WatchLocaleData, WatchProvider } from "@/types/watch-providers";

export function MovieWatchProviders({
  providers,
}: {
  providers?: WatchLocaleData;
}) {
  const t = useTranslations("domains.movie");

  if (!providers) return null;

  const { flatrate, rent, buy } = providers;

  if (!flatrate?.length && !rent?.length && !buy?.length) return null;

  const renderProviderGroup = (title: string, providers?: WatchProvider[]) => {
    if (!providers || providers.length === 0) return null;

    return (
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-muted-foreground text-sm">{title}</h3>
        <div className="flex flex-wrap gap-3">
          {providers.map((provider) => (
            <div key={provider.provider_id} title={provider.provider_name}>
              <ImageWithSkeleton
                src={getTMDBImageUrl(provider.logo_path, "original") ?? ""}
                alt={provider.provider_name}
                width={48}
                height={48}
                className="rounded-xl border border-border shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">
            {t("where_to_watch")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 px-6 md:grid-cols-3">
          {renderProviderGroup(t("stream"), flatrate)}
          {renderProviderGroup(t("rent"), rent)}
          {renderProviderGroup(t("buy"), buy)}
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            {t("providers_attribution")} JustWatch.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
