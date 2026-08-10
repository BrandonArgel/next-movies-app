// src/app/[locale]/(main)/error.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { ErrorStateUi } from "@/components/ui/error-state-ui";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const tGlobal = useTranslations("global");
  const tErrors = useTranslations("errors");

  useEffect(() => {
    console.error("Page error caught by boundary:", error);
  }, [error]);

  const errorMessage = error.message || "default";

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-4">
      <ErrorStateUi
        title={tGlobal("states.loading_error")}
        description={tErrors(errorMessage)}
        retryLabel={tErrors("retry")}
        onRetry={() => reset()}
      />
    </div>
  );
}
