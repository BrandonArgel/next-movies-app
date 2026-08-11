"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { logoutTMDB } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const t = useTranslations("global");
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      onPress={() => startTransition(() => logoutTMDB())}
      isDisabled={isPending}
    >
      {isPending ? t("states.logging_out") : t("actions.logout")}
    </Button>
  );
}
