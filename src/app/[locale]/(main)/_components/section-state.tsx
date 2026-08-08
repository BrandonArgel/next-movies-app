import { getTranslations } from "next-intl/server";
import { Film } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { RetryButton } from "@/components/ui/retry-button";
import { ErrorStateUi } from "@/components/ui/error-state-ui";
import type { ErrorTranslationKey } from "@/types/api";

type EntityType = "movies" | "tv_shows" | "people";

type SectionStateProps =
  | { type: "error"; entity: EntityType; error: ErrorTranslationKey }
  | { type: "empty"; entity?: EntityType };

export async function SectionState(props: SectionStateProps) {
  const tGlobal = await getTranslations("global");

  // -----------------------------------------------------
  // 1. STATUS: NO RESULTS (Empty)
  // -----------------------------------------------------
  if (props.type === "empty") {
    return (
      <Empty className="p-12 border border-dashed rounded-xl bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Film className="h-8 w-8 text-muted-foreground opacity-50" />
          </EmptyMedia>
          <EmptyTitle>{tGlobal("states.no_results")}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  // -----------------------------------------------------
  // 2. STATUS: ERROR
  // -----------------------------------------------------
  const tErrors = await getTranslations("errors");
  const title = `${tGlobal("states.loading_error")} ${tGlobal(`entities.${props.entity}`)}`;

  return (
    <ErrorStateUi
      title={title}
      description={tErrors(props.error)}
      actionElement={<RetryButton label={tErrors("retry")} />}
    />
  );
}
