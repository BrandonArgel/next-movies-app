import { type NextRequest, NextResponse } from "next/server";
import { discoverMovies } from "@/lib/api/movies";
import { searchMovies } from "@/lib/api/search";

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
    const result = await searchMovies(query, page);

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

  const result = await discoverMovies(filters, page);

  // Unwrap the Result object
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
