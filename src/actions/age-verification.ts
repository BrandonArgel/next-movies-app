"use server";

import { cookies } from "next/headers";
import { ADULT_CONTENT_COOKIE } from "@/lib/constants";

export async function verifyAdultAge() {
  const cookieStore = await cookies();
  cookieStore.set(ADULT_CONTENT_COOKIE, "true", {
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
