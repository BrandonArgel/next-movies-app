import { useTranslations } from "next-intl";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

interface AgeRatingBadgeProps {
  rating: string;
}

export function AgeRatingBadge({ rating }: AgeRatingBadgeProps) {
  const t = useTranslations("certifications");

  const tooltipText = t.has(rating) ? t(rating) : t("fallback");

  return (
    <TooltipTrigger>
      <span className="inline-flex cursor-help items-center justify-center rounded-sm border border-white/80 px-1.5 py-0.5 font-medium text-white/80 text-xs transition-colors hover:border-white hover:text-white">
        {rating}
      </span>
      <Tooltip offset={10}>
        <p>{tooltipText}</p>
      </Tooltip>
    </TooltipTrigger>
  );
}
