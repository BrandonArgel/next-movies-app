export type TMDBImageSize = "w300" | "w500" | "w780" | "w1280" | "original";

export function getTMDBImageUrl(
  path: string | null | undefined,
  size: TMDBImageSize = "original",
): string | null {
  if (!path) return null;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${normalizedPath}`;
}
