"use server";

import { tmdb } from "@/lib/tmdb";
import { type Result } from "@/types/api";
import { type PaginatedResponse } from "@/types/common";
import { type Movie } from "@/types/movies";

export async function getTrendingMoviesAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<Movie>>> {
  return tmdb.getTrendingMovies(timeWindow);
}
