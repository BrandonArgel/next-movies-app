import type { TMDBPaginatedResponse } from "@/types/api";
import type { Movie } from "@/types/movies";
import type { Person } from "@/types/person";
import type { TvShow } from "@/types/tv-show";
import { fetchTMDB } from "../fetch-tmdb";
import { buildQuery } from "./utils";

export const searchMovies = (
  query: string,
  page = 1,
): TMDBPaginatedResponse<Movie> => {
  return fetchTMDB(`/search/movie${buildQuery({ query, page })}`);
};

export const searchTvShows = (
  query: string,
  page = 1,
): TMDBPaginatedResponse<TvShow> => {
  return fetchTMDB(`/search/tv${buildQuery({ query, page })}`);
};

export const searchPeople = (
  query: string,
  page = 1,
): TMDBPaginatedResponse<Person> => {
  return fetchTMDB(`/search/person${buildQuery({ query, page })}`);
};
