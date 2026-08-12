import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { routing, type Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "global.actions" });
  return {
    title: t("login"),
  };
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const tActions = await getTranslations("global.actions");
  const tErrors = await getTranslations("errors");
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams.error;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            {tActions("login")}
          </h2>
        </div>

        {error === "access_denied" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{tErrors("title")}</AlertTitle>
            <AlertDescription>{tErrors("unauthorized")}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
