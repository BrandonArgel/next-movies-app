import { useTranslations } from "next-intl";
import { WatchProvider, WatchLocaleData } from "@/types/watch-providers";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";

export function MovieWatchProviders({
  providers,
}: {
  providers?: WatchLocaleData;
}) {
  if (!providers) return null;

  const t = useTranslations("movie");

  const { flatrate, rent, buy } = providers;

  if (!flatrate?.length && !rent?.length && !buy?.length) return null;

  const renderProviderGroup = (title: string, providers?: WatchProvider[]) => {
    if (!providers || providers.length === 0) return null;

    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <div className="flex flex-wrap gap-3">
          {providers.map((provider) => (
            <div key={provider.provider_id} title={provider.provider_name}>
              <ImageWithSkeleton
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                width={48}
                height={48}
                className="rounded-xl shadow-sm border border-border"
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
          <CardTitle className="text-2xl font-bold">
            {t("where_to_watch")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          {renderProviderGroup(t("stream"), flatrate)}
          {renderProviderGroup(t("rent"), rent)}
          {renderProviderGroup(t("buy"), buy)}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            {t("providers_attribution")} JustWatch.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
