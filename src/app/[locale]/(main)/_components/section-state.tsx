import { getTranslations } from "next-intl/server";
import { AlertCircle, Film } from "lucide-react";
import { RetryButton } from "@/components/ui/retry-button";
import type { ErrorTranslationKey } from "@/types/api";

type EntityType = "movies" | "tv_shows" | "people";

type SectionStateProps =
  | { type: "error"; entity: EntityType; error: ErrorTranslationKey }
  | { type: "empty"; entity?: EntityType };

export async function SectionState(props: SectionStateProps) {
  const tCommon = await getTranslations("common");

  // -----------------------------------------------------
  // 1. STATUS: NO RESULTS (Empty)
  // -----------------------------------------------------
  if (props.type === "empty") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-3 border border-dashed rounded-xl bg-muted/20">
        <Film className="h-8 w-8 text-muted-foreground opacity-50" />
        <p className="text-lg font-medium text-foreground">
          {tCommon("states.no_results")}
        </p>
      </div>
    );
  }

  // -----------------------------------------------------
  // 2. STATUS: ERROR
  // -----------------------------------------------------
  const tErrors = await getTranslations("errors");

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center gap-4 border border-dashed border-destructive/30 rounded-xl bg-destructive/5">
      <AlertCircle className="h-8 w-8 text-destructive opacity-80" />

      <div className="space-y-1">
        <p className="text-lg font-medium text-foreground">
          {tCommon("states.loading_error")}{" "}
          {tCommon(`entities.${props.entity}`)}
        </p>
        <p className="text-sm text-muted-foreground max-w-md">
          {tErrors(props.error)}
        </p>
      </div>

      <RetryButton label={tErrors("retry")} />
    </div>
  );
}
