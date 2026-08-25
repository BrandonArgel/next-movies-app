import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TMDB_SESSION_ID_COOKIE } from "@/lib/constants";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  cookieStore.delete(TMDB_SESSION_ID_COOKIE);

  return NextResponse.redirect(new URL("/", request.url));
}
