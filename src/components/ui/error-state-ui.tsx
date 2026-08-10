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
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 border-dashed bg-destructive/5 p-12 text-center">
      <AlertCircle className="h-8 w-8 text-destructive opacity-80" />

      <div className="space-y-1">
        <p className="font-medium text-foreground text-lg">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
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
