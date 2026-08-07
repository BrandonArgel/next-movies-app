import TrendingPeopleSection from "./trending-people-section";
import { SectionState } from "./section-state";
import { getTrendingPeople } from "@/lib/api/people";

export async function TrendingPeopleContainer() {
  const result = await getTrendingPeople("day");

  if (!result.success) {
    return <SectionState type="error" entity="people" error={result.error} />;
  }

  if (!result.data.results || result.data.results.length === 0) {
    return <SectionState type="empty" entity="people" />;
  }

  return <TrendingPeopleSection initialPeople={result.data.results} />;
}
