export function parseMovieSearchParams(resolvedParams: {
  [key: string]: string | string[] | undefined;
}) {
  const filters: Record<string, string> = {};

  if (
    typeof resolvedParams.genre === "string" &&
    resolvedParams.genre !== "all"
  ) {
    filters.with_genres = resolvedParams.genre;
  }
  if (typeof resolvedParams.release_from === "string") {
    filters["primary_release_date.gte"] = resolvedParams.release_from;
  }
  if (typeof resolvedParams.release_to === "string") {
    filters["primary_release_date.lte"] = resolvedParams.release_to;
  }
  if (typeof resolvedParams.runtime_min === "string") {
    filters["with_runtime.gte"] = resolvedParams.runtime_min;
  }
  if (typeof resolvedParams.runtime_max === "string") {
    filters["with_runtime.lte"] = resolvedParams.runtime_max;
  }
  if (typeof resolvedParams.sort === "string") {
    filters.sort_by = resolvedParams.sort;
  }

  return filters;
}

export function parseTvSearchParams(resolvedParams: {
  [key: string]: string | string[] | undefined;
}) {
  const filters: Record<string, string> = {};

  if (
    typeof resolvedParams.genre === "string" &&
    resolvedParams.genre !== "all"
  ) {
    filters.with_genres = resolvedParams.genre;
  }

  if (typeof resolvedParams.release_from === "string") {
    filters["first_air_date.gte"] = resolvedParams.release_from;
  }
  if (typeof resolvedParams.release_to === "string") {
    filters["first_air_date.lte"] = resolvedParams.release_to;
  }

  if (typeof resolvedParams.runtime_min === "string") {
    filters["with_runtime.gte"] = resolvedParams.runtime_min;
  }
  if (typeof resolvedParams.runtime_max === "string") {
    filters["with_runtime.lte"] = resolvedParams.runtime_max;
  }
  if (typeof resolvedParams.sort === "string") {
    filters.sort_by = resolvedParams.sort;
  }

  return filters;
}
