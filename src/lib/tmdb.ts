import { getLocale } from "next-intl/server";
import { type PaginatedResponse } from "@/types/common";
import { type Movie, type DetailedMovie } from "@/types/movies";
import { type CastMember } from "@/types/credits";
import { type DetailedShow } from "@/types/show";
import { Show } from "@/types/show";
import { PersonDetail } from "@/types/person";
import {
  type Result,
  type ErrorTranslationKey,
  type TMDBErrorResponse,
} from "@/types/api";

const BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;

async function fetchTMDB<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<Result<T>> {
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
        errorKey = "notFound";
      } else if (status === 401 || status === 403) {
        errorKey = "unauthorized";
      } else if (status === 429 || tmdbCode === 25) {
        errorKey = "rateLimit";
      } else if (status >= 500) {
        errorKey = "serverError";
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
  getMovieDetails: async (
    id: string | number,
  ): Promise<Result<DetailedMovie>> => {
    return fetchTMDB<DetailedMovie>(
      `/movie/${id}?append_to_response=videos,images,credits,similar`,
    );
  },

  getShowDetails: async (
    id: string | number,
  ): Promise<Result<DetailedShow>> => {
    return fetchTMDB<DetailedShow>(
      `/tv/${id}?append_to_response=videos,images,credits`,
    );
  },

  getPersonDetails: async (
    id: string | number,
  ): Promise<Result<PersonDetail>> => {
    return fetchTMDB<PersonDetail>(
      `/person/${id}?append_to_response=movie_credits`,
    );
  },

  getTrendingMovies: async (
    timeWindow: "day" | "week" = "day",
    page = 1,
  ): Promise<Result<PaginatedResponse<Movie>>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/trending/movie/${timeWindow}?page=${page}`,
    );
  },

  getTrendingShows: async (
    timeWindow: "day" | "week" = "day",
    page = 1,
  ): Promise<Result<PaginatedResponse<Show>>> => {
    return fetchTMDB<PaginatedResponse<Show>>(
      `/trending/tv/${timeWindow}?page=${page}`,
    );
  },

  getTrendingPeople: async (
    timeWindow: "day" | "week" = "day",
    page = 1,
  ): Promise<Result<PaginatedResponse<CastMember>>> => {
    return fetchTMDB<PaginatedResponse<CastMember>>(
      `/trending/person/${timeWindow}?page=${page}`,
    );
  },

  getSimilarMovies: async (
    id: string | number,
    page = 1,
  ): Promise<Result<PaginatedResponse<Movie>>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/movie/${id}/similar?page=${page}`,
    );
  },

  getMovieRecommendations: async (
    id: string | number,
    page = 1,
  ): Promise<Result<PaginatedResponse<Movie>>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/movie/${id}/recommendations?page=${page}`,
    );
  },

  getShowRecommendations: async (
    id: string | number,
    page = 1,
  ): Promise<Result<PaginatedResponse<Show>>> => {
    return fetchTMDB<PaginatedResponse<Show>>(
      `/tv/${id}/recommendations?page=${page}`,
    );
  },

  getPopular: async (page = 1): Promise<Result<PaginatedResponse<Movie>>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(`/movie/popular?page=${page}`);
  },

  getUpcoming: async (page = 1): Promise<Result<PaginatedResponse<Movie>>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(`/movie/upcoming?page=${page}`);
  },

  searchMovies: async (
    query: string,
    page = 1,
  ): Promise<Result<PaginatedResponse<Movie>>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    );
  },

  rateMovie: async (
    movieId: string,
    rating: number,
  ): Promise<Result<{ status_code: number; status_message: string }>> => {
    return fetchTMDB<{ status_code: number; status_message: string }>(
      `/movie/${movieId}/rating`,
      {
        method: "POST",
        body: JSON.stringify({ value: rating }),
      },
    );
  },
};
