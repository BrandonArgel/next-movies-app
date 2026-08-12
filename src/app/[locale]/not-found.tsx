import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  const tGlobal = useTranslations("global");
  const tErrors = useTranslations("errors");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-6 text-destructive">
        <AlertCircle className="size-12" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">404</h1>
        <p className="text-xl text-muted-foreground">{tErrors("not_found")}</p>
      </div>
      <LinkButton href="/" size="lg" className="mt-8">
        {tGlobal("actions.back_to_home")}
      </LinkButton>
    </div>
  );
}
