"use server";

import { tmdb } from "@/lib/tmdb";
import { type Result } from "@/types/api";
import { type PaginatedResponse } from "@/types/common";
import { type TvShow } from "@/types/tv-show";

export async function getTrendingTVShowsAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<TvShow>>> {
  return tmdb.getTrendingTVShows(timeWindow);
}
