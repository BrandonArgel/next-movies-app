import type { ReleaseDatesResult } from "@/types/movies";

export function getAgeRating(
  releaseDatesResults?: ReleaseDatesResult[],
  countryCode: string = "US",
) {
  if (!releaseDatesResults) return null;

  const countryData =
    releaseDatesResults.find((r) => r.iso_3166_1 === countryCode) ||
    releaseDatesResults.find((r) => r.iso_3166_1 === "US");

  if (!countryData) return null;

  const certification = countryData.release_dates.find(
    (d) => d.certification !== "",
  )?.certification;

  return certification || null;
}
