export type MediaType = "tv" | "movie";
export type Site = "YouTube" | "Vimeo";
export type VideoType =
  | "Featurette"
  | "Teaser"
  | "Behind the Scenes"
  | "Trailer"
  | "Clip";

export interface VideoResult {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: Site;
  size: number;
  type: VideoType;
  official: boolean;
  id: string;
  published_at: string;
}

export interface Videos {
  results: VideoResult[];
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

export interface Images {
  backdrops: Backdrop[];
  logos: Backdrop[];
  posters: Backdrop[];
}
