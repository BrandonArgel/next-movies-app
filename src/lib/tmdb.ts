import { getLocale } from "next-intl/server";
import {
  type PaginatedResponse,
  type Genres,
  TimeWindow,
} from "@/types/common";
import { type Movie, type DetailedMovie } from "@/types/movies";
import { type DetailedTVShow } from "@/types/tv-show";
import { type TVShow } from "@/types/tv-show";
import { type Collection } from "@/types/collection";
import { type PersonDetail, type TrendingPerson } from "@/types/person";
import {
  type Result,
  type ErrorTranslationKey,
  type TMDBErrorResponse,
  type MultiSearchResult,
} from "@/types/api";

type TMDBResponse<T> = Promise<Result<T>>;
type TMDBPaginatedResponse<T> = Promise<Result<PaginatedResponse<T>>>;
type TMDBImageSize = "w300" | "w500" | "w780" | "w1280" | "original";

const BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;

export function getTMDBImageUrl(
  path: string | null | undefined,
  size: TMDBImageSize = "original",
): string | null {
  if (!path) return null;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${normalizedPath}`;
}

async function fetchTMDB<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<Result<T>> {
  if (!API_TOKEN) {
    console.error(
      "TMDB_API_READ_ACCESS_TOKEN is missing in environment variables.",
    );
    return { success: false, error: "unauthorized" };
  }

  try {
    const locale = await getLocale();
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append("language", locale);
    url.searchParams.append("include_image_language", locale);

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        accept: "application/json",
        ...options.headers,
      },
      next: { revalidate: 3600, ...options.next },
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as Partial<TMDBErrorResponse>;
      const status = response.status;
      const tmdbCode = errorData.status_code;

      let errorKey: ErrorTranslationKey = "default";

      if (status === 404 || tmdbCode === 34) {
        errorKey = "not_found";
      } else if (status === 401 || status === 403) {
        errorKey = "unauthorized";
      } else if (status === 429 || tmdbCode === 25) {
        errorKey = "rate_limit";
      } else if (status >= 500) {
        errorKey = "server_error";
      }

      return { success: false, error: errorKey };
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (error) {
    const isNetworkError = error instanceof Error && error.name === "TypeError";
    const isTimeout = error instanceof Error && error.name === "AbortError";

    if (isNetworkError) {
      return { success: false, error: "network" };
    }

    if (isTimeout) {
      return { success: false, error: "timeout" };
    }

    return { success: false, error: "default" };
  }
}

export const tmdb = {
  getMovieDetails: async (id: string | number): TMDBResponse<DetailedMovie> => {
    return fetchTMDB<DetailedMovie>(
      `/movie/${id}?append_to_response=videos,images,credits,watch/providers,reviews,release_dates`,
    );
  },

  getCollection: async (
    collectionId: string | number,
  ): TMDBResponse<Collection> => {
    return fetchTMDB<Collection>(`/collection/${collectionId}`);
  },

  getTVShowDetails: async (
    id: string | number,
  ): TMDBResponse<DetailedTVShow> => {
    return fetchTMDB<DetailedTVShow>(
      `/tv/${id}?append_to_response=videos,images,credits,watch/providers,reviews`,
    );
  },

  getPersonDetails: async (id: string | number): TMDBResponse<PersonDetail> => {
    return fetchTMDB<PersonDetail>(
      `/person/${id}?append_to_response=movie_credits,tv_credits,images,tagged_images,external_ids`,
    );
  },

  getTrendingMovies: async (
    timeWindow: TimeWindow = "day",
    page = 1,
  ): TMDBResponse<PaginatedResponse<Movie>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/trending/movie/${timeWindow}?page=${page}`,
    );
  },

  getTrendingTVShows: async (
    timeWindow: TimeWindow = "day",
    page = 1,
  ): TMDBPaginatedResponse<TVShow> => {
    return fetchTMDB<PaginatedResponse<TVShow>>(
      `/trending/tv/${timeWindow}?page=${page}`,
    );
  },

  getTrendingPeople: async (
    timeWindow: TimeWindow = "day",
    page = 1,
  ): TMDBPaginatedResponse<TrendingPerson> => {
    return fetchTMDB<PaginatedResponse<TrendingPerson>>(
      `/trending/person/${timeWindow}?page=${page}`,
    );
  },

  getSimilarMovies: async (
    id: string | number,
    page = 1,
  ): TMDBPaginatedResponse<Movie> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/movie/${id}/similar?page=${page}`,
    );
  },

  getMovieRecommendations: async (
    id: string | number,
    page = 1,
  ): TMDBPaginatedResponse<Movie> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/movie/${id}/recommendations?page=${page}`,
    );
  },

  getTVShowRecommendations: async (
    id: string | number,
    page = 1,
  ): TMDBPaginatedResponse<TVShow> => {
    return fetchTMDB<PaginatedResponse<TVShow>>(
      `/tv/${id}/recommendations?page=${page}`,
    );
  },

  getMovieGenres: async (): TMDBResponse<Genres> => {
    return fetchTMDB<Genres>("/genre/movie/list");
  },

  getTVShowGenres: async (): TMDBResponse<Genres> => {
    return fetchTMDB<Genres>("/genre/tv/list");
  },

  getPopular: async (page = 1): TMDBPaginatedResponse<Movie> => {
    return fetchTMDB<PaginatedResponse<Movie>>(`/movie/popular?page=${page}`);
  },

  getUpcoming: async (page = 1): TMDBPaginatedResponse<Movie> => {
    return fetchTMDB<PaginatedResponse<Movie>>(`/movie/upcoming?page=${page}`);
  },

  getNowPlaying: async (page = 1): TMDBPaginatedResponse<Movie> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/movie/now_playing?page=${page}`,
    );
  },

  getTopRatedMovies: async (page = 1): TMDBPaginatedResponse<Movie> => {
    return fetchTMDB<PaginatedResponse<Movie>>(`/movie/top_rated?page=${page}`);
  },

  getAiringTodayTVShows: async (page = 1): TMDBPaginatedResponse<TVShow> => {
    return fetchTMDB<PaginatedResponse<TVShow>>(
      `/tv/airing_today?page=${page}`,
    );
  },

  getOnAirTVShows: async (page = 1): TMDBPaginatedResponse<TVShow> => {
    return fetchTMDB<PaginatedResponse<TVShow>>(`/tv/on_the_air?page=${page}`);
  },

  getPopularTVShows: async (page = 1): TMDBPaginatedResponse<TVShow> => {
    return fetchTMDB<PaginatedResponse<TVShow>>(`/tv/popular?page=${page}`);
  },

  getTopRatedTVShows: async (page = 1): TMDBPaginatedResponse<TVShow> => {
    return fetchTMDB<PaginatedResponse<TVShow>>(`/tv/top_rated?page=${page}`);
  },

  getPopularPeople: async (page = 1): TMDBPaginatedResponse<TrendingPerson> => {
    return fetchTMDB<PaginatedResponse<TrendingPerson>>(
      `/person/popular?page=${page}`,
    );
  },

  discoverMoviesByGenre: async (
    genreId: number | string,
    page = 1,
  ): TMDBPaginatedResponse<Movie> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
    );
  },

  discoverTVShowsByGenre: async (
    genreId: number | string,
    page = 1,
  ): TMDBPaginatedResponse<TVShow> => {
    return fetchTMDB<PaginatedResponse<TVShow>>(
      `/discover/tv?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
    );
  },

  searchMovies: async (
    query: string,
    page = 1,
  ): TMDBPaginatedResponse<Movie> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    );
  },

  multiSearch: async (
    query: string,
    page = 1,
  ): TMDBPaginatedResponse<MultiSearchResult> => {
    return fetchTMDB<PaginatedResponse<MultiSearchResult>>(
      `/search/multi?query=${encodeURIComponent(query)}&page=${page}`,
    );
  },

  rateMovie: async (
    movieId: string,
    rating: number,
  ): TMDBResponse<{ status_code: number; status_message: string }> => {
    return fetchTMDB<{ status_code: number; status_message: string }>(
      `/movie/${movieId}/rating`,
      {
        method: "POST",
        body: JSON.stringify({ value: rating }),
      },
    );
  },
};
