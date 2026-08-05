import { type NextRequest, NextResponse } from "next/server";
import { getLocale } from "next-intl/server";
import { type PaginatedResponse } from "@/types/common";
import { type Movie } from "@/types/movies";

export type MovieListType =
  | "trending"
  | "popular"
  | "upcoming"
  | "now-playing"
  | "top-rated"
  | "search"
  | "genre";

const BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;

async function fetchPage(
  type: MovieListType,
  page: number,
  query: string,
  genreId: string,
  locale: string,
): Promise<PaginatedResponse<Movie>> {
  const url = new URL(BASE_URL);

  switch (type) {
    case "trending":
      url.pathname = "/3/trending/movie/day";
      break;
    case "popular":
      url.pathname = "/3/movie/popular";
      break;
    case "upcoming":
      url.pathname = "/3/movie/upcoming";
      break;
    case "now-playing":
      url.pathname = "/3/movie/now_playing";
      break;
    case "top-rated":
      url.pathname = "/3/movie/top_rated";
      break;
    case "search":
      url.pathname = "/3/search/movie";
      url.searchParams.set("query", query);
      break;
    case "genre":
      url.pathname = "/3/discover/movie";
      url.searchParams.set("with_genres", genreId);
      url.searchParams.set("sort_by", "popularity.desc");
      break;
  }

  url.searchParams.set("page", String(page));
  url.searchParams.set("language", locale);
  url.searchParams.set("include_image_language", locale);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      accept: "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { status_message?: string }).status_message ?? "TMDB API error",
    );
  }

  return response.json() as Promise<PaginatedResponse<Movie>>;
}

const VALID_TYPES = new Set<MovieListType>([
  "trending",
  "popular",
  "upcoming",
  "now-playing",
  "top-rated",
  "search",
  "genre",
]);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const rawType = searchParams.get("type") ?? "trending";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const query = searchParams.get("q") ?? "";
  const genreId = searchParams.get("genre") ?? "";

  if (!VALID_TYPES.has(rawType as MovieListType)) {
    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 },
    );
  }

  const type = rawType as MovieListType;

  if (type === "search" && !query.trim()) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 },
    );
  }

  if (type === "genre" && !genreId.trim()) {
    return NextResponse.json(
      { error: "Missing genre parameter" },
      { status: 400 },
    );
  }

  const locale = await getLocale();

  const data = await fetchPage(type, page, query, genreId, locale);
  return NextResponse.json(data);
}
