import { type NextRequest, NextResponse } from "next/server";
import { discoverTVShows } from "@/lib/api/tv-shows";
import { searchTvShows } from "@/lib/api/search";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const type = searchParams.get("type");

  if (type === "search") {
    const query = searchParams.get("q") ?? "";
    if (!query.trim()) {
      return NextResponse.json(
        { error: "Missing search query" },
        { status: 400 },
      );
    }
    const result = await searchTvShows(query, page);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json(result.data);
  }

  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key !== "page" && key !== "type" && key !== "q") {
      filters[key] = value;
    }
  });

  const result = await discoverTVShows(filters, page);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
