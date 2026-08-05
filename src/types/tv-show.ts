import { MediaType } from "./media";
import {
  Genre,
  PaginatedResponse,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
} from "./common";
import { Videos, Images } from "./media";
import { WatchProvidersResponse } from "./watch-providers";
import { type Review } from "./movies";

export interface TVShow {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type?: MediaType;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface Season {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface DetailedTVShow extends TVShow {
  created_by: Creator[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: Season[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  videos: Videos;
  images: Images;
  credits: ShowCredits;
  reviews: PaginatedResponse<Review>;
  "watch/providers"?: WatchProvidersResponse;
}

export interface ShowCredits {
  cast: ShowCast[];
  crew: ShowCast[];
}

export interface ShowCast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
}
