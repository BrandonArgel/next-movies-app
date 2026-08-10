import type { TMDBResponse } from "@/types/api";
import type { Collection } from "@/types/collection";
import { fetchTMDB } from "../fetch-tmdb";

export const getCollection = (
  collectionId: string | number,
): TMDBResponse<Collection> => fetchTMDB(`/collection/${collectionId}`);
