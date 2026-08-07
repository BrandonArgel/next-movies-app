import { fetchTMDB } from "../fetch-tmdb";
import type { TMDBResponse } from "@/types/api";
import { type Genres } from "@/types/genres";

export const getTvShowGenres = (): TMDBResponse<Genres> =>
  fetchTMDB(`/genre/tv/list`);

export const getMovieGenres = (): TMDBResponse<Genres> =>
  fetchTMDB(`/genre/movie/list`);
