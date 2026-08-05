"use server";

import { tmdb } from "@/lib/tmdb";
import { type Result } from "@/types/api";
import { type PaginatedResponse } from "@/types/common";
import { type TrendingPerson } from "@/types/person";

export async function getTrendingPeopleAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<TrendingPerson>>> {
  return tmdb.getTrendingPeople(timeWindow);
}
