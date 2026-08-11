import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccountDetails } from "@/lib/api/account";
import { TMDB_SESSION_ID_COOKIE } from "@/lib/constants";

export async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TMDB_SESSION_ID_COOKIE)?.value;

  if (!token) return { user: undefined, token: undefined };

  const res = await getAccountDetails(token);

  if (!res.success || !res.data) {
    redirect("/api/auth/clear-session");
  }

  return { user: res.data, token };
}
