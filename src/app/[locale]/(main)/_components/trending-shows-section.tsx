"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { getTrendingShowsAction } from "@/actions/movies";
import { sileo } from "sileo";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ShowCarousel } from "@/components/movies/show-carousel";
import { cn } from "@/lib/utils";
import { type Show } from "@/types/show";
import { type TimeWindow } from "@/types/common";

export default function TrendingShowsSection({
  initialShows,
}: {
  initialShows: Show[];
}) {
  const t = useTranslations("home.trending.shows");
  const tErrors = useTranslations("errors");
  const [shows, setShows] = useState<Show[]>(initialShows);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("day");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newWindow: "day" | "week") => {
    if (newWindow === timeWindow) return;

    const previousWindow = timeWindow;

    setTimeWindow(newWindow);

    startTransition(async () => {
      const result = await getTrendingShowsAction(newWindow);

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

      setShows(result.data.results);
    });
  };

  const dayTimeWindow = timeWindow === "day";

  return (
    <section className="container mx-auto mt-12 flex flex-col gap-4 px-4 md:px-8">
      <div
        className={cn(
          "container mx-auto px-4 md:px-8 mt-12",
          "transition-opacity duration-300",
          isPending && "opacity-50",
        )}
      >
        <div className="mb-6">
          <div className="flex items-center gap-6 mb-2">
            <h2 className="text-2xl font-bold">{t("title")}</h2>

            <ButtonGroup>
              <Button
                variant={dayTimeWindow ? "default" : "secondary"}
                onClick={() => handleTabChange("day")}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium transition-colors",
                )}
                isDisabled={isPending}
              >
                {t("day")}
              </Button>
              <Button
                variant={dayTimeWindow ? "secondary" : "default"}
                onClick={() => handleTabChange("week")}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium transition-colors",
                )}
                isDisabled={isPending}
              >
                {t("week")}
              </Button>
            </ButtonGroup>
          </div>
          <p>{t("description")}</p>
        </div>

        <ShowCarousel shows={shows} />
      </div>
    </section>
  );
}
