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
      <span className="inline-flex items-center justify-center px-1.5 py-0.5 border border-white/80 text-white/80 rounded-sm text-xs font-medium cursor-help transition-colors hover:text-white hover:border-white">
        {rating}
      </span>
      <Tooltip offset={10}>
        <p>{tooltipText}</p>
      </Tooltip>
    </TooltipTrigger>
  );
}
