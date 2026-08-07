import { NextRequest, NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);

    const response = await tmdb.getPopularPeople(page);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || "Failed to fetch popular people" },
        { status: 502 },
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
