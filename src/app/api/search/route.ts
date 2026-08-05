import { type NextRequest, NextResponse } from "next/server";
import { getLocale } from "next-intl/server";
import { type PaginatedResponse } from "@/types/common";
import { type MultiSearchResult } from "@/types/api";

const BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  if (!query.trim()) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const locale = await getLocale();
  const url = new URL(`${BASE_URL}/search/multi`);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("language", locale);
  url.searchParams.set("include_image_language", locale);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { status_message?: string }).status_message ?? "TMDB API error",
    );
  }

  const data = (await response.json()) as PaginatedResponse<MultiSearchResult>;
  return NextResponse.json(data);
}
