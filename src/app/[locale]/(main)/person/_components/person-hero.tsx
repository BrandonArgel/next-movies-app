"use client";

import { Activity, Calendar, Clapperboard, MapPin } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { getTMDBImageUrl } from "@/lib/get-tmdb-image-url";
import type { PersonDetail } from "@/types/person";
import { ExpandableBiography } from "./expandable-biography";
import { PersonExternalLinks } from "./person-external-links";

export function PersonHero({ person }: { person: PersonDetail }) {
  const format = useFormatter();
  const tPerson = useTranslations("domains.person");
  const tGlobal = useTranslations("global.actions");
  const {
    name,
    biography,
    profile_path,
    birthday,
    deathday,
    place_of_birth,
    known_for_department,
    also_known_as,
    popularity,
    external_ids,
  } = person;

  const formattedBirthday = birthday
    ? format.dateTime(new Date(birthday), { dateStyle: "long" })
    : null;

  const formattedDeathday = deathday
    ? format.dateTime(new Date(deathday as unknown as string), {
        dateStyle: "long",
      })
    : null;

  const formattedPopularity = popularity
    ? Math.round(popularity).toLocaleString()
    : null;
  const profileImgUrl = getTMDBImageUrl(profile_path, "w500");

  const displayAliases = also_known_as?.slice(0, 5) ?? [];

  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-40 xl:pt-48 xl:pb-48">
      <div className="container mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 md:flex-row md:items-start md:gap-12 md:px-8">
        {/* Portrait */}
        <div className="relative h-96 w-64 shrink-0 overflow-hidden rounded-xl shadow-2xl ring-1 ring-foreground/20 md:h-120 md:w-80">
          {profileImgUrl ? (
            <Image
              src={profileImgUrl}
              alt={name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-foreground/5">
              <span className="text-xl">{tPerson("noPhoto")}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col items-center gap-5 text-center md:items-start md:text-left">
          {/* Department badge */}
          {known_for_department && (
            <Badge className="self-center bg-primary/80 text-primary-foreground md:self-start">
              {known_for_department}
            </Badge>
          )}

          <h1 className="font-bold text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {name}
          </h1>

          {/* External links */}
          {external_ids && (
            <PersonExternalLinks externalIds={external_ids} name={name} />
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium text-sm md:justify-start md:text-base">
            {formattedBirthday && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{formattedBirthday}</span>
                {formattedDeathday && <span>— {formattedDeathday}</span>}
              </div>
            )}
            {place_of_birth && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{place_of_birth}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
            {formattedPopularity && (
              <div className="flex flex-col items-center gap-0.5 md:items-start">
                <span className="flex items-center gap-1 font-medium text-[11px] uppercase tracking-wider">
                  <Activity className="h-3 w-3" />
                  {tPerson("popularity")}
                </span>
                <span className="font-semibold text-sm">
                  {formattedPopularity}
                </span>
              </div>
            )}
            {known_for_department && (
              <div className="flex flex-col items-center gap-0.5 md:items-start">
                <span className="flex items-center gap-1 font-medium text-[11px] uppercase tracking-wider">
                  <Clapperboard className="h-3 w-3" />
                  {tPerson("known_for")}
                </span>
                <span className="font-semibold text-sm">
                  {known_for_department}
                </span>
              </div>
            )}
          </div>

          {/* Biography */}
          <ExpandableBiography
            text={biography}
            dictionary={{
              readMore: tGlobal("readMore"),
              readLess: tGlobal("readLess"),
              noBiography: tPerson("noBiography"),
            }}
          />

          {/* Also known as */}
          {displayAliases.length > 0 && (
            <div className="flex flex-col items-center gap-2 md:items-start">
              <span className="font-medium text-xs uppercase tracking-wider">
                {tPerson("also_known_as")}
              </span>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {displayAliases.map((alias) => (
                  <span
                    key={alias}
                    className="rounded-full border border-foreground/20 bg-foreground/10 px-2.5 py-1 text-foreground text-xs"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
