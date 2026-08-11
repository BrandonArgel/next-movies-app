import type { Account, MutationResponse } from "@/types/account";
import type { TMDBPaginatedResponse, TMDBResponse } from "@/types/api";
import type { MediaType } from "@/types/media";
import type { Movie, MovieAccountState } from "@/types/movies";
import type { TvShow } from "@/types/tv-show";
import { fetchTMDB } from "../fetch-tmdb";
import { buildQuery } from "./utils";

export const getAccountDetails = (sessionId: string): TMDBResponse<Account> =>
  fetchTMDB(`/account?session_id=${sessionId}`);

export const getFavoriteMovies = (
  accountId: number,
  sessionId: string,
  page: number = 1,
): TMDBPaginatedResponse<Movie> =>
  fetchTMDB(
    `/account/${accountId}/favorite/movies${buildQuery({
      session_id: sessionId,
      page,
    })}`,
    { next: { revalidate: 0 } },
  );

export const getFavoriteTvShows = (
  accountId: number,
  sessionId: string,
  page: number = 1,
): TMDBPaginatedResponse<TvShow> =>
  fetchTMDB(
    `/account/${accountId}/favorite/tv${buildQuery({
      session_id: sessionId,
      page,
    })}`,
    { next: { revalidate: 0 } },
  );

export const getWatchLaterMovies = (
  accountId: number,
  sessionId: string,
  page: number = 1,
): TMDBPaginatedResponse<Movie> =>
  fetchTMDB(
    `/account/${accountId}/watchlist/movies${buildQuery({
      session_id: sessionId,
      page,
    })}`,
    { next: { revalidate: 0 } },
  );

export const getWatchLaterTvShows = (
  accountId: number,
  sessionId: string,
  page: number = 1,
): TMDBPaginatedResponse<TvShow> =>
  fetchTMDB(
    `/account/${accountId}/watchlist/tv${buildQuery({
      session_id: sessionId,
      page,
    })}`,
    { next: { revalidate: 0 } },
  );

export const getRatedMovies = (
  accountId: number,
  sessionId: string,
  page: number = 1,
): TMDBPaginatedResponse<Movie> =>
  fetchTMDB(
    `/account/${accountId}/rated/movies${buildQuery({
      session_id: sessionId,
      page,
    })}`,
    { next: { revalidate: 0 } },
  );

export const getRatedTvShows = (
  accountId: number,
  sessionId: string,
  page: number = 1,
): TMDBPaginatedResponse<TvShow> =>
  fetchTMDB(
    `/account/${accountId}/rated/tv${buildQuery({
      session_id: sessionId,
      page,
    })}`,
    { next: { revalidate: 0 } },
  );

export const toggleFavorite = (
  accountId: number,
  sessionId: string,
  mediaType: MediaType,
  mediaId: number,
  isFavorite: boolean,
): TMDBResponse<MutationResponse> =>
  fetchTMDB(`/account/${accountId}/favorite?session_id=${sessionId}`, {
    method: "POST",
    body: JSON.stringify({
      media_type: mediaType,
      media_id: mediaId,
      favorite: isFavorite,
    }),
  });

export const toggleWatchList = (
  accountId: number,
  sessionId: string,
  mediaType: MediaType,
  mediaId: number,
  isWatchList: boolean,
): TMDBResponse<MutationResponse> =>
  fetchTMDB(`/account/${accountId}/watchlist?session_id=${sessionId}`, {
    method: "POST",
    body: JSON.stringify({
      media_type: mediaType,
      media_id: mediaId,
      watchlist: isWatchList,
    }),
  });

export const getMediaAccountState = (
  mediaType: MediaType,
  mediaId: number,
  sessionId: string,
): TMDBResponse<MovieAccountState> =>
  fetchTMDB(
    `/${mediaType}/${mediaId}/account_states${buildQuery({ session_id: sessionId })}`,
    {
      next: { revalidate: 0 },
    },
  );

export const rateMedia = (
  mediaType: MediaType,
  mediaId: number,
  sessionId: string,
  rating: number,
): TMDBResponse<MutationResponse> =>
  fetchTMDB(
    `/${mediaType}/${mediaId}/rating${buildQuery({ session_id: sessionId })}`,
    {
      method: "POST",
      body: JSON.stringify({
        value: rating,
      }),
    },
  );

export const unrateMedia = (
  mediaType: MediaType,
  mediaId: number,
  sessionId: string,
): TMDBResponse<MutationResponse> =>
  fetchTMDB(
    `/${mediaType}/${mediaId}/rating${buildQuery({ session_id: sessionId })}`,
    {
      method: "DELETE",
    },
  );
