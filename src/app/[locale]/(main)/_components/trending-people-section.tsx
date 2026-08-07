"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { getTrendingPeopleAction } from "@/actions/people";
import { sileo } from "sileo";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { PeopleCarousel } from "@/components/people/people-carousel";
import { cn } from "@/lib/utils";
import { type Person } from "@/types/person";
import { type TimeWindow } from "@/types/common";

export default function TrendingPeopleSection({
  initialPeople,
}: {
  initialPeople: Person[];
}) {
  const t = useTranslations("pages.home.trending.people");
  const tErrors = useTranslations("errors");
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("day");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newWindow: TimeWindow) => {
    if (newWindow === timeWindow) return;

    const previousWindow = timeWindow;

    setTimeWindow(newWindow);

    startTransition(async () => {
      const result = await getTrendingPeopleAction(newWindow);

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

      setPeople(result.data.results);
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
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-2">
          <h2 className="text-2xl font-bold">{t("title")}</h2>

          <ButtonGroup>
            <Button
              variant={dayTimeWindow ? "default" : "secondary"}
              onPress={() => handleTabChange("day")}
              className="px-4 py-1.5 text-sm font-medium transition-colors"
              isDisabled={isPending}
            >
              {t("day")}
            </Button>
            <Button
              variant={dayTimeWindow ? "secondary" : "default"}
              onPress={() => handleTabChange("week")}
              className="px-4 py-1.5 text-sm font-medium transition-colors"
              isDisabled={isPending}
            >
              {t("week")}
            </Button>
          </ButtonGroup>
        </div>
        <p>{t("description")}</p>
      </div>

      <PeopleCarousel key={timeWindow} people={people} loop />
    </section>
  );
}
