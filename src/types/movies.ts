export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  softcore: boolean;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Images {
  backdrops: Backdrop[];
  logos: Backdrop[];
  posters: Backdrop[];
}

export interface Backdrop {
  aspect_ratio: number;
  height: number;
  iso_3166_1: string;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface VideoResult {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: "YouTube" | "Vimeo";
  size: number;
  type: "Featurette" | "Teaser" | "Behind the Scenes" | "Trailer" | "Clip";
  official: boolean;
  id: string;
  published_at: string;
}

export interface Videos {
  results: VideoResult[];
}

// Legacy alias kept for backward compat
export type Result = VideoResult;
export type Site = "YouTube";
export type Type = "Featurette" | "Teaser" | "Behind the Scenes" | "Trailer";
export type OriginCountry = "US";
export type OriginalLanguage = "en";

export interface DetailedMovie
  extends Omit<Movie, "genre_ids" | "media_type" | "original_language" | "release_date"> {
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
  // Appended via append_to_response
  credits: Credits;
  similar: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
}
