import { getLocale } from "next-intl/server";
import type {
  ErrorTranslationKey,
  TMDBErrorResponse,
  TMDBResponse,
} from "@/types/api";
import { API_TOKEN, BASE_TMDB_API_URL } from "./constants";

export async function fetchTMDB<T>(
  endpoint: string,
  options: RequestInit = {},
): TMDBResponse<T> {
  if (!API_TOKEN) {
    console.error(
      "TMDB_API_READ_ACCESS_TOKEN is missing in environment variables.",
    );
    return { success: false, error: "unauthorized_dev" };
  }

  try {
    const locale = await getLocale();
    const url = new URL(`${BASE_TMDB_API_URL}${endpoint}`);
    url.searchParams.append("language", locale);
    url.searchParams.append("include_image_language", locale);

    const isMutation = options.method && options.method !== "GET";

    const defaultHeaders: HeadersInit = {
      Authorization: `Bearer ${API_TOKEN}`,
      accept: "application/json",
    };

    if (options.body) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...(isMutation
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, ...options.next } }),
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
