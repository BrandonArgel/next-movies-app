"use server";

import { getTrendingMovies } from "@/lib/api/movies";
import { type Result } from "@/types/api";
import { type PaginatedResponse } from "@/types/api";
import { type Movie } from "@/types/movies";

export async function getTrendingMoviesAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<Movie>>> {
  return getTrendingMovies(timeWindow);
}
