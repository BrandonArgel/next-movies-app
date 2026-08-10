"use server";

import { getTrendingTvShows } from "@/lib/api/tv-shows";
import type { PaginatedResponse, Result } from "@/types/api";
import type { TvShow } from "@/types/tv-show";

export async function getTrendingTVShowsAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<TvShow>>> {
  return getTrendingTvShows(timeWindow);
}
