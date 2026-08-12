import type { TMDBPaginatedResponse, TMDBResponse } from "@/types/api";
import type { TimeWindow } from "@/types/common";
import type { DetailedMovie, Movie, OMDbMovie } from "@/types/movies";
import type { MovieAppend } from "@/types/tmdb";
import { fetchOMDb } from "../fetch-omdb";
import { fetchTMDB } from "../fetch-tmdb";
import { buildQuery } from "./utils";

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

const _getPopularMovies = (page = 1): TMDBPaginatedResponse<Movie> =>
  fetchTMDB(`/movie/popular${buildQuery({ page })}`);

export const discoverMovies = (
  params: Record<string, string>,
  page = 1,
): TMDBPaginatedResponse<Movie> =>
  fetchTMDB(`/discover/movie${buildQuery({ ...params, page })}`);
