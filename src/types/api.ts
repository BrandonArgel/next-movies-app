import type { Movie } from "./movies";
import type { Person } from "./person";
import type { TvShow } from "./tv-show";

export type ErrorTranslationKey =
  | "network"
  | "timeout"
  | "not_found"
  | "unauthorized"
  | "rate_limit"
  | "server_error"
  | "default";

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type Result<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: ErrorTranslationKey; data?: never };

export interface TMDBErrorResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

export type MultiSearchResult =
  | (Movie & { media_type: "movie" })
  | (TvShow & { media_type: "tv" })
  | (Person & { media_type: "person" });

export interface MultiSearchResponse
  extends PaginatedResponse<MultiSearchResult> {}
export type TMDBResponse<T> = Promise<Result<T>>;
export type TMDBPaginatedResponse<T> = Promise<Result<PaginatedResponse<T>>>;
