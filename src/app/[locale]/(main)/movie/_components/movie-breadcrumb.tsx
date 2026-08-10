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
  movieTitle: string;
}

export function MovieBreadcrumb({ movieTitle }: MovieBreadcrumbProps) {
  const tNav = useTranslations("components.nav");

  return (
    <Breadcrumb>
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
          <BreadcrumbPage className="max-w-xs truncate" title={movieTitle}>
            {movieTitle}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
