import { type NextRequest, NextResponse } from "next/server";
import { getLocale } from "next-intl/server";
import { type PaginatedResponse } from "@/types/common";
import { type TrendingPerson } from "@/types/person";

export type PeopleListType = "popular" | "trending";

const BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;

async function fetchPage(
  type: PeopleListType,
  page: number,
  locale: string,
): Promise<PaginatedResponse<TrendingPerson>> {
  const url = new URL(BASE_URL);

  switch (type) {
    case "popular":
      url.pathname = "/3/person/popular";
      break;
    case "trending":
      url.pathname = "/3/trending/person/day";
      break;
  }

  url.searchParams.set("page", String(page));
  url.searchParams.set("language", locale);

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

  return response.json() as Promise<PaginatedResponse<TrendingPerson>>;
}

const VALID_TYPES = new Set<PeopleListType>(["popular", "trending"]);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const rawType = searchParams.get("type") ?? "popular";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  if (!VALID_TYPES.has(rawType as PeopleListType)) {
    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 },
    );
  }

  const type = rawType as PeopleListType;
  const locale = await getLocale();

  const data = await fetchPage(type, page, locale);
  return NextResponse.json(data);
}
