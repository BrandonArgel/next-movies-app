"use client";

import { type ExternalIDS } from "@/types/person";
import { useTranslations } from "next-intl";
import {
  InstagramIcon,
  FacebookIcon,
  ImdbIcon,
  TikTokIcon,
  TwitterIcon,
  WikidataIcon,
} from "@/assets/icons/social";

interface ExternalLink {
  id: string;
  label: string;
  url: string;
  icon: React.ReactNode;
}

interface PersonExternalLinksProps {
  externalIds: ExternalIDS;
  name: string;
}

export function PersonExternalLinks({
  externalIds,
  name,
}: PersonExternalLinksProps) {
  const t = useTranslations("domains.person");

  if (!externalIds) return null;

  const links: ExternalLink[] = [
    externalIds.imdb_id && {
      id: "imdb",
      label: "IMDb",
      url: `https://www.imdb.com/name/${externalIds.imdb_id}`,
      icon: <ImdbIcon />,
    },
    externalIds.instagram_id && {
      id: "instagram",
      label: "Instagram",
      url: `https://www.instagram.com/${externalIds.instagram_id}`,
      icon: <InstagramIcon />,
    },
    externalIds.twitter_id && {
      id: "twitter",
      label: "X (Twitter)",
      url: `https://x.com/${externalIds.twitter_id}`,
      icon: <TwitterIcon />,
    },
    externalIds.facebook_id && {
      id: "facebook",
      label: "Facebook",
      url: `https://www.facebook.com/${externalIds.facebook_id}`,
      icon: <FacebookIcon />,
    },
    externalIds.tiktok_id && {
      id: "tiktok",
      label: "TikTok",
      url: `https://www.tiktok.com/@${externalIds.tiktok_id}`,
      icon: <TikTokIcon />,
    },
    externalIds.wikidata_id && {
      id: "wikidata",
      label: "Wikidata",
      url: `https://www.wikidata.org/wiki/${externalIds.wikidata_id}`,
      icon: <WikidataIcon />,
    },
  ].filter(Boolean) as ExternalLink[];

  if (links.length === 0) return null;

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      aria-label={t("social_links_aria", { name })}
    >
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
          className="p-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
