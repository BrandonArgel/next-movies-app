import { getTranslations } from "next-intl/server";
import { Trophy } from "lucide-react";
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
    <div className="flex items-center gap-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 p-4 rounded-xl border border-amber-500/20">
      <div className="p-2 bg-amber-500/20 rounded-full">
        <Trophy className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider">
          {t("awards")}
        </h3>
        <p className="text-sm font-medium">{awardsRes.data.Awards}</p>
      </div>
    </div>
  );
}
