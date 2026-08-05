import type { PersonData } from "@/components/people/person-card";

/**
 * Unified CastMember type compatible with both movie cast (MovieCastMember)
 * and TV show cast (ShowCast), extending PersonData used by PeopleCarousel.
 */
export interface CastMember extends PersonData {
  original_name?: string;
  popularity: number;
  gender?: number;
  department?: string;
  job?: string;
  credit_id?: string;
  order?: number;
}
