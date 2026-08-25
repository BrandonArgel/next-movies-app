import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/api/auth";
import { TMDB_SESSION_ID_COOKIE } from "@/lib/constants";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const { searchParams } = new URL(request.url);
  const requestToken = searchParams.get("request_token");
  const approved = searchParams.get("approved");

  if (!requestToken || approved !== "true") {
    return NextResponse.redirect(
      new URL("/login?error=access_denied", request.url),
    );
  }

  const res = await createSession(requestToken);

  if (!res.success) {
    return NextResponse.redirect(
      new URL("/login?error=session_failed", request.url),
    );
  }

  cookieStore.set({
    name: TMDB_SESSION_ID_COOKIE,
    value: res.data.session_id,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(new URL("/", request.url));
}
