import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;
  console.log({ apiKey });

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-MX`,
    );
    const data = await res.json();

    return NextResponse.json(data.results);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching movies" },
      { status: 500 },
    );
  }
}
