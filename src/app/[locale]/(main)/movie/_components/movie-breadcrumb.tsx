"use client";

import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface MovieBreadcrumbProps {
  movieTitle: string;
}

export function MovieBreadcrumb({ movieTitle }: MovieBreadcrumbProps) {
  const tNav = useTranslations("nav");

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
