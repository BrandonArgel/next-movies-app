// /movie/{movie_id}
export type MovieAppend =
  | "account_states"
  | "alternative_titles"
  | "changes"
  | "credits"
  | "external_ids"
  | "images"
  | "keywords"
  | "lists"
  | "recommendations"
  | "release_dates"
  | "reviews"
  | "similar"
  | "translations"
  | "videos"
  | "watch/providers";

// /tv/{tv_id}
export type TvShowAppend =
  | "account_states"
  | "aggregate_credits"
  | "alternative_titles"
  | "changes"
  | "content_ratings"
  | "credits"
  | "episode_groups"
  | "external_ids"
  | "images"
  | "keywords"
  | "recommendations"
  | "reviews"
  | "screened_theatrically"
  | "similar"
  | "translations"
  | "videos"
  | "watch/providers";

// /person/{person_id}
export type PersonAppend =
  | "changes"
  | "combined_credits"
  | "external_ids"
  | "images"
  | "movie_credits"
  | "tv_credits"
  | "tagged_images"
  | "translations";

// /collection/{collection_id}
export type CollectionAppend = "images" | "translations";
