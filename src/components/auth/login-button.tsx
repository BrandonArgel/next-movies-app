"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { initiateTMDBLogin } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  const t = useTranslations("global");
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onPress={() => startTransition(() => initiateTMDBLogin())}
      isDisabled={isPending}
    >
      {isPending ? t("states.redirecting") : t("actions.login")}
    </Button>
  );
}
