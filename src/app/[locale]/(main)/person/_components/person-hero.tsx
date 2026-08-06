"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { Calendar, MapPin, Activity, Clapperboard } from "lucide-react";
import { ExpandableBiography } from "./expandable-biography";
import { PersonExternalLinks } from "./person-external-links";
import { type PersonDetail } from "@/types/person";
import { Badge } from "@/components/ui/badge";
import { getTMDBImageUrl } from "@/lib/tmdb";

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
  const profileUrl = getTMDBImageUrl(profile_path, "w500");

  const displayAliases = also_known_as?.slice(0, 5) ?? [];

  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-40 xl:pt-48 xl:pb-48">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        {/* Portrait */}
        <div className="relative w-64 h-96 md:w-80 md:h-120 shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-foreground/20">
          {profileUrl ? (
            <Image
              src={profileUrl}
              alt={name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
              <span className="text-xl">{tPerson("noPhoto")}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-5 flex-1">
          {/* Department badge */}
          {known_for_department && (
            <Badge className="bg-primary/80 text-primary-foreground self-center md:self-start">
              {known_for_department}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {name}
          </h1>

          {/* External links */}
          {external_ids && (
            <PersonExternalLinks externalIds={external_ids} name={name} />
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm md:text-base font-medium">
            {formattedBirthday && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{formattedBirthday}</span>
                {formattedDeathday && <span>— {formattedDeathday}</span>}
              </div>
            )}
            {place_of_birth && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{place_of_birth}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            {formattedPopularity && (
              <div className="flex flex-col items-center md:items-start gap-0.5">
                <span className=" text-[11px] uppercase tracking-wider flex items-center gap-1 font-medium">
                  <Activity className="w-3 h-3" />
                  {tPerson("popularity")}
                </span>
                <span className="text-sm font-semibold">
                  {formattedPopularity}
                </span>
              </div>
            )}
            {known_for_department && (
              <div className="flex flex-col items-center md:items-start gap-0.5">
                <span className=" text-[11px] uppercase tracking-wider flex items-center gap-1 font-medium">
                  <Clapperboard className="w-3 h-3" />
                  {tPerson("known_for")}
                </span>
                <span className="text-sm font-semibold">
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
            <div className="flex flex-col gap-2 items-center md:items-start">
              <span className="text-xs uppercase tracking-wider font-medium">
                {tPerson("also_known_as")}
              </span>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {displayAliases.map((alias) => (
                  <span
                    key={alias}
                    className="text-xs bg-foreground/10 px-2.5 py-1 rounded-full border border-foreground/20 text-foreground"
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
