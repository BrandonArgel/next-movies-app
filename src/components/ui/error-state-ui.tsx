import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateUiProps {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
  actionElement?: React.ReactNode;
}

export function ErrorStateUi({
  title,
  description,
  retryLabel,
  onRetry,
  actionElement,
}: ErrorStateUiProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center gap-4 border border-dashed border-destructive/30 rounded-xl bg-destructive/5 max-w-lg w-full mx-auto">
      <AlertCircle className="h-8 w-8 text-destructive opacity-80" />

      <div className="space-y-1">
        <p className="text-lg font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {actionElement ? (
        actionElement
      ) : onRetry && retryLabel ? (
        <Button onClick={onRetry} variant="default">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
