"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { sileo } from "sileo";
import { getTrendingTVShowsAction } from "@/actions/tv-shows";
import { TvShowCarousel } from "@/components/tv-show/tv-show-carousel";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import type { TimeWindow } from "@/types/common";
import type { TvShow } from "@/types/tv-show";

export default function TrendingTVShowsSection({
  initialTVShows,
}: {
  initialTVShows: TvShow[];
}) {
  const t = useTranslations("pages.home.trending.tv_shows");
  const tErrors = useTranslations("errors");

  const [tvShows, setTvShows] = useState<TvShow[]>(initialTVShows);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("day");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newWindow: TimeWindow) => {
    if (newWindow === timeWindow) return;

    const previousWindow = timeWindow;
    setTimeWindow(newWindow);

    startTransition(async () => {
      const result = await getTrendingTVShowsAction(newWindow);

      if (!result.success) {
        setTimeWindow(previousWindow);
        sileo.error({
          title: tErrors("title"),
          description: tErrors(result.error),
          button: {
            title: tErrors("retry"),
            onClick: () => handleTabChange(newWindow),
          },
        });
        return;
      }

      setTvShows(result.data.results);
    });
  };

  const dayTimeWindow = timeWindow === "day";

  return (
    <section
      className={cn(
        "transition-opacity duration-300",
        isPending && "opacity-50",
      )}
    >
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-4 md:gap-6">
          <h2 className="font-bold text-xl md:text-2xl">{t("title")}</h2>

          <ButtonGroup>
            <Button
              variant={dayTimeWindow ? "default" : "secondary"}
              onPress={() => handleTabChange("day")}
              className="px-4 py-1.5 font-medium text-sm transition-colors"
              isDisabled={isPending}
            >
              {t("day")}
            </Button>
            <Button
              variant={dayTimeWindow ? "secondary" : "default"}
              onPress={() => handleTabChange("week")}
              className="px-4 py-1.5 font-medium text-sm transition-colors"
              isDisabled={isPending}
            >
              {t("week")}
            </Button>
          </ButtonGroup>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          {t("description")}
        </p>
      </div>

      <TvShowCarousel key={timeWindow} tvShows={tvShows} loop />
    </section>
  );
}
