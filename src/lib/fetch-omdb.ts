import type { ErrorTranslationKey, Result } from "@/types/api";
import { buildQuery } from "./api/utils";
import { BASE_OMDB_API_URL } from "./constants";

const API_KEY = process.env.OMDB_API_KEY;

export async function fetchOMDb<T>(
  params: Record<string, string | number | undefined>,
  options: RequestInit = {},
): Promise<Result<T>> {
  try {
    if (!API_KEY) {
      console.error("OMDB_API_KEY is missing in environment variables.");
      return { success: false, error: "unauthorized" };
    }

    const query = buildQuery({ apikey: API_KEY, ...params });
    const url = `${BASE_OMDB_API_URL}${query}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        accept: "application/json",
        ...options.headers,
      },
      next: { revalidate: 3600, ...options.next },
    });

    if (!response.ok) {
      const status = response.status;
      let errorKey: ErrorTranslationKey = "default";

      if (status === 401 || status === 403) {
        errorKey = "unauthorized";
      } else if (status >= 500) {
        errorKey = "server_error";
      }

      return { success: false, error: errorKey };
    }

    const data = await response.json();

    if (data.Response === "False") {
      const errorMessage = data.Error;
      let errorKey: ErrorTranslationKey = "default";

      if (errorMessage === "Movie not found!") {
        errorKey = "not_found";
      } else if (errorMessage === "Invalid API key!") {
        errorKey = "unauthorized";
      } else if (errorMessage === "Request limit reached!") {
        errorKey = "rate_limit";
      }

      return { success: false, error: errorKey };
    }

    return { success: true, data: data as T };
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
