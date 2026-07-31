export type ErrorTranslationKey =
  | "network"
  | "timeout"
  | "notFound"
  | "unauthorized"
  | "rateLimit"
  | "serverError"
  | "default";

export type Result<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: ErrorTranslationKey; data?: never };

export interface TMDBErrorResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}
