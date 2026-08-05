import { type NextRequest, NextResponse } from "next/server";
import { getLocale } from "next-intl/server";
import { type PaginatedResponse } from "@/types/common";
import { type TVShow } from "@/types/tv-show";

export type TVListType =
  | "airing-today"
  | "on-tv"
  | "popular"
  | "top-rated"
  | "genre";

const BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;

async function fetchPage(
  type: TVListType,
  page: number,
  genreId: string,
  locale: string,
): Promise<PaginatedResponse<TVShow>> {
  const url = new URL(BASE_URL);

  switch (type) {
    case "airing-today":
      url.pathname = "/3/tv/airing_today";
      break;
    case "on-tv":
      url.pathname = "/3/tv/on_the_air";
      break;
    case "popular":
      url.pathname = "/3/tv/popular";
      break;
    case "top-rated":
      url.pathname = "/3/tv/top_rated";
      break;
    case "genre":
      url.pathname = "/3/discover/tv";
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

  return response.json() as Promise<PaginatedResponse<TVShow>>;
}

const VALID_TYPES = new Set<TVListType>([
  "airing-today",
  "on-tv",
  "popular",
  "top-rated",
  "genre",
]);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const rawType = searchParams.get("type") ?? "popular";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const genreId = searchParams.get("genre") ?? "";

  if (!VALID_TYPES.has(rawType as TVListType)) {
    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 },
    );
  }

  const type = rawType as TVListType;

  if (type === "genre" && !genreId.trim()) {
    return NextResponse.json(
      { error: "Missing genre parameter" },
      { status: 400 },
    );
  }

  const locale = await getLocale();

  const data = await fetchPage(type, page, genreId, locale);
  return NextResponse.json(data);
}
