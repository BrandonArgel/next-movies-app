"use client";

import { Bookmark, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { sileo } from "sileo";
import {
  rateMediaAction,
  toggleFavoriteAction,
  toggleWatchListAction,
  unrateMediaAction,
} from "@/actions/media";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppLocale } from "@/providers/locale-provider";
import type { MediaType } from "@/types/media";

interface MediaUserActionsProps {
  mediaId: number;
  mediaTitle: string;
  mediaType: MediaType;
  initialFavorite: boolean;
  initialWatchLater: boolean;
  initialRating: number | undefined;
}

export function MediaUserActions({
  mediaId,
  mediaTitle,
  mediaType,
  initialFavorite,
  initialWatchLater,
  initialRating,
}: MediaUserActionsProps) {
  const { direction } = useAppLocale();
  const t = useTranslations("components.media_actions");
  const tActions = useTranslations("global.actions");

  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isWatchLater, setIsWatchLater] = useState(initialWatchLater);
  const [rating, setRating] = useState(initialRating);

  const [isFavoritePending, startFavoriteTransition] = useTransition();
  const [isWatchLaterPending, startWatchListTransition] = useTransition();
  const [isRatingPending, startRatingTransition] = useTransition();

  const handleFavoriteClick = () => {
    const nextState = !isFavorite;
    setIsFavorite(nextState);

    startFavoriteTransition(async () => {
      const result = await toggleFavoriteAction(mediaId, nextState, mediaType);

      if (result.success) {
        sileo.success({
          title: t("success_title"),
          description: nextState
            ? t("favorite_added", { title: mediaTitle })
            : t("favorite_removed", { title: mediaTitle }),
        });
      } else {
        setIsFavorite(!nextState);
        sileo.error({
          title: t("error_title"),
          description: t("action_error", { title: mediaTitle }),
        });
      }
    });
  };

  const handleWatchLaterClick = () => {
    const nextState = !isWatchLater;
    setIsWatchLater(nextState);

    startWatchListTransition(async () => {
      const result = await toggleWatchListAction(mediaId, nextState, mediaType);

      if (result.success) {
        sileo.success({
          title: t("success_title"),
          description: nextState
            ? t("watch_later_added", { title: mediaTitle })
            : t("watch_later_removed", { title: mediaTitle }),
        });
      } else {
        setIsWatchLater(!nextState);
        sileo.error({
          title: t("error_title"),
          description: t("action_error", { title: mediaTitle }),
        });
      }
    });
  };

  const handleRatingClick = (value: number) => {
    const prevState = rating;
    const newState = value * 2;
    if (rating === newState) return;
    setRating(newState);

    startRatingTransition(async () => {
      const result = await rateMediaAction(mediaId, newState, mediaType);

      if (result.success) {
        sileo.success({
          title: t("success_title"),
          description: t("rating_success", { title: mediaTitle }),
        });

        setIsWatchLater(false);
      } else {
        setRating(prevState);
        sileo.error({
          title: t("error_title"),
          description: t("action_error", { title: mediaTitle }),
        });
      }
    });
  };

  const handleUnratingClick = () => {
    const prevState = rating;
    setRating(undefined);

    startRatingTransition(async () => {
      const result = await unrateMediaAction(mediaId, mediaType);

      if (result.success) {
        sileo.success({
          title: t("success_title"),
          description: t("unrate_success", { title: mediaTitle }),
        });
      } else {
        setRating(prevState);
        sileo.error({ title: t("action_error") });
      }
    });
  };

  const ratingTooltips = [
    t("rating_labels.terrible"),
    t("rating_labels.bad"),
    t("rating_labels.average"),
    t("rating_labels.great"),
    t("rating_labels.perfect"),
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <TooltipTrigger delay={0}>
        <Button
          onPress={handleFavoriteClick}
          isDisabled={isFavoritePending}
          className={`rounded-full p-2 transition-colors ${
            isFavorite
              ? "bg-red-600 text-white hover:bg-red-800"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
          aria-label={tActions(isFavorite ? "remove_favorite" : "add_favorite")}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        <Tooltip offset={8}>
          {tActions(isFavorite ? "remove_favorite" : "add_favorite")}
        </Tooltip>
      </TooltipTrigger>

      <TooltipTrigger delay={0}>
        <Button
          onPress={handleWatchLaterClick}
          isDisabled={isWatchLaterPending}
          className={`rounded-full p-2 transition-colors ${
            isWatchLater
              ? "bg-primary text-primary-foreground"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
          aria-label={tActions(
            isWatchLater ? "remove_watch_later" : "add_watch_later",
          )}
        >
          <Bookmark
            className={`h-5 w-5 ${isWatchLater ? "fill-current" : ""}`}
          />
        </Button>
        <Tooltip offset={8}>
          {tActions(isWatchLater ? "remove_watch_later" : "add_watch_later")}
        </Tooltip>
      </TooltipTrigger>

      <Rating
        onClick={handleRatingClick}
        initialValue={rating ? rating / 2 : 0}
        allowFraction
        transition
        direction={direction}
        showTooltip
        tooltipDefaultText={tActions("rate")}
        tooltipArray={ratingTooltips}
        readonly={isRatingPending}
      />

      {rating !== undefined && rating > 0 && (
        <Button
          variant="destructive"
          onPress={handleUnratingClick}
          isDisabled={isRatingPending}
          className="bg-destructive text-white hover:bg-destructive/80 dark:bg-destructive dark:hover:bg-destructive/80"
        >
          {tActions("unrate")}
        </Button>
      )}
    </div>
  );
}
