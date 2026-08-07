import { fetchTMDB } from "../fetch-tmdb";
import { fetchOMDb } from "../omdb";
import { buildQuery } from "./utils";
import type { TMDBResponse, TMDBPaginatedResponse } from "@/types/api";
import { type Movie, type OMDbMovie, type DetailedMovie } from "@/types/movies";
import type { MovieAppend } from "@/types/tmdb";
import { type TimeWindow } from "@/types/common";

export const getMovie = (
  id: string | number,
  appends?: MovieAppend[],
): TMDBResponse<DetailedMovie> => {
  const appendString = appends?.length ? appends.join(",") : undefined;
  return fetchTMDB(
    `/movie/${id}${buildQuery({ append_to_response: appendString })}`,
  );
};

export const getMovieAwards = (imdbId: string): TMDBResponse<OMDbMovie> => {
  return fetchOMDb<OMDbMovie>({ i: imdbId });
};

export const getRecommendedMovies = (
  id: string | number,
  page = 1,
): TMDBPaginatedResponse<Movie> =>
  fetchTMDB(`/movie/${id}/recommendations?page=${page}`);

export const getTrendingMovies = (
  timeWindow: TimeWindow = "day",
  page = 1,
): TMDBPaginatedResponse<Movie> =>
  fetchTMDB(`/trending/movie/${timeWindow}${buildQuery({ page })}`);

export const getPopularMovies = (page = 1): TMDBPaginatedResponse<Movie> =>
  fetchTMDB(`/movie/popular${buildQuery({ page })}`);

export const discoverMovies = (
  params: Record<string, string>,
  page = 1,
): TMDBPaginatedResponse<Movie> =>
  fetchTMDB(`/discover/movie${buildQuery({ ...params, page })}`);

// TODO: Type
export const rateMovie = (
  movieId: string | number,
  rating: number,
): TMDBResponse<{ status_code: number; status_message: string }> => {
  return fetchTMDB(`/movie/${movieId}/rating`, {
    method: "POST",
    body: JSON.stringify({ value: rating }),
  });
};
