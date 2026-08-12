"use client";

import { Bookmark, Heart, MoreVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Dialog } from "react-aria-components";
import { sileo } from "sileo";
import {
  getMediaAccountStateAction,
  rateMediaAction,
  toggleFavoriteAction,
  toggleWatchListAction,
  unrateMediaAction,
} from "@/actions/media";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppLocale } from "@/providers/locale-provider";
import type { MediaType } from "@/types/media";

interface MediaActionsDropdownProps {
  mediaId: number;
  mediaTitle: string;
  mediaType: MediaType;
  isTouchActive?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

export function MediaActionsDropdown({
  mediaId,
  mediaTitle,
  mediaType,
  isTouchActive = false,
  onOpenChange,
  className,
}: MediaActionsDropdownProps) {
  const { direction } = useAppLocale();
  const t = useTranslations("components.media_actions");
  const tActions = useTranslations("global.actions");

  const [isOpen, setIsOpen] = useState(false);
  const [hasFetchedState, setHasFetchedState] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [rating, setRating] = useState<number | undefined>(undefined);

  const [isFavoritePending, startFavoriteTransition] = useTransition();
  const [isWatchLaterPending, startWatchListTransition] = useTransition();
  const [isRatingPending, startRatingTransition] = useTransition();

  const fetchState = async () => {
    setIsLoadingState(true);
    const result = await getMediaAccountStateAction(mediaId, mediaType);

    if (result.success && result.data) {
      setIsFavorite(result.data.favorite);
      setIsWatchLater(result.data.watchlist);
      setRating(
        typeof result.data.rated === "object" && result.data.rated !== null
          ? result.data.rated.value / 2
          : undefined,
      );
    }

    setHasFetchedState(true);
    setIsLoadingState(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);

    if (open && !hasFetchedState) {
      fetchState();
    }
  };

  const handleFavoritePress = () => {
    const previousState = isFavorite;
    const nextState = !isFavorite;
    setIsFavorite(nextState); // Actualización optimista

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
        setIsFavorite(previousState); // Reversión en caso de error
        sileo.error({
          title: t("error_title"),
          description: t("action_error", { title: mediaTitle }),
        });
      }
    });
  };

  const handleWatchLaterPress = () => {
    const previousState = isWatchLater;
    const nextState = !isWatchLater;
    setIsWatchLater(nextState); // Actualización optimista

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
        setIsWatchLater(previousState); // Reversión en caso de error
        sileo.error({
          title: t("error_title"),
          description: t("action_error", { title: mediaTitle }),
        });
      }
    });
  };

  const handleRatingClick = (value: number) => {
    const previousState = rating;
    const newState = value * 2;
    if (rating === newState) return;
    setRating(newState); // Actualización optimista

    startRatingTransition(async () => {
      const result = await rateMediaAction(mediaId, newState, mediaType);

      if (result.success) {
        sileo.success({
          title: t("success_title"),
          description: t("rating_success", { title: mediaTitle }),
        });
      } else {
        setRating(previousState); // Reversión en caso de error
        sileo.error({
          title: t("error_title"),
          description: t("action_error", { title: mediaTitle }),
        });
      }
    });
  };

  const handleUnratingPress = () => {
    const previousState = rating;
    setRating(undefined); // Actualización optimista

    startRatingTransition(async () => {
      const result = await unrateMediaAction(mediaId, mediaType);

      if (result.success) {
        sileo.success({
          title: t("success_title"),
          description: t("unrate_success", { title: mediaTitle }),
        });
      } else {
        setRating(previousState); // Reversión en caso de error
        sileo.error({
          title: t("error_title"),
          description: t("action_error", { title: mediaTitle }),
        });
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
    <div
      className={cn(
        "absolute inset-e-2 top-2 z-50 transition-opacity duration-300",
        "pointer-events-none opacity-0",
        "group-hover:pointer-events-auto group-hover:opacity-100",
        "group-focus-within:pointer-events-auto group-focus-within:opacity-100",
        isTouchActive && "pointer-events-auto opacity-100",
        className,
      )}
    >
      <PopoverTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
        <Button
          variant="ghost"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white outline-none backdrop-blur-md transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={tActions("options_aria_label", { name: mediaTitle })}
        >
          <MoreVerticalIcon className="size-4" />
        </Button>

        <Popover
          placement="bottom end"
          className="z-100 w-56 p-1 backdrop-blur-md"
        >
          <Dialog className="flex flex-col outline-none">
            {isLoadingState ? (
              <div className="flex flex-col outline-none">
                {/* Favorite */}
                <div className="flex w-full items-center gap-2.5 px-2.5 py-2">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="h-4 w-32 rounded-sm" />
                </div>

                {/* Watch Later */}
                <div className="flex w-full items-center gap-2.5 px-2.5 py-2">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="h-4 w-36 rounded-sm" />
                </div>

                <div className="-mx-1 my-1 h-px bg-border" />

                {/* Rating */}
                <div className="flex flex-col gap-2 px-2.5 py-1.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-10 rounded-sm" />
                    <Skeleton className="size-5 rounded-md" />
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="size-6 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  isDisabled={isFavoritePending}
                  onPress={handleFavoritePress}
                >
                  <Heart
                    className={cn(
                      "size-4 transition-colors",
                      isFavorite
                        ? "fill-red-600 text-red-600"
                        : "text-muted-foreground",
                    )}
                  />
                  <span>
                    {tActions(isFavorite ? "remove_favorite" : "add_favorite")}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  isDisabled={isWatchLaterPending}
                  onPress={handleWatchLaterPress}
                >
                  <Bookmark
                    className={cn(
                      "size-4 transition-colors",
                      isWatchLater
                        ? "fill-primary text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  <span>
                    {tActions(
                      isWatchLater ? "remove_watch_later" : "add_watch_later",
                    )}
                  </span>
                </Button>

                <div className="-mx-1 my-1 h-px bg-border" />

                <div className="flex flex-col gap-2 px-2.5 py-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground text-xs">
                      {tActions("rate")}
                    </span>
                    {rating !== undefined && rating > 0 && (
                      <Button
                        variant="ghost"
                        isDisabled={isRatingPending}
                        onPress={handleUnratingPress}
                        aria-label={tActions("unrate")}
                        className="text-xs"
                      >
                        {tActions("unrate")}
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <Rating
                      onClick={handleRatingClick}
                      initialValue={rating ? rating : 0}
                      allowFraction
                      transition
                      direction={direction}
                      showTooltip
                      tooltipDefaultText={tActions("rate")}
                      tooltipArray={ratingTooltips}
                      readonly={isRatingPending}
                    />
                  </div>
                </div>
              </>
            )}
          </Dialog>
        </Popover>
      </PopoverTrigger>
    </div>
  );
}
