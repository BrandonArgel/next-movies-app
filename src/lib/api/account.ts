import { fetchTMDB } from "../fetch-tmdb";
import { buildQuery } from "./utils";
import { type TMDBResponse, type TMDBPaginatedResponse } from "@/types/api";
import { type Account, type MutationResponse } from "@/types/account";
import { Movie } from "@/types/movies";
import { TvShow } from "@/types/tv-show";

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
  );

export const toggleFavorite = (
  accountId: number,
  sessionId: string,
  mediaType: "movie" | "tv",
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

export const toggleWatchlist = (
  accountId: number,
  sessionId: string,
  mediaType: "movie" | "tv",
  mediaId: number,
  isWatchlist: boolean,
): TMDBResponse<MutationResponse> =>
  fetchTMDB(`/account/${accountId}/watchlist?session_id=${sessionId}`, {
    method: "POST",
    body: JSON.stringify({
      media_type: mediaType,
      media_id: mediaId,
      watchlist: isWatchlist,
    }),
  });

// export const addToList = (
//   listId: number | string,
//   sessionId: string,
//   mediaId: number,
// ): TMDBResponse<MutationResponse> =>
//   fetchTMDB(`/list/${listId}/add_item?session_id=${sessionId}`, {
//     method: "POST",
//     body: JSON.stringify({
//       media_id: mediaId,
//     }),
//   });
