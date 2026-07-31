import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

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

  // // Intentamos obtener la sesión del usuario desde las cookies
  // const cookieStore = cookies();
  // const userSessionId = cookieStore.get("tmdb_session_id")?.value;

  // // Si hay sesión y es un endpoint de usuario, agregamos el parámetro o header
  // if (userSessionId) {
  //   url.searchParams.append("session_id", userSessionId);
  // }

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
    throw new Error(errorData.status_message);
  }

  return response.json();
}

// 2. Objeto exportado con tus métodos específicos
export const tmdb = {
  getTrending: async (timeWindow: "day" | "week" = "day") => {
    return fetchTMDB<any>(`/trending/movie/${timeWindow}`);
  },

  getMovie: async (id: string) => {
    return fetchTMDB<any>(`/movie/${id}`);
  },

  searchMovies: async (query: string) => {
    const url = new URL(`${BASE_URL}/search/movie`);
    url.searchParams.append("query", query);
    // Nota: fetchTMDB ya le agregará el ?language= automáticamente
    return fetchTMDB<any>(`/search/movie?query=${encodeURIComponent(query)}`);
  },
  // Ejemplo de un método POST
  rateMovie: async (movieId: string, rating: number) => {
    return fetchTMDB<any>(`/movie/${movieId}/rating`, {
      method: "POST",
      body: JSON.stringify({ value: rating }),
    });
  },
};
