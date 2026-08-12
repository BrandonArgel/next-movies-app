import type { Formats } from "next-intl";

export const formats: Formats = {
  dateTime: {
    movieRelease: {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    },
  },
  number: {
    usd: {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    },
    compact: {
      notation: "compact",
      compactDisplay: "short",
    },
  },
};
