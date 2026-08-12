export type AccentColor =
  | "green"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "yellow"
  | "orange"
  | "red"
  | "pink"
  | "gray";

export interface ColorConfig {
  key: AccentColor;
  label: string;
  previewClass: string;
}

export const ACCENT_COLORS: ColorConfig[] = [
  {
    key: "blue",
    label: "Blue",
    previewClass: "bg-[oklch(0.488_0.243_264.376)]",
  },
  {
    key: "green",
    label: "Green",
    previewClass: "bg-[oklch(0.627_0.171_149.214)]",
  },
  {
    key: "cyan",
    label: "Cyan",
    previewClass: "bg-[oklch(0.705_0.133_214.346)]",
  },
  {
    key: "indigo",
    label: "Indigo",
    previewClass: "bg-[oklch(0.511_0.262_276.966)]",
  },
  {
    key: "purple",
    label: "Purple",
    previewClass: "bg-[oklch(0.558_0.288_292.717)]",
  },
  {
    key: "yellow",
    label: "Yellow",
    previewClass: "bg-[oklch(0.795_0.184_89.777)]",
  },
  {
    key: "orange",
    label: "Orange",
    previewClass: "bg-[oklch(0.646_0.222_41.116)]",
  },
  { key: "red", label: "Red", previewClass: "bg-[oklch(0.637_0.237_25.331)]" },
  {
    key: "pink",
    label: "Pink",
    previewClass: "bg-[oklch(0.645_0.246_346.816)]",
  },
  { key: "gray", label: "Gray", previewClass: "bg-[oklch(0.5971_0_0)]" },
];

export const ACCENT_COLORS_VALUES: Record<AccentColor, string> = {
  blue: "oklch(0.488 0.243 264.376)",
  green: "oklch(0.627 0.171 149.214)",
  cyan: "oklch(0.705 0.133 214.346)",
  indigo: "oklch(0.511 0.262 276.966)",
  purple: "oklch(0.558 0.288 292.717)",
  yellow: "oklch(0.795 0.184 89.777)",
  orange: "oklch(0.646 0.222 41.116)",
  red: "oklch(0.637 0.237 25.331)",
  pink: "oklch(0.645 0.246 346.816)",
  gray: "oklch(0.5971 0 0)",
};
