import { tmdb } from "@/lib/tmdb";
import { getTranslations } from "next-intl/server";
import TrendingPeopleSection from "./trending-people-section";
import { SectionState } from "./section-state";

export async function TrendingPeopleContainer() {
  const result = await tmdb.getTrendingPeople("day");

  if (!result.success) {
    return <SectionState type="error" entity="people" error={result.error} />;
  }

  if (!result.data.results || result.data.results.length === 0) {
    return <SectionState type="empty" entity="people" />;
  }

  return <TrendingPeopleSection initialPeople={result.data.results} />;
}
