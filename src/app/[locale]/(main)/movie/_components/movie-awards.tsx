import { Trophy } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getMovieAwards } from "@/lib/api/movies";

export async function MovieAwards({ imdbId }: { imdbId: string }) {
  if (!imdbId) return null;
  const awardsRes = await getMovieAwards(imdbId);
  const t = await getTranslations("domains.movie");

  if (
    !awardsRes.success ||
    !awardsRes.data.Awards ||
    awardsRes.data.Awards === "N/A"
  ) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400">
      <div className="rounded-full bg-amber-500/20 p-2">
        <Trophy className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider">
          {t("awards")}
        </h3>
        <p className="font-medium text-sm">{awardsRes.data.Awards}</p>
      </div>
    </div>
  );
}
