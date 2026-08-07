import { type Movie } from "./movies";
import { type TvShow } from "./tv-show";
import { type Person } from "./person";
import { type PaginatedResponse } from "./common";

export type ErrorTranslationKey =
  | "network"
  | "timeout"
  | "not_found"
  | "unauthorized"
  | "rate_limit"
  | "server_error"
  | "default";

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

export interface MultiSearchResponse extends PaginatedResponse<MultiSearchResult> {}
