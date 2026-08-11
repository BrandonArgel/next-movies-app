import type { TMDBResponse } from "@/types/api";
import type { Session, Token } from "@/types/token";
import { fetchTMDB } from "../fetch-tmdb";

export const getToken = (): TMDBResponse<Token> =>
  fetchTMDB("/authentication/token/new", { next: { revalidate: 0 } });

export const createSession = (requestToken: string): TMDBResponse<Session> =>
  fetchTMDB("/authentication/session/new", {
    method: "POST",
    body: JSON.stringify({ request_token: requestToken }),
  });
