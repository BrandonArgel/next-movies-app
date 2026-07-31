"use server";

import { tmdb } from "@/lib/tmdb";
import { type Result } from "@/types/api";
import { type PaginatedResponse } from "@/types/common";
import { type Movie } from "@/types/movies";
import { type CastMember } from "@/types/credits";
import { type Show } from "@/types/show";

export async function getTrendingMoviesAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<Movie>>> {
  return tmdb.getTrendingMovies(timeWindow);
}

export async function getTrendingShowsAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<Show>>> {
  return tmdb.getTrendingShows(timeWindow);
}

export async function getTrendingPeopleAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<CastMember>>> {
  return tmdb.getTrendingPeople(timeWindow);
}
