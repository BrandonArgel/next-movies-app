import type { TMDBPaginatedResponse, TMDBResponse } from "@/types/api";
import type { TimeWindow } from "@/types/common";
import type { TvShowAppend } from "@/types/tmdb";
import type { DetailedTvShow, TvShow } from "@/types/tv-show";
import { fetchTMDB } from "../fetch-tmdb";
import { buildQuery } from "./utils";

export const getTvShow = (
  id: string | number,
  appends?: TvShowAppend[],
): TMDBResponse<DetailedTvShow> => {
  const appendString = appends?.length ? appends.join(",") : undefined;
  return fetchTMDB(
    `/tv/${id}${buildQuery({ append_to_response: appendString })}`,
  );
};

export const getTrendingTvShows = (
  timeWindow: TimeWindow = "day",
  page = 1,
): TMDBPaginatedResponse<TvShow> =>
  fetchTMDB(`/trending/tv/${timeWindow}${buildQuery({ page })}`);

export const getRecommendedTvShows = (
  id: string | number,
  page = 1,
): TMDBPaginatedResponse<TvShow> =>
  fetchTMDB(`/tv/${id}/recommendations${buildQuery({ page })}`);

export const discoverTVShows = (
  params: Record<string, string>,
  page = 1,
): TMDBPaginatedResponse<TvShow> => {
  return fetchTMDB(`/discover/tv${buildQuery({ ...params, page })}`);
};
