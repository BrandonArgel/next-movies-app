import { fetchTMDB } from "../fetch-tmdb";
import { buildQuery } from "./utils";
import type { TMDBResponse, TMDBPaginatedResponse } from "@/types/api";
import { type Person, type PersonDetail } from "@/types/person";
import type { PersonAppend } from "@/types/tmdb";
import { type TimeWindow } from "@/types/common";

export const getPerson = (
  id: string | number,
  appends?: PersonAppend[],
): TMDBResponse<PersonDetail> => {
  const appendString = appends?.length ? appends.join(",") : undefined;
  return fetchTMDB(
    `/person/${id}${buildQuery({ append_to_response: appendString })}`,
  );
};

export const getTrendingPeople = (
  timeWindow: TimeWindow = "day",
  page = 1,
): TMDBPaginatedResponse<Person> =>
  fetchTMDB(`/trending/person/${timeWindow}${buildQuery({ page })}`);

export const getPopularPeople = (page = 1): TMDBPaginatedResponse<Person> =>
  fetchTMDB(`/person/popular${buildQuery({ page })}`);
