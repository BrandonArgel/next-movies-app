import { type NextRequest, NextResponse } from "next/server";
import { getPopularPeople } from "@/lib/api/people";
import { searchPeople } from "@/lib/api/search";

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

    const result = await searchPeople(query, page);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  }

  const result = await getPopularPeople(page);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to fetch popular people" },
      { status: 502 },
    );
  }

  return NextResponse.json(result.data);
}
