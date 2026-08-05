import { type Result, type ErrorTranslationKey } from "@/types/api";

type OMDbResponseWrapper<T> = Promise<Result<T>>;

const BASE_URL = "https://www.omdbapi.com";
const API_KEY = process.env.OMDB_API_KEY;

// Interfaz específica para lo que queremos extraer (puedes agregar más campos luego si los necesitas)
export interface OMDbMovie {
  Awards: string;
  // imdbRating: string; // Ejemplo de otro campo útil que podrías extraer después
}

async function fetchOMDb<T>(
  queryParams: Record<string, string>,
  options: RequestInit = {},
): Promise<Result<T>> {
  try {
    if (!API_KEY) {
      console.error("OMDB_API_KEY is missing in environment variables.");
      return { success: false, error: "unauthorized" };
    }

    const url = new URL(BASE_URL);

    url.searchParams.append("apikey", API_KEY);

    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value);
    }

    const response = await fetch(url.toString(), {
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

export const omdb = {
  getAwards: async (imdbId: string): OMDbResponseWrapper<OMDbMovie> => {
    return fetchOMDb<OMDbMovie>({ i: imdbId });
  },
};
