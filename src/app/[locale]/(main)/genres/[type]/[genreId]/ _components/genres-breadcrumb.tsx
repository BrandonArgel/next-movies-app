"use client";

import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { LinkButton } from "@/components/ui/button";

interface MovieBreadcrumbProps {
  genreName: string;
}

export function GenresBreadcrumb({ genreName }: MovieBreadcrumbProps) {
  const t = useTranslations("pages.genres");
  const tNav = useTranslations("components.nav");

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={() => (
              <LinkButton variant="ghost" href={"/"}>
                {tNav("home")}
              </LinkButton>
            )}
          />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={() => (
              <LinkButton variant="ghost" href={"/genres"}>
                {t("title")}
              </LinkButton>
            )}
          />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-xs truncate" title={genreName}>
            {genreName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
