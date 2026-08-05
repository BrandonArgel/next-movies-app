import {
  Genre,
  PaginatedResponse,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
} from "./common";
import { Videos, Images } from "./media";
import { WatchProvidersResponse } from "./watch-providers";

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type?: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  softcore?: boolean;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: {
    certification: string;
    release_date: string;
  }[];
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating?: number;
    avatar_path?: string;
  };
}

export interface DetailedMovie extends Omit<
  Movie,
  "genre_ids" | "media_type" | "original_language" | "release_date"
> {
  belongs_to_collection: BelongsToCollection | null;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  videos: Videos;
  images: Images;
  credits: MovieCredits;
  reviews: PaginatedResponse<Review>;
  release_dates: PaginatedResponse<ReleaseDatesResult>;
  "watch/providers"?: WatchProvidersResponse;
}

export interface MovieCastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  cast_id?: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
}

export interface MovieCrewMember extends MovieCastMember {}

export interface MovieCredits {
  cast: MovieCastMember[];
  crew: MovieCrewMember[];
}
