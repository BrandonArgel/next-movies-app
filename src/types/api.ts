import { type Movie } from "./movies";
import { type TVShow } from "./tv-show";
import { type TrendingPerson } from "./person";
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
  | (TVShow & { media_type: "tv" })
  | (TrendingPerson & { media_type: "person" });

export interface MultiSearchResponse extends PaginatedResponse<MultiSearchResult> {}
