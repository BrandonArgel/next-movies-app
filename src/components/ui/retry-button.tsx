"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface RetryButtonProps {
  label: string;
}

export function RetryButton({ label }: RetryButtonProps) {
  const router = useRouter();

  return (
    <Button variant="outline" onPress={() => router.refresh()}>
      <RefreshCcw className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
