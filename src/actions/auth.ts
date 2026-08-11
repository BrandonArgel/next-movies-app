"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/api/auth";
import { TMDB_SESSION_ID_COOKIE } from "@/lib/constants";

export async function initiateTMDBLogin() {
  const res = await getToken();

  if (!res.success) {
    throw new Error("Failed to generate TMDB request token");
  }

  const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;
  redirect(
    `https://www.themoviedb.org/authenticate/${res.data.request_token}?redirect_to=${callbackUrl}`,
  );
}

export async function logoutTMDB() {
  const cookieStore = await cookies();
  cookieStore.delete(TMDB_SESSION_ID_COOKIE);

  redirect("/");
}
