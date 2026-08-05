"use server";

import { tmdb } from "@/lib/tmdb";
import { type Result } from "@/types/api";
import { type PaginatedResponse } from "@/types/common";
import { type TVShow } from "@/types/tv-show";

export async function getTrendingTVShowsAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<TVShow>>> {
  return tmdb.getTrendingTVShows(timeWindow);
}
