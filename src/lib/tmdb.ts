import { getLocale } from "next-intl/server";
import type { Movie, DetailedMovie, PaginatedResponse } from "@/types/movies";

export type { PaginatedResponse };

const BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;

async function fetchTMDB<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.status_message ?? "TMDB request failed");
  }

  return response.json() as Promise<T>;
}

export const tmdb = {
  getTrending: async (
    timeWindow: "day" | "week" = "day",
    page = 1,
  ): Promise<PaginatedResponse<Movie>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/trending/movie/${timeWindow}?page=${page}`,
    );
  },

  getPopular: async (page = 1): Promise<PaginatedResponse<Movie>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(`/movie/popular?page=${page}`);
  },

  getUpcoming: async (page = 1): Promise<PaginatedResponse<Movie>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(`/movie/upcoming?page=${page}`);
  },

  searchMovies: async (
    query: string,
    page = 1,
  ): Promise<PaginatedResponse<Movie>> => {
    return fetchTMDB<PaginatedResponse<Movie>>(
      `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    );
  },

  /**
   * Fetches full movie details including videos, credits, and similar movies
   * in a single request via `append_to_response`.
   */
  getMovieDetails: async (id: string | number): Promise<DetailedMovie> => {
    return fetchTMDB<DetailedMovie>(
      `/movie/${id}?append_to_response=videos,images,credits,similar`,
    );
  },

  /** @deprecated Use `getMovieDetails` instead for full data */
  getMovie: async (id: string | number, appendToResponse?: string) => {
    const query = appendToResponse
      ? `?append_to_response=${appendToResponse}`
      : "";
    return fetchTMDB<DetailedMovie>(`/movie/${id}${query}`);
  },

  rateMovie: async (
    movieId: string,
    rating: number,
  ): Promise<{
    success: boolean;
    status_code: number;
    status_message: string;
  }> => {
    return fetchTMDB(`/movie/${movieId}/rating`, {
      method: "POST",
      body: JSON.stringify({ value: rating }),
    });
  },
};
