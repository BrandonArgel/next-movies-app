"use server";

import { getTrendingPeople } from "@/lib/api/people";
import { type Result } from "@/types/api";
import { type PaginatedResponse } from "@/types/api";
import { type Person } from "@/types/person";

export async function getTrendingPeopleAction(
  timeWindow: "day" | "week",
): Promise<Result<PaginatedResponse<Person>>> {
  return getTrendingPeople(timeWindow);
}
