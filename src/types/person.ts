import { type MediaType } from "./media";

export interface Person {
  adult: boolean;
  id: number;
  name: string;
  original_name: string;
  media_type: string;
  popularity: number;
  gender: number;
  known_for_department: string;
  profile_path: string;
  known_for: KnownFor[];
}

export interface KnownFor {
  adult: boolean;
  backdrop_path: null | string;
  id: number;
  title?: string;
  original_language: string;
  original_title?: string;
  overview: string;
  poster_path: string;
  media_type: MediaType;
  genre_ids: number[];
  popularity: number;
  release_date?: Date;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  name?: string;
  original_name?: string;
  first_air_date?: Date;
  origin_country?: string[];
}

export interface PersonDetail {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: Date;
  deathday: null;
  gender: number;
  homepage: null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
  movie_credits: MovieCredits;
  tv_credits: TvCredits;
  external_ids: ExternalIDS;
  images: Images;
  tagged_images: TaggedImages;
}

export interface MovieCredits {
  cast: MediaElement[];
  crew: MediaElement[];
}

export interface MediaElement {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  softcore: boolean;
  video: boolean;
  vote_average: number;
  vote_count: number;
  character?: string;
  credit_id?: string;
  order?: number;
  department?: string;
  job?: string;
  media_type?: MediaType;
}

export interface TvCredits {
  cast: TvCreditsCast[];
  crew: TvCreditsCast[];
}

export interface TvCreditsCast {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  softcore: boolean;
  name: string;
  vote_average: number;
  vote_count: number;
  character?: string;
  credit_id: string;
  episode_count: number;
  first_credit_air_date: string;
  department?: string;
  job?: string;
}

export interface ExternalIDS {
  freebase_mid: string;
  freebase_id: string;
  imdb_id: string;
  tvrage_id: number;
  wikidata_id: string;
  facebook_id: string;
  instagram_id: string;
  tiktok_id: string;
  twitter_id: string;
  youtube_id: string;
}

export interface Images {
  profiles: Profile[];
}

export interface Profile {
  aspect_ratio: number;
  height: number;
  iso_3166_1: null;
  iso_639_1: null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TaggedImages {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}

export interface Result {
  aspect_ratio: number;
  file_path: string;
  height: number;
  id: string;
  iso_3166_1: string;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
  image_type: string;
  media: Media;
  media_type: MediaType;
}

export interface Media {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: MediaType;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: Date;
  softcore: boolean;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
